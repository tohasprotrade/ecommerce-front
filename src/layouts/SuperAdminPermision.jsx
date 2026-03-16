import React from 'react'
import { useSelector } from 'react-redux'
import { isSuperAdmin } from '../utils/isAdmin'

const SuperAdminPermision = ({children}) => {
    const user = useSelector(state => state.user)

    return (
        <>
            {
                isSuperAdmin(user.role) ?  children : (
                    <div className='flex items-center justify-center h-64'>
                        <div className='text-center'>
                            <p className='text-red-600 bg-red-100 p-4 rounded-lg'>
                                You do not have permission to access this page.
                            </p>
                            <p className='text-gray-500 mt-2'>Only Super Admin can view this page.</p>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default SuperAdminPermision
