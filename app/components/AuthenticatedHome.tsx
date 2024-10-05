import React from 'react';
import Link from 'next/link';
import { User } from '@clerk/nextjs/server';
import { Leaf, Droplet, MessageSquare, Bug, Satellite } from 'lucide-react';

interface AuthenticatedHomeProps {
  user: User | null;
}

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode; href: string }> = ({ title, description, icon, href }) => (
  <Link href={href} className="block">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center text-center">
      <div className="text-green-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </Link>
);

const AuthenticatedHome: React.FC<AuthenticatedHomeProps> = ({ user }) => {
  const features = [
    { title: 'Weed Detector', description: 'Identify and manage weeds in your crops', icon: <Leaf size={24} />, href: '/WeedDetector' },
    { title: 'ChatBot', description: 'Get instant answers to your farming questions', icon: <MessageSquare size={24} />, href: '/ChatBot' },
    { title: 'NASA Data', description: 'Access satellite data for informed decisions', icon: <Satellite size={24} />, href: '/NasaData' },
    { title: 'Insect Detector', description: 'Detect and identify crop-damaging insects', icon: <Bug size={24} />, href: '/InsectDetector' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome, {user?.firstName || 'User'}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Explore our AI-powered tools to enhance your farming practices
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to revolutionize your farming?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Our AI-powered tools are here to help you make data-driven decisions and improve your crop yield.
          </p>
          <Link href="/ChatBot" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Get Started with AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedHome;