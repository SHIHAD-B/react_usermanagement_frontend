
import { Routes, Route } from 'react-router-dom'
import { Login } from '../pages/login'
import { SignUp } from '../pages/signup'
import { Home } from '../pages/home'
import { Profile } from '../pages/profile'
import { Admin } from '../pages/adminDash'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { setUSerData } from '../../redux/store'
import axios from 'axios'
export const Router = () => {

    const dispatch = useDispatch()
    const userdata = useSelector((state) => state.userData)


    useEffect(() => {
        axios.get('http://localhost:4014/fetchuserdata/').then((response) => {
            dispatch(setUSerData(response.data))
        })
    }, [])
    return (
        <>
            <Routes>
                <Route path='/' element={userdata ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                <Route path='/login' element={!userdata ? <Login /> :userdata.role=='admin'?<Navigate to="/admin" />: <Navigate to="/home" />} />
                <Route path='/signup' element={!userdata ? <SignUp /> : <Navigate to="/home" />} />
                <Route path='/home' element={userdata ?userdata.role=='user'? <Home />:<Navigate to="/login" />: <Navigate to="/login" />} />
                <Route path='/profile' element={userdata ?userdata.role=='user'?  <Profile />:<Navigate to="/login" /> : <Navigate to="/" />} />
                <Route path='/admin' element={userdata?.role=='admin'?<Admin />:<Navigate to="/login" />} />
            </Routes>
        </>
    )
}