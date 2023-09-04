import { CircularProgress } from '@mui/material'
import React from 'react'

export default function Loading() {
  return (
    <div style={{display:'flex',justifyContent:'center',marginTop:"50vh"}}>
      <CircularProgress />
    </div>
  )
}
