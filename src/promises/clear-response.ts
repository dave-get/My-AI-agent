import { ConfidenceLevels, ResponseCategories, type StructuredData } from "../lib/types/response.js";

// Helper function to categorize response content
export const categorizeResponse = (
  message: string,
  toolUsed?: string
): StructuredData | undefined => {
  const lowerMessage = message.toLowerCase();

  // Determine category based on content
  let category: StructuredData["category"] = ResponseCategories.GENERAL;
  if (
    lowerMessage.includes("skill") ||
    lowerMessage.includes("technology") ||
    lowerMessage.includes("programming")
  ) {
    category = ResponseCategories.TECHNICAL;
  } else if (
    lowerMessage.includes("project") ||
    lowerMessage.includes("built") ||
    lowerMessage.includes("developed")
  ) {
    category = ResponseCategories.PROJECTS;
  } else if (
    lowerMessage.includes("contact") ||
    lowerMessage.includes("email") ||
    lowerMessage.includes("github")
  ) {
    category = ResponseCategories.CONTACT;
  } else if (
    lowerMessage.includes("education") ||
    lowerMessage.includes("university") ||
    lowerMessage.includes("degree")
  ) {
    category = ResponseCategories.EDUCATION;
  } else if (
    lowerMessage.includes("name") ||
    lowerMessage.includes("about") ||
    lowerMessage.includes("myself")
  ) {
    category = ResponseCategories.PERSONAL;
  }

  // Extract highlights (key points from the response)
  const highlights: string[] = [];
  const sentences = message.split(/[.!?]+/).filter((s) => s.trim().length > 10);

  // Extract important sentences as highlights
  sentences.forEach((sentence) => {
    const trimmed = sentence.trim();
    if (trimmed.length > 20 && trimmed.length < 150) {
      highlights.push(trimmed);
    }
  });

  // Limit highlights to most relevant ones
  const limitedHighlights = highlights.slice(0, 3);

  // Determine related topics based on content
  const relatedTopics: string[] = [];
  if (category === "technical") {
    relatedTopics.push("Projects", "Experience", "Skills");
  } else if (category === "projects") {
    relatedTopics.push("Technical Skills", "Experience", "Contact");
  } else if (category === "personal") {
    relatedTopics.push("Education", "Technical Skills", "Projects");
  }

  return {
    category,
    highlights: limitedHighlights,
    relatedTopics: relatedTopics.length > 0 ? relatedTopics : undefined,
  };
};

// Helper function to determine confidence level
export const determineConfidence = (
  message: string,
  toolUsed?: string
): ConfidenceLevels => {
  if (toolUsed === "about_me") {
    return ConfidenceLevels.HIGH; // High confidence when using the about_me tool
  }

  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes("i'm") ||
    lowerMessage.includes("my") ||
    lowerMessage.includes("i have")
  ) {
    return ConfidenceLevels.MEDIUM; // Medium confidence for personal statements
  }

  return ConfidenceLevels.LOW; // Low confidence for general responses
};
