import axios from "axios";
import jwtDecode from "jwt-decode";
import SetAuthToken from "../auth-token";
import  { USER } from "./types";

let API = "";
if(process.env.NODE_ENV != "production")
  API = "http://localhost:8000";



export function SetCurrentUser(data){ 
  // saving user's data in the store
  return { 
    type: USER,
    payload: data
  }
}

export function Logout(){
  return dispatch => {
    // removing token to request headers
    SetAuthToken();
    dispatch(SetCurrentUser({}));
  }
}

export function LoginRequest(data){ 
  return dispatch => { 
    return axios.post(API + "/api/v1/signin", data)
      .then(data => {
        // console.log(data);
        SetAuthToken(data.data.payload);
        dispatch(
          SetCurrentUser(jwtDecode(localStorage.getItem("token")))
        );
        return data;
      })
  }
}

export function RegRequest(data){ 
  return dispatch => { 
    return axios.post(API + "/api/v1/signup", data)
      .then(data => {
        // console.log(data);
        SetAuthToken(data.data.payload);
        dispatch(
          SetCurrentUser(jwtDecode(localStorage.getItem("token")))
        );
        return data;
      })
  }
}

export function ApplyRequest(data){ 
  return dispatch => { 
    return axios.post(API + "/api/v1/apply", data)
  }
}

export function FetchApplicationsRequest(data){ 
  return dispatch => { 
    return axios.get(API + "/api/v1/admin/get-applicants-list", data)
  }
}

