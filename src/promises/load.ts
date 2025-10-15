import { readFile } from "fs/promises";

async function loadAboutMe() {
  try {
    const file = await readFile("./src/promises/aboutme.json", "utf-8");
    const data = JSON.parse(file);
    return data;
  } catch (error) {
    console.error("Error reading aboutme.json:", error);
  }
}

export { loadAboutMe };