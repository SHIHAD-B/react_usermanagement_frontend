
import { TextField, FormHelperText } from "@mui/material"
import { useState } from "react"
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isEmpty, isEmailValid } from "../../helper/validation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUSerData } from "../../redux/store";
import { useDispatch } from "react-redux";

export const Login = () => {
    const dispatch=useDispatch()
    const navigate = useNavigate()

    const [error, setError] = useState({
        emailerr: false,
        passworderr: false
    })
    const [errdefin, seterrdefin] = useState({
        email: "",
        password: ""
    })
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async() => {

        const errors = {
            emailerr: false,
            passworderr: false
        }

        const errmessage = {
            email: "",
            password: ""
        };

        let valid = true;

        if (isEmailValid(userData.email)) {
            errmessage.email = "enter a valid email"
            errors.emailerr = true
            valid = false
        }
        if (isEmpty(userData.email)) {
            errmessage.email = "email can't be empty"
            errors.emailerr = true
            valid = false
        }
        if (isEmpty(userData.password)) {
            errmessage.password = "password can't be empty"
            errors.passworderr = true
            valid = false
        }
        setError(errors)
        seterrdefin(errmessage)

        if (valid) {
            try {
                const response = await axios.post('http://localhost:4014/login', userData);
        
                if (response.data.success) {
                    const userDataResponse = await axios.get('http://localhost:4014/fetchuserdata/');
                    dispatch(setUSerData(userDataResponse.data));
                    navigate('/home');
                } else if (response.data.emailerr) {
                    setError((previous) => ({
                        ...previous,
                        emailerr: true
                    }));
                    seterrdefin((previous) => ({
                        ...previous,
                        email: response.data.emailerr
                    }));
                } else if (response.data.passworderr) {
                    setError((previous) => ({
                        ...previous,
                        passworderr: true
                    }));
                    seterrdefin((previous) => ({
                        ...previous,
                        password: response.data.passworderr
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        }
        

    }


    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value
        });
    }

    return (
        <>
            <div className="h-screen w-screen bg-blue-950 flex justify-center items-center">
                <div className="w-[70%] md:w-[28%] h-[60%] border border-gray-500 rounded flex flex-col items-center gap-8 pt-4">
                    <span className="text-white text-3xl font-bold">Login</span>
                    <TextField
                        onChange={handleChange}
                        name="email"
                        className="w-[80%]"
                        id="outlined-basic"
                        InputLabelProps={{ style: { color: 'white' } }}
                        inputProps={{ style: { color: 'white' } }}
                        error={error.emailerr}
                        label="Email"
                        variant="outlined"
                        helperText={errdefin.email}
                    />

                    <FormControl sx={{ mt: 2, width: '80%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password" sx={{ color: 'white' }}>
                            Password
                        </InputLabel>
                        <OutlinedInput
                            onChange={handleChange}
                            name="password"
                            error={error.passworderr}
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            sx={{ color: 'white', borderColor: '#ff5733' }}
                        />
                        <FormHelperText sx={{ color: 'red' }}>{errdefin.password}</FormHelperText>
                    </FormControl>
                    <button onClick={handleLogin} className=" w-[80%] h-[10%] rounded bg-blue-900 text-white">Login</button>
                    <span onClick={() => navigate('/signup')} className="text-white text-sm w-full flex justify-end pr-12 cursor-pointer">new user? signup</span>
                </div>
            </div>
        </>
    )

}