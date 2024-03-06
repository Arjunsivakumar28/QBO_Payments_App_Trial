import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import axios from 'axios';

let requestId = self.crypto.randomUUID()
let refreshToken = ""
const path = "code.txt"

const bearerUrl = "https://cors-anywhere.herokuapp.com/"+"https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer" 
const baseCode = "QUJoaUFlbHdXSjhWQXRYZHZhOGJMMnF2V0J3bkt0ZldtUE9Gb0dhOUtwbXFYNDNOcTk6RnpEUDlSc2k5RDMzZnBZQU5OUEE0ODJCbWZCcXRzRkZMVzRjYW51OA=="
const bearerHeaders = {
  "Accept": "application/json",
  "Authorization": "Basic " + baseCode, 
  "content-type": "application/x-www-form-urlencoded",
}

  fetch(path)
    .then(res => {
      refreshToken = "AB11709841877keK74c1MyCwcd7Y2pWP403tMH16rxZCkzaMmt"
      const bearerBody = {
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
      }
      console.log(bearerUrl)
      console.log(bearerBody)
      console.log(bearerHeaders)
      axios.post(bearerUrl, bearerBody, { bearerHeaders })
        .then(res => console.log("the response : ", res.data))
        .catch(e => console.log("error : ", e.message) )
    })
    .catch(e => console.log("the refresh token get from file error: ", e.message))


const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  
  return (
    <>
      <div className="p-4 box mt-3 text-center">
        Welcome <br />
        {user && user.email}
      </div>
      <div className="d-grid gap-2">

          <Button variant="primary" onClick={handleLogout}>
            Log out
          </Button>

      </div>
    </>
  );
};

export default Home;
