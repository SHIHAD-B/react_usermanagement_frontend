import { useSelector,useDispatch } from "react-redux"
import { setUSerData } from "../../redux/store"
import { useNavigate } from "react-router-dom"
import axios from "axios"
export const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userdata = useSelector((state) => state.userData)
    const logout = () => {
        axios.get('http://localhost:4014/logout/')
            .then(() => {
                dispatch(setUSerData(null))
                navigate('/login')
            })
    }
    return (
        <>
            <div className="h-[10%] w-full border border-gray-600 flex">
                <div className="h-full w-[50%] flex items-center pl-2">
                    <img className="w-[60px] h-[60px] border border-gray-50 rounded-full" src={userdata.profile} alt="" />
                </div>
                <div className="h-full w-[50%] flex justify-end items-center gap-2 pr-3">
                    <span onClick={() => navigate('/home')} className="text-white text-lg cursor-pointer">Home</span>
                    <span onClick={() => navigate('/profile')} className="text-white text-lg cursor-pointer">Profile</span>
                    <button onClick={logout} className="border border-gray-600 text-white rounded h-10 w-28 bg-red-700">Logout</button>

                </div>


            </div>
        </>
    )
}