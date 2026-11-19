import styles from "./ChatForm.module.css";

const ChatForm = () => {
  return (
    <div className={`${styles.chatFormContainer} chatFormContainer`}>
      <div className={styles.chatDiv}>
        <h1>New Chat</h1>
        <form className={styles.chatForm}>
          <input />
        </form>
      </div>
    </div>
  );
};

export { ChatForm };
