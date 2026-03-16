const isAdmin = (s)=>{
    if(s === 'SUPER_ADMIN' || s === 'ADMIN'){
        return true
    }

    return false
}

export const isSuperAdmin = (s) => {
    if(s === 'SUPER_ADMIN'){
        return true
    }
    return false
}

export default isAdmin