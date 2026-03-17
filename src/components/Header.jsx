import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import screen from '../assets/screen.png'
import logo1 from '../assets/logo1.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty, guestCart } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)

    // Show cart if user has items OR guest has items
    const hasCartItems = user._id ? cartItem[0] : guestCart.length > 0

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }

        navigate("/user")
    }

    return (
        <header className='h-16 w-full md:h-20 shadow-md fixed top-0 z-40 flex items-center bg-gradient-to-r from-green-600 to-green-500 border-b border-green-400'>
            <div className='container mx-auto flex items-center px-2 md:px-4 justify-between w-full gap-2 md:gap-4'>
                {/**logo */}
                <div className='flex-shrink-0'>
                    <Link to={"/"} className='block'>
                        <img
                            src={logo1}
                            alt='Ghor2ghor'
                            className='h-20 md:h-20 w-auto max-w-[150px] md:max-w-[220px] object-contain'
                        />
                    </Link>
                </div>

                {/**Search */}
                <div className='hidden md:block flex-1 max-w-lg mx-2 lg:mx-4'>
                    <Search />
                </div>


                {/**login and my cart */}
                <div className='flex items-center gap-2 md:gap-3 flex-shrink-0'>
                    {/**user icons display in only mobile version**/}
                    <button className='p-1.5 md:p-2 text-white hover:text-green-100 lg:hidden' onClick={handleMobileUser}>
                        <FaRegCircleUser size={20} />
                    </button>

                    {/**Desktop**/}
                    <div className='hidden lg:flex items-center gap-4 xl:gap-6'>
                        {
                            user?._id ? (
                                <div className='relative'>
                                    <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-1 cursor-pointer'>
                                        <p className='text-white font-medium text-sm'>Account</p>
                                        {
                                            openUserMenu ? (
                                                <GoTriangleUp size={16} />
                                            ) : (
                                                <GoTriangleDown size={16} />
                                            )
                                        }

                                    </div>
                                    {
                                        openUserMenu && (
                                            <div className='absolute right-0 top-10'>
                                                <div className='bg-white rounded-lg p-4 min-w-48 lg:shadow-xl border border-gray-100'>
                                                    <UserMenu close={handleCloseUserMenu} />
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                            ) : (
                                <button onClick={redirectToLoginPage} className='text-sm px-2 py-1.5 text-white font-medium hover:text-green-100'>Login</button>
                            )
                        }
                        <button onClick={() => setOpenCartSection(true)} className='flex items-center gap-1.5 md:gap-2 bg-amber-500 hover:bg-amber-600 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-white font-semibold shadow-md transition-colors text-sm md:text-base'>
                            {/**add to card icons */}
                            <div className=''>
                                <BsCart4 size={18} />
                            </div>
                            <div className='hidden sm:block text-xs md:text-sm'>
                                {
                                    hasCartItems ? (
                                        <div className='leading-tight'>
                                            <span>{totalQty}</span> <span className='hidden md:inline'>Items</span>
                                        </div>
                                    ) : (
                                        <span>Cart</span>
                                    )
                                }
                            </div>
                            {hasCartItems && (
                                <div className='hidden md:block text-xs'>
                                    {DisplayPriceInRupees(totalPrice)}
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className='w-full px-2 pb-2 md:hidden'>
                <Search />
            </div>

            {
                openCartSection && (
                    <DisplayCartItem close={() => setOpenCartSection(false)} />
                )
            }
        </header>
    )
}

export default Header
