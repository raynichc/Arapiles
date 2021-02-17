import React from "react"

import { Formik, Field, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button, LinearProgress } from "@material-ui/core";
import { DatePicker } from "formik-material-ui-pickers";
import Modal from '@material-ui/core/Modal';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Select from "../components/inputs/Select";
import Phone, { phoneValidation } from "../components/inputs/Phone";
import Address, { addressValidation } from "../components/inputs/Address";

import marked from "marked";
import axios from "axios"

//Authentication services for logging in
import { authenticationService } from "../services/authentication.js"

//
import { userService } from "../services/user.js";

//Basic Sign Up component
class SignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            waiver: "Loading...",
            membership: "Loading...",
            waiverOpen: false,
            membershipOpen: false,
            dateOfBirth: new Date(),
            agreedLiabilityWaiver: false,
            agreedMembershipContract: false,
            registered: false
        }
    }

    async componentDidMount() {
        const waiver = await axios.get(process.env.GATSBY_CMS_HOST  + "/liability-waiver");
        this.setState({waiver: marked(waiver['data']['content'])});

        const membership = await axios.get(process.env.GATSBY_CMS_HOST  + "/membership-agreement");
        this.setState({membership: marked(membership['data']['content'])});
    }

    validationSchema = Yup.object().shape({
        nameFirst: Yup.string()
            .required("Required"),

        nameLast: Yup.string()
            .required("Required"),

        sex: Yup.string()
            .ensure()
            .required("Required"),

        username: Yup.string()
            .required("Required"),

        email: Yup.string()
            .email("Invalid Email")
            .required("Required"),

        password: Yup.string()
            .required("Required"),

        phoneNumber: phoneValidation,

        dateOfBirth: Yup.date()
            .required("Required"),

        address: addressValidation,

        studentStatus: Yup.string()
            .ensure()
            .required("Required"),

        studentNumber: Yup.number()
            .positive("Student Number must be positive")
            .integer("Student Number must be an integer")
            .required("Required"),

        emergencyContact: Yup.object().shape({
            name: Yup.string()
                .required("Required"),

            phoneNumber: phoneValidation,

            address: addressValidation
        }),

        medicalDetails: Yup.string(),

        agreedLiabilityWaiver: Yup.boolean()
            .oneOf([true], "You must agree to the Liability Waiver"),

        agreedMembershipContract: Yup.boolean()
            .oneOf([true], "You must agree to the Membership Agreement")

    }); 

    //Function to handle login form submission
    handleSubmit = async (data, actions) => {
        //Attempt to register a new user
        const response = await authenticationService.register(data);

        //Check register request was successful 
        if (response === true) {
            this.setState({
                registered: true
            });
        } else {
            if (response === false) {
                actions.setFieldError('general', "An error occured");
            } else {
                actions.setFieldError('general', response);
            }
        }

        actions.setSubmitting(false);
    }

    //Simple Sign Up form
    render() {
        if (this.state.registered) {
            return (
                <p>
                    Please check your email to confirm your account.
                </p>
            )
        } else {
            return (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Formik
                        initialValues={{
                            dateOfBirth: new Date(),
                            agreedLiabilityWaiver: false,
                            agreedMembershipContract: false
                        }}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleSubmit}
                    >
                    {(formProps) => (
                        <Form>
                            <h2>Your Details</h2>
                            <label htmlFor="nameFirst">First Name</label>
                            <Field name="nameFirst" />
                            <ErrorMessage name="nameFirst" />
                            <br />

                            <label htmlFor="nameLast">Last Name</label>
                            <Field name="nameLast" />
                            <ErrorMessage name="nameLast" />
                            <br />

                            <label htmlFor="sex">Sex</label>
                            <Select name="sex" options={userService.sexes} />
                            <ErrorMessage name="sex" />
                            <br />

                            <label htmlFor="username">Username</label>
                            <Field name="username" />
                            <ErrorMessage name="username" />
                            <br />

                            <label htmlFor="email">Email</label>
                            <Field name="email" type="email" />
                            <ErrorMessage name="email" />
                            <br />

                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" />
                            <ErrorMessage name="password" />
                            <br />

                            <Phone name="phoneNumber" />

                            <label htmlFor="dateOfBirth">Date of Birth</label>
                            <Field name="dateOfBirth" component={DatePicker} />
                            <ErrorMessage name="dateOfBirth" />
                            <br />

                            <Address name="address" />

                            <label htmlFor="studentStatus">Student Status</label>
                            <Select name="studentStatus" options={userService.studentStatuses} />
                            <ErrorMessage name="studentStatus" />
                            <br />

                            {/*TODO: number?*/}
                            <label htmlFor="studentNumber">Student Number</label>
                            <Field name="studentNumber" />
                            <ErrorMessage name="studentNumber" />
                            <br />

                            <label htmlFor="medicalDetails">Medical Details</label>
                            <ErrorMessage name="medicalDetails" />
                            <br />
                            <Field name="medicalDetails" as="textarea" />
                            <br />

                            <h2>Emergency Contact</h2>
                            <label htmlFor="emergencyContact.name">Contact Name</label>
                            <Field name="emergencyContact.name" />
                            <ErrorMessage name="emergencyContact.name" />
                            <br />
                            
                            <Phone name="emergencyContact.phoneNumber" />

                            <Address name="emergencyContact.address" />

                            <h2>Membership</h2>
                            <label htmlFor="agreedLiabilityWaiver">Liability Waiver</label>
                            <button type="button" onClick={() => this.setState({ waiverOpen: true })}>View Waiver</button>
                            <Modal
                                open={this.state.waiverOpen}
                            >
                                <div className="modal">
                                    <div className="modal-header">
                                        <button type="button" onClick={() => this.setState({ waiverOpen: false })}>Close Waiver</button>
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.waiver }} />
                                    <Field name="agreedLiabilityWaiver" type="checkbox" />
                                    <label htmlFor="agreedLiabilityWaiver">Accept Waiver</label>
                                    <div className="modal-header">
                                        <button type="button" onClick={() => this.setState({ waiverOpen: false })}>Close Waiver</button>
                                    </div>
                                </div>
                            </Modal>
                            <ErrorMessage name="agreedLiabilityWaiver" />
                            <br />

                            <label htmlFor="agreedMembershipContract">Membership agreement</label>
                            <button type="button" onClick={() => this.setState({ membershipOpen: true })}>View Membership Agreement</button>
                            <Modal
                                open={this.state.membershipOpen}
                            >
                                <div className="modal">
                                    <div className="modal-header">
                                        <button type="button" onClick={() => this.setState({ membershipOpen: false })}>Close Membership Agreement</button>
                                    </div>
                                    <div className="modal-text" dangerouslySetInnerHTML={{ __html: this.state.membership }} />
                                    <Field name="agreedMembershipContract" type="checkbox" />
                                    <label htmlFor="agreedMembershipContract">Accept Membership Agreement</label>
                                    <div className="modal-header">
                                        <button type="button" onClick={() => this.setState({ membershipOpen: false })}>Close Membership Agreement</button>
                                    </div>
                                </div>
                            </Modal>
                            <ErrorMessage name="agreedMembershipContract" />
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
                                Sign Up!
                            </Button>
                        </Form>
                    )}
                    </Formik>
                </MuiPickersUtilsProvider>
            ) 
        }
    }
}

export default SignUp;