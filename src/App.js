import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import SignIn from "./Login";
import Register from "./Register";
import Protector from "./Protector";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./features/user/userSlice";

function App() {
  const [loading, setLoading] = useState(true);
  const user=useSelector((state)=>state.user.user)
  const dispatch = useDispatch()
  const getData = async () => {
    if (localStorage.getItem('access_token')) {
      const res = await axios.post('http://localhost:8000/api/token/verify/', {
        "token": localStorage.getItem('access_token')
      })
      if (res.status === 200) {
        dispatch(loginUser({}))
      } else if (localStorage.getItem('refresh_token')) {
        const res = await axios.post('http://localhost:8000/api/token/refresh/', {
          "refresh": localStorage.getItem('refresh_token')
        })
        if (res.status === 200) {
          localStorage.setItem('access_token', res.data.access)
          dispatch(loginUser({}))
        }
      } else {
        return;
      }
    }
  }
  useEffect(() => {
    if(user){
      setLoading(false);
    }else{
      getData();
      setLoading(false);

    }
    
  }, [user])
  if (loading) {
    return <Loading />;
  }
  return (
    <Routes>
      <Route path="login" element={<SignIn />} />
      <Route path="register" element={<Register />} />
      <Route element={<Protector />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
