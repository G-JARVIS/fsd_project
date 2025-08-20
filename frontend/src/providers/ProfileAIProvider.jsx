import React, { createContext, useContext, useEffect, useState } from "react";

const ProfileAIContext = createContext(null);

export function useProfileAI() {
  return useContext(ProfileAIContext);
}

// Simple mock resume analyzer: looks for keywords in filename or provided text
function mockAnalyzeFromName(fileName) {
  const name = (fileName || "").toLowerCase();
  const interests = [];
  const skills = new Set();
  if (name.includes("react") || name.includes("frontend")) {
    interests.push("Full-Stack Development");
    skills.add("React.js");
  }
  if (name.includes("node") || name.includes("express") || name.includes("backend")) {
    interests.push("Full-Stack Development");
    skills.add("Node.js");
  }
  if (name.includes("data") || name.includes("ml") || name.includes("python")) {
    interests.push("Data Science");
    skills.add("Python");
  }
  if (name.includes("ux") || name.includes("design") || name.includes("ui")) {
    interests.push("UI/UX Design");
    skills.add("Figma");
  }
  if (name.includes("java")) {
    skills.add("Java");
  }
  if (name.includes("aws") || name.includes("cloud")) {
    skills.add("AWS");
  }

  // fallback
  if (interests.length === 0) interests.push("General Software Engineering");
  if (skills.size === 0) skills.add("Problem Solving");

  const readiness = Math.min(95, 50 + skills.size * 12 + Math.min(20, interests.length * 5));

  return {
    skillLevel: readiness > 75 ? "Ready" : readiness > 55 ? "Developing" : "Needs Improvement",
    interests,
    readinessScore: readiness,
    topSkills: Array.from(skills),
    suggestions: [
      "Highlight key projects and technologies in the top section.",
      "Add measurable outcomes for each project (metrics, impact).",
    ],
    detectedFrom: fileName,
  };
}

export function ProfileAIProvider({ children }) {
  const [analysis, setAnalysis] = useState(() => {
    try {
      const raw = localStorage.getItem("rx_resume_analysis");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (analysis) localStorage.setItem("rx_resume_analysis", JSON.stringify(analysis));
      else localStorage.removeItem("rx_resume_analysis");
    } catch (e) {}
  }, [analysis]);

  const analyzeResume = async (file) => {
    try {
      setLoading(true);
      // Simulate upload + analysis delay
      await new Promise((r) => setTimeout(r, 900));
      const result = mockAnalyzeFromName(file?.name || file?.filename || "uploaded_resume.pdf");
      setAnalysis({ ...result, analyzedAt: new Date().toISOString() });
      return result;
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => setAnalysis(null);

  return (
    <ProfileAIContext.Provider value={{ analysis, analyzeResume, clearAnalysis, loading }}>
      {children}
    </ProfileAIContext.Provider>
  );
}

export default ProfileAIProvider;
