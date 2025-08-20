import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useToast } from "@/components/ui/use-toast.js";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const { authenticatedFetch } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    category: '',
    timeLimit: 10,
    passingScore: 70,
    questions: [
      {
        text: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    ]
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('http://localhost:5001/api/admin/quizzes');
      
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        throw new Error('Failed to fetch quizzes');
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quizzes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingQuiz 
        ? `http://localhost:5001/api/admin/quizzes/${editingQuiz._id}`
        : 'http://localhost:5001/api/admin/quizzes';
      
      const method = editingQuiz ? 'PUT' : 'POST';
      
      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Quiz ${editingQuiz ? 'updated' : 'created'} successfully`
        });
        setIsDialogOpen(false);
        resetForm();
        fetchQuizzes();
      } else {
        throw new Error(`Failed to ${editingQuiz ? 'update' : 'create'} quiz`);
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingQuiz ? 'update' : 'create'} quiz`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const response = await authenticatedFetch(`http://localhost:5001/api/admin/quizzes/${quizId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Quiz deleted successfully"
        });
        fetchQuizzes();
      } else {
        throw new Error('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      difficulty: 'Easy',
      category: '',
      timeLimit: 10,
      passingScore: 70,
      questions: [
        {
          text: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          explanation: ''
        }
      ]
    });
    setEditingQuiz(null);
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      difficulty: quiz.difficulty,
      category: quiz.category,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      questions: quiz.questions
    });
    setIsDialogOpen(true);
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          explanation: ''
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      setFormData({
        ...formData,
        questions: formData.questions.filter((_, i) => i !== index)
      });
    }
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Quizzes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage practice hub quizzes
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
              <DialogDescription>
                {editingQuiz ? 'Update quiz details and questions' : 'Add a new quiz to the practice hub'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({...formData, passingScore: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Questions</Label>
                  <Button type="button" onClick={addQuestion} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Question
                  </Button>
                </div>
                
                {formData.questions.map((question, questionIndex) => (
                  <Card key={questionIndex} className="mb-4">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                        {formData.questions.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeQuestion(questionIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Question Text</Label>
                        <Textarea
                          value={question.text}
                          onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>Options</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2 mt-2">
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                              required
                            />
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctIndex === optionIndex}
                              onChange={() => updateQuestion(questionIndex, 'correctIndex', optionIndex)}
                            />
                            <Label className="text-sm">Correct</Label>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <Label>Explanation (Optional)</Label>
                        <Textarea
                          value={question.explanation}
                          onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                          placeholder="Explain why this is the correct answer..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Library</CardTitle>
          <CardDescription>
            Manage all practice hub quizzes
          </CardDescription>
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
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Time Limit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizzes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <BookOpen className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No quizzes found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    quizzes.map((quiz) => (
                      <TableRow key={quiz._id}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{quiz.category}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              quiz.difficulty === 'Easy' ? 'secondary' :
                              quiz.difficulty === 'Medium' ? 'default' : 'destructive'
                            }
                          >
                            {quiz.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>{quiz.questions.length}</TableCell>
                        <TableCell>{quiz.timeLimit} min</TableCell>
                        <TableCell>
                          <Badge variant={quiz.isActive ? 'default' : 'secondary'}>
                            {quiz.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(quiz)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(quiz._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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