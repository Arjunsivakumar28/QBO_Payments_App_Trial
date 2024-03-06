import React, {useSate} from 'react'
import {useNavigate, Outlet, Link } from 'react-router-dom'
import {Button} from "react-bootstrap"

const Root = () => {
  return (
    <div className="p-4 box" >
        <h1 className="text-center" >Welcome to CSE Payments!</h1>
        <div className="d-flex justify-content-center ">
            <Link to="/customerLogin"> <Button className="me-3" variant="primary">Customer</Button> </Link>   
            <Link to="/adminLogin"> <Button variant="primary">Admin</Button> </Link> 
        </div>
        <div className="d-flex justify-content-center">
            <Outlet />
        </div>     
    </div>
  )
}

export default Root