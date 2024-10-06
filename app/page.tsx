'use client';
import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthenticatedHome from './components/AuthenticatedHome';

export default function Home() {
  const [showAuthenticatedHome, setShowAuthenticatedHome] = useState(false);

  const handleExploreClick = () => {
    setShowAuthenticatedHome(true);
  };

  if (showAuthenticatedHome) {
    return <AuthenticatedHome />;
  }

  return <LandingPage onExploreClick={handleExploreClick} />;
}