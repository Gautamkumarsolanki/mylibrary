import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
export default function Protector() {
  const user = useSelector((state) => state.user.user)
  if (!user) {
    return <Navigate to='/login' />
  } else {
    return (
      <Outlet />
    )
  }
}
