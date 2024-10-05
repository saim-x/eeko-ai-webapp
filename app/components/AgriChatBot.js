import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaTag, FaCamera, FaUpload } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Groq } from "groq-sdk";

const AgriChatbot = ({ latitude, longitude, nasaData }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [locationInfo, setLocationInfo] = useState(null);
    const chatEndRef = useRef(null);
    const [currentTagIndex, setCurrentTagIndex] = useState(0);
    const [mode, setMode] = useState('text'); // 'text', 'camera', or 'upload'
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        fetchLocationInfo();
    }, [latitude, longitude]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTagIndex((prevIndex) => (prevIndex + 1) % promptTags.length);
        }, 2000); // Change tag every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchLocationInfo = async () => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            setLocationInfo(data);
        } catch (error) {
            console.error('Error fetching location info:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!input.trim() && mode === 'text') || (!image && (mode === 'camera' || mode === 'upload'))) return;

        const userMessage = { 
            role: 'user', 
            content: mode === 'text' ? input : { image: image }
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (error) {
            console.error("Error calling chat API:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error while processing your request. Please try again later." }]);
        } finally {
            setIsLoading(false);
            setImage(null);
            setMode('text');
        }
    };

    const getBotResponse = async (userMessage) => {
        const locationString = locationInfo ?
            `${locationInfo.address.city || locationInfo.address.town || locationInfo.address.village || 'Unknown City'}, ${locationInfo.address.country || 'Unknown Country'}` :
            'Unknown Location';

        try {
            const messages = [
                {
                    role: "system",
                    content: `You are an agricultural assistant who only talks about agriculture and crops. Answer concisely. The user's location is at coordinates ${latitude}°N, ${longitude}°E, which is in ${locationString}. Use this location information and the following NASA POWER API data to provide relevant agricultural advice: ${JSON.stringify(nasaData)}`

                }
            ];

            if (mode === 'text') {
                messages.push({
                    role: "user",
                    content: userMessage
                });
            } else if (mode === 'camera' || mode === 'upload') {
                messages.push({
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze this agricultural image and provide insights:" },
                        { type: "image_url", image_url: { url: image } }
                    ]
                });
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: messages,
                    mode: mode,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.content;
        } catch (error) {
            console.error("Error calling chat API:", error);
            return "I'm sorry, I encountered an error while processing your request. Please try again later.";
        }
    };

    const handleCameraCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            await videoElement.play();

            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            canvas.getContext('2d').drawImage(videoElement, 0, 0);

            const imageDataUrl = canvas.toDataURL('image/jpeg');
            setImage(imageDataUrl);
            setMode('camera');

            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setMode('upload');
            };
            reader.readAsDataURL(file);
        }
    };

    const promptTags = [
        "Best crops for my area",
        "Soil health tips",
        "Weather impact on farming",
        "Pest control advice",
        "Sustainable farming practices",
        "Irrigation strategies",
        "Crop rotation benefits",
        "Solar radiation effects",
        "Temperature trends",
        "Precipitation patterns",
        "Wind speed impact",
        "Humidity management",
        "Frost risk assessment",
        "Growing degree days",
        "Climate change adaptation"
    ];

    return (
        <div className="bg-gray-800 rounded-lg p-2 sm:p-4 w-full h-full flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-gray-100">Agricultural Assistant</h2>
            <div className="flex-grow overflow-y-auto mb-2 sm:mb-4">
                {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                        <span className={`inline-block p-1 sm:p-2 text-sm sm:text-base rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </span>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="text-center">
                        <FaRobot className="animate-spin inline-block text-gray-400" />
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="mb-2 flex justify-center space-x-2">
                <button onClick={() => setMode('text')} className={`p-2 rounded ${mode === 'text' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    <FaPaperPlane />
                </button>
                <button onClick={handleCameraCapture} className={`p-2 rounded ${mode === 'camera' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    <FaCamera />
                </button>
                <button onClick={() => fileInputRef.current.click()} className={`p-2 rounded ${mode === 'upload' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    <FaUpload />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
            </div>
            {image && (
                <div className="mb-2">
                    <img src={image} alt="Captured or uploaded image" className="max-w-full h-auto" />
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
                {mode === 'text' && (
                    <div className="flex-grow mb-2 sm:mb-0 sm:mr-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-gray-700 text-gray-100 text-sm sm:text-base rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ask about agriculture..."
                        />
                    </div>
                )}
                <button
                    type="submit"
                    className="bg-blue-600 text-white rounded-lg p-2 sm:p-3 hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                    disabled={isLoading}
                >
                    <FaPaperPlane className="text-sm sm:text-base" />
                    <span className="ml-2 hidden sm:inline">Send</span>
                </button>
            </form>
        </div>
    );
};

export default AgriChatbot;