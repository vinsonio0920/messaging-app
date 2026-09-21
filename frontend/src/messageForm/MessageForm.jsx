import { useEffect, useState } from "react";
import styles from "./MessageForm.module.css";

const MessageForm = () => {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(false);

  // fetch all users
  useEffect(() => {
    async function fetchData() {
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

    fetchData();
  }, []);

  // make sure to not send a new message request if users are already messaging!

  return (
    <div className={styles.messageFormContainer}>
      <div className={styles.messageForm}>
        <h1>Create a New Message Chat</h1>
        <form>
          <input type="text" id="search" name="search" />
          <input type="hidden" id="targetUser" name="targetUser" value="" />
        </form>
        {error ? (
          <p className={styles.errorPara}>
            There was an error getting the users. Please try again later.
          </p>
        ) : null}
        {users && users.length > 0 ? (
          <ul className={styles.usersUl}>
            {users.map((user) => (
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
          <p>There are no users right now!</p>
        )}
      </div>
    </div>
  );
};

export { MessageForm };
