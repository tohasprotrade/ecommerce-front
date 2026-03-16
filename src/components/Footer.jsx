import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='bg-white border-t border-gray-200 mt-auto'>
        <div className='container mx-auto p-6 text-center flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4'>
            <p className='text-sm text-gray-600'>© 2024 Ghor2ghor. All Rights Reserved.</p>

            <div className='flex items-center gap-4 justify-center text-xl'>
                <a href='' className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-amber-500 hover:text-white transition-all'>
                    <FaFacebook/>
                </a>
                <a href='' className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-amber-500 hover:text-white transition-all'>
                    <FaInstagram/>
                </a>
                <a href='' className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-amber-500 hover:text-white transition-all'>
                    <FaLinkedin/>
                </a>
            </div>
        </div>
    </footer>
  )
}

export default Footer
