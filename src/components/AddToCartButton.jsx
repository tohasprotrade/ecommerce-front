import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";
import { getGuestCart, addToGuestCart, updateGuestCartItem, removeFromGuestCart } from '../utils/guestCart'

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails,setCartItemsDetails] = useState()
    const [isGuest, setIsGuest] = useState(false)

    useEffect(() => {
        // Check if user is logged in
        if (!user._id) {
            setIsGuest(true)
            // Check guest cart
            const guestCart = getGuestCart()
            const guestItem = guestCart.find(item => item.productId?._id === data._id || item.productId === data._id)
            if (guestItem) {
                setIsAvailableCart(true)
                setQty(guestItem.quantity)
                setCartItemsDetails(guestItem)
            } else {
                setIsAvailableCart(false)
                setQty(0)
            }
        } else {
            setIsGuest(false)
            // Check logged in cart
            const checkingitem = cartItem.some(item => item.productId._id === data._id)
            setIsAvailableCart(checkingitem)

            const product = cartItem.find(item => item.productId._id === data._id)
            setQty(product?.quantity)
            setCartItemsDetails(product)
        }
    }, [data, cartItem, user._id])

    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (isGuest) {
            // Guest user - use localStorage cart
            try {
                const newCart = addToGuestCart(data, 1)
                toast.success("Item added to cart")
                // Trigger cart update event
                window.dispatchEvent(new Event('guestCartUpdated'))
            } catch (error) {
                toast.error("Failed to add item")
            }
            return
        }

        // Logged in user - use API
        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const increaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (isGuest) {
            const guestCart = getGuestCart()
            const guestItem = guestCart.find(item => item.productId?._id === data._id || item.productId === data._id)
            updateGuestCartItem(data._id, (guestItem?.quantity || 0) + 1)
            toast.success("Item added")
            window.dispatchEvent(new Event('guestCartUpdated'))
            return
        }
     
        const response = await updateCartItem(cartItemDetails?._id, qty + 1)
         
        if(response.success){
            toast.success("Item added")
        }
    }

    const decreaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (isGuest) {
            const guestCart = getGuestCart()
            const guestItem = guestCart.find(item => item.productId?._id === data._id || item.productId === data._id)
            const newQty = (guestItem?.quantity || 1) - 1
            if (newQty <= 0) {
                removeFromGuestCart(data._id)
                toast.success("Item removed")
            } else {
                updateGuestCartItem(data._id, newQty)
                toast.success("Item removed")
            }
            window.dispatchEvent(new Event('guestCartUpdated'))
            return
        }

        if(qty === 1){
            deleteCartItem(cartItemDetails?._id)
        }else{
            const response = await updateCartItem(cartItemDetails?._id, qty-1)

            if(response.success){
                toast.success("Item remove")
            }
        }
    }

    return (
        <div className='w-full max-w-[150px]'>
            {
                isAvailableCart ? (
                    <div className='flex w-full h-full'>
                        <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaMinus /></button>

                        <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p>

                        <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaPlus /></button>
                    </div>
                ) : (
                    <button onClick={handleAddToCart} className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded'>
                        {loading ? <Loading /> : "Add"}
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartButton
