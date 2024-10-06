import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

export default async function handler(req, res) {
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

            const messages = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "You are an expert in weed detection for agricultural fields. Analyze the following image and provide a concise response: just tell which weeds are detected and if no weed is detected reply with no weed detected , your response SHOULD be in 3 lines and your reply should be based on the squares shown on the image , if there are no squares then no weed is detected" },
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ]
                }
            ];

            const chatCompletion = await groq.chat.completions.create({
                messages: messages,
                model: "llama-3.2-11b-vision-preview",
                temperature: 0.5,
                max_tokens: 8192,
                top_p: 1,
                stream: false,
                stop: null
            });

            const responseContent = chatCompletion.choices[0]?.message?.content || '';
            return res.status(200).json({ 
                role: 'assistant', 
                content: responseContent
            });

        } catch (error) {
            console.error("Error in weed detection API:", error);
            return res.status(500).json({ error: "An error occurred while processing your request." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}