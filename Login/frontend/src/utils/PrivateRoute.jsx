import { ACCESS_TOKEN_NAME } from "../constants/apiConstants";
import {Navigate} from "react-router-dom";

export default function PrivateRoute({children}){
    return localStorage.getItem(ACCESS_TOKEN_NAME) ? children : <Navigate to="/login"></Navigate>
}