'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCamera, FaUpload, FaMapMarkerAlt, FaSatellite, FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import { format, subDays } from 'date-fns';
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'] });

const AgriChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState('text');
    const [image, setImage] = useState(null);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [nasaData, setNasaData] = useState(null);
    const [showNasaData, setShowNasaData] = useState(false);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchNasaData = async () => {
        if (!latitude || !longitude) return null;
        const endDate = format(new Date(), 'yyyyMMdd');
        // 12 days bhi chal jae ga but 10 for safe side if user prompt is big
        const startDate = format(subDays(new Date(), 10), 'yyyyMMdd');

        try {
            const res = await fetch(
                `https://power.larc.nasa.gov/api/temporal/hourly/point?start=${startDate}&end=${endDate}&latitude=${latitude}&longitude=${longitude}&community=re&parameters=T2M,PRECTOTCORR,WS2M,RH2M,ALLSKY_SFC_SW_DWN&format=json&user=demo&header=true`
            );
            const result = await res.json();
            return result;
        } catch (err) {
            console.error("Error fetching NASA data:", err);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!input.trim() && mode === 'text') || (!image && (mode === 'camera' || mode === 'upload'))) return;

        setIsLoading(true);

        const fetchedNasaData = await fetchNasaData();

        let userMessage = {
            role: 'user',
            content: mode === 'text' ? input : { image: image }
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, {
                        role: 'user',
                        content: `
User query: ${userMessage.content}

NASA POWER Data for the location:
${JSON.stringify(fetchedNasaData)}

Please analyze the NASA POWER data provided above and use it to inform your response to the user's query. Consider how the weather conditions might affect agricultural practices or crop growth in the area.
`
                    }],
                    mode,
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (error) {
            console.error("Error calling chat API:", error);
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

            setImage(canvas.toDataURL('image/jpeg'));
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

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude.toFixed(6));
                    setLongitude(position.coords.longitude.toFixed(6));
                },
                (error) => console.error("Error getting location:", error)
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
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
        } else if (content && typeof content === 'object' && content.image) {
            return <img src={content.image} alt="User uploaded" className="max-w-full h-auto rounded-lg" />;
        }
        return <p>Unsupported message content</p>;
    };

    const renderNasaData = () => {
        if (!nasaData || !nasaData.properties || !nasaData.properties.parameter) return null;

        const parameters = nasaData.properties.parameter;
        const dates = Object.keys(parameters.T2M);

        return (
            <div className="bg-white rounded-2xl p-6 mt-6 shadow-xl overflow-x-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">NASA POWER Data</h2>
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-gray-200 text-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Temperature (°C)</th>
                            <th scope="col" className="px-6 py-3">Precipitation (mm)</th>
                            <th scope="col" className="px-6 py-3">Wind Speed (m/s)</th>
                            <th scope="col" className="px-6 py-3">Relative Humidity (%)</th>
                            <th scope="col" className="px-6 py-3">Solar Radiation (W/m²)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dates.map((date, index) => (
                            <tr key={date} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                <td className="px-6 py-4 font-medium text-gray-900">{date}</td>
                                <td className="px-6 py-4">{(parameters.T2M[date] - 273.15).toFixed(2)}</td>
                                <td className="px-6 py-4">{parameters.PRECTOTCORR[date].toFixed(2)}</td>
                                <td className="px-6 py-4">{parameters.WS2M[date].toFixed(2)}</td>
                                <td className="px-6 py-4">{parameters.RH2M[date].toFixed(2)}</td>
                                <td className="px-6 py-4">{parameters.ALLSKY_SFC_SW_DWN[date].toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className={`${inter.className} bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex flex-col`}>
            <Header />
            <div className="flex-grow flex flex-col p-4 sm:p-6 max-w-6xl mx-auto w-full">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <h1 className="text-3xl font-bold text-green-600 mb-4 flex items-center">
                        <FaRobot className="mr-2" /> AgriBot Assistant
                    </h1>
                    <p className="text-gray-600">Your AI-powered agricultural companion. Ask questions, get insights, and make data-driven decisions for your farm.</p>
                </div>
                
                <div className="flex-grow overflow-y-auto mb-6 space-y-6 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-200 pr-2 sm:pr-4 bg-white rounded-2xl shadow-xl p-6">
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] sm:max-w-3/4 p-3 sm:p-4 rounded-2xl shadow-lg ${message.role === 'user' ? 'bg-green-600 text-white' : 'bg-blue-100 text-gray-900'}`}>
                                {renderMessageContent(message.content)}
                            </div>
                        </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="bg-white rounded-2xl p-6 space-y-4 sm:space-y-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Input
                            type="text"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            placeholder="Latitude"
                            className="w-full sm:flex-grow bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"
                        />
                        <Input
                            type="text"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            placeholder="Longitude"
                            className="w-full sm:flex-grow bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"
                        />
                        <Button onClick={handleGetCurrentLocation} variant="secondary" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                            <FaMapMarkerAlt className="mr-2" />
                            Get Location
                        </Button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {[
                            { name: "Gojra (Punjab)", lat: "31.582045", lon: "74.329376" },
                            { name: "Sehwan (Sindh)", lat: "24.860966", lon: "67.001137" },
                            { name: "Charsadda (KPK)", lat: "34.008053", lon: "71.578640" },
                            { name: "Khuzdar (Balochistan)", lat: "28.394857", lon: "66.261768" },
                            { name: "Skardu (Gilgit-Baltistan)", lat: "35.350659", lon: "74.857989" }
                        ].map((location) => (
                            <Button 
                                key={location.name}
                                onClick={() => { setLatitude(location.lat); setLongitude(location.lon); }} 
                                className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs sm:text-sm py-1 px-2 rounded-full"
                            >
                                {location.name}
                            </Button>
                        ))}
                    </div>

                    {image && (
                        <div className="mt-4 sm:mt-6">
                            <Image
                                src={image}
                                alt="Captured or uploaded image"
                                width={500}
                                height={300}
                                layout="responsive"
                                className="rounded-xl shadow-lg"
                            />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full sm:flex-grow bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300 text-base sm:text-lg py-2 sm:py-3"
                            placeholder="Ask about agriculture..."
                        />
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg py-2 sm:py-3 px-4 sm:px-6">
                            <FaPaperPlane className="mr-2" />
                            Send
                        </Button>
                    </form>

                    <Button
                        onClick={() => setShowNasaData(!showNasaData)}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg py-2 sm:py-3 px-4 sm:px-6 mt-4"
                    >
                        <FaSatellite className="mr-2" />
                        {showNasaData ? 'Hide NASA Data' : 'Show NASA Data'}
                    </Button>
                </div>

                {showNasaData && renderNasaData()}
            </div>
        </div>
    );
};

export default AgriChatbot;