import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Trophy, Target, Zap, Clock, Brain, ArrowRight, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useToast } from "@/components/ui/use-toast.js";

// --- Sub-Component: Quiz Results View ---
const QuizResults = ({ score, totalQuestions, xpEarned, leveledUp, newLevel, currentXP, onRetake, onBack }) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const message = score === totalQuestions
        ? "Perfect Score! You nailed it!"
        : score >= totalQuestions * 0.7
        ? "Great Job! You have a solid grasp."
        : "Good attempt! Review the concepts and try again.";

    const scoreColor = percentage >= 80 ? "text-success" : percentage >= 50 ? "text-warning" : "text-destructive";

    return (
        <Card className="max-w-xl mx-auto mt-10 p-10 text-center shadow-2xl border-primary/20">
            <Trophy className={`w-20 h-20 mx-auto mb-4 ${scoreColor}`} strokeWidth={1.5} />
            <CardTitle className="text-3xl font-extrabold mb-4">Quiz Complete!</CardTitle>
            <CardDescription className="text-lg mb-6">{message}</CardDescription>
            
            <div className="space-y-4 mb-8">
                <div className="text-6xl font-black mb-2 flex items-center justify-center gap-2">
                    <span className={scoreColor}>{score}</span> / <span>{totalQuestions}</span>
                </div>
                <Progress value={percentage} className="h-4" />
                <p className="text-2xl font-bold">{percentage}% Score</p>
                <div className="space-y-2">
                    <Badge variant="secondary" className="text-sm">
                        XP Earned: {xpEarned || (score * 10)} XP
                    </Badge>
                    {leveledUp && (
                        <Badge className="text-sm bg-gradient-to-r from-primary to-accent text-white">
                            🎉 Level Up! Now Level {newLevel}
                        </Badge>
                    )}
                    <div className="text-xs text-muted-foreground">
                        Progress to next level: {currentXP || 0}/1000 XP
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <Button onClick={onRetake} className="bg-gradient-to-r from-primary to-accent hover:shadow-lg">
                    Retake Quiz
                </Button>
                <Button onClick={onBack} variant="outline">
                    Back to List
                </Button>
            </div>
        </Card>
    );
};

// --- Sub-Component: Quiz Taking View ---
const QuizPlayer = ({ quiz, onQuizEnd, onBack }) => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isQuizComplete, setIsQuizComplete] = useState(false);
    const [userAnswers, setUserAnswers] = useState([]); // Track all user answers
    const [quizResult, setQuizResult] = useState(null); // Store quiz results from backend

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return <div className="p-10 text-center">Quiz data missing.</div>;
    }

    const currentQuestion = quiz.questions[currentQIndex];
    const totalQuestions = quiz.questions.length;

    const handleAnswer = (optionIndex) => {
        if (isAnswered) return;
        setSelectedOption(optionIndex);
        setIsAnswered(true);

        // Store the answer for submission
        const answerData = {
            questionIndex: currentQIndex,
            selectedOption: optionIndex
        };
        
        setUserAnswers(prev => [...prev, answerData]);

        // Note: We don't check correctness here since we don't have the correct answers
        // The backend will handle scoring when we submit
    };

    const handleNext = () => {
        if (currentQIndex < totalQuestions - 1) {
            setCurrentQIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setIsQuizComplete(true);
            onQuizEnd(userAnswers, totalQuestions, setQuizResult); // Pass callback to set results
        }
    };

    // Render the results screen if the quiz is complete
    if (isQuizComplete) {
        return (
            <QuizResults 
                score={quizResult?.correctAnswers || score} 
                totalQuestions={totalQuestions}
                xpEarned={quizResult?.xpEarned}
                leveledUp={quizResult?.leveledUp}
                newLevel={quizResult?.newLevel}
                currentXP={quizResult?.currentXP}
                onRetake={() => {
                    setCurrentQIndex(0);
                    setScore(0);
                    setIsAnswered(false);
                    setSelectedOption(null);
                    setIsQuizComplete(false);
                    setUserAnswers([]); // Reset answers
                    setQuizResult(null); // Reset results
                }}
                onBack={onBack}
            />
        );
    }
    
    // Determine button state/color
    const getOptionClass = (index) => {
        if (!isAnswered) {
            return "hover:bg-primary/5 hover:border-primary/30";
        }
        if (index === selectedOption) {
            return "bg-primary text-white border-primary shadow-lg shadow-primary/30";
        }
        return "bg-muted/50 border-border";
    };

    return (
        <Card className="max-w-3xl mx-auto mt-10 p-8 shadow-2xl border-accent/20">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-accent">{quiz.title}</h3>
                <Badge variant="outline" className="text-lg px-4 py-1">
                    Question {currentQIndex + 1} / {totalQuestions}
                </Badge>
            </div>

            {/* Question Progress */}
            <div className="mb-6">
                 <Progress value={((currentQIndex + 1) / totalQuestions) * 100} className="h-2" />
                 <p className="text-sm text-muted-foreground mt-2 text-right">Progress</p>
            </div>

            <CardTitle className="text-2xl mb-8 leading-relaxed">
                {currentQuestion.text}
            </CardTitle>

            <div className="space-y-4 mb-8">
                {currentQuestion.options.map((option, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleAnswer(index)}
                        className={`w-full h-auto justify-start p-4 text-left font-medium text-base transition-all duration-300 ${getOptionClass(index)}`}
                        disabled={isAnswered}
                    >
                        <span className="mr-4 font-bold text-primary/80">{String.fromCharCode(65 + index)}.</span>
                        {option}
                    </Button>
                ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={onBack} disabled={isAnswered}>
                    <X className="w-4 h-4 mr-2" />
                    Quit Quiz
                </Button>
                <Button 
                    onClick={handleNext} 
                    disabled={!isAnswered}
                    className="bg-gradient-to-r from-accent to-primary hover:shadow-lg hover:shadow-primary/30"
                >
                    {currentQIndex === totalQuestions - 1 ? "Finish Quiz" : "Next Question"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </Card>
    );
};

// --- Main Component: PracticeHub (Quiz List) ---
export default function PracticeHub() {
    const [activeView, setActiveView] = useState("list");
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [quizResults, setQuizResults] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { getAuthHeaders, API_BASE_URL } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        fetchQuizzes();
        fetchQuizResults();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/quizzes`);
            if (response.ok) {
                const data = await response.json();
                setQuizzes(data.quizzes || []);
            }
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            toast({
                title: "Error",
                description: "Failed to load quizzes",
                variant: "destructive"
            });
        }
    };

    const fetchQuizResults = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/quizzes/my-results`, {
                headers: getAuthHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setQuizResults(data.results || []);
            }
        } catch (error) {
            console.error('Failed to fetch quiz results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = async (quizId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`);
            if (response.ok) {
                const quiz = await response.json();
                setActiveQuiz(quiz);
                setActiveView("quiz");
            } else {
                throw new Error('Failed to load quiz');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load quiz",
                variant: "destructive"
            });
        }
    };

    const handleQuizEnd = async (userAnswers, totalQuestions, setQuizResult) => {
        if (activeQuiz) {
            try {
                const response = await fetch(`${API_BASE_URL}/quizzes/${activeQuiz._id}/submit`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ answers: userAnswers })
                });

                if (response.ok) {
                    const result = await response.json();
                    
                    // Set the quiz result for the results component
                    setQuizResult(result);
                    
                    // Show success notification with XP earned
                    toast({
                        title: result.leveledUp ? "🎉 Level Up!" : "Quiz Completed!",
                        description: result.leveledUp 
                            ? `You scored ${result.score}% and reached Level ${result.newLevel}! (+${result.xpEarned} XP, ${result.currentXP}/1000 XP to next level)`
                            : `You scored ${result.score}% and earned ${result.xpEarned} XP (${result.currentXP}/1000 XP to next level)`,
                    });
                    
                    // Update the quiz results state
                    setQuizResults(prev => [
                        ...prev.filter(r => r.quizId !== activeQuiz._id),
                        {
                            quizId: activeQuiz._id,
                            score: result.score,
                            completed: true
                        }
                    ]);
                } else {
                    throw new Error('Failed to submit quiz');
                }
            } catch (error) {
                console.error('Quiz submission error:', error);
                toast({
                    title: "Error",
                    description: "Failed to submit quiz results",
                    variant: "destructive"
                });
            }
        }
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            Easy: "bg-success/10 text-success border-success/20",
            Medium: "bg-warning/10 text-warning border-warning/20",
            Hard: "bg-destructive/10 text-destructive border-destructive/20",
        };
        return colors[difficulty] || "";
    };

    const availableQuizzes = quizzes.map(quiz => {
        const result = quizResults.find(result => result.quizId === quiz._id);
        return {
            id: quiz._id,
            title: quiz.title,
            difficulty: quiz.difficulty,
            category: quiz.category,
            questionsCount: quiz.questions?.length || 0,
            timeLimit: quiz.timeLimit,
            completed: !!result,
            score: result?.score || null,
        };
    });

    const renderQuizList = () => (
        <>
            {/* Header section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-primary to-accent p-10 text-white shadow-2xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
                
                <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl">
                            <Target className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">MCQ Quiz Practice</h1>
                            <p className="text-lg text-white/90 mt-1">
                                Test your theoretical knowledge across {availableQuizzes.length} domains.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                         <Button 
                            size="lg"
                            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all"
                        >
                            <Zap className="w-5 h-5 mr-2" />
                            Challenge Streak: 7 Days
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 transition-all"
                        >
                            <Trophy className="w-5 h-5 mr-2" />
                            Global Rank: #1234
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quiz Cards */}
            <Card className="bg-gradient-glass border-accent/20 backdrop-blur-xl overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
                            <Brain className="w-5 h-5 text-accent" />
                        </div>
                        Available Quizzes
                    </CardTitle>
                    <CardDescription>
                        Select a quiz to begin testing your knowledge. Each quiz has multiple questions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableQuizzes.map((quiz, index) => (
                            <div 
                                key={quiz.id} 
                                className="p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
                                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-xl">{quiz.title}</h4>
                                        {quiz.completed && (
                                            <Badge className="bg-gradient-to-r from-success to-success/80 text-white border-0 shadow-lg">
                                                {quiz.score}%
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Brain className="w-3.5 h-3.5" />
                                            {quiz.questionsCount} questions
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {quiz.timeLimit} min
                                        </span>
                                        <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                                            {quiz.difficulty}
                                        </Badge>
                                    </div>
                                    <Badge variant="outline" className="bg-muted/30">
                                        {quiz.category}
                                    </Badge>
                                    {quiz.completed && quiz.score && (
                                        <Progress value={quiz.score} className="h-2" />
                                    )}
                                    <Button 
                                        onClick={() => handleStartQuiz(quiz.id)}
                                        className="w-full bg-gradient-to-r from-accent to-primary hover:shadow-lg hover:shadow-accent/30"
                                    >
                                        {quiz.completed ? "Retake Quiz" : "Start Quiz"}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    );

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Main rendering logic based on the activeView state
    return (
        <div className="p-6 space-y-6">
            {activeView === "list" && renderQuizList()}
            
            {activeView === "quiz" && activeQuiz && (
                <QuizPlayer 
                    quiz={activeQuiz} 
                    onQuizEnd={handleQuizEnd} 
                    onBack={() => setActiveView("list")} 
                />
            )}
        </div>
    );
}