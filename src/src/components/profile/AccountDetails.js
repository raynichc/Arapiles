import React from "react"

import { Formik, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from '@material-ui/core';
import Select from "../inputs/Select";

import ResetPassword from "../ResetPassword";
import { userService } from "../../services/user.js"

//Basic Account Details component
class AccountDetails extends React.Component {

    constructor(props) {
        super(props);

        //Initialize state with edit flags and roles list
        this.state = {
            edit: false,
            editPassword: false,
            passwordSuccess: false,
            roles: []
        }
    }

    async componentDidMount() {
        //Retrieve the roles for rendering.
        const roles = await userService.roles();

        if (roles) {
            //Format the roles for Select component options
            this.setState({
                roles: roles.data.roles.map((role) => {
                    return {value: role.id, label: role.name}
                })
            });
        }
    } 

    //Handle role change submit
    handleSubmit = async (data, actions) => {
        //Only attempt is admin flag is set.
        if (this.props.admin) {
            //Attempt to update user's role.
            const response = await userService.update(this.props.id, data);

            //Check if request was successful
            if (response === true) {
                this.setState({edit: false});
            } else {
                actions.setFieldError('general', response);
            }
        }

        actions.setSubmitting(false);
    }

    //Render Account Details
    render() {
        return (
            <>
                <p>Username: {this.props.data.username}</p>
                <p>Email: {this.props.data.email}</p>

                {
                    this.props.admin &&
                    <Formik
                        initialValues={{role: this.props.data.role.id}}
                        validationSchema={Yup.object().shape({
                            role: Yup.string()
                                .ensure("Please select a Role.")
                                .required("Required")
                        })}
                        onSubmit={this.handleSubmit}
                    >
                    {(formProps) => (
                        <Form>
                            <label htmlFor="role">Role</label>
                            <Select name="role" disabled={!this.state.edit} options={this.state.roles} placeholder={false} />
                            <ErrorMessage name="role" />

                            <Button
                                className="btn draw-border"
                                disabled={formProps.isSubmitting}
                                onClick={() => {
                                    if (this.state.edit) {
                                        formProps.handleSubmit()
                                    } else {
                                        this.setState({edit: true})
                                    }
                                }}
                            >
                                {this.state.edit ? "Submit" : "Edit"}
                            </Button>
                            <br/>
                        </Form>
                    )}
                    </Formik>
                } 

                <br/>
                <Button
                    className="btn draw-border"
                    onClick={()=>{
                        this.setState({
                            editPassword: !this.state.editPassword,
                            passwordSuccess: false
                        });
                    }}
                >
                    {this.state.editPassword ? (this.state.passwordSuccess ? "Close" : "Cancel") : "Change Password"}
                </Button>

                { this.state.editPassword &&
                    <>
                    <br />
                    <ResetPassword onSuccess={() => {
                        this.setState({
                            passwordSuccess: true
                        })
                    }} />
                    </>
                }
            </>
        )
    }
}

export default AccountDetails;