import React from 'react'
import Squares from '@/components/Squares';
const Cta = () => {
    return (
        <div className='bg-black'>
            <Squares
                speed={0.5}
                squareSize={25}
                direction='diagonal' // up, down, left, right, diagonal
                borderColor='#2d2a3d'
                hoverFillColor='#6366F1'
            />
        </div>
    )
}

export default Cta
