import { useEffect, useState } from "react";
import styles from "./ChatForm.module.css";
import { useFetcher } from "react-router";
import { sortFriendsList } from "../utils";

const FriendLi = ({ friend, selectedFriends, setSelectedFriends }) => {
  function handleButtonClick(event) {
    const friendId = event.currentTarget.dataset.id;

    if (selectedFriends.includes(friendId)) {
      setSelectedFriends((prevState) =>
        prevState.filter((id) => id !== friendId),
      );
    } else {
      setSelectedFriends((prevState) => [...prevState, friendId]);
    }
  }

  return (
    <li>
      <button type="button" data-id={friend.id} onClick={handleButtonClick}>
        <div className={styles.leftButton}>
          <img
            src={friend.profile}
            alt={`${friend.username}'s profile picture`}
            width="32"
            className={styles.profilePicture}
          />
          <span>{friend.username}</span>
        </div>
        <div className={styles.rightButton}>
          {selectedFriends.includes(String(friend.id)) && (
            <span
              className={`material-symbols-outlined ${styles.checkmarkIcon}`}
            >
              check
            </span>
          )}
        </div>
      </button>
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
  const [selectedFriends, setSelectedFriends] = useState([]);

  const friendsList =
    friends &&
    friends
      .filter((friend) =>
        friend.username.toLowerCase().includes(search.toLowerCase()),
      )
      .sort(sortFriendsList(selectedFriends));

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
              className={styles.searchInput}
              placeholder="Search friends"
            />
            <ul className={styles.friendsUl}>
              {friends && friends.length === 0 && (
                <li>You have no friends right now.</li>
              )}
              {friendsList && friendsList.length > 0 ? (
                friendsList.map((friend) => (
                  <FriendLi
                    key={friend.id}
                    friend={friend}
                    selectedFriends={selectedFriends}
                    setSelectedFriends={setSelectedFriends}
                  />
                ))
              ) : (
                <li>No friends found</li>
              )}
            </ul>
          </div>
          <div>
            <input
              type="hidden"
              id="members"
              name="members"
              value={JSON.stringify(selectedFriends)}
            />
            <input type="hidden" id="userId" name="userId" value={user.id} />
          </div>
          <div>
            <button
              type="submit"
              name="type"
              value="chat"
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
