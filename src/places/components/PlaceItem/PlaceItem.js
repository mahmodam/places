import React, { useState, useContext } from "react";
import Button from "../../../shared/components/FormElements/Button/Button";
import Card from "../../../shared/components/UIElements/Card/Card";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import Map from "../../../shared/components/UIElements/Map/Map";
import Modal from "../../../shared/components/UIElements/Modal/Modal";
import { AuthContext } from "../../../shared/context/auth-context";
import { FaTrash, FaRegEdit } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";

import "./PlaceItem.css";

function PlaceItem(props) {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      setIsLoading(true);
      await fetch(process.env.REACT_APP_URL + `/places/${props.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      setIsLoading(false);
      props.onDelete(props.id);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Something went wrong, please try again.");
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              <FaTrash /> Delete
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              <GrMapLocation /> VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>
                {" "}
                <FaRegEdit /> EDIT
              </Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                <FaTrash /> DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
}

export default PlaceItem;
