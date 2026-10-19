import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";

// make sure to domPurify user messages!
// also sort messages by date desc!
const Chat = () => {
  const user = useOutletContext();
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [errors, setErrors] = useState([]);

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
          setMessages(result.data);
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

  return <div>Testing...</div>;
};

export { Chat };
