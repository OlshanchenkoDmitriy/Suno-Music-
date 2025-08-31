import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Serve static files from the root

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Endpoint for style suggestions
app.post('/api/suggestions', async (req, res) => {
    try {
        const { styleTags, styleInput } = req.body;
        const prompt = `Based on the following musical styles: [${styleTags.join(', ')}]. The user is currently typing: "${styleInput}". Suggest 5 related music genres, moods, or instruments. Prioritize suggestions related to what the user is typing. If both are empty, suggest 5 popular and diverse genres. Return only a JSON array of strings, like ["pop", "rock", "lo-fi"].`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
            },
        });

        const suggestions = JSON.parse(response.text);
        res.json(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).send('Failed to fetch suggestions');
    }
});

// Endpoint for fixing lyrics
app.post('/api/fix-lyrics', async (req, res) => {
    try {
        const { lyrics } = req.body;
        const prompt = `You are a helpful assistant for songwriters. A user has provided lyrics that need cleanup. Your primary goal is to fix formatting, typos, and structural tags while preserving the original language of the lyrics.

1. **Preserve Language**: Keep the lyrics in their original language. Do NOT translate the entire song unless it's a mix of languages or completely un-parsable.
2. **Correct Mistakes**: Fix obvious spelling and grammar errors within the original language.
3. **Format Stanzas**: Organize the text into standard lyric stanzas (verses, choruses, etc.).
4. **Standardize Tags**: Find all structural tags (e.g., 'verse', 'chorus', 'bridge', 'intro', 'outro', 'guitar solo'). You MUST reformat these tags to be ONLY in square brackets. For example, (chorus) or "verse 1" must become [Chorus] and [Verse 1]. This is the most important rule.
5. **Clean Output**: Return ONLY the cleaned and formatted lyrics. Do not add any commentary, headings, or explanations.

Here is the text to process:
"${lyrics}"`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        res.send(response.text);
    } catch (error) {
        console.error('Error fixing lyrics:', error);
        res.status(500).send('Failed to fix lyrics');
    }
});

// Endpoint for parsing a song description
app.post('/api/parse-song', async (req, res) => {
    try {
        const { userInput } = req.body;
        const songSchema = {
            type: Type.OBJECT,
            properties: {
                lyrics: {
                    type: Type.STRING,
                    description: "The lyrics for the song. If none are provided, this should be an empty string.",
                },
                title: {
                    type: Type.STRING,
                    description: "The title of the song. If not specified, suggest a creative title based on the lyrics or styles.",
                },
                styles: {
                    type: Type.ARRAY,
                    description: "A list of musical styles, genres, moods, or instruments mentioned in the prompt. E.g., ['pop', '80s', 'synth', 'happy'].",
                    items: { type: Type.STRING },
                },
                isInstrumental: {
                    type: Type.BOOLEAN,
                    description: "True if the user requests an instrumental track, otherwise false.",
                },
                vocalGender: {
                    type: Type.STRING,
                    description: "The preferred vocal gender. Should be 'male', 'female', or 'neutral'. Default to 'neutral' if not specified.",
                },
                weirdness: {
                    type: Type.INTEGER,
                    description: "A value from 0 to 100 representing how unusual or experimental the song should be. 50 is neutral. Extract from user input if present.",
                },
                styleInfluence: {
                    type: Type.INTEGER,
                    description: "A value from 0 to 100 representing how strongly the specified styles should influence the result. 50 is neutral.",
                },
            },
        };
        const prompt = `Parse the following song description and extract its properties into the provided JSON schema. Stick strictly to the schema. Description: "${userInput}"`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: songSchema,
            },
        });

        const jsonString = response.text;
        res.json(JSON.parse(jsonString));
    } catch (error) {
        console.error('Error parsing song:', error);
        res.status(500).send('Failed to parse song description');
    }
});

// Endpoint for generating lyrics
app.post('/api/generate-lyrics', async (req, res) => {
    try {
        const { theme } = req.body;
        if (!theme) {
            return res.status(400).send('Theme is required.');
        }

        const prompt = `You are a creative songwriter. Write a complete song with lyrics about the following theme: "${theme}".
The song should have a clear structure, including verses and a chorus.
It can optionally include other parts like a bridge, intro, or outro.
Format the parts with tags like [Verse 1], [Chorus], [Bridge].
Return ONLY the lyrics. Do not include any other text, title, or explanation.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.send(response.text);
    } catch (error) {
        console.error('Error generating lyrics:', error);
        res.status(500).send('Failed to generate lyrics');
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});