import React, { useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";

import "./PlaceForm.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../shared/components/FormElements/Button/Button";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import PreviewImage from "../../shared/components/FormElements/ImageUpload/PreviewImage";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const InputSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short title!")
    .max(100, "Too Long title!")
    .required("Please enter a title"),
  description: Yup.string()
    .min(5, "Too Short!")
    .max(1000, "Too Long!")
    .required("Please enter a description (at least 5 characters)"),
  address: Yup.string()
    .min(5, "Too Short!")
    .max(100, "Too Long!")
    .required("Please enter an address"),
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

function NewPlace(props) {
  const auth = useContext(AuthContext);
  const fileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const history = useHistory();

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("address", values.address);
      formData.append("creator", auth.userId);
      formData.append("file", values.file);

      setIsLoading(true);
      const response = await fetch(process.env.REACT_APP_URL + "/places", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);

      history.push("/");
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Something went wrong, please try again.");
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    // <form className="place-form">
    //   <Input element="input" type="text" label="Title" />
    // </form>
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <div className={`place-form`}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Formik
          initialValues={{
            title: props.title || "",
            description: props.description || "",
            address: props.address || "",
          }}
          validationSchema={InputSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="form-control">
                <label>Title</label>
                <Field type="text" name="title" className="form-control" />
                <ErrorMessage
                  className="form-control-invalid"
                  name="title"
                  component="div"
                />
              </div>
              <div className="form-control">
                <label>Address</label>
                <Field type="text" name="address" className="form-control" />
                <ErrorMessage
                  className="form-control-invalid"
                  name="address"
                  component="div"
                />
              </div>
              <div className="form-control">
                <label>Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="form-control"
                />
                <ErrorMessage
                  className="form-control-invalid"
                  name="description"
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
                <Button type="submit" className="">
                  Add Place
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default NewPlace;
