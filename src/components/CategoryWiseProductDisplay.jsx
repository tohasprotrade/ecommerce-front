import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    

  

  const handleRedirectProductListpage = ()=>{
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

      return url
  }

  const redirectURL =  handleRedirectProductListpage()
    return (
        <div className='py-4'>
            <div className='container mx-auto px-3 md:px-4 flex items-center justify-between gap-2 mb-3'>
                <h3 className='font-bold text-lg md:text-xl text-gray-800 truncate'>{name}</h3>
                <Link to={redirectURL} className='text-sm font-medium text-amber-600 hover:text-amber-700 whitespace-nowrap'>See All</Link>
            </div>
            <div className='relative'>
                <div className='flex gap-3 md:gap-4 container mx-auto px-2 overflow-x-auto scrollbar-none scroll-smooth pb-2' ref={containerRef}>
                    {loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <CardLoading key={"CategorywiseProductDisplay123" + index} />
                            )
                        })
                    }

                    {
                        data.map((p, index) => {
                            return (
                                <CardProduct
                                    data={p}
                                    key={p._id + "CategorywiseProductDisplay" + index}
                                />
                            )
                        })
                    }
                </div>
                
                {data.length > 0 && (
                    <div className='hidden lg:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between px-2 pointer-events-none'>
                        <button 
                            onClick={handleScrollLeft} 
                            className='pointer-events-auto z-10 bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full transition-colors'
                        >
                            <FaAngleLeft className='text-gray-600' />
                        </button>
                        <button 
                            onClick={handleScrollRight} 
                            className='pointer-events-auto z-10 bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full transition-colors'
                        >
                            <FaAngleRight className='text-gray-600' />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay
