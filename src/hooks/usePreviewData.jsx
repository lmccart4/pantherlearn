// src/hooks/usePreviewData.jsx
// Generates mock student progress data based on the selected preview scenario.
// When in preview mode, this replaces the real Firestore student data
// so teachers see what students at different stages would see.

import { useMemo } from "react";
import { usePreview } from "../contexts/PreviewContext";

/**
 * Given a lesson's blocks and a scenario, generate mock studentData and chatLogs.
 *
 * @param {Object} lesson - The lesson object with blocks array
 * @param {Object} realStudentData - The teacher's real student data (used as fallback)
 * @param {Object} realChatLogs - The teacher's real chat logs (used as fallback)
 * @returns {{ studentData, chatLogs, isPreviewActive }}
 */
export function usePreviewData(lesson, realStudentData = {}, realChatLogs = {}) {
  const { isPreview, scenario, scenarioConfig } = usePreview();

  const mockData = useMemo(() => {
    if (!isPreview || !lesson) return null;

    const blocks = lesson.blocks || [];
    const questionBlocks = blocks.filter((b) => b.type === "question");
    const chatbotBlocks = blocks.filter((b) => b.type === "chatbot");

    if (scenario === "new") {
      // New student: no progress at all
      return { studentData: {}, chatLogs: {} };
    }

    if (scenario === "midway") {
      // Midway: ~50% of questions answered (first half), no chatbot logs
      const studentData = {};
      const halfway = Math.ceil(questionBlocks.length / 2);

      questionBlocks.slice(0, halfway).forEach((q) => {
        if (q.questionType === "multiple_choice" || q.type === "multiple_choice") {
          // Pick the correct answer for mock data
          const correctIdx = (q.options || []).findIndex((o) => o.correct);
          studentData[q.id] = {
            answer: correctIdx >= 0 ? correctIdx : 0,
            correct: correctIdx >= 0,
            submitted: true,
          };
        } else {
          // Open-ended: provide a sample answer
          studentData[q.id] = {
            answer: "This is a sample student response for preview purposes.",
            submitted: true,
          };
        }
      });

      // A couple chatbot blocks with some messages
      const chatLogs = {};
      chatbotBlocks.slice(0, 1).forEach((cb) => {
        chatLogs[cb.id] = {
          messages: [
            { role: "user", content: "Hi, can you help me understand this?" },
            { role: "assistant", content: "Of course! What specifically would you like to know more about?" },
            { role: "user", content: "How does this concept apply in real life?" },
          ],
          messageCount: 3,
        };
      });

      return { studentData, chatLogs };
    }

    if (scenario === "complete") {
      // Completed: all questions answered, all chatbots used
      const studentData = {};

      questionBlocks.forEach((q) => {
        if (q.questionType === "multiple_choice" || q.type === "multiple_choice") {
          const correctIdx = (q.options || []).findIndex((o) => o.correct);
          studentData[q.id] = {
            answer: correctIdx >= 0 ? correctIdx : 0,
            correct: correctIdx >= 0,
            submitted: true,
          };
        } else {
          studentData[q.id] = {
            answer: "This is a complete sample student response demonstrating full progress.",
            submitted: true,
          };
        }
      });

      const chatLogs = {};
      chatbotBlocks.forEach((cb) => {
        chatLogs[cb.id] = {
          messages: [
            { role: "user", content: "Can you explain this topic?" },
            { role: "assistant", content: "Sure! Let me walk you through it step by step." },
            { role: "user", content: "That makes sense. What about the second part?" },
            { role: "assistant", content: "Great question! The second part builds on what we just discussed..." },
            { role: "user", content: "Thank you, I understand now!" },
          ],
          messageCount: 5,
        };
      });

      return { studentData, chatLogs };
    }

    return null;
  }, [isPreview, scenario, lesson]);

  if (!isPreview || !mockData) {
    return {
      studentData: realStudentData,
      chatLogs: realChatLogs,
      isPreviewActive: false,
    };
  }

  return {
    studentData: mockData.studentData,
    chatLogs: mockData.chatLogs,
    isPreviewActive: true,
  };
}
