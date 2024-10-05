import { getAuth } from "@clerk/nextjs/server";
import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export default async function handler(req, res) {
    const { userId } = getAuth(req);

    // Check if the user is authenticated
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === 'POST') {
        if (!GROQ_API_KEY) {
            console.error("GROQ_API_KEY is not set.");
            return res.status(500).json({ error: "GROQ_API_KEY is not set." });
        }

        const groq = new Groq({
            apiKey: GROQ_API_KEY
        });

        try {
            const { image } = req.body;

            if (!image) {
                return res.status(400).json({ error: "No image provided." });
            }

            const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

            const analysisMessages = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze this image and provide insights. If the image is related to agriculture, focus on:" },
                        { type: "text", text: "1) Crop types visible\n2) Plant growth stages\n3) Signs of pest damage or disease\n4) Overall crop health\n5) Soil condition (if visible)\n6) Irrigation systems or farming equipment\n7) Estimated field size and crop density\n8) Recommendations for improving yield or health\n\nIf the image is not related to agriculture, provide a general description of what you see in the image. Be concise and focus only on what's clearly visible." },
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ]
                }
            ];

            const analysisCompletion = await groq.chat.completions.create({
                messages: analysisMessages,
                model: "llama-3.2-11b-vision-preview",
                temperature: 0.5,
                max_tokens: 8192,
                top_p: 1,
                stream: false,
                stop: null
            });

            const responseContent = analysisCompletion.choices[0]?.message?.content || '';
            return res.status(200).json({ 
                role: 'assistant', 
                content: responseContent
            });

        } catch (error) {
            console.error("Error in image analysis API:", error);
            return res.status(500).json({ error: "An error occurred while processing your request." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}