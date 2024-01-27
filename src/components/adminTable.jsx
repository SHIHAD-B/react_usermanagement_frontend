
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { AdminNav } from './adminNav';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import { isEmpty, isPasswordValid, isEmailValid } from '../../helper/validation';
import { TextField, FormHelperText } from "@mui/material"
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
const DataTable = () => {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editerr, setEditerr] = useState(false)
  const [editerrdef, setEditerrdef] = useState("")
  const [open, setOpen] = useState(false);
  const [addopen, setAddOpen] = useState(false)
  const [editname, setEditname] = useState({
    name: "",
    id: "",
    value: ""
  })
  const [error, setError] = useState({
    emailred: false,
    namered: false,
    passwordred: false,
    confirmpasswordred: false,
  })
  const [errordef, seterrordef] = useState({
    emailerr: "",
    nameerr: "",
    passworderr: "",

  })
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    Password: "",

  })
  const [deluser, setDelUser] = useState("")
  const [delopen, setDelopen] = useState(false)
  const [delid, setDelid] = useState(null)

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

  const editvalue = (event) => {
    setEditname((previous) => ({
      ...previous,
      value: event.target.value
    }))
  }

  //edit modal

  const handleOpen = (id) => {
    const userToEdit = user.find((item) => item.id == id);
    setEditname({
      ...editname,
      name: userToEdit.name,
      id: userToEdit._id
    })
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    setAddOpen(false)
  }



  //add modal funcitons


  useEffect(() => {
    axios.get('http://localhost:4014/admin/fetchusertoadmin')
      .then((response) => {
        const fetchedUsers = response.data.data;
        const usersWithId = fetchedUsers.map((user, index) => ({
          ...user,
          id: index + 1,
        }));

        setUser(usersWithId);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);


  //edit user
  const handleEdit = () => {
    let valid = true;

    if (isEmpty(editname.value)) {
      valid = false
      setEditerr(true)
      setEditerrdef("field can't be empty")
    }

    if (valid) {
      setEditerr(false)
      setEditerrdef("")

      axios.post('http://localhost:4014/admin/edituser', editname)
        .then(() => {
          setOpen(false)
          axios.get('http://localhost:4014/admin/fetchusertoadmin')
            .then((response) => {
              const fetchedUsers = response.data.data;
              const usersWithId = fetchedUsers.map((user, index) => ({
                ...user,
                id: index + 1,
              }));

              setUser(usersWithId);
              setIsLoading(false);
              setEditname({
                name: "",
                id: "",
                value: ""
              })
            })
            .catch((err) => {
              console.error("Error fetching users after deletion:", err);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };



  //delete user
  const handleDelete = async (id) => {
    const userToDelete = user.find((item) => item.id == id);
    setDelUser(userToDelete.name)
    setDelopen(true)
    setDelid(id)

  };

  const deletecred = (id) => {

    const userToDelete = user.find((item) => item.id == id);
    axios.delete('http://localhost:4014/admin/deleteuser', { data: { id: userToDelete._id } })
      .then(() => {
        axios.get('http://localhost:4014/admin/fetchusertoadmin')
          .then((response) => {
            const fetchedUsers = response.data.data;
            const usersWithId = fetchedUsers.map((user, index) => ({
              ...user,
              id: index + 1,
            }));

            setUser(usersWithId);
            setIsLoading(false);
            setDelUser("")
            setDelopen(false)
            setDelid(null)
          })
          .catch((err) => {
            console.error("Error fetching users after deletion:", err);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });

  }




  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'profile',
      headerName: 'Profile',
      width: 100,
      renderCell: (params) => (
        <img src={params.row.profile} alt={`Profile of ${params.row.name}`} className="h-10 w-10 rounded-full" />
      ),
    },
    { field: 'name', headerName: 'Name', width: 230 },
    { field: 'email', headerName: 'Email', width: 230 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div className='flex gap-4'>
          <button className='h-10 w-12 border border-black' onClick={() => handleOpen(params.row.id)}>Edit</button>
          <button className='h-10 w-16 border border-black' onClick={() => handleDelete(params.row.id)}>Delete</button>
        </div>
      ),
    },

  ];

  if (isLoading) {
    return <p className='text-white text-3xl font-bold'>Loading...</p>;
  }



  //adduser 



  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value
    });
  }



  const handleSubmission = () => {
    let errors = {
      emailred: false,
      namered: false,
      passwordred: false,
      confirmpasswordred: false,
    };

    let errorMessages = {
      emailerr: "",
      nameerr: "",
      passworderr: "",
      confirmpassworderr: ""
    };

    // Validate email
    if (isEmpty(userData.email)) {
      errors.emailred = true;
      errorMessages.emailerr = "Email can't be empty";
    } else if (isEmailValid(userData.email)) {
      errors.emailred = true;
      errorMessages.emailerr = "Enter a valid email";
    }

    // Validate name
    if (isEmpty(userData.name)) {
      errors.namered = true;
      errorMessages.nameerr = "Name can't be empty";
    }

    // Validate password
    if (isEmpty(userData.Password)) {
      errors.passwordred = true;
      errorMessages.passworderr = "Password can't be empty";
    } else if (isPasswordValid(userData.Password)) {
      errors.passwordred = true;
      errorMessages.passworderr = "Password is too weak";
    }



    setError(errors);
    seterrordef(errorMessages);


    if (!errors.emailred && !errors.namered && !errors.passwordred) {
      async function register() {
        try {

          await axios.post('http://localhost:4014/admin/adduser/', userData)
            .then((response) => {
              if (response.data.success) {
                setAddOpen(false)
                axios.get('http://localhost:4014/admin/fetchusertoadmin')
                  .then((response) => {
                    const fetchedUsers = response.data.data;
                    const usersWithId = fetchedUsers.map((user, index) => ({
                      ...user,
                      id: index + 1,
                    }));

                    setUser(usersWithId);
                    setIsLoading(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                  });

              } else if (response.data.error) {
                setError((previous) => ({
                  ...previous,
                  emailred: true
                }))
                seterrordef((previous) => ({
                  ...previous,
                  emailerr: response.data.error
                }))
              }
            })

        } catch (error) {
          console.log(error);
        }
      }
      register()
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <>
      <div className='w-screen h-screen flex flex-col items-center gap-6'>
        <AdminNav users={user} setUser={setUser} setAddOpen={setAddOpen} />
        <div style={{ height: 600, width: '55%' }} className='text-white bg-blue-50'>
          <DataGrid
            rows={user}
            columns={columns}
            pageSize={5}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </div>


      {/* edit modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='h-[150px] flex flex-col items-center gap-4'>
            <span className='text-xl font-bold'>Edit user</span>
            <TextField
              onChange={editvalue}
              name="email"
              className="w-[80%]"
              id="outlined-basic"
              InputLabelProps={{ style: { color: 'black' } }}
              error={editerr}
              defaultValue={editname.name}
              label="Name"
              variant="outlined"
              helperText={editerrdef}
            />
            <div className='w-full h-36  flex justify-end pr-3 gap-3' >
              <button onClick={() => { setOpen(false); setEditerr(false); setEditerrdef("") }} className='h-full w-16 border border-black hover:bg-red-500 hover:text-white'>cancel</button>
              <button onClick={handleEdit} className='h-full w-16 border border-black hover:bg-green-400 hover:text-white'>save</button>
            </div>
          </div>
        </Box>
      </Modal>



      {/* add user modal */}
      <Modal
        open={addopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='h-[350px] flex flex-col items-center gap-4'>
            <span className='text-xl font-bold'>Add user</span>
            <TextField
              onChange={handleChange}
              name="name"
              className="w-[80%] "
              id="outlined-basic"
              InputLabelProps={{ style: { color: 'black' } }}
              inputProps={{ style: { color: 'black' } }}
              error={error.namered}
              label="Name"
              variant="outlined"
              helperText={errordef.nameerr}
            />
            <TextField
              onChange={handleChange}
              name="email"
              className="w-[80%]"
              id="outlined-basic"
              inputProps={{ style: { color: 'black' } }}
              InputLabelProps={{ style: { color: 'black' } }}

              error={error.emailred}
              label="Email"
              variant="outlined"
              helperText={errordef.emailerr}
            />

            <FormControl sx={{ mt: 2, width: '80%' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password" sx={{ color: 'black' }}>
                Password
              </InputLabel>
              <OutlinedInput

                onChange={handleChange}
                name="Password"
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                error={error.passwordred}
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

                sx={{ color: 'black', borderColor: '#ff5733' }}
              />
              <FormHelperText sx={{ color: 'red' }}>{errordef.passworderr}</FormHelperText>
            </FormControl>

            <div className='w-full h-8  flex justify-end pr-3 gap-3' >
              <button onClick={() => {
                setAddOpen(false); setError({
                  emailred: false,
                  namered: false,
                  passwordred: false,
                  confirmpasswordred: false,
                }); errordef({
                  emailerr: "",
                  nameerr: "",
                  passworderr: "",

                })
              }} className='h-full w-16 border border-black hover:bg-red-500 hover:text-white'>cancel</button>
              <button onClick={handleSubmission} className='h-full w-16 border border-black hover:bg-green-400 hover:text-white'>Add</button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* delete modal */}
      <Modal
        open={delopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='h-[150px] flex flex-col items-center gap-4'>
            <span className='text-xl font-bold'>Delete User</span>
            Are you sure to delete {deluser}
            <div className='w-full h-8  flex justify-end pr-3 gap-3' >
              <button onClick={() => { setDelopen(false); setDelUser(""); setDelid(null) }} className='h-full w-16 border border-black hover:bg-red-500 hover:text-white'>cancel</button>
              <button onClick={() => { setDelopen(false); deletecred(delid) }} className='h-full w-16 border border-black hover:bg-gray-500 hover:text-white'>delete</button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default DataTable;
