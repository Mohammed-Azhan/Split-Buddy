'use client'
import React from 'react'
import FuzzyText from '@/components/FuzzyText';

const page = () => {
  return (
    <div className='pt-12'>
      <FuzzyText
        baseIntensity={0.2}
        hoverIntensity={0.5}
        enableHover={true}
        color={"black"}
        fontSize = {'clamp(1rem, 4vw, 4rem)'}
      >
        Dashboard
      </FuzzyText>

       
    </div>
  )
}

export default page
