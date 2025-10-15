import fetch from 'node-fetch';

const API_KEY = process.env.GOOGLE_API_KEY;

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    console.log('Available models:');
    data.models?.forEach(model => {
      console.log(`- ${model.name}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
