import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { useSelector } from 'react-redux'
import { FaBox, FaShoppingCart, FaRupeeSign, FaExclamationTriangle, FaCheckCircle, FaEdit, FaTimes, FaChevronRight, FaUser, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const Report = () => {
    const user = useSelector(state => state.user)
    const [activeTab, setActiveTab] = useState('orders')
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [orderSummary, setOrderSummary] = useState({ totalAmount: 0, totalOrders: 0 })
    const [stockSummary, setStockSummary] = useState({ totalProducts: 0, totalStock: 0, outOfStock: 0, lowStock: 0 })
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [editingOrder, setEditingOrder] = useState(null)
    const [deliveryDate, setDeliveryDate] = useState('')
    const [orderStatus, setOrderStatus] = useState('')
    const [selectedOrder, setSelectedOrder] = useState(null)

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders()
        } else {
            fetchProductsStock()
        }
    }, [activeTab])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getAllOrders,
                params: { search }
            })
            if (response.data.success) {
                setOrders(response.data.data)
                setOrderSummary({
                    totalAmount: response.data.totalAmount || 0,
                    totalOrders: response.data.totalOrders || 0
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchProductsStock = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getAllProductsStock,
                params: { search }
            })
            if (response.data.success) {
                setProducts(response.data.data)
                setStockSummary(response.data.summary || {})
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (activeTab === 'orders') {
            fetchOrders()
        } else {
            fetchProductsStock()
        }
    }

    const openEditModal = (order) => {
        setEditingOrder(order)
        setDeliveryDate(order.delivery_date ? new Date(order.delivery_date).toISOString().split('T')[0] : '')
        setOrderStatus(order.order_status || 'Pending')
    }

    const handleUpdateOrder = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                ...SummaryApi.updateOrder,
                data: {
                    orderId: editingOrder._id,
                    delivery_date: deliveryDate,
                    order_status: orderStatus
                }
            })
            if (response.data.success) {
                toast.success('Order updated successfully')
                setEditingOrder(null)
                fetchOrders()
                if (selectedOrder && selectedOrder._id === editingOrder._id) {
                    setSelectedOrder(response.data.data)
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const canChangeStatus = (order) => {
        const orderDate = new Date(order.createdAt)
        const now = new Date()
        const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24))
        return daysDiff <= 3
    }

    const formatDate = (date) => {
        if (!date) return 'Not set'
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700'
            case 'Shipped': return 'bg-blue-100 text-blue-700'
            case 'Processing': return 'bg-orange-100 text-orange-700'
            case 'Cancelled': return 'bg-red-100 text-red-700'
            case 'Returned': return 'bg-purple-100 text-purple-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className='p-4'>
            <div className='mb-6'>
                <h2 className='text-2xl font-bold'>Admin Report</h2>
                <p className='text-gray-600'>Welcome back, {user.name} (Owner)</p>
            </div>

            {/* Summary Cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                <div className='bg-white p-4 rounded-lg shadow border'>
                    <div className='flex items-center gap-3'>
                        <div className='p-3 bg-blue-100 rounded-full'>
                            <FaShoppingCart className='text-blue-600' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Total Orders</p>
                            <p className='text-xl font-bold'>{orderSummary.totalOrders}</p>
                        </div>
                    </div>
                </div>
                <div className='bg-white p-4 rounded-lg shadow border'>
                    <div className='flex items-center gap-3'>
                        <div className='p-3 bg-green-100 rounded-full'>
                            <FaRupeeSign className='text-green-600' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Total Revenue</p>
                            <p className='text-xl font-bold'>tk{orderSummary.totalAmount?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className='bg-white p-4 rounded-lg shadow border'>
                    <div className='flex items-center gap-3'>
                        <div className='p-3 bg-purple-100 rounded-full'>
                            <FaBox className='text-purple-600' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Total Products</p>
                            <p className='text-xl font-bold'>{stockSummary.totalProducts}</p>
                        </div>
                    </div>
                </div>
                <div className='bg-white p-4 rounded-lg shadow border'>
                    <div className='flex items-center gap-3'>
                        <div className='p-3 bg-orange-100 rounded-full'>
                            <FaExclamationTriangle className='text-orange-600' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>Low Stock</p>
                            <p className='text-xl font-bold'>{stockSummary.lowStock}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className='flex gap-4 mb-4 border-b'>
                <button
                    onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
                    className={`pb-2 px-4 font-semibold ${activeTab === 'orders' ? 'border-b-2 border-amber-500 text-amber-600' : 'text-gray-500'}`}
                >
                    Orders Report
                </button>
                <button
                    onClick={() => { setActiveTab('stock'); setSelectedOrder(null); }}
                    className={`pb-2 px-4 font-semibold ${activeTab === 'stock' ? 'border-b-2 border-amber-500 text-amber-600' : 'text-gray-500'}`}
                >
                    Stock Report
                </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className='mb-4 flex gap-2'>
                <input
                    type='text'
                    placeholder='Search order ID, name, mobile...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='border p-2 rounded w-full max-w-md'
                />
                <button type='submit' className='bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600'>
                    Search
                </button>
            </form>

            {/* Main Content - Orders with Details Panel */}
            {activeTab === 'orders' && (
                <div className='flex flex-col lg:flex-row gap-4'>
                    {/* Orders List */}
                    <div className={`${selectedOrder ? 'lg:w-2/3' : 'w-full'}`}>
                        <div className='overflow-x-auto bg-white rounded-lg shadow border'>
                            <table className='w-full'>
                                <thead className='bg-gray-100'>
                                    <tr>
                                        <th className='p-3 text-left'></th>
                                        <th className='p-3 text-left'>Order ID</th>
                                        <th className='p-3 text-left'>Customer</th>
                                        <th className='p-3 text-left'>Product</th>
                                        <th className='p-3 text-left'>Amount</th>
                                        <th className='p-3 text-left'>Status</th>
                                        <th className='p-3 text-left'>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={7} className='p-4 text-center'>Loading...</td></tr>
                                    ) : orders.length === 0 ? (
                                        <tr><td colSpan={7} className='p-4 text-center'>No orders found</td></tr>
                                    ) : (
                                        orders.map((order, index) => (
                                            <tr 
                                                key={index} 
                                                className={`border-t hover:bg-gray-50 cursor-pointer ${selectedOrder?._id === order._id ? 'bg-amber-50' : ''}`}
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <td className='p-3'>
                                                    <FaChevronRight className={`text-gray-400 ${selectedOrder?._id === order._id ? 'text-amber-500' : ''}`} />
                                                </td>
                                                <td className='p-3 text-sm font-mono font-semibold text-amber-600'>{order.orderId}</td>
                                                <td className='p-3 text-sm'>
                                                    {order.userId?.name || order.guestInfo?.name || 'N/A'}<br/>
                                                    <span className='text-gray-500 text-xs'>
                                                        {order.userId?.mobile || order.guestInfo?.mobile || ''}
                                                    </span>
                                                </td>
                                                <td className='p-3 text-sm max-w-[150px] truncate'>{order.product_details?.name || 'N/A'}</td>
                                                <td className='p-3 text-sm font-semibold'>tk{order.totalAmt?.toLocaleString()}</td>
                                                <td className='p-3'>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.order_status || 'Pending')}`}>
                                                        {order.order_status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className='p-3 text-sm text-gray-600'>{formatDate(order.createdAt)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Details Panel */}
                    {selectedOrder && (
                        <div className='lg:w-1/3 bg-white rounded-lg shadow border p-4 h-fit sticky top-4'>
                            <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='text-lg font-bold'>Order Details</h3>
                                    <p className='text-sm text-gray-500'>{selectedOrder.orderId}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className='text-gray-400 hover:text-gray-600'>
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Customer Info */}
                            <div className='mb-4 p-3 bg-gray-50 rounded'>
                                <p className='font-semibold flex items-center gap-2 mb-2'>
                                    <FaUser className='text-amber-500' /> Customer Info
                                </p>
                                <p className='text-sm'>{selectedOrder.userId?.name || selectedOrder.guestInfo?.name || 'N/A'}</p>
                                <p className='text-sm text-gray-600 flex items-center gap-2'>
                                    <FaPhone className='text-xs' /> {selectedOrder.userId?.mobile || selectedOrder.guestInfo?.mobile || 'N/A'}
                                </p>
                                {selectedOrder.userId?.email && (
                                    <p className='text-sm text-gray-600'>{selectedOrder.userId.email}</p>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className='mb-4 p-3 bg-gray-50 rounded'>
                                <p className='font-semibold mb-2'>Product Info</p>
                                <div className='flex gap-3'>
                                    {selectedOrder.product_details?.image?.[0] && (
                                        <img 
                                            src={selectedOrder.product_details.image[0]} 
                                            alt={selectedOrder.product_details.name}
                                            className='w-16 h-16 object-cover rounded'
                                        />
                                    )}
                                    <div>
                                        <p className='text-sm font-medium'>{selectedOrder.product_details?.name || 'N/A'}</p>
                                        <p className='text-sm font-bold text-amber-600'>tk{selectedOrder.totalAmt?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            {selectedOrder.delivery_address && (
                                <div className='mb-4 p-3 bg-gray-50 rounded'>
                                    <p className='font-semibold flex items-center gap-2 mb-2'>
                                        <FaMapMarkerAlt className='text-amber-500' /> Delivery Address
                                    </p>
                                    <p className='text-sm'>
                                        {selectedOrder.delivery_address.address_line}, 
                                        {selectedOrder.delivery_address.city}, 
                                        {selectedOrder.delivery_address.state} - {selectedOrder.delivery_address.pincode}
                                    </p>
                                </div>
                            )}

                            {/* Order Status Update */}
                            <div className='mb-4 p-3 bg-gray-50 rounded'>
                                <p className='font-semibold mb-2'>Order Status</p>
                                <div className='flex flex-wrap gap-2 mb-3'>
                                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setOrderStatus(status)
                                                setEditingOrder(selectedOrder)
                                                setDeliveryDate(selectedOrder.delivery_date ? new Date(selectedOrder.delivery_date).toISOString().split('T')[0] : '')
                                            }}
                                            className={`px-3 py-1 rounded text-xs font-semibold transition
                                                ${selectedOrder.order_status === status 
                                                    ? 'bg-amber-500 text-white' 
                                                    : 'bg-white border hover:bg-gray-100'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Refund/Cancel/Return options - only within 3 days */}
                                {canChangeStatus(selectedOrder) && (
                                    <div className='flex flex-wrap gap-2 pt-2 border-t'>
                                        <button
                                            onClick={() => {
                                                setOrderStatus('Cancelled')
                                                setEditingOrder(selectedOrder)
                                            }}
                                            className='px-3 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200'
                                        >
                                            Cancel Order
                                        </button>
                                        <button
                                            onClick={() => {
                                                setOrderStatus('Returned')
                                                setEditingOrder(selectedOrder)
                                            }}
                                            className='px-3 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200'
                                        >
                                            Mark as Returned
                                        </button>
                                        <button
                                            onClick={() => {
                                                setOrderStatus('Delivered')
                                                setEditingOrder(selectedOrder)
                                            }}
                                            className='px-3 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200'
                                        >
                                            Mark as Delivered
                                        </button>
                                    </div>
                                )}
                                {!canChangeStatus(selectedOrder) && (
                                    <p className='text-xs text-gray-500 italic'>Status can only be changed within 3 days of ordering</p>
                                )}
                            </div>

                            {/* Delivery Date */}
                            <div className='mb-4 p-3 bg-gray-50 rounded'>
                                <p className='font-semibold mb-2'>Delivery Date</p>
                                <p className='text-sm'>{formatDate(selectedOrder.delivery_date)}</p>
                                <button
                                    onClick={() => {
                                        setEditingOrder(selectedOrder)
                                        setDeliveryDate(selectedOrder.delivery_date ? new Date(selectedOrder.delivery_date).toISOString().split('T')[0] : '')
                                        setOrderStatus(selectedOrder.order_status || 'Pending')
                                    }}
                                    className='mt-2 text-sm text-amber-600 hover:text-amber-700'
                                >
                                    Change Delivery Date
                                </button>
                            </div>

                            {/* Order Info */}
                            <div className='text-sm text-gray-500'>
                                <p>Ordered: {formatDate(selectedOrder.createdAt)}</p>
                                <p>Payment: {selectedOrder.payment_status}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Stock Table */}
            {activeTab === 'stock' && (
                <div className='overflow-x-auto'>
                    <table className='w-full bg-white rounded-lg shadow border'>
                        <thead className='bg-gray-100'>
                            <tr>
                                <th className='p-3 text-left'>Product</th>
                                <th className='p-3 text-left'>Category</th>
                                <th className='p-3 text-left'>Price</th>
                                <th className='p-3 text-left'>Stock</th>
                                <th className='p-3 text-left'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className='p-4 text-center'>Loading...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={5} className='p-4 text-center'>No products found</td></tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr key={index} className='border-t hover:bg-gray-50'>
                                        <td className='p-3'>
                                            <div className='flex items-center gap-2'>
                                                {product.image?.[0] && (
                                                    <img src={product.image[0]} alt={product.name} className='w-10 h-10 object-cover rounded' />
                                                )}
                                                <span className='font-medium text-sm'>{product.name}</span>
                                            </div>
                                        </td>
                                        <td className='p-3 text-sm'>{product.category?.name || 'N/A'}</td>
                                        <td className='p-3 text-sm font-semibold'>tk{product.price?.toLocaleString()}</td>
                                        <td className='p-3 text-sm font-bold'>{product.stock || 0}</td>
                                        <td className='p-3'>
                                            {product.stock <= 0 ? (
                                                <span className='px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1'>
                                                    <FaExclamationTriangle /> Out
                                                </span>
                                            ) : product.stock <= 10 ? (
                                                <span className='px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700 flex items-center gap-1'>
                                                    <FaExclamationTriangle /> Low
                                                </span>
                                            ) : (
                                                <span className='px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1'>
                                                    <FaCheckCircle /> OK
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Order Modal */}
            {editingOrder && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-lg font-bold'>Update Order</h3>
                            <button onClick={() => setEditingOrder(null)} className='text-gray-500 hover:text-gray-700'>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateOrder}>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium mb-1'>Order ID</label>
                                <input 
                                    type='text' 
                                    value={editingOrder.orderId} 
                                    disabled 
                                    className='w-full border p-2 rounded bg-gray-100'
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium mb-1'>Delivery Date</label>
                                <input 
                                    type='date' 
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    className='w-full border p-2 rounded'
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium mb-1'>Order Status</label>
                                <select 
                                    value={orderStatus}
                                    onChange={(e) => setOrderStatus(e.target.value)}
                                    className='w-full border p-2 rounded'
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Returned">Returned</option>
                                </select>
                            </div>
                            <button 
                                type='submit'
                                className='w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600'
                            >
                                Update Order
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Report
