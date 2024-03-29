import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import axios from "../../api/axios";
import { GET_PLACES_USER } from "../../api/routes";
import Cancellation from "axios";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../components/UI/Error";
import Spinner from "../../components/UI/Spinner";
import { TinyButton as ScrollUpButton } from "react-scroll-up-button";

const UserPlaces = ({ t }) => {
  const CancelToken = Cancellation.CancelToken;
  const source = CancelToken.source();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [loadedPlaces, setLoadedPlaces] = useState(undefined);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(GET_PLACES_USER + userId, {
          cancelToken: source.token
        });

        setLoadedPlaces(response.data.places);
      } catch (err) {
        setError(t("Error modal body"));
        source.cancel("Operation canceled by the user.");
        throw err.message;
      }
      setIsLoading(false);
    };
    fetchPlaces();
    // eslint-disable-next-line
  }, [userId]);

  const errorHandler = () => {
    setError(null);
  };

  const placeDeleteHandler = deletedPlaceId => {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    );
  };

  return (
    <>
      <ScrollUpButton />
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <Spinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />
      )}
    </>
  );
};

export default withNamespaces()(UserPlaces);
