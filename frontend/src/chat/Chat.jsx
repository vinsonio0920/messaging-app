import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import styles from "./Chat.module.css";

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
  console.log(messages);

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
      <header>
        <div className={styles.profileInfo}>
          <p>{otherUser?.username}</p>
          <img
            src={otherUser?.profile}
            alt={`${otherUser?.username}'s profile picture`}
            width="32"
            className={styles.profilePicture}
          />
        </div>
        <p>Chatting since {chatData?.date}</p>
      </header>
      <ul className={styles.messagesUl}>
        {messages?.map((message) => (
          <li key={message.id}>
            <img
              src={
                members.find((member) => member.id === message.senderId)
                  ?.profile
              }
              alt={`${members.find((member) => member.id === message.senderId)?.username}'s profile picture`}
              width="32"
              className={styles.profilePicture}
            />
            {message.message && <p>{message.message}</p>}
            {message.image && (
              <img
                src={message.image}
                alt="Image file"
                width="150"
                className={styles.messageImage}
              />
            )}
            <span>{message.date}</span>
          </li>
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
