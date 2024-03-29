import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Cancellation from "axios";
import { GET_USERS } from "../../api/routes";

import UsersList from "../components/UserList";
import ErrorModal from "../../components/UI/Error";
import Spinner from "../../components/UI/Spinner";
import { TinyButton as ScrollUpButton } from "react-scroll-up-button";

const Users = () => {
  const CancelToken = Cancellation.CancelToken;
  const source = CancelToken.source();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [loadedUsers, setLoadedUsers] = useState(undefined);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(GET_USERS, {
          cancelToken: source.token
        });

        setLoadedUsers(response.data.users);
      } catch (err) {
        setError(err.message);
        source.cancel("Operation canceled by the user.");
        throw err;
      }
      setIsLoading(false);
    };
    sendRequest();
    // eslint-disable-next-line
  }, []);

  const errorHandler = () => {
    setError(null);
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
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
