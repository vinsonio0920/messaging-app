import { useEffect, useState } from "react";
import styles from "./MessageForm.module.css";

const MessageForm = ({ user }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(null);
  const [friends, setFriends] = useState(null);
  const [error, setError] = useState(null);

  const usersList =
    users &&
    users.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase()),
    );

  // fetch all users
  useEffect(() => {
    async function fetchUserData() {
      try {
        const url = `${import.meta.env.VITE_SERVER_URL}/users`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.status === "success") {
          setUsers(result.data);
        } else {
          throw new Error("Error fetching the users");
        }
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }

    async function fetchFriendsData() {
      try {
        const url = `${import.meta.env.VITE_SERVER_URL}/users/${user.id}/friends`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.status === "success") {
          setFriends(result.data);
        } else {
          throw new Error("Error fetcher user's friends");
        }
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }

    fetchUserData();
    fetchFriendsData();
  }, [user]);

  function handleInputEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  function handleInputChange(event) {
    setSearch(event.target.value);
  }

  // make sure to not send a new message request if users are already messaging!

  return (
    <div className={`${styles.messageFormContainer} messageFormContainer`}>
      <div className={styles.messageDiv}>
        <h1>Create a New Message Chat</h1>
        <form className={styles.messageForm}>
          <input
            type="text"
            id="search"
            name="search"
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleInputEnter}
          />
          <input type="hidden" id="targetUser" name="targetUser" value="" />
          {error ? (
            <p className={styles.errorPara}>
              There was an error getting the users. Please try again later.
            </p>
          ) : null}
          {users && users.length == 0 && <p>There are no users right now!</p>}
          {usersList && usersList.length > 0 ? (
            <ul className={styles.usersUl}>
              {usersList.map((user) => (
                <li data-id={user.id} key={user.id}>
                  <img
                    src={user.profile}
                    alt={`${user.username}'s profile picture`}
                    width="32"
                    className={styles.profilePicture}
                  />
                  <span>{user.username}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found</p>
          )}
          <div>
            <button type="submit" className={styles.submitButton}>
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { MessageForm };
