'use client';
import { div } from 'framer-motion/client';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const params = useSearchParams();
  const failure = params.get("message");

  return (
    <div>
      {failure && (
        <div className='flex h-[100vh] gap-28 items-center justify-center flex-col'>
            <h1 className='font-bold text-4xl mt-8 text-center'>Oops! Looks like the token is invalid or expired</h1>
            <Image src={'/taken.svg'} width={400} height={400} alt='image'></Image>
        </div>
      )}
    </div>
  );
};

export default Page;
