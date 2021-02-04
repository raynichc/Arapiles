import axios from "axios";

import { authenticationService } from "../services/authentication.js"

const sexes = [
    {label: "Male", value: "Male"},
    {label: "Female", value: "Female"},
    {label: "Not Stated", value: "Not_Stated"}
]; 

const phoneTypes = [
    {label: "Mobile", value: "Mobile"},
    {label: "Home", value: "Home"},
    {label: "Work", value: "Work"}
];

const studentStatuses = [
    {label: "Not UQ", value: "Not_UQ"},
    {label: "Domestic", value: "Domestic"},
    {label: "International", value: "International"},
    {label: "Exchange", value: "Exchange"},
    {label: "Staff", value: "Staff"}
];

//TODO: Improve response and error handling
async function me() {
    const response = await axios.get(process.env.GATSBY_CMS_HOST + "/users/me", {
        headers: authenticationService.getAuthHeader()
    }).then(response => {
        return response;
    }).catch(error => {
        return false;
    })

    return response;
}

async function find(id) {
    const response = await axios.get(process.env.GATSBY_CMS_HOST + `/users/${id}`, {
        headers: authenticationService.getAuthHeader()
    }).then(response => {
        return response;
    }).catch(error => {
        return false;
    });

    return response;
}

async function update(id, data) {
    console.log('update');
    const response = await axios.put(process.env.GATSBY_CMS_HOST + `/users/${id}`, data, {
        headers: authenticationService.getAuthHeader()
    }).then(response => {
        return true;
    }).catch(error => {
        return false;
    })

    return response;
}

async function updateMe(data) {
    console.log('updateMe');
    const response = await axios.put(process.env.GATSBY_CMS_HOST + "/grampians/users/me", data, {
        headers: authenticationService.getAuthHeader()
    }).then(response => {
        return true;
    }).catch(error => {
        return false;
    })

    return response;
}

export const userService = {
    me,
    find,
    update,
    updateMe,
    sexes,
    phoneTypes,
    studentStatuses
};