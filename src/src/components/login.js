import React from "react"

import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button, LinearProgress } from '@material-ui/core';

import { Redirect } from "@reach/router";
import { Link } from "gatsby";

//Authentication services for logging in
import { authenticationService } from "../services/authentication.js"

//Basic Login componnent
//For now just used for testing purposes.
//Based off of: https://www.gatsbyjs.com/tutorial/authentication-tutorial/
class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            success: false
        }
    }

    validationSchema = Yup.object().shape({
        identifier: Yup.string()
            .required("Required"),

        password: Yup.string()
            .required("Required")
    }); 

    //Function to handle login form submission
    handleSubmit = async (data, actions) => {
        //Attempt to log in with identifier and password provided
        const response = await authenticationService.login(data.identifier, data.password);

        //Check if login was successful
        if (response === true) {
            this.setState({ success: true });
        } else {
            if (response === false) {
                actions.setFieldError('general', "An error occured");
            } else {
                actions.setFieldError('general', response);
            }
        }

        actions.setSubmitting(false);
    }

    //Basic Component Renderer
    render() {
        if (this.state.success) {
            return (
                <Redirect noThrow to="/profile" />
            )
        } else {
            return (
                <Formik
                    initialValues = {{}}
                    validationSchema={this.validationSchema}
                    onSubmit={this.handleSubmit}
                >
                {(formProps) => (
                    <Form>
                        <label htmlFor="identifier">Username/Email</label>
                        <Field name="identifier" />
                        <ErrorMessage name="identifier" />
                        <br />

                        <label htmlFor="password">Password</label>
                        <Field name="password" type="password" />
                        <ErrorMessage name="password" />
                        <br />

                        {
                            formProps.isSubmitting
                            ? <LinearProgress />
                            : <div style={{color: "red"}}>{formProps.errors.general}</div>
                        }
                        <Button
                            className="btn draw-border"
                            disabled={formProps.isSubmitting}
                            onClick={formProps.handleSubmit}
                        >
                            Login!
                        </Button>
                        <Link to="/sign-up">
                            <Button className="btn draw-border">
                                Sign Up!
                            </Button>
                        </Link>
                    </Form>
                )}
                </Formik>
            )
        }
    }
}

export default Login;