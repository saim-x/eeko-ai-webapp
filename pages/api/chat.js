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
            const mode = req.body.mode;
            console.log("Received messages:", JSON.stringify(messages, null, 2));
            console.log("Mode:", mode);
            
            // Format messages for Groq API
            const formattedMessages = messages.map(message => {
                if (message.role === 'user' && message.content && typeof message.content === 'object' && message.content.image) {
                    // Handle base64 encoded image
                    const base64Image = message.content.image.replace(/^data:image\/\w+;base64,/, '');
                    return {
                        role: "user",
                        content: [
                            { type: "text", text: "Analyze this agricultural image:" },
                            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                        ]
                    };
                } else {
                    return {
                        role: message.role,
                        content: typeof message.content === 'string' ? message.content : JSON.stringify(message.content)
                    };
                }
            });
            
            console.log("Formatted messages:", JSON.stringify(formattedMessages, null, 2)); // Debug log

            const chatCompletion = await groq.chat.completions.create({
                messages: formattedMessages,
                model: "llama-3.2-11b-vision-preview",
                temperature: 0.5,
                max_tokens: 8192,
                top_p: 1,
                stream: false,
                stop: null
            });

            // Ensure the response is always a string
            const responseContent = chatCompletion.choices[0]?.message?.content || '';
            return res.status(200).json({ 
                role: 'assistant', 
                content: typeof responseContent === 'string' ? responseContent : JSON.stringify(responseContent)
            });

        } catch (error) {
            console.error("Error in chat API:", error);
            return res.status(500).json({ error: "An error occurred while processing your request." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}