import React from 'react'
import { useRouteError } from 'react-router-dom'

const Error = () => {

    const error = useRouteError()
    console.error(error.message)

  return (
    <div id="error-page" className="p-5 box mt-5">
        <h1 className="text-center" >Oh no!</h1>
        <p className="text-center" >Sorry for the unexpected error</p>
        <p className="text-center" >
            <i>{error.statusText || error.message}</i>
        </p>
    </div>
  )
}

export default Error