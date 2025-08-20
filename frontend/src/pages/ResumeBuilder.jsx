import React, { useState } from "react";
import { UploadCloud, FileText, Zap, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useProfileAI } from "@/providers/ProfileAIProvider.jsx";

export default function ResumeBuilder() {
  const { analysis, analyzeResume, clearAnalysis } = useProfileAI();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFileChange = (e) => {
    setError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // basic type check
    if (!/pdf|docx|doc/i.test(f.name)) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }
    setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume first.");
      return;
    }
    setLoading(true);
    try {
      await analyzeResume(file);
    } catch (e) {
      setError("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Resume Builder</h1>
            <p className="text-lg text-white/90 mt-1">Upload, analyze and personalize your learning path.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Upload your Resume</CardTitle>
            <CardDescription>Supported formats: PDF, DOCX</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="p-3 rounded-lg bg-muted/20">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">Choose file</span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={onFileChange} className="hidden" />
                </label>
                {file && (
                  <div className="flex-1">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                  </div>
                )}
              </div>

              {error && <div className="text-destructive text-sm">{error}</div>}

              <div className="flex gap-3">
                <Button onClick={handleAnalyze} disabled={loading} className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {loading ? "Analyzing..." : "Analyze My Resume"}
                </Button>
                <Button variant="outline" onClick={() => { setFile(null); setError(null); clearAnalysis(); }}>
                  Clear
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">Tip: Use a recent resume with clear project bullets for best analysis.</div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-gradient-glass">
            <CardHeader>
              <CardTitle>Quick Status</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Readiness Score</p>
                      <p className="text-2xl font-bold">{analysis.readinessScore}%</p>
                    </div>
                    <Badge variant="secondary" className="text-sm">{analysis.skillLevel}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Top Skills</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis.topSkills.map((s) => (
                        <Badge key={s} className="bg-muted/10">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No analysis yet. Upload and analyze to get tailored recommendations.</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-glass">
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-sm list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Upload your resume (PDF / DOCX).</li>
                <li>Click Analyze — the AI extracts skills, projects and role signals.</li>
                <li>We use the results site-wide to personalize Learning, Practice and Role recommendations.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      {analysis && (
        <div className="p-4 rounded-xl bg-card/90 border border-border/50">
          <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Skill Level</p>
              <p className="font-semibold text-lg">{analysis.skillLevel}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Interests Detected</p>
              <div className="mt-2">
                {analysis.interests.map((i) => (
                  <Badge key={i} className="mr-2 mb-2">{i}</Badge>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Suggestions</p>
              <ul className="mt-2 text-sm list-disc list-inside text-muted-foreground">
                {analysis.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
