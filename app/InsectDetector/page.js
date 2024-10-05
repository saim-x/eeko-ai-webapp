'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCamera, FaUpload, FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import Header from '../components/Header'; // Assuming you have a Header component

const InsectDetector = ({ latitude, longitude, nasaData }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [locationInfo, setLocationInfo] = useState(null);
    const chatEndRef = useRef(null);
    const [mode, setMode] = useState('text');
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        fetchLocationInfo();
    }, [latitude, longitude]);

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
            const response = await fetch('/api/detect-insect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    image: mode === 'text' ? null : image  // Send image data if not in text mode
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (error) {
            console.error("Error calling detect-insect API:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later." }]);
        } finally {
            setIsLoading(false);
            setImage(null);
            setMode('text');
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

    const renderMessageContent = (content) => {
        if (typeof content === 'string') {
            return <ReactMarkdown>{content}</ReactMarkdown>;
        } else if (content && typeof content === 'object') {
            if (content.image) {
                return <img src={content.image} alt="User uploaded" className="max-w-[200px] h-auto rounded-lg" />;
            } else if (content.text) {
                return <ReactMarkdown>{content.text}</ReactMarkdown>;
            }
        }
        return <p>Unsupported message content</p>;
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <FaRobot className="mr-2" /> Insect Detector and Visual Analyzer
                    </h2>
                    <div className="flex-grow overflow-y-auto mb-6 space-y-4">
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[75%] p-3 rounded-lg shadow ${
                                    message.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {renderMessageContent(message.content)}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="flex space-x-2 mb-4">
                        <button onClick={() => setMode('text')} className={`p-2 rounded-full ${mode === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            <FaPaperPlane />
                        </button>
                        <button onClick={handleCameraCapture} className={`p-2 rounded-full ${mode === 'camera' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            <FaCamera />
                        </button>
                        <button onClick={() => fileInputRef.current.click()} className={`p-2 rounded-full ${mode === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            <FaUpload />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    {image && (
                        <div className="mb-4">
                            <img src={image} alt="Captured or uploaded image" className="max-w-[300px] h-auto rounded-lg shadow" />
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-grow bg-gray-100 text-gray-800 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Attach an image to analyze..."
                            disabled={mode !== 'text'}
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white rounded-r-lg p-3 hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InsectDetector;