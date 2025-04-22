import React from 'react'
import { motion } from 'framer-motion' // This import is fine since you're using motion.div

const TransitionEffect = () => {
    return (
        <>
            <motion.div
                className='position-fixed top-0 bottom-0 right-full w-100 vh-100 z-30 bg-blue-200'
                initial={{ x: "100%", width: "100%" }}
                animate={{ x: "0%", width: "0%" }}
                exit={{ x: ["0%", "100%"], width: ["0%", "100%"] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <motion.div
                className='position-fixed top-0 bottom-0 right-full w-100 vh-100 z-20 bg-blue-500'
                initial={{ x: "100%", width: "100%" }}
                animate={{ x: "0%", width: "0%" }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
            />
            <motion.div
                className='position-fixed top-0 bottom-0 right-full w-100 vh-100 z-10 bg-blue-900'
                initial={{ x: "100%", width: "100%" }}
                animate={{ x: "0%", width: "0%" }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
            />
        </>
    )
}

export default TransitionEffect