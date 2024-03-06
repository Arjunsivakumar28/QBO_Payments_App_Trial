console.log("in main.jsx succesfully!!!!!")

import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserAuthContextProvider } from './context/UserAuthContext.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Root from './components/root.jsx'
import Error from './Error.jsx';
import CustomerLogin from './components/CustomerLogin.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './components/Home.jsx';
import Signup from './components/Signup.jsx';
import ResetPassword from './components/ResetPassword.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/customerLogin",
        element: <CustomerLogin />,
      },
      {
        path: "/adminLogin",
        element: <AdminLogin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/reset",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/home",
    element: <ProtectedRoute> <Home /> </ProtectedRoute>
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
)
