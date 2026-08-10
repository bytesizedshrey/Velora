import React from 'react'
import { useSelector } from 'react-redux'
import {Navigate} from 'react-router'

const Protected = ({children,role = "buyer"}) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    
    if(loading){
        return <div>loading</div>
    }
    
    if(!user){
        return <Navigate to='/login' />
    }
    
    // If role is "any", allow any logged-in user (buyers and sellers)
    if (role !== "any" && user.role !== role) {
        return <Navigate to="/" />
    }
    
    return children
}

export default Protected