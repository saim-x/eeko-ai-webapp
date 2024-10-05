// app/page.js

import LandingPage from "./components/LandingPage"; // Ensure the correct file extension

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <LandingPage />
    </main>
  );
}