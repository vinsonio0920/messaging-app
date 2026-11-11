import { useEffect, useState } from "react";
import styles from "./Settings.module.css";
import { useFetcher, useOutletContext } from "react-router";

const Settings = () => {
  const fetcher = useFetcher();
  const user = useOutletContext();
  const [errors, setErrors] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user) return;

    async function fetchUserInfo() {
      try {
        const url = `${import.meta.env.VITE_SERVER_URL}/users/${user.id}`;

        const response = await fetch(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          },
        });
        const result = await response.json();

        if (result.status === "success") {
          setUserInfo(result.data);
          setUsername(user?.username);
        } else {
          throw new Error("Error fetching the user info.");
        }
      } catch (error) {
        console.error(error);
        setErrors((prevState) => [...prevState, "userInfo"]);
      }
    }

    fetchUserInfo();
  }, [user]);

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleImageChange(event) {}

  return (
    <div className={styles.settingsContainer}>
      <div>
        <h1>Profile Settings</h1>
        <p>Update your picture and username</p>
      </div>
      <form className={styles.settingsForm}>
        <div className={styles.fieldsContainer}>
          <div>
            <div className={styles.fieldContainer}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                required
                minLength="3"
                maxLength="64"
                onChange={handleUsernameChange}
              />
            </div>
            <div className={styles.fieldContainer}>
              <label htmlFor="email">Email</label>
              <div className={styles.readOnlyContainer}>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={userInfo?.email ?? ""}
                  required
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            </div>
            <div className={styles.fieldContainer}>
              <label htmlFor="password">Password</label>
              <div className={styles.readOnlyContainer}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={userInfo?.password ?? ""}
                  required
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            </div>
          </div>
          <div className={styles.imageSection}>
            <img
              src={userInfo?.profile}
              width="50"
              alt="Your profile picture"
              className={styles.profilePicture}
            />
            <label htmlFor="image" className={styles.imageLabel}>
              Upload a picture
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className={`visually-hidden`}
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <button type="button" className={styles.resetButton}>
            Reset changes
          </button>
          <button type="submit">Save changes</button>
        </div>
      </form>
    </div>
  );
};

export { Settings };
