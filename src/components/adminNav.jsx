import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUSerData } from '../../redux/store';
import axios from 'axios';


export const AdminNav = ({ users, setUser ,setAddOpen}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [originalUserData, setOriginalUserData] = React.useState([...users]);


    const handleSearch = (event) => {
        const searchTerm = event.target.value.trim().toLowerCase();
        const filteredUsers = originalUserData.filter((user) =>
            user.name.toLowerCase().includes(searchTerm)
        );

        setUser(filteredUsers);
    };


    const logout = () => {
        axios.get('http://localhost:4014/logout/')
            .then(() => {
                dispatch(setUSerData(null))
                navigate('/login')
            })
    }

    return (
        <>
            <div className="w-full h-20 border border-black bg-blue-300 flex justify-end items-center pr-3 gap-5">
                <Stack spacing={2} sx={{ width: 300 }}>
                    <TextField
                        onChange={handleSearch}

                        label="Search User"
                        InputProps={{
                            type: 'search',
                        }}
                    />
                </Stack>
                <button onClick={()=>setAddOpen(true)} className='h-14 w-28  rounded  bg-gray-600 text-white'>ADD USER</button>
                <button onClick={logout} className='h-14 w-28  rounded  bg-red-600 text-white'>Logout</button>
            </div>
        </>
    );
};
