'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "./Header";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Satellite,
    Sprout,
    MessageSquare,
    BarChart,
    CloudSun,
    Brain,
    Leaf,
    TrendingUp,
    Shield,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Here you would typically send the data to your backend
        // For now, we'll just log it to the console
        console.log("Form submitted:", formData);

        // Simulating an email send (replace with actual API call later)
        alert(`Thank you for your message, ${formData.name}! We'll get back to you soon.`);

        // Clear the form
        setFormData({ name: "", email: "", message: "" });
    };

    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <Header />
            <main className="flex-1 pt-16">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="flex flex-col items-start space-y-4 lg:w-1/2">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                                    Empower Farming with AI and Satellite Data
                                </h1>
                                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                    EekoAI: A hackathon project revolutionizing agriculture with Deep Learning, Computer Vision, Machine Learning, and AI.
                                </p>
                                <Button size="lg" className="mt-4 hover:bg-gray-700" onClick={() => router.push('/ChatBot')}>Explore EekoAI</Button>
                            </div>
                            <div className="lg:w-1/2">
                                <video
                                    src="/farm-video-background.mp4"
                                    className="rounded-lg shadow-xl"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    controls={false}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section
                    id="features"
                    className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900"
                >
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                            EekoAI Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card className="bg-green-50 dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader>
                                    <Satellite className="h-12 w-12 mb-4 text-green-600 dark:text-green-400" />
                                    <CardTitle className="text-2xl">Crops Imagery Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Leverage cutting-edge Computer Vision to analyze data for precise crop monitoring and management.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-blue-50 dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader>
                                    <Brain className="h-12 w-12 mb-4 text-blue-600 dark:text-blue-400" />
                                    <CardTitle className="text-2xl">AI-Driven Insights</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Harness the power of Deep Learning and Machine Learning to provide actionable insights for farmers.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-purple-50 dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader>
                                    <BarChart className="h-12 w-12 mb-4 text-purple-600 dark:text-purple-400" />
                                    <CardTitle className="text-2xl">Predictive Analytics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Utilize advanced ML models to predict crop yields, optimize resource allocation, and mitigate risks.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-yellow-50 dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader>
                                    <CloudSun className="h-12 w-12 mb-4 text-yellow-600 dark:text-yellow-400" />
                                    <CardTitle className="text-2xl">NASA Power API</CardTitle>
                                </CardHeader>
                                <CardContent>


                                    <p className="text-gray-600 dark:text-gray-300">
                                        Integrate real-time climate data with AI models.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-red-50 dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader>
                                    <Sprout className="h-12 w-12 mb-4 text-red-600 dark:text-red-400" />
                                    <CardTitle className="text-2xl">Weed Detection</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Employ Computer Vision techniques to detect weeds in crops.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-indigo-50 dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader>
                                    <MessageSquare className="h-12 w-12 mb-4 text-indigo-600 dark:text-indigo-400" />
                                    <CardTitle className="text-2xl">Farm crops image upload and analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Upload images of your farm crops and get an analysis of the image.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section id="about" className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">About EekoAI</h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                                    EekoAI is a groundbreaking hackathon project that combines satellite data with advanced AI technologies to revolutionize farming practices.
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                                    Our mission is to empower farmers with cutting-edge tools and insights, enabling data-driven decision-making and sustainable agricultural practices.
                                </p>
                                <Button variant="outline" size="lg">Discover More</Button>
                            </div>
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <TrendingUp className="h-8 w-8 mb-2 text-green-600" />
                                        <CardTitle>AI-Driven Efficiency</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Harness the power of AI to optimize resource usage and boost crop yields significantly.</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <Shield className="h-8 w-8 mb-2 text-blue-600" />
                                        <CardTitle>Data-Backed Sustainability</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Make environmentally conscious decisions supported by real-time satellite data and AI analysis.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Contact Us</h2>
                        <div className="max-w-md mx-auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Get in Touch</CardTitle>
                                    <CardDescription>Interested in EekoAI? We'd love to hear from you. Send us a message for more information.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="Your name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Your email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="message">Message</Label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                                    placeholder="Your message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                        <CardFooter className="px-0 pt-4">
                                            <Button type="submit" className="w-full">Send Message</Button>
                                        </CardFooter>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full py-6 bg-gray-100 dark:bg-gray-900">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                            <span className="font-bold text-gray-900 dark:text-white">EekoAI</span>
                        </div>
                        <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
                            <Link className="text-sm hover:underline underline-offset-4" href="#">
                                Terms of Service
                            </Link>
                            <Link className="text-sm hover:underline underline-offset-4" href="#">
                                Privacy Policy
                            </Link>
                            <Link className="text-sm hover:underline underline-offset-4" href="#">
                                Cookie Policy
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        © 2024 EekoAI. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}