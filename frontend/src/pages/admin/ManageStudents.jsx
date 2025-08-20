import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Search, Eye, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast.js";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (search = '') => {
    try {
      setLoading(true);
      const url = search 
        ? `/api/admin/students?search=${encodeURIComponent(search)}`
        : '/api/admin/students';
      
      const response = await authenticatedFetch(`http://localhost:5001${url}`);
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        throw new Error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(searchTerm);
  };

  const viewStudentProfile = (studentId) => {
    navigate(`/admin/students/${studentId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Students</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage all registered students
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>
            Search and view student profiles and information
          </CardDescription>
          
          <form onSubmit={handleSearch} className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                fetchStudents();
              }}
            >
              Clear
            </Button>
          </form>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Year of Study</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <User className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No students found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {student.profile?.branch ? (
                            <Badge variant="secondary">{student.profile.branch}</Badge>
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.profile?.yearOfStudy || (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.profile?.college || (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(student.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewStudentProfile(student._id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}