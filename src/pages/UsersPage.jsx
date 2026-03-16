import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { FaUserShield, FaUser, FaTrash, FaEdit, FaPlus, FaSearch } from 'react-icons/fa'

const UsersPage = () => {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    
    const [openCreateAdmin, setOpenCreateAdmin] = useState(false)
    const [openEditUser, setOpenEditUser] = useState(false)
    const [openConfimBox, setOpenConfimBox] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    
    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    })

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getAllUsers,
                data: { page, limit: 20, search, role: roleFilter || undefined }
            })
            const { data: responseData } = response
            if (responseData.success) {
                setUsers(responseData.data)
                setTotalPage(responseData.totalPage)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page, roleFilter])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search) {
                fetchUsers()
            } else if (!search) {
                fetchUsers()
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [search])

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const handleRoleFilter = (e) => {
        setRoleFilter(e.target.value)
        setPage(1)
    }

    const handleCreateAdmin = async (e) => {
        e.preventDefault()
        if (newAdmin.password !== newAdmin.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        try {
            const response = await Axios({
                ...SummaryApi.createAdmin,
                data: {
                    name: newAdmin.name,
                    email: newAdmin.email,
                    mobile: newAdmin.mobile || null,
                    password: newAdmin.password
                }
            })
            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                setOpenCreateAdmin(false)
                setNewAdmin({ name: '', email: '', mobile: '', password: '', confirmPassword: '' })
                fetchUsers()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleUpdateRole = async (userId, newRole) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateUserRole,
                data: { userId, role: newRole }
            })
            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                fetchUsers()
                setOpenEditUser(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleUpdateStatus = async (userId, newStatus) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateUserRole,
                data: { userId, status: newStatus }
            })
            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                fetchUsers()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleDeleteUser = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteUser,
                data: { userId: selectedUser._id }
            })
            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                setOpenConfimBox(false)
                fetchUsers()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const openDeleteConfirm = (user) => {
        setSelectedUser(user)
        setOpenConfimBox(true)
    }

    const openEditModal = (user) => {
        setSelectedUser(user)
        setOpenEditUser(true)
    }

    return (
        <section className=''>
            <div className='p-4 bg-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4'>
                <h2 className='font-semibold text-lg'>Users Management</h2>
                <div className='flex items-center gap-3'>
                    <select 
                        value={roleFilter} 
                        onChange={handleRoleFilter}
                        className='p-2 border rounded outline-none focus:border-primary-200'
                    >
                        <option value="">All Roles</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                    </select>
                    <button 
                        onClick={() => setOpenCreateAdmin(true)}
                        className='text-sm bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2'
                    >
                        <FaPlus size={14} /> Create Admin
                    </button>
                </div>
            </div>

            <div className='p-4'>
                <div className='mb-4 flex items-center gap-2 bg-white p-2 rounded border'>
                    <FaSearch className='text-gray-400' />
                    <input
                        type='text'
                        placeholder='Search by name, email, mobile...'
                        value={search}
                        onChange={handleSearch}
                        className='w-full outline-none'
                    />
                </div>

                {loading ? (
                    <Loading />
                ) : users.length === 0 ? (
                    <NoData />
                ) : (
                    <div className='bg-white rounded shadow overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-gray-100'>
                                    <tr>
                                        <th className='p-3 text-left text-sm font-semibold'>Name</th>
                                        <th className='p-3 text-left text-sm font-semibold'>Email</th>
                                        <th className='p-3 text-left text-sm font-semibold'>Mobile</th>
                                        <th className='p-3 text-left text-sm font-semibold'>Role</th>
                                        <th className='p-3 text-left text-sm font-semibold'>Status</th>
                                        <th className='p-3 text-left text-sm font-semibold'>Joined</th>
                                        <th className='p-3 text-left text-sm font-semibold'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id} className='border-t hover:bg-gray-50'>
                                            <td className='p-3 text-sm'>
                                                <div className='flex items-center gap-2'>
                                                    {user.role === 'SUPER_ADMIN' && <FaUserShield className='text-purple-600' />}
                                                    {user.role === 'ADMIN' && <FaUserShield className='text-green-600' />}
                                                    {user.role === 'USER' && <FaUser className='text-gray-400' />}
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td className='p-3 text-sm'>{user.email}</td>
                                            <td className='p-3 text-sm'>{user.mobile || '-'}</td>
                                            <td className='p-3 text-sm'>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'ADMIN' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className='p-3 text-sm'>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    user.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                    user.status === 'Inactive' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className='p-3 text-sm text-gray-500'>
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                            </td>
                                            <td className='p-3 text-sm'>
                                                <div className='flex items-center gap-2'>
                                                    {user.role !== 'SUPER_ADMIN' && (
                                                        <>
                                                            <button
                                                                onClick={() => openEditModal(user)}
                                                                className='p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200'
                                                                title='Edit'
                                                            >
                                                                <FaEdit size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteConfirm(user)}
                                                                className='p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200'
                                                                title='Delete'
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {totalPage > 1 && (
                    <div className='flex items-center justify-center gap-2 mt-4'>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className='px-3 py-1 bg-gray-100 rounded disabled:opacity-50'
                        >
                            Previous
                        </button>
                        <span className='text-sm'>Page {page} of {totalPage}</span>
                        <button
                            disabled={page === totalPage}
                            onClick={() => setPage(p => p + 1)}
                            className='px-3 py-1 bg-gray-100 rounded disabled:opacity-50'
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {openCreateAdmin && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg w-full max-w-md'>
                        <h3 className='font-semibold text-lg mb-4'>Create New Admin</h3>
                        <form onSubmit={handleCreateAdmin} className='grid gap-4'>
                            <div>
                                <label className='text-sm'>Name *</label>
                                <input
                                    type='text'
                                    required
                                    value={newAdmin.name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    className='w-full p-2 border rounded outline-none focus:border-primary-200'
                                    placeholder='Enter name'
                                />
                            </div>
                            <div>
                                <label className='text-sm'>Email *</label>
                                <input
                                    type='email'
                                    required
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    className='w-full p-2 border rounded outline-none focus:border-primary-200'
                                    placeholder='Enter email'
                                />
                            </div>
                            <div>
                                <label className='text-sm'>Mobile</label>
                                <input
                                    type='text'
                                    value={newAdmin.mobile}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, mobile: e.target.value })}
                                    className='w-full p-2 border rounded outline-none focus:border-primary-200'
                                    placeholder='Enter mobile number'
                                />
                            </div>
                            <div>
                                <label className='text-sm'>Password *</label>
                                <input
                                    type='password'
                                    required
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    className='w-full p-2 border rounded outline-none focus:border-primary-200'
                                    placeholder='Enter password'
                                />
                            </div>
                            <div>
                                <label className='text-sm'>Confirm Password *</label>
                                <input
                                    type='password'
                                    required
                                    value={newAdmin.confirmPassword}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                                    className='w-full p-2 border rounded outline-none focus:border-primary-200'
                                    placeholder='Confirm password'
                                />
                            </div>
                            <div className='flex gap-2 justify-end mt-4'>
                                <button
                                    type='button'
                                    onClick={() => setOpenCreateAdmin(false)}
                                    className='px-4 py-2 border rounded'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600'
                                >
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {openEditUser && selectedUser && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg w-full max-w-md'>
                        <h3 className='font-semibold text-lg mb-4'>Edit User: {selectedUser.name}</h3>
                        <div className='grid gap-4'>
                            <div>
                                <label className='text-sm'>Role</label>
                                <select
                                    value={selectedUser.role}
                                    onChange={(e) => handleUpdateRole(selectedUser._id, e.target.value)}
                                    className='w-full p-2 border rounded outline-none focus:border-primary-200'
                                    disabled={selectedUser.role === 'SUPER_ADMIN'}
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className='text-sm'>Status</label>
                                <select
                                    value={selectedUser.status}
                                    onChange={(e) => handleUpdateStatus(selectedUser._id, e.target.value)}
                                    className='w-full p-2 border rounded outline-none focus:border-primary-200'
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>
                            <div className='flex justify-end mt-4'>
                                <button
                                    onClick={() => setOpenEditUser(false)}
                                    className='px-4 py-2 border rounded'
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {openConfimBox && selectedUser && (
                <CofirmBox
                    close={() => setOpenConfimBox(false)}
                    confirm={handleDeleteUser}
                    message={`Are you sure you want to delete ${selectedUser.name}?`}
                />
            )}
        </section>
    )
}

export default UsersPage
