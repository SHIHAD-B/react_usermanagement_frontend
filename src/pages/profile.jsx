
import { FiUpload } from "react-icons/fi";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setUSerData } from "../../redux/store";
import axios from "axios";
import { Modal, Box } from '@mui/material';
import 'react-image-crop/dist/ReactCrop.css'
import { isEmpty, isPasswordValid } from "../../helper/validation";
import ReactCrop from 'react-image-crop';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { Navbar } from "../components/navbar";

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

export const Profile = () => {
    const [snackopen, setsnackopen] = useState(false);

    //errors state
    const [errorst, setErrorst] = useState({
        name: false,
        currentpassword: false,
        newpassword: false
    })

    const [errdef, setErrDef] = useState({
        name: "",
        currentpassword: "",
        newpassword: ""
    })


    const dispatch = useDispatch()
    const [crop, setCrop] = useState(undefined)
    const [croppedImage, setCroppedImage] = useState(null);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);


    const userdatas = useSelector((state) => state.userData)
    const [selectedImage, setSelectedImage] = useState(null);
    const [userdata, setUserdata] = useState({
        ...userdatas,
        currentpassword: "",
        newpassword: ""
    })
    const [viewonly, setViewonly] = useState(true)
    const [edit, setEdit] = useState(false)
    useEffect(() => {
        axios.get('http://localhost:4014/fetchuserdata/').then((response) => {
            dispatch(setUSerData(response.data))
        })
    }, [])

    const Cancel = () => {

        setEdit(false)
        setViewonly(true)
        setUserdata(userdatas)
        setCroppedImage(null)
        setErrorst({
            name: false,
            currentpassword: false,
            newpassword: false
        })
        setErrDef({
            name: "",
            currentpassword: "",
            newpassword: ""
        })

    }
    const handleChange = (event) => {
        setUserdata((previous) => ({
            ...previous,
            [event.target.name]: event.target.value
        }));

    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            setSelectedImage(e.target.result);
            setOpen(true);
        };
        reader.readAsDataURL(file);
        handleCropSave();
    };



    const handleCropSave = () => {
        console.log("handleCropSave triggered");
        if (crop && selectedImage) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.src = selectedImage;
            image.onload = () => {
                canvas.width = crop.width;
                canvas.height = crop.height;

                ctx.drawImage(
                    image,
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height,
                    0,
                    0,
                    crop.width,
                    crop.height
                );

                const croppedImageData = canvas.toDataURL();
                setCroppedImage(croppedImageData);
                setUserdata((prevUserData) => ({
                    ...prevUserData,
                    profile: croppedImageData,
                }));

                setOpen(false);

            };
        }
    };

    const handleSave = async () => {
        try {

            const error = {
                name: false,
                currentpassword: false,
                newpassword: false
            }

            const errordef = {
                name: "",
                currentpassword: "",
                newpassword: ""
            }

            let valid = true;
            if (isEmpty(userdata.name)) {
                valid = false
                error.name = true
                errordef.name = "name can't be empty"

            }

            if (userdata.currentpassword.length || userdata.newpassword.length) {
                if (isEmpty(userdata.newpassword)) {
                    valid = false
                    error.newpassword = true
                    errordef.newpassword = "new password can't be empty"

                } else if (isPasswordValid(userdata.newpassword)) {
                    valid = false
                    error.newpassword = true
                    errordef.newpassword = "password is too weak"

                }
                if (isEmpty(userdata.currentpassword)) {
                    valid = false
                    error.currentpassword = true
                    errordef.currentpassword = "current password can't be empty"
                }
            }
            setErrorst(error)
            setErrDef(errordef)

            if (valid) {


                if (croppedImage) {
                    const formData = new FormData();

                    const fileBlob = await fetch(croppedImage).then((res) => res.blob());
                    formData.append('profile', fileBlob, 'profile.jpg');


                    const response = await axios.post('http://localhost:4014/uploadprofileimage/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });


                    console.log('Response from server:', response.data);
                    setCroppedImage(null)
                }

                axios.post('http://localhost:4014/editprofile/', userdata).then((response) => {
                    if (response.data.error) {

                        setErrDef((previous) => ({
                            ...previous,
                            currentpassword: response.error
                        }))
                    } else if (response.data.success) {
                        setsnackopen(true)
                        setTimeout(() => {
                            setsnackopen(false)

                        }, 3000);

                    }
                })


                setEdit(false);
                setViewonly(true);

                axios.get('http://localhost:4014/fetchuserdata/').then((response) => {
                    dispatch(setUSerData(response.data))
                })
            }
        } catch (error) {
            // Handle error
            console.error('Error saving user data:', error);
        }

    };




    return (
        <>
            <Snackbar
                open={snackopen}
                onClose={handleClose}
                TransitionComponent={SlideTransition}
                message="profile updated"
                autoHideDuration={1200}
            />

            <div className="w-screen h-screen bg-blue-900 flex flex-col justify-center  items-center">
                <Navbar />
                <div className="h-[90%] w-full flex justify-center items-center">
                    <div className="  w-[80%] md:w-[30%] h-auto bg-white gap-4 rounded flex flex-col items-center">
                        <h1 className="text-2xl ">profile</h1>
                        <div className="h-[40%] w-full  flex flex-col justify-center gap-2 items-center">
                            <img className="h-[150px] w-[25%] border border-black  rounded object-cover" src={userdata.profile} alt="" />
                            {edit &&
                                <label className="h-[13%] w-[25%] rounded border border-black flex justify-center items-center hover:bg-gray-400 hover:text-white cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                    />
                                    <FiUpload />
                                </label>
                            }
                        </div>
                        <TextField
                            error={errorst.name}
                            onChange={handleChange}
                            name="name"
                            className="w-[70%]"
                            id="outlined-read-only-input"
                            label="Name"
                            value={userdata.name}
                            defaultValue={userdata.name}
                            InputProps={{
                                readOnly: viewonly,
                            }}
                            helperText={errdef.name}
                        />
                        <TextField
                            className="w-[70%]"
                            id="outlined-read-only-input"
                            label="Email"
                            defaultValue={userdata.email}
                            InputProps={{
                                readOnly: true,
                            }}

                        />



                        {edit && (
                            <>
                                <TextField
                                    error={errorst.currentpassword}
                                    onChange={handleChange}
                                    type="password"
                                    name="currentpassword"
                                    value={userdata.currentpassword}
                                    className="w-[70%]"
                                    id="current-password-input"
                                    label="Current Password"
                                    InputProps={{
                                        readOnly: viewonly,
                                    }}
                                    helperText={errdef.currentpassword}
                                />
                                <TextField
                                    error={errorst.newpassword}
                                    onChange={handleChange}
                                    type="password"
                                    value={userdata.newpassword}
                                    name="newpassword"
                                    className="w-[70%]"
                                    id="new-password-input"
                                    label="New Password"
                                    InputProps={{
                                        readOnly: viewonly,
                                    }}
                                    helperText={errdef.newpassword}
                                />
                            </>
                        )}



                        {!edit &&
                            <div className="h-[10%] w-full flex justify-end items-center pr-3 mb-2">
                                <button onClick={() => { setEdit(true); setViewonly(false); }} className="h-[30px] border border-black w-20 rounded hover:bg-slate-500 hover:text-white">Edit</button>
                            </div>
                        }
                        {edit &&
                            <div className="h-[10%] w-full flex justify-end items-center pr-3 gap-5 mb-2">
                                <button onClick={Cancel} className="h-[30px] border border-black w-20 rounded hover:bg-red-500 hover:text-white">Cancel</button>
                                <button onClick={handleSave} className="h-[30px] border border-black w-20 rounded hover:bg-green-500 hover:text-white">Save</button>
                            </div>

                        }

                    </div>
                </div>


                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                            <img className="h-auto w-auto" src={selectedImage} alt="" />
                        </ReactCrop>
                        <div className="h-14 w-full  flex justify-end gap-2 pr-2 items-center">
                            <button onClick={() => setOpen(false)} className="h-8 w-24 border border-black rounded hover:bg-red-500 hover:text-white">Cancel</button>
                            <button onClick={handleCropSave} className="h-8 w-14 border border-black rounded hover:bg-green-500 hover:text-white">Save</button>
                        </div>
                    </Box>
                </Modal>
            </div>





        </>
    )
}