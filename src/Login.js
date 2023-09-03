import * as React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Container, Typography, Box, TextField, CssBaseline, Button, Avatar, Grid} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup'
import axios from 'axios';
import { Link, Navigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './features/user/userSlice';

const defaultTheme = createTheme();
const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .required('Password is required'),
});


export default function SignIn() {
  const user = useSelector((state) => state.user.user)
    const dispatch=useDispatch();
    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema,
        onSubmit:async (value) => {
            const res=await axios.post('http://localhost:8000/api/user/login',{
                email:value.email,password:value.password
            })
            console.log(res);
            if(res.status===200){
                localStorage.setItem('access_token',res.data.token["access"])
                localStorage.setItem('refresh_token',res.data.token["refresh"])
                dispatch(loginUser(res.data.user));
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
                        marginTop: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
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
                                <Link to={'/register'}>
                                    {"Don't have an account? Register"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}