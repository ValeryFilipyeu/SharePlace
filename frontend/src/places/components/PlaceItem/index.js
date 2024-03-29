import React, { useState, useContext } from "react";
import { withNamespaces } from "react-i18next";
import PropTypes from "prop-types";

import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Form/Button";
import Modal from "../../../components/UI/Modal";
import Map from "../../../components/UI/Map";
import Spinner from "../../../components/UI/Spinner";
import ErrorModal from "../../../components/UI/Error";

import { AuthContext } from "../../../context/auth-context";
import { PLACES, DELETE_PLACE } from "../../../api/routes";
import axios from "../../../api/axios";
import Cancellation from "axios";

import "./index.css";

const PlaceItem = props => {
  const auth = useContext(AuthContext);
  const CancelToken = Cancellation.CancelToken;
  const source = CancelToken.source();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    setIsLoading(true);

    try {
      await axios.delete(DELETE_PLACE + props.id, {
        headers: {
          Authorization: "Bearer " + auth.token
        },
        cancelToken: source.token
      });
      props.onDelete(props.id);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || props.t("Error message"));
      setIsLoading(false);
      source.cancel("Operation canceled by the user.");
      throw err;
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
        footer={<Button onClick={closeMapHandler}>{props.t("Close")}</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header={props.t("Are you sure")}
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              {props.t("Cancel")}
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              {props.t("Delete")}
            </Button>
          </>
        }
      >
        <p>{props.t("Delete modal body")}</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <Spinner asOverlay />}
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
              {props.t("View on Map")}
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={PLACES + props.id}>{props.t("Edit")}</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                {props.t("Delete")}
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

PlaceItem.propTypes = {
  address: PropTypes.string.isRequired,
  coordinates: PropTypes.objectOf(PropTypes.number).isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default withNamespaces()(PlaceItem);
