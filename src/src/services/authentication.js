//Based on: https://github.com/cornflourblue/react-jwt-authentication-example/blob/master/src/_services/authentication.service.js
import axios from "axios";

//Current user, retrieved from local storage.
let currentUser = null;
try {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
} catch (e) {
}

function setCurrentUser(user) {
    //Update local storage with new current user data
    if (user !== null) {
        localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
        localStorage.removeItem("currentUser");
    }

    //Set current user to new user data
    currentUser = user;
}

function getAuthHeader() {
    return currentUser?.jwt
    ? { Authorization: `Bearer ${currentUser.jwt}`}
    : {};
}

//TODO: Better response and error processing

//Function to make and process login request
async function login(identifier, password) {
    const success = await axios.post(process.env.GATSBY_CMS_HOST + "/auth/local/", {
        identifier: identifier,
        password: password,
    }).then(response => {
        //Extract and set current user data from response
        setCurrentUser(response.data);

        return true;
    }).catch(error => {
        if (error.response) { 
            //Return error message
            return error.response.data.message[0].messages[0].message;
        } else {
            return false;
        }
    });

    //Return success status
    return success;
}

//Function to logout
function logout() {
    setCurrentUser(null);
}

//Function to chek if user is logged in
function isLoggedIn() {
    return currentUser != null;
}

//Function to register a user
async function register(data) {
    const success = await axios.post(process.env.GATSBY_CMS_HOST + "/auth/local/register", data)
    .then(response => {
        //Extract and set current user data from response
        return true;
    }).catch(error => {
        if (error.response) { 
            //Return error message
            return error.response.data.message[0].messages[0].message;
        } else {
            return false;
        }
    });


    return success;
}

//Function to send password reset email
async function forgotPassword(email) {
    const success = await axios.post(process.env.GATSBY_CMS_HOST + "/auth/forgot-password", {
        email: email
    }).then(response => {
        console.log(response);
        return true;
    }).catch(error => {
        console.log(error);
        return false;
    });

    return success;
}

//Function to reset password from forgot password email.
async function resetPassword(privateCode, password, passwordConfirmation) {
    const success = await axios.post(process.env.GATSBY_CMS_HOST + "/auth/reset-password", {
        code: privateCode,
        password: password,
        passwordConfirmation: passwordConfirmation
    }).then(response => {
        return true;
    }).catch(error => {
        return false;
    });

    return success;
}

//Export services
export const authenticationService = {
    login,
    logout,
    isLoggedIn,
    register,
    forgotPassword,
    resetPassword,
    currentUser,
    getAuthHeader
};