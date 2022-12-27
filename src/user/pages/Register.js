import React, { useContext, useState, useRef } from "react";
import Card from "../../shared/components/UIElements/Card/Card";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../shared/components/FormElements/Button/Button";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";

import "./Auth.css";
//import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload";
import PreviewImage from "../../shared/components/FormElements/ImageUpload/PreviewImage";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const InputSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Please enter an email"),
  password: Yup.string()
    .min(4, "Too Short!")
    .max(50, "Too Long!")
    .required("Please enter a password"),
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Please enter a name"),
  //image: Yup.mixed().required("Please upload an image"),
  file: Yup.mixed()
    .nullable()
    .required("Please upload an image")
    .test("FILE_SIZE", "The file is too large", (value) => {
      return value && value.size <= 1000000;
    })
    .test("FILE_FORMAT", "Unsupported Format", (value) => {
      return value && SUPPORTED_FORMATS.includes(value.type);
    }),
});

function Register(props) {
  const auth = useContext(AuthContext);
  const fileRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("file", values.file);
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_URL + "/users/signup",
        {
          method: "POST",
          body: formData,
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);

      auth.register(responseData.userId, responseData.token);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Something went wrong, please try again.");
    }
    setIsLoading(false);
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Sign Up</h2>
        <hr />
        <Formik
          initialValues={{
            email: "",
            password: "",
            name: "",
            file: null,
          }}
          validationSchema={InputSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="place-form">
              <div className="form-control">
                <label className="form-control-label" htmlFor="name">
                  Your Name
                </label>
                <Field
                  className="form-control-field"
                  type="text"
                  id="name"
                  name="name"
                />
                <ErrorMessage
                  className="form-control-invalid"
                  name="name"
                  component="div"
                />
              </div>

              <input
                ref={fileRef}
                hidden
                type="file"
                onChange={(event) => {
                  setFieldValue("file", event.target.files[0]);
                }}
              />

              {values.file && <PreviewImage center file={values.file} />}
              <ErrorMessage
                className="form-control-invalid"
                name="file"
                component="div"
              />

              <Button type="button" onClick={() => fileRef.current.click()}>
                PICK IMAGE
              </Button>

              <div className="form-control">
                <label className="form-control-label" htmlFor="email">
                  E-Mail
                </label>
                <Field
                  className="form-control-field"
                  type="email"
                  id="email"
                  name="email"
                />
                <ErrorMessage
                  className="form-control-invalid"
                  name="email"
                  component="div"
                />
              </div>
              <div className="form-control">
                <label className="form-control-label" htmlFor="password">
                  Password
                </label>
                <Field
                  className="form-control-field"
                  type="password"
                  id="password"
                  name="password"
                />
                <ErrorMessage
                  className="form-control-invalid"
                  name="password"
                  component="div"
                />
              </div>
              <Button type="submit">SIGNUP</Button>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
}

export default Register;
