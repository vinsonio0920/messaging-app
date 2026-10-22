import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import styles from "./Chat.module.css";
import { formatChatDate, formatMessageDate } from "../utils";

const Message = ({ message, members, otherUser }) => {
  // If messages are posted within 10 minutes of each other, allow them to be grouped
  // Also show the latest time for the grouped messages

  // we'll simply hide the other elements while still being accessible!
  // maybe also a useRef... but all that will need some wifi for research so I'll rest for now.
  return (
    <li className={styles.messageLi}>
      <img
        src={members.find((member) => member.id === message.senderId)?.profile}
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
  // for messages, make them continue if they are posted within 10 minutes of each other
  // also test text messages!

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
        {messages?.map((message) => (
          <Message
            key={message.id}
            message={message}
            members={members}
            otherUser={otherUser}
          />
        ))}
      </ul>
      <form>
        <button type="button" aria-label="Add image">
          <span className="material-symbols-outlined">image</span>
        </button>
        <label htmlFor="message">Write a message</label>
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
