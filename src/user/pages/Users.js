import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList/UsersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";

function Users() {
  // const USERS = [
  //   {
  //     id: "u1",
  //     name: "Max Schwarz",
  //     image: "https://randomuser.me/api/portraits/women/12.jpg",
  //     places: 3,
  //   },
  // ];

  const [isLoading, setIsLoading] = useState(false);
  const [loadedUsers, setLoadedUsers] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(process.env.REACT_APP_URL + "/users");
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedUsers(responseData.users);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Something went wrong, please try again.");
      }
    };
    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
}

export default Users;
