import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)


    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accesstoken',response.data.data.accesstoken)
                localStorage.setItem('refreshToken',response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email : "",
                    password : "",
                })
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
        }



    }
    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-8 w-full max-w-md mx-auto rounded-xl shadow-lg border border-gray-100 p-8'>
                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-bold text-gray-900'>Welcome to Ghor2ghor</h2>
                    <p className='text-gray-500 mt-1'>Sign in to continue</p>
                </div>

                <form className='grid gap-5' onSubmit={handleSubmit}>
                    <div className='grid gap-2'>
                        <label htmlFor='email' className='text-sm font-medium text-gray-700'>Email Address</label>
                        <input
                            type='email'
                            id='email'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>
                    <div className='grid gap-2'>
                        <label htmlFor='password' className='text-sm font-medium text-gray-700'>Password</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all pr-12'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700'>
                                {
                                    showPassword ? (
                                        <FaRegEye size={20} />
                                    ) : (
                                        <FaRegEyeSlash size={20} />
                                    )
                                }
                            </div>
                        </div>
                        <Link to={"/forgot-password"} className='text-sm text-amber-600 hover:text-amber-700 ml-auto font-medium'>Forgot password?</Link>
                    </div>
    
                    <button disabled={!valideValue} className={`w-full py-3 rounded-lg font-semibold text-white tracking-wide transition-all ${valideValue ? "bg-amber-500 hover:bg-amber-600 shadow-md" : "bg-gray-400 cursor-not-allowed"}`}>
                        Sign In
                    </button>

                </form>

                <p className='text-center mt-6 text-gray-600'>
                    Don't have an account? <Link to={"/register"} className='font-semibold text-amber-600 hover:text-amber-700'>Register now</Link>
                </p>
            </div>
        </section>
    )
}

export default Login

