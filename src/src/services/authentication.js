//Based on: https://github.com/cornflourblue/react-jwt-authentication-example/blob/master/src/_services/authentication.service.js
import axios from 'axios';

//Current user, retrieved from local storage.
let currentUser = null;
try {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
} catch (e) {
}

function setCurrentUser(user) {
    //Update local storage with new current user data
    if (user !== null) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }

    //Set current user to new user data
    currentUser = user;
}

//Function to make and process login request
async function login(identifier, password) {
    const success = await axios.post(process.env.GATSBY_CMS_HOST + '/auth/local/', {
        identifier: identifier,
        password: password,
    }).then(response => {
        //Extract and set current user data from response
        setCurrentUser(response.data);

        return true;
    }).catch(error => {
        //TODO: Handle and return error response
        return false;
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
async function register(username, email, password) {
    const success = await axios.post(process.env.GATSBY_CMS_HOST + '/auth/local/register', {
        username: username,
        email: email,
        password: password
    }).then(response => {
        //Extract and set current user data from response
        setCurrentUser(response.data);

        return true;
    }).catch(error => {
        //TOOD: Error proccesing
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
    currentUser
};