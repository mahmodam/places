import React, { useContext, useState } from "react";
import Card from "../../shared/components/UIElements/Card/Card";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../shared/components/FormElements/Button/Button";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";

import "./Auth.css";

const InputSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Please enter an email"),
  password: Yup.string()
    .min(4, "Too Short!")
    .max(50, "Too Long!")
    .required("Please enter a password"),
});

function Login() {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (event) => {
    try {
      setIsLoading(true);
      const response = await fetch(process.env.REACT_APP_URL + "/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: event.email,
          password: event.password,
        }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setIsLoading(false);

      auth.login(responseData.userId, responseData.token);
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
        <h2>Login Required</h2>
        <hr />
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={InputSchema}
          onSubmit={handleSubmit}
        >
          <Form className="place-form">
            <div className="form-control">
              <label htmlFor="email">E-Mail</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage
                className="form-control-invalid"
                name="email"
                component="div"
              />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage
                className="form-control-invalid"
                name="password"
                component="div"
              />
            </div>
            <Button type="submit">LOGIN</Button>
            {/* <button type="submit">login</button> */}
          </Form>
        </Formik>
      </Card>
    </>
  );
}

export default Login;
