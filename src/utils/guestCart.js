// Guest cart utilities using localStorage
export const getGuestCart = () => {
    try {
        const cart = localStorage.getItem('guestCart')
        return cart ? JSON.parse(cart) : []
    } catch (error) {
        return []
    }
}

export const addToGuestCart = (product, quantity = 1) => {
    const cart = getGuestCart()
    const existingIndex = cart.findIndex(item => item.productId?._id === product._id || item.productId === product._id)
    
    if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity
    } else {
        cart.push({
            productId: product,
            quantity: quantity
        })
    }
    
    localStorage.setItem('guestCart', JSON.stringify(cart))
    return cart
}

export const updateGuestCartItem = (productId, quantity) => {
    const cart = getGuestCart()
    const index = cart.findIndex(item => item.productId?._id === productId || item.productId === productId)
    
    if (index >= 0) {
        if (quantity <= 0) {
            cart.splice(index, 1)
        } else {
            cart[index].quantity = quantity
        }
    }
    
    localStorage.setItem('guestCart', JSON.stringify(cart))
    return cart
}

export const removeFromGuestCart = (productId) => {
    const cart = getGuestCart()
    const newCart = cart.filter(item => item.productId?._id !== productId && item.productId !== productId)
    localStorage.setItem('guestCart', JSON.stringify(newCart))
    return newCart
}

export const clearGuestCart = () => {
    localStorage.removeItem('guestCart')
}

export const isGuestCartEmpty = () => {
    const cart = getGuestCart()
    return cart.length === 0
}

export const getGuestCartTotal = () => {
    const cart = getGuestCart()
    return cart.reduce((total, item) => {
        const price = item.productId?.price || 0
        const discount = item.productId?.discount || 0
        const discountedPrice = price - (price * discount / 100)
        return total + (discountedPrice * item.quantity)
    }, 0)
}
