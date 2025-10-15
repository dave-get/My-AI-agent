import z from "zod";

export const aboutMeSchema = z.object({
  query: z.string().describe("The user's question about you")
});

export const aboutMeDataSchema = z.object({
  name: z.string(),
  title: z.string(),
  education: z.object({
    university: z.string(),
    degree: z.string(),
    year: z.string(),
  }),
  summary: z.string().optional(),
  skills: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    ui_ux: z.array(z.string()),
    other: z.array(z.string()),
  }),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
  experience: z.array(
    z.object({
      role: z.string(),
      project: z.string(),
      responsibilities: z.array(z.string()),
    })
  ),
  focus: z.array(z.string()).optional(),
  contact: z.object({
    email: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
  }),
  location: z.string().optional(),
});
