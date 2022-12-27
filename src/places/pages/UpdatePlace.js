import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import Card from "../../shared/components/UIElements/Card/Card";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../shared/components/FormElements/Button/Button";

import "./PlaceForm.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";

// const DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
//     address: "20 W 34th St, New York, NY 10001, United States",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
//     address: "20 W 34th St, New York, NY 10001, United States",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u2",
//   },
// ];

const InputSchema = Yup.object({
  title: Yup.string().required("Please enter a title"),
  description: Yup.string()
    .min(5, "Description must be at least 5 characters")
    .required("Please enter a description"),
});

function UpdatePlace() {
  const auth = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedPlace, setLoadedPlace] = useState();

  const history = useHistory();

  const placeId = useParams().placeId;

  // const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    const fetchPlace = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          process.env.REACT_APP_URL + `/places/${placeId}`
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedPlace(responseData.place);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    fetchPlace();
  }, [placeId]);

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_URL + `/places/${placeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({
            title: event.title,
            description: event.description,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      // מחזיר את המשתמש לדף המקומות שלו
      history.push("/" + auth.userId + "/places");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={() => setError(null)} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlace && (
        <Formik
          initialValues={{
            title: loadedPlace.title || "",
            description: loadedPlace.description || "",
          }}
          validationSchema={InputSchema}
          onSubmit={handleSubmit}
        >
          <Form className="place-form">
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
            <Button type="submit">UPDATE PLACE</Button>
          </Form>
        </Formik>
      )}
    </>
  );
}

export default UpdatePlace;
