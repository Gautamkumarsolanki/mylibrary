import * as React from 'react';
import { Container, Box, TextField, CssBaseline, Button, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup'
import axios from 'axios';
import { Link, Navigate, redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './features/user/userSlice';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const defaultTheme = createTheme();
const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    phone: yup
        .string('Enter Phone Number')
        .min(10, 'Phone Number must have 10 digits')
        .matches(phoneRegExp, 'Phone number is not valid')
        .required("Phone Number is required")
        .max(10),
    address: yup
        .string('Enter your address')
        .required("Address is required"),
    college: yup
        .string('Enter your College name')
        .required("College name is required"),
    name: yup
        .string('Enter your name')
});


export default function Register() {
    const dispatch=useDispatch();
    const user = useSelector((state) => state.user.user)

    const formik = useFormik({
        initialValues: { email: "", password: "", phone: "", address: "", name: "", college: "" },
        validationSchema,
        onSubmit: async (value) => {
            const res=await axios.post('http://localhost:8000/api/user/register',{
                email:value.email,password:value.password,address:value.address,college:value.college,name:value.name,phone:value.phone
            })
            console.log(res);
            if(res.status===201){
                localStorage.setItem('access_token',res.data.token["access_token"])
                localStorage.setItem('refresh_token',res.data.token["refresh_token"])
                dispatch(loginUser(res.data.user))
                redirect("/")
            }
        }
    })
    if(user){
        return <Navigate to='/'/>
    }
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 2,
                        marginBottom: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            autoComplete="name"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            id="password"
                            autoComplete="current-password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="phone"
                            label="Phone No."
                            type="text"
                            value={formik.values.phone}
                            id="phone"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="college"
                            label="College"
                            type="text"
                            value={formik.values.college}
                            id="college"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.college && Boolean(formik.errors.college)}
                            helperText={formik.touched.college && formik.errors.college}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="address"
                            label="Address"
                            type="text"
                            value={formik.values.address}
                            id="address"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to={'/login'}>
                                    {"Already have an account? Login"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}