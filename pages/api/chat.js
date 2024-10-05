import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("GROQ_API_KEY:", GROQ_API_KEY); // Debug log

        if (!GROQ_API_KEY) {
            console.error("GROQ_API_KEY is not set.");
            return res.status(500).json({ error: "GROQ_API_KEY is not set." });
        }

        const groq = new Groq({
            apiKey: GROQ_API_KEY
        });

        try {
            let messages = req.body.messages;
            console.log("Received messages:", messages);
            
            // Format messages for Groq API
            const formattedMessages = messages.map(message => {
                if (typeof message.content === 'object' && message.content.image) {
                    return {
                        role: "user",
                        content: [
                            { type: "text", text: "Analyze this agricultural image:" },
                            { type: "image_url", url: message.content.image }
                        ]
                    };
                } else {
                    return {
                        role: message.role,
                        content: typeof message.content === 'string' ? message.content : ""
                    };
                }
            });
            

            console.log("Formatted messages:", JSON.stringify(formattedMessages, null, 2)); // Debug log

            const chatCompletion = await groq.chat.completions.create({
                messages: formattedMessages,
                model: "llama-3.2-11b-vision-preview",
                temperature: 0.5,
                max_tokens: 1024,
                top_p: 1,
                stream: false,
                stop: null
            });

            res.status(200).json({ content: chatCompletion.choices[0].message.content });
        } catch (error) {
            console.error("Error calling Groq API:", error);
            res.status(500).json({ error: "An error occurred while processing your request." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}