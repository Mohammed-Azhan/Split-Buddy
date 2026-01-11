'use client';
import React, { useEffect, useState } from 'react'
import SignIn from '@/pages/SignIn';
import { main } from 'framer-motion/client';
import { useSearchParams } from 'next/navigation';
const page = () => {
  const params = useSearchParams();
  const SignInError = params.get("SignInError") || null;
  const success = params.get("success");
  const [alert, showAlert] = useState(false);
  useEffect(() => {
    if(success){
      showAlert("Your account has been verified successfully , please login to continue");
    }
  }, [success, SignInError])
  return (
      <main className='bg-white'>
        <SignIn />
      </main>
  )
}

export default page
