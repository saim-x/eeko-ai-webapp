'use client'
import { useUser } from '@clerk/nextjs';
import LandingPage from "./components/LandingPage";
import AuthenticatedHome from "./components/AuthenticatedHome";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen">
      {isSignedIn ? <AuthenticatedHome user={user} /> : <LandingPage />}
    </main>
  );
}