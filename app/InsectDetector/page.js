'use client'
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaUpload, FaBug } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';

const InsectDetector = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    const [mode, setMode] = useState('upload');
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const handleSubmit = async () => {
        if (!image) return;

        const userMessage = { 
            role: 'user', 
            content: { image: image }
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/detect-insect', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: image }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (error) {
            console.error("Error calling image analysis API:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error while analyzing the image. Please try again later." }]);
        } finally {
            setIsLoading(false);
            setImage(null);
        }
    };

    const handleCameraCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setMode('camera');
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
            setImage(imageDataUrl);
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setMode('upload');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderMessageContent = (content) => {
        if (typeof content === 'string') {
            return (
                <ReactMarkdown
                    components={{
                        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                    }}
                >
                    {content}
                </ReactMarkdown>
            );
        } else if (content && typeof content === 'object') {
            if (content.image) {
                return <img src={content.image} alt="User uploaded" className="max-w-full h-auto rounded-lg" />;
            }
        }
        return <p>Unsupported message content</p>;
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex justify-center items-start p-4 pt-20">
                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl w-full flex flex-col">
                    <h2 className="text-3xl font-bold mb-6 text-green-600 flex items-center">
                        <FaBug className="mr-2" /> Insect Detector
                    </h2>
                    <p className="text-gray-600 mb-6">Upload or capture an image to detect and analyze insects in your crops.</p>
                    <div className="flex-grow overflow-y-auto mb-6 space-y-4 max-h-96">
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[75%] p-3 rounded-2xl shadow ${
                                    message.role === 'user' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {renderMessageContent(message.content)}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="flex space-x-2 mb-4">
                        <Button onClick={handleCameraCapture} variant={mode === 'camera' ? 'default' : 'outline'} className="flex-1">
                            <FaCamera className="mr-2" /> Camera
                        </Button>
                        <Button onClick={() => fileInputRef.current.click()} variant={mode === 'upload' ? 'default' : 'outline'} className="flex-1">
                            <FaUpload className="mr-2" /> Upload
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    {mode === 'camera' && (
                        <div className="mb-4">
                            <video ref={videoRef} className="w-full h-auto rounded-lg" autoPlay playsInline muted />
                            <canvas ref={canvasRef} className="hidden" />
                            <Button onClick={captureFrame} className="mt-2 w-full">Capture Frame</Button>
                        </div>
                    )}
                    {image && (
                        <div className="mb-4">
                            <img src={image} alt="Captured or uploaded image" className="max-w-full h-auto rounded-lg shadow" />
                            <Button onClick={handleSubmit} className="mt-2 w-full bg-green-600 text-white" disabled={isLoading}>
                                {isLoading ? 'Analyzing...' : 'Analyze Image'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InsectDetector;