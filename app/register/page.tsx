'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Clerk-hosted sign-up page
    router.push('/sign-up');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignUp />
    </div>
  );
}