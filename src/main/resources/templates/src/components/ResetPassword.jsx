import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"
import {Form, Button, Alert} from "react-bootstrap"
import {getAuth, sendPasswordResetEmail} from "firebase/auth"

const ResetPassword = () => {

    let navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const auth = getAuth()

    const handleSubmit = (e) => {
        e.preventDefault()
        try {
            sendPasswordResetEmail(auth, email)
            navigate("/")
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className="p-4 box" >
        <h1>Reset Password</h1>
        {error && <Alert variant="danger">error</Alert>}
        <Form onSubmit={handleSubmit} >
            <Form.Group className="mb-3" controlId="resetEmail">
                <Form.Control 
                    type="email"
                    placeholder="Enter Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>
            <div className="d-flex justify-content-center">
                <Button variant="secondary" type="submit">Send Reset Email</Button>
            </div>
        </Form>
    </div>
  )
}

export default ResetPassword