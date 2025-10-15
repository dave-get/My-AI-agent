import { tool } from "@langchain/core/tools";
import z from "zod";
import { loadAboutMe } from "../promises/load.js";
import { aboutMeSchema } from "../lib/schema/aboutme.js";

// Helper function to normalize query for better matching
const normalizeQuery = (query: string): string => {
  return query.toLowerCase().trim();
};

// Helper function to check if query contains any of the keywords
const containsAny = (query: string, keywords: string[]): boolean => {
  const normalizedQuery = normalizeQuery(query);
  return keywords.some((keyword) => normalizedQuery.includes(keyword));
};

// Advanced query analyzer for better context understanding
const analyzeQuery = (query: string) => {
  const normalizedQuery = normalizeQuery(query);

  // Question type detection
  const questionTypes = {
    what: containsAny(query, ["what", "what's", "what is"]),
    who: containsAny(query, ["who", "who's", "who is"]),
    where: containsAny(query, ["where", "where's", "where is"]),
    when: containsAny(query, ["when", "when's", "when is"]),
    how: containsAny(query, ["how", "how's", "how is", "how do"]),
    why: containsAny(query, ["why", "why's", "why is"]),
    can: containsAny(query, ["can", "can you", "are you able"]),
    do: containsAny(query, ["do you", "do you have", "do you know"]),
    tell: containsAny(query, ["tell me", "tell us", "tell"]),
    show: containsAny(query, ["show me", "show", "list"]),
  };

  // Context detection
  const contexts = {
    technical: containsAny(query, [
      "technical",
      "tech",
      "programming",
      "coding",
      "development",
      "software",
      "code",
    ]),
    professional: containsAny(query, [
      "professional",
      "career",
      "work",
      "job",
      "business",
      "industry",
    ]),
    personal: containsAny(query, [
      "personal",
      "about you",
      "yourself",
      "background",
      "story",
    ]),
    academic: containsAny(query, [
      "academic",
      "education",
      "school",
      "university",
      "study",
      "student",
    ]),
    project: containsAny(query, [
      "project",
      "portfolio",
      "work",
      "built",
      "developed",
      "created",
    ]),
    skill: containsAny(query, [
      "skill",
      "ability",
      "expertise",
      "proficient",
      "know",
      "familiar",
    ]),
    contact: containsAny(query, [
      "contact",
      "reach",
      "connect",
      "email",
      "social",
      "linkedin",
      "github",
    ]),
  };

  return { questionTypes, contexts };
};

// Generate contextual response based on query analysis
const generateContextualResponse = (
  data: any,
  query: string,
  analysis: any
) => {
  const { questionTypes, contexts } = analysis;

  // Handle specific combinations
  if (questionTypes.what && contexts.skill) {
    return `Here's what I know and work with:\n\nFrontend Technologies: ${data.skills.frontend.join(
      ", "
    )}\nBackend Technologies: ${data.skills.backend.join(
      ", "
    )}\nUI/UX Tools: ${data.skills.ui_ux.join(
      ", "
    )}\nOther Skills: ${data.skills.other.join(", ")}`;
  }

  if (questionTypes.what && contexts.project) {
    const projectDetails = data.projects
      .map((p) => `• ${p.name}: ${p.description}`)
      .join("\n");
    return `Here are the projects I've worked on:\n\n${projectDetails}`;
  }

  if (questionTypes.how && contexts.technical) {
    return `I approach development with a focus on:\n• ${
      data.focus?.join("\n• ") ||
      "Performance optimization\n• Clean and maintainable code\n• Pixel-perfect UI design\n• Full development lifecycle"
    }`;
  }

  if (questionTypes.can && contexts.technical) {
    return `Yes, I can work with:\n\nFrontend: ${data.skills.frontend.join(
      ", "
    )}\nBackend: ${data.skills.backend.join(
      ", "
    )}\nUI/UX: ${data.skills.ui_ux.join(
      ", "
    )}\n\nI specialize in full-stack development and have experience building complete web applications from design to deployment.`;
  }

  if (questionTypes.tell && contexts.personal) {
    return `I'm ${data.name}, a ${data.title} based in ${data.location}. ${
      data.summary ||
      "I'm passionate about creating modern, responsive web applications with clean UI/UX and robust backend systems."
    }`;
  }

  if (questionTypes.show && contexts.project) {
    const projectDetails = data.projects
      .map((p) => `• ${p.name}: ${p.description}`)
      .join("\n");
    return `Here are my projects:\n\n${projectDetails}`;
  }

  return null; // Let the main function handle it
};

export const aboutMeTool = tool(
  async ({ query }: { query: string }) => {
    const data = await loadAboutMe();
    const normalizedQuery = normalizeQuery(query);

    // First, try advanced contextual analysis
    const analysis = analyzeQuery(query);
    const contextualResponse = generateContextualResponse(
      data,
      query,
      analysis
    );
    if (contextualResponse) {
      return contextualResponse;
    }

    // Name and basic info
    if (
      containsAny(query, [
        "name",
        "who are you",
        "introduce",
        "tell me about yourself",
      ])
    ) {
      return `I'm ${data.name}, a ${data.title} based in ${data.location}. ${
        data.summary ||
        "I specialize in full-stack development, combining clean UI/UX with robust backend systems."
      }`;
    }

    // Education
    if (
      containsAny(query, [
        "education",
        "school",
        "university",
        "degree",
        "study",
        "student",
      ])
    ) {
      return `I'm currently studying ${data.education.degree} at ${data.education.university}, in my ${data.education.year}.`;
    }

    // Skills - Frontend
    if (
      containsAny(query, [
        "frontend",
        "react",
        "front-end",
        "ui",
        "javascript",
        "typescript",
        "css",
        "html",
      ])
    ) {
      return `My frontend skills include: ${data.skills.frontend.join(
        ", "
      )}. I also have UI/UX skills in ${data.skills.ui_ux.join(", ")}.`;
    }

    // Skills - Backend
    if (
      containsAny(query, [
        "backend",
        "back-end",
        "node",
        "express",
        "database",
        "api",
        "server",
      ])
    ) {
      return `My backend skills include: ${data.skills.backend.join(", ")}.`;
    }

    // All skills
    if (
      containsAny(query, [
        "skill",
        "technologies",
        "tech stack",
        "programming",
        "coding",
        "languages",
      ])
    ) {
      return `My technical skills span across multiple areas:\n\nFrontend: ${data.skills.frontend.join(
        ", "
      )}\nBackend: ${data.skills.backend.join(
        ", "
      )}\nUI/UX: ${data.skills.ui_ux.join(
        ", "
      )}\nOther: ${data.skills.other.join(", ")}`;
    }

    // Projects
    if (
      containsAny(query, ["project", "work", "built", "developed", "created"])
    ) {
      const projectDetails = data.projects
        .map((p) => `• ${p.name}: ${p.description}`)
        .join("\n");
      return `Here are some of my key projects:\n\n${projectDetails}`;
    }

    // Experience
    if (
      containsAny(query, [
        "experience",
        "worked",
        "job",
        "career",
        "professional",
      ])
    ) {
      const experienceDetails = data.experience
        .map(
          (exp) =>
            `• ${exp.role} - ${
              exp.project
            }\n  Responsibilities: ${exp.responsibilities.join(", ")}`
        )
        .join("\n\n");
      return `My professional experience:\n\n${experienceDetails}`;
    }

    // Focus areas
    if (
      containsAny(query, [
        "focus",
        "specialize",
        "expertise",
        "strengths",
        "passion",
      ])
    ) {
      return `My main focus areas are: ${
        data.focus?.join(", ") ||
        "Performance optimization, clean and maintainable code, pixel-perfect UI design, and full development lifecycle"
      }.`;
    }

    // Contact information
    if (
      containsAny(query, [
        "contact",
        "email",
        "github",
        "linkedin",
        "portfolio",
        "reach",
        "connect",
      ])
    ) {
      const contactInfo = [];
      if (data.contact.email) contactInfo.push(`Email: ${data.contact.email}`);
      if (data.contact.github)
        contactInfo.push(`GitHub: ${data.contact.github}`);
      if (data.contact.linkedin)
        contactInfo.push(`LinkedIn: ${data.contact.linkedin}`);
      if (data.contact.portfolio)
        contactInfo.push(`Portfolio: ${data.contact.portfolio}`);

      return `You can reach me through:\n${contactInfo.join("\n")}`;
    }

    // Location
    if (containsAny(query, ["location", "where", "based", "live", "from"])) {
      return `I'm based in ${data.location}.`;
    }

    // Summary/Overview
    if (
      containsAny(query, ["summary", "overview", "brief", "short", "quick"])
    ) {
      return `${
        data.summary ||
        `I'm ${data.name}, a ${data.title} specializing in full-stack development. I focus on creating modern, responsive web applications with clean UI/UX and robust backend systems.`
      }`;
    }

    // Default comprehensive response for general questions
    return `I'm ${data.name}, a ${data.title} based in ${data.location}. 

    ${
      data.summary ||
      "I specialize in full-stack development, combining clean UI/UX with robust backend systems."
    }

    Key highlights:
    • Currently studying ${data.education.degree} at ${data.education.university}
    • Skilled in frontend (${data.skills.frontend
          .slice(0, 3)
          .join(", ")}) and backend (${data.skills.backend.slice(0, 3).join(", ")})
    • Notable projects: ${data.projects.map((p) => p.name).join(", ")}
    • Focus on: ${
          data.focus?.join(", ") || "Performance optimization and clean code"
        }

    Feel free to ask me about my projects, skills, experience, or anything else you'd like to know!`;
      },

  {
    name: "about_me",
    description:
      "Get comprehensive information about Dawit Getachew including education, skills, projects, experience, and contact details. Can answer questions about any aspect of his background.",
    schema: aboutMeSchema,
  }
);
