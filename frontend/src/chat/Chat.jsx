import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import styles from "./Chat.module.css";
import { formatChatDate, formatMessageDate } from "../utils";

const Message = ({ message, members, index, array, user, otherUser }) => {
  const previousMessage = array[index - 1];
  // checks if the message belongs the user (person using the website)
  const isUsersMessage = message.senderId === user.id;
  let groupMessage = false;

  if (previousMessage) {
    const timeDifference =
      new Date(message.date) - new Date(previousMessage.date);
    const timeThreshold = 1000 * 60 * 10; // 10 minute

    if (timeDifference < timeThreshold) groupMessage = true;
  }

  if (groupMessage) {
    // If messages are posted within 10 minutes of each other, allow them to be grouped
    // This will be achieved through styling in CSS
    return (
      <li
        className={`${styles.messageLi} ${styles.groupedMessage} ${isUsersMessage ? styles.isUsersMessage : ""}`}
      >
        <img
          src={
            members.find((member) => member.id === message.senderId)?.profile
          }
          alt={`${members.find((member) => member.id === message.senderId)?.username}'s profile picture`}
          width="32"
          className={`${styles.profilePicture} visually-hidden`}
        />
        <div className={styles.messageRight}>
          <div className={`${styles.messageMetadata} visually-hidden`}>
            <p className={styles.username}>
              {message.senderId === otherUser.id ? otherUser.username : "You"}
            </p>
            <span className={styles.messageDate}>
              {formatMessageDate(message.date)}
            </span>
          </div>
          <div className={styles.messageContent}>
            {message.message && <p>{message.message}</p>}
            {message.image && (
              <img
                src={message.image}
                alt="Image file"
                width="150"
                className={styles.messageImage}
              />
            )}
          </div>
        </div>
      </li>
    );
  } else {
    return (
      <li
        className={`${styles.messageLi} ${isUsersMessage ? styles.isUsersMessage : ""}`}
      >
        <img
          src={
            members.find((member) => member.id === message.senderId)?.profile
          }
          alt={`${members.find((member) => member.id === message.senderId)?.username}'s profile picture`}
          width="32"
          className={styles.profilePicture}
        />
        <div className={styles.messageRight}>
          <div className={styles.messageMetadata}>
            <p className={styles.username}>
              {message.senderId === otherUser.id ? otherUser.username : "You"}
            </p>
            <span className={styles.messageDate}>
              {formatMessageDate(message.date)}
            </span>
          </div>
          <div className={styles.messageContent}>
            {message.message && <p>{message.message}</p>}
            {message.image && (
              <img
                src={message.image}
                alt="Image file"
                width="150"
                className={styles.messageImage}
              />
            )}
          </div>
        </div>
      </li>
    );
  }
};

// make sure to domPurify user messages!
// also sort messages by date desc!
const Chat = () => {
  const user = useOutletContext();
  const { chatId } = useParams();
  const [chatData, setChatData] = useState(null);
  const [errors, setErrors] = useState([]);

  const messages = chatData?.messages;
  const members = chatData?.members;
  const otherUser = members?.find((member) => member.id !== user.id);

  useEffect(() => {
    if (!user) return;

    async function fetchMessages() {
      try {
        const url = `${import.meta.env.VITE_SERVER_URL}/chats/${chatId}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          },
          body: new URLSearchParams({
            userId: user.id,
          }),
        });
        const result = await response.json();

        if (result.status === "success") {
          setChatData(result.data);
        } else {
          throw new Error("Error fetching the messages!");
        }
      } catch (error) {
        console.error(error);
        setErrors((prevState) => [...prevState, "messages"]);
      }
    }

    fetchMessages();
  }, [chatId, user]);

  return (
    <>
      <header className={styles.chatHeader}>
        <div className={styles.profileInfo}>
          <img
            src={otherUser?.profile}
            alt={`${otherUser?.username}'s profile picture`}
            width="32"
            className={styles.profilePicture}
          />
          <h1 className={styles.username}>{otherUser?.username}</h1>
        </div>
        <p className={styles.chatStartDate}>
          Chatting since {chatData && formatChatDate(chatData.date)}
        </p>
      </header>
      <ul className={styles.messagesUl}>
        {messages?.map((message, index, array) => (
          <Message
            key={message.id}
            message={message}
            index={index}
            array={array}
            members={members}
            user={user}
            otherUser={otherUser}
          />
        ))}
      </ul>
      <form>
        <button type="button" aria-label="Add image">
          <span className="material-symbols-outlined">image</span>
        </button>
        <label htmlFor="message" className="visually-hidden">
          Write a message
        </label>
        <input
          type="text"
          id="message"
          name="message"
          placeholder="Write a message"
          required
        />
        <button type="submit" aria-label="Send message">
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </>
  );
};

export { Chat };
