import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { FaBox, FaShippingFast, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa'

const MyOrders = () => {
  const user = useSelector(state => state.user)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrderItems
      })
      if (response.data.success) {
        setOrders(response.data.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FaCheckCircle className="text-green-600" />
      case 'Shipped':
        return <FaShippingFast className="text-blue-600" />
      case 'Processing':
        return <FaClock className="text-orange-600" />
      case 'Cancelled':
        return <FaTimes className="text-red-600" />
      default:
        return <FaBox className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700'
      case 'Shipped':
        return 'bg-blue-100 text-blue-700'
      case 'Processing':
        return 'bg-orange-100 text-orange-700'
      case 'Cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className='p-4'>
      <div className='bg-white shadow-md p-3 font-semibold mb-4'>
        <h1 className='text-xl'>My Orders</h1>
        <p className='text-sm text-gray-500'>Welcome, {user.name}</p>
      </div>

      {loading ? (
        <div className='text-center p-4'>Loading...</div>
      ) : !orders.length ? (
        <NoData />
      ) : (
        <div className='space-y-4'>
          {orders.map((order, index) => (
            <div key={order._id + index} className='bg-white rounded-lg shadow-md border p-4'>
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <p className='font-bold text-lg'>Order No : {order?.orderId}</p>
                  <p className='text-sm text-gray-500'>
                    Ordered on: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(order.order_status || 'Pending')}`}>
                  {getStatusIcon(order.order_status || 'Pending')}
                  <span className='font-semibold text-sm'>{order.order_status || 'Pending'}</span>
                </div>
              </div>

              <div className='flex gap-4 items-center border-t pt-3'>
                {order.product_details?.image?.[0] && (
                  <img
                    src={order.product_details.image[0]}
                    alt={order.product_details.name}
                    className='w-20 h-20 object-cover rounded'
                  />
                )}
                <div className='flex-1'>
                  <p className='font-medium'>{order.product_details?.name || 'Product'}</p>
                  <p className='text-sm text-gray-500'>Qty: 1</p>
                  <p className='font-bold text-lg mt-1'>tk{order.totalAmt?.toLocaleString()}</p>
                </div>
              </div>

              <div className='border-t mt-3 pt-3'>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='text-gray-500'>Payment Status</p>
                    <p className='font-semibold'>{order.payment_status || 'N/A'}</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Delivery Date</p>
                    <p className='font-semibold'>{formatDate(order.delivery_date)}</p>
                  </div>
                </div>
              </div>

              {order.delivery_address && (
                <div className='border-t mt-3 pt-3 text-sm'>
                  <p className='text-gray-500'>Delivery Address</p>
                  <p className='font-medium'>
                    {order.delivery_address.address_line}, {order.delivery_address.city}, 
                    {order.delivery_address.state} - {order.delivery_address.pincode}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders
