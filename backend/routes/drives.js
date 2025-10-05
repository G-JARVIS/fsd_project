import express from 'express';
import { protect } from '../middleware/auth.js';
import CompanyDrive from '../models/CompanyDrive.js';
import Application from '../models/Application.js';
import Event from '../models/Event.js';

const router = express.Router();

// @desc    Get all company drives
// @route   GET /api/drives
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { requirements: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const drives = await CompanyDrive.find(query)
      .sort({ featured: -1, deadline: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CompanyDrive.countDocuments(query);

    res.json({
      drives,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get drives error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single drive
// @route   GET /api/drives/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const drive = await CompanyDrive.findById(req.params.id);
    
    if (!drive) {
      return res.status(404).json({ message: 'Company drive not found' });
    }

    res.json(drive);
  } catch (error) {
    console.error('Get drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Apply for company drive
// @route   POST /api/drives/:id/apply
// @access  Private
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const drive = await CompanyDrive.findById(req.params.id);
    
    if (!drive) {
      return res.status(404).json({ message: 'Company drive not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      userId: req.user._id,
      driveId: drive._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this drive' });
    }

    // Create application with process stage tracking
    const processStageIndex = 0; // Starting at first stage
    const nextStepIndex = processStageIndex + 1;
    const nextStep = nextStepIndex < drive.process.length ? drive.process[nextStepIndex] : 'Completed';

    const application = await Application.create({
      userId: req.user._id,
      driveId: drive._id,
      status: 'applied',
      currentStage: drive.process[processStageIndex] || 'Applied',
      processStageIndex: processStageIndex,
      nextStep: nextStep
    });

    // Create calendar events for all process schedule items
    if (drive.processSchedule && drive.processSchedule.length > 0) {
      const calendarEvents = [];
      
      for (let i = 0; i < drive.processSchedule.length; i++) {
        const scheduleItem = drive.processSchedule[i];
        
        try {
          // Validate required fields
          if (!scheduleItem.date || !scheduleItem.stage) {
            console.warn(`Skipping invalid schedule item: missing date or stage`);
            continue;
          }

          // Create event date and time
          const eventDate = new Date(scheduleItem.date);
          
          // Validate date
          if (isNaN(eventDate.getTime())) {
            console.warn(`Skipping schedule item with invalid date: ${scheduleItem.date}`);
            continue;
          }

          const eventTime = scheduleItem.time || '10:00 AM';
          
          // Parse time and set it on the date (with better error handling)
          try {
            const timeMatch = eventTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
            if (timeMatch) {
              const [, hours, minutes, period] = timeMatch;
              let hour24 = parseInt(hours);
              
              if (period.toUpperCase() === 'PM' && hour24 !== 12) {
                hour24 += 12;
              } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
                hour24 = 0;
              }
              
              eventDate.setHours(hour24, parseInt(minutes), 0, 0);
            } else {
              // Default to 10:00 AM if time format is invalid
              eventDate.setHours(10, 0, 0, 0);
            }
          } catch (timeError) {
            console.warn(`Invalid time format: ${eventTime}, using default 10:00 AM`);
            eventDate.setHours(10, 0, 0, 0);
          }
          
          // Create the calendar event
          const calendarEvent = await Event.create({
            title: `${drive.company} - ${scheduleItem.stage}`,
            type: 'Placement Drive',
            date: eventDate,
            time: eventTime,
            location: scheduleItem.venue || 'TBD',
            description: `${scheduleItem.stage} for ${drive.role} position at ${drive.company}. ${scheduleItem.description || 'Please check with placement cell for more details.'}`,
            organizer: 'Placement Cell',
            attendees: [{
              userId: req.user._id,
              status: 'registered'
            }],
            status: 'scheduled',
            isActive: true,
            metadata: {
              applicationId: application._id,
              driveId: drive._id,
              stageIndex: i
            }
          });
          
          calendarEvents.push(calendarEvent);
        } catch (eventError) {
          console.error(`Error creating calendar event for ${scheduleItem.stage}:`, eventError);
          // Continue with other events even if one fails
        }
      }
      
      console.log(`Created ${calendarEvents.length} calendar events for application ${application._id}`);
    } else {
      console.log(`No process schedule found for drive ${drive._id}, skipping calendar event creation`);
    }

    // Increment applicants count
    drive.applicants += 1;
    await drive.save();

    res.status(201).json(application);
  } catch (error) {
    console.error('Apply for drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;