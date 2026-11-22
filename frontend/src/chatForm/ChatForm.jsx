import { useEffect, useState } from "react";
import styles from "./ChatForm.module.css";
import { useFetcher } from "react-router";

const FriendLi = ({ friend }) => {
  console.log(friend);
  return (
    <li>
      <div className={styles.leftLi}>
        <img
          src={friend.profile}
          alt={`${friend.username}'s profile picture`}
          width="32"
          className={styles.profilePicture}
        />
        <span>{friend.username}</span>
      </div>
      <div className={styles.rightLi}>{/* add friend status later */}</div>
    </li>
  );
};

const ChatForm = ({ user }) => {
  const fetcher = useFetcher();
  const [friends, setFriends] = useState([]);
  const [chatName, setChatName] = useState(
    localStorage.getItem("chatFormName") ?? "",
  );
  const [search, setSearch] = useState(
    localStorage.getItem("chatFormSearch") ?? "",
  );
  const [errors, setErrors] = useState([]);

  // only enable when name is filled out for now
  let disableButton = false;

  useEffect(() => {
    if (!user) return;

    async function fetchFriends() {
      try {
        const friendsUrl = `${import.meta.env.VITE_SERVER_URL}/users/${user.id}/friends/mutual`;

        const friendsResponse = await fetch(friendsUrl);
        const friendsResult = await friendsResponse.json();

        if (friendsResult.status === "success") {
          setFriends(friendsResult.data);
        } else {
          throw new Error("Error fetching friends!");
        }
      } catch (error) {
        console.error(error);
        setErrors((prevState) => [...prevState, "fetch"]);
      }
    }

    fetchFriends();
  }, [user]);

  function handleChatChange(event) {
    setChatName(event.target.value);
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
  }

  return (
    <div className={`${styles.chatFormContainer} chatFormContainer`}>
      <div className={styles.chatDiv}>
        <h1>New Chat</h1>
        <fetcher.Form method="POST" className={styles.chatForm}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={chatName}
              onChange={handleChatChange}
            />
          </div>
          <div>
            <p>Members</p>
            <label htmlFor="search" className="visually-hidden">
              Search friends
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={search}
              onChange={handleSearchChange}
            />
            <ul className={styles.friendsList}>
              {friends && friends.length === 0 && (
                <li>You have no friends right now.</li>
              )}
              {friends && friends.length > 0 ? (
                friends.map((friend) => (
                  <FriendLi key={friend.id} friend={friend} />
                ))
              ) : (
                <li>No friends found</li>
              )}
            </ul>
          </div>
          <div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={disableButton}
            >
              Send Request
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
};

export { ChatForm };
