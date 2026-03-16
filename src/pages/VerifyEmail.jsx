import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    
    const email = location?.state?.email || searchParams.get('email') || ""
    const [otp, setOtp] = useState(["","","","","",""])
    const inputRef = useRef([])

    useEffect(() => {
        if (!email) {
            toast.error("Please register first")
            navigate("/register")
        }
    }, [email])

    const valideValue = otp.every(el => el)

    const handleChange = (e, index) => {
        const value = e.target.value
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            inputRef.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRef.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!valideValue) {
            toast.error("Please enter complete OTP")
            return
        }

        setLoading(true)
        try {
            const response = await Axios({
                ...SummaryApi.verifyEmail,
                data: { 
                    email: email,
                    otp: otp.join("")
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                
                const { accesstoken, refreshToken } = response.data.data
                localStorage.setItem('accesstoken', accesstoken)
                localStorage.setItem('refreshToken', refreshToken)
                
                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))
                
                navigate("/")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const resendOtp = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.resendVerifyOtp,
                data: { email }
            })

            if (response.data.success) {
                toast.success(response.data.message)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-8 w-full max-w-md mx-auto rounded-xl shadow-lg border border-gray-100 p-8'>
                <div className='text-center mb-6'>
                    <h2 className='text-2xl font-bold text-gray-900'>Verify Email</h2>
                    <p className='text-gray-500 mt-1'>Enter the 6-digit OTP sent to</p>
                    <p className='font-semibold text-amber-600'>{email}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='grid gap-1 mb-4'>
                        <label className='text-sm font-medium text-gray-700'>Enter OTP :</label>
                        <div className='flex items-center gap-2 justify-between mt-2'>
                            {otp.map((el, index) => (
                                <input
                                    key={"otp"+index}
                                    type='text'
                                    ref={(ref) => {
                                        inputRef.current[index] = ref
                                        return ref 
                                    }}
                                    value={otp[index]}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    maxLength={1}
                                    className='bg-blue-50 w-full max-w-14 p-3 border rounded-lg outline-none focus:border-amber-500 text-center font-semibold text-lg'
                                />
                            ))}
                        </div>
                    </div>
            
                    <button 
                        disabled={!valideValue || loading} 
                        className={`w-full py-3 rounded-lg font-semibold text-white tracking-wide transition-all ${valideValue && !loading ? "bg-amber-500 hover:bg-amber-600 shadow-md" : "bg-gray-400 cursor-not-allowed"}`}
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                <div className='text-center mt-4'>
                    <p className='text-gray-600'>
                        Didn't receive OTP? 
                        <button onClick={resendOtp} className='font-semibold text-amber-600 hover:text-amber-700 ml-1'>
                            Resend
                        </button>
                    </p>
                </div>

                <p className='text-center mt-6 text-gray-600'>
                    <button onClick={() => navigate("/register")} className='font-semibold text-amber-600 hover:text-amber-700'>
                        Register with different email
                    </button>
                </p>
            </div>
        </section>
    )
}

export default VerifyEmail
