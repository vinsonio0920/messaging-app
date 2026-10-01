import { useEffect, useState } from "react";
import styles from "./MessageForm.module.css";
import { compareUsersList, sortPendingAcceptance } from "../utils";

// finally we have to also add requesting from the other user side

const UserLi = ({
  currentUserId,
  user,
  friends,
  selectedUser,
  setSelectedUser,
}) => {
  let friendStatus;

  // user 1 is equal to user.id and ...
  const otherFriendRequested =
    friends &&
    friends.find(
      (friend) =>
        friend.user1 === user.id && friend.user2 === Number(currentUserId),
    );
  const findFriendStatus =
    friends && friends.find((friend) => friend.user2 === user.id);
  if (findFriendStatus && findFriendStatus.accepted === true) {
    friendStatus = "friends";
  } else if (findFriendStatus) {
    friendStatus = "requested";
  } else if (otherFriendRequested) {
    friendStatus = "pending acceptance";
  }

  function handleUserLiClick(event) {
    const userId = event.currentTarget.dataset.id;

    setSelectedUser(userId);
  }

  return (
    <li
      data-id={user.id}
      className={Number(selectedUser) === user.id ? styles.selected : null}
      onClick={handleUserLiClick}
    >
      <div className={styles.leftLi}>
        <img
          src={user.profile}
          alt={`${user.username}'s profile picture`}
          width="32"
          className={styles.profilePicture}
        />
        <span>{user.username}</span>
      </div>
      <div className={styles.rightLi}>
        {friendStatus && (
          <span className={styles.friendStatus}>{friendStatus}</span>
        )}
        {Number(selectedUser) === user.id ? (
          <span className={`material-symbols-outlined ${styles.checkmarkIcon}`}>
            check
          </span>
        ) : null}
      </div>
    </li>
  );
};

const MessageForm = ({ user }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(null);
  const [friends, setFriends] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState(null);

  const usersList =
    users &&
    users
      .filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase()),
      )
      .sort(compareUsersList(friends, user))
      .sort(sortPendingAcceptance(friends, user));

  // disable the submit button if already requested/messaging
  let disableButton;
  const selectedUserObject =
    friends && friends.find((friend) => friend.user2 === Number(selectedUser));
  if (selectedUserObject || !selectedUser) {
    disableButton = true;
  } else {
    disableButton = false;
  }

  // fetch all users
  useEffect(() => {
    async function fetchUserData() {
      try {
        const url = `${import.meta.env.VITE_SERVER_URL}/users`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.status === "success") {
          // remove the user itself from the user list
          const newUsers = result.data.filter(
            (resultUser) => resultUser.id !== Number(user.id),
          );

          setUsers(newUsers);
        } else {
          throw new Error("Error fetching the users");
        }
      } catch (error) {
        console.error(error);
        setError({
          message:
            "There was an error getting the users. Please try again later.",
        });
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

  async function handleSubmitClick(event) {
    event.preventDefault();

    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/users/${user.id}/friends/${selectedUser}`;

      const response = await fetch(url, {
        method: "POST",
      });

      const result = await response.json();
      if (result.status === "success") {
        // update to make friend requested/friended and reset states
        const newFriends = [...friends, result.data];
        setFriends(newFriends);
        setError(null);
      } else {
        throw new Error("Problem posting request to server");
      }
    } catch (err) {
      console.error(err);
      setError({
        message:
          "There was an error submitting your request. Please try again later.",
      });
    }
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
          <input
            type="hidden"
            id="targetUser"
            name="targetUser"
            value={selectedUser}
          />
          {error ? <p className={styles.errorPara}>{error.message}</p> : null}
          {users && users.length == 0 && <p>There are no users right now!</p>}
          {usersList && usersList.length > 0 ? (
            <ul className={styles.usersUl}>
              {usersList.map((userLi) => (
                <UserLi
                  currentUserId={user.id}
                  user={userLi}
                  friends={friends}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  key={userLi.id}
                />
              ))}
            </ul>
          ) : (
            <p>No users found</p>
          )}
          <div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={disableButton}
              onClick={handleSubmitClick}
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { MessageForm };
