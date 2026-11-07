import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFetcher, useOutletContext, useParams } from "react-router";
import { formatChatDate, formatMessageDate } from "../utils";
import DOMPurify from "dompurify";
import styles from "./Chat.module.css";

const MessageForm = ({
  fetcher,
  messageFormRef,
  errors,
  setErrors,
  setUlPaddingBottom,
  chatId,
  user,
}) => {
  const [textValue, setTextValue] = useState(
    localStorage.getItem(`formTextValue${chatId}`) ?? "",
  );
  const [image, setImage] = useState(
    localStorage.getItem(`formImage${chatId}`) ?? null,
  );
  const [imageKey, setImageKey] = useState(crypto.randomUUID());
  const [prevData, setPrevData] = useState(null);

  // Reset the form on a successful submit
  // This works because fetcher.data persists between renders!
  if (fetcher.data !== prevData) {
    setPrevData(fetcher.data);
    if (fetcher.data?.data) {
      setTextValue("");
      setImageKey(crypto.randomUUID());
      setImage(null);
      localStorage.removeItem(`formTextValue${chatId}`);
      localStorage.removeItem(`formImage${chatId}`);
    }
  }

  let formError = null;
  let disableSend = true;

  if (errors.includes("fileType")) {
    formError = "Only image files are accepted";
  } else if (errors.includes("fileSize")) {
    formError = "File must not exceed 2 MB";
  } else if (errors.includes("reader")) {
    formError = "There was an error reading the file. Please try again later";
  } else if (fetcher.data?.status === "error") {
    formError = fetcher.data.errors[0].message;
  }

  if (image || textValue.length > 0) {
    disableSend = false;
  }

  useLayoutEffect(() => {
    // When the message text is updated, get the updated height
    // If it has a new line then it will add extra padding to the bottom
    // to accommodate the message form and show all messages
    setUlPaddingBottom(messageFormRef.current.clientHeight);
  }, [textValue, image, messageFormRef, setUlPaddingBottom]);

  function handleTextInput(event) {
    localStorage.setItem(`formTextValue${chatId}`, event.target.value);
    setTextValue(event.target.value);
  }

  function handleTextKeyDown(event) {
    if (event.shiftKey && event.code === "Enter") {
      // simply return as it's a newline
      return;
    } else if (event.code === "Enter") {
      event.preventDefault();
      const formData = new FormData(messageFormRef.current);
      console.log(formData);
      formData.set("message", textValue);
      fetcher.submit(formData, { method: "POST" });
    }
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file.type.startsWith("image"))
      return setErrors((prevState) => [...prevState, "fileType"]);
    if (file.size > 2097152)
      return setErrors((prevState) => [...prevState, "fileSize"]);

    const reader = new FileReader();
    reader.onload = (e) => {
      localStorage.setItem(`formImage${chatId}`, e.target.result);
      setImage(e.target.result);
    };
    reader.onerror = () => {
      setErrors((prevState) => [...prevState, "reader"]);
    };

    reader.readAsDataURL(file);
  }

  function handleImageRemoveClick() {
    // update the file input's key so that it will force a re-render and reset the input
    localStorage.removeItem(`formImage${chatId}`);
    setImageKey(crypto.randomUUID());
    setImage(null);
  }

  return (
    <fetcher.Form
      method="POST"
      className={styles.messageForm}
      ref={messageFormRef}
      encType="multipart/form-data"
      noValidate
    >
      <div>
        <label htmlFor="message" className="visually-hidden">
          Write a message
        </label>
        <div className={styles.growWrap}>
          <textarea
            id="message"
            name="message"
            placeholder="Write a message"
            required
            className={styles.textInput}
            onInput={handleTextInput}
            onKeyDown={handleTextKeyDown}
            value={textValue}
            data-replicated-value={textValue}
            autoFocus
          ></textarea>
        </div>
      </div>
      <div>
        <input type="hidden" id="chatId" name="chatId" value={chatId} />
        <input type="hidden" id="userId" name="userId" value={`${user?.id}`} />
        <input type="hidden" id="image" name="image" value={image ?? ""} />
      </div>
      <div className={styles.messageButtons}>
        <div>
          <div className={styles.imageContainer}>
            <label
              htmlFor="imageInput"
              aria-label="Add image"
              className={styles.imageLabel}
            >
              {image ? (
                <img
                  src={image}
                  alt="Attached image"
                  className={styles.formImage}
                />
              ) : (
                <span className="material-symbols-outlined">image</span>
              )}
            </label>
            {image && (
              <button
                type="button"
                className={styles.imageRemove}
                aria-label="Remove image"
                onClick={handleImageRemoveClick}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
          <input
            type="file"
            id="imageInput"
            name="imageInput"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.imageInput}
            key={imageKey}
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          aria-label="Send message"
          disabled={disableSend}
        >
          <span className="material-symbols-outlined">send</span> Send
        </button>
      </div>
      <div className={styles.formErrorContainer}>
        {formError && <p className={styles.error}>{formError}</p>}
      </div>
    </fetcher.Form>
  );
};

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
          <div>
            <div>
              <div className={`${styles.messageMetadata} visually-hidden`}>
                <p className={styles.username}>
                  {message.senderId === otherUser.id
                    ? otherUser.username
                    : "You"}
                </p>
                <span className={styles.messageDate}>
                  {formatMessageDate(message.date)}
                </span>
              </div>
              <div className={styles.messageContent}>
                <div>
                  {message.message && (
                    <p className={styles.messageText}>
                      {/* split the messages by newlines, then map them out */}
                      {message.message.split("\r\n").map((text, index) => (
                        <span key={index}>{DOMPurify.sanitize(text)}</span>
                      ))}
                    </p>
                  )}
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
            </div>
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
          <div>
            <div>
              <div className={styles.messageMetadata}>
                <p className={styles.username}>
                  {message.senderId === otherUser.id
                    ? otherUser.username
                    : "You"}
                </p>
                <span className={styles.messageDate}>
                  {formatMessageDate(message.date)}
                </span>
              </div>
              <div className={styles.messageContent}>
                <div>
                  {message.message && (
                    <p className={styles.messageText}>
                      {/* split the messages by newlines, then map them out */}
                      {message.message.split(/[\r\n]+/).map((text, index) => (
                        <span key={index}>{DOMPurify.sanitize(text)}</span>
                      ))}
                    </p>
                  )}
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
            </div>
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
  const fetcher = useFetcher();
  const { chatId } = useParams();
  const [chatData, setChatData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [ulPaddingBottom, setUlPaddingBottom] = useState(0);
  const messageFormRef = useRef(null);
  const messagesRef = useRef(null);

  const messages = chatData?.messages;
  const members = chatData?.members;
  const otherUser = members?.find((member) => member.id !== user.id);

  function scrollToBottom(behavior = "smooth") {
    const element = messagesRef.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior });
  }

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
  }, [chatId, user, fetcher.data]);

  useEffect(() => {
    // auto scroll to bottom (newest and message form)
    scrollToBottom("auto");
  }, [chatData]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages?.length]);

  if (errors.includes("messages")) {
    return (
      <div className={styles.messagesErrorContainer}>
        <p>There was an error getting the chat. Please try again later.</p>
      </div>
    );
  }

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
      <ul
        className={styles.messagesUl}
        style={{ paddingBottom: `${ulPaddingBottom + 32}px` }}
        ref={messagesRef}
      >
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
      <MessageForm
        key={`${fetcher.data?.data?.id}${chatId}`}
        fetcher={fetcher}
        messageFormRef={messageFormRef}
        errors={errors}
        setErrors={setErrors}
        setUlPaddingBottom={setUlPaddingBottom}
        chatId={chatId}
        user={user}
      />
    </>
  );
};

export { Chat };
