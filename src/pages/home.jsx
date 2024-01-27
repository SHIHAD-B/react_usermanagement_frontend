import axios from "axios"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setUSerData } from "../../redux/store"
import { Navbar } from "../components/navbar"
export const Home = () => {

    const dispatch = useDispatch()
    const userdata = useSelector((state) => state.userData)
   
   


    useEffect(() => {
        axios.get('http://localhost:4014/fetchuserdata/').then((response) => {
            dispatch(setUSerData(response.data))
        })
    }, [])

    return (
        <>
            <div className="h-screen w-screen bg-blue-900 flex flex-col">
                <Navbar />
                <h1 className="w-full text-white text-center mt-3 font-bold text-3xl">Welcome {userdata?.name} ....</h1>
                <div className="w-full h-[80%] flex justify-center items-center">
                    <img className="h-[50%] md:h-full w-[60%] md:w-[50%] " src="./src/assets/content-manager-concept-isolated-creation-of-content-for-filling-site-layout-people-scene-in-flat-cartoon-design-illustration-for-blogging-website-mobile-app-promotional-materials-vector-removebg-prev.png" alt="" />
                </div>
            </div>
        </>
    )
}