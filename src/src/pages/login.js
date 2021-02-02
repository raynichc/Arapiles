import React from "react";

import { navigate } from "gatsby"

import PrimaryLayout from "../layouts/primaryLayout";
import Login from "../components/Login";

import { authenticationService } from "../services/authentication.js"
//Simple Login page
const LOGIN = () => {
    if (authenticationService.isLoggedIn()) {
        navigate("/profile");   
    }

    return ( 
        <PrimaryLayout>
            <Login />
        </PrimaryLayout>
    );
};

export default LOGIN;
