import axios from "axios";

import { authenticationService } from "../services/authentication.js"

async function me() {
    const response = await axios.get(process.env.GATSBY_CMS_HOST + '/users/me', {
        headers: authenticationService.getAuthHeader()
    }).then(response => {
        return response;
    }).catch(error => {
        return false;
    })

    return response;
}

async function update(id, data) {
    const response = await axios.put(process.env.GATSBY_CMS_HOST + `/users/${id}`, data, {
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
    update
};