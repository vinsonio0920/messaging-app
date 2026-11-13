import { useEffect, useState } from "react";
import styles from "./Settings.module.css";
import { useFetcher, useOutletContext } from "react-router";

const Settings = () => {
  const fetcher = useFetcher();
  const user = useOutletContext();
  const [errors, setErrors] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);

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
          setProfile(user?.profile);
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

  function handleProfileChange(event) {
    const file = event.target.files[0];

    if (!file.type.startsWith("image"))
      return setErrors((prevState) => [...prevState, "fileType"]);
    if (file.size > 2097152)
      return setErrors((prevState) => [...prevState, "fileSize"]);

    const reader = new FileReader();
    reader.onload = (e) => {
      setProfile(e.target.result);
    };
    reader.onerror = () => {
      setErrors((prevState) => [...prevState, "reader"]);
    };

    reader.readAsDataURL(file);
  }

  function handleResetClick() {
    // reset back to user's information
    setUsername(user.username);
    setProfile(user?.profile);
  }

  return (
    <div className={styles.settingsContainer}>
      <div>
        <h1>Profile Settings</h1>
        <p>Update your picture and username</p>
      </div>
      <fetcher.Form method="PUT" className={styles.settingsForm}>
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
              src={profile}
              width="50"
              alt="Your profile picture"
              className={styles.profilePicture}
            />
            <label htmlFor="profileInput" className={styles.profileLabel}>
              Upload a picture
            </label>
            <input
              id="profileInput"
              name="profileInput"
              type="file"
              accept="image/*"
              className={`visually-hidden`}
              onChange={handleProfileChange}
            />
          </div>
        </div>
        <div>
          <input
            id="profile"
            name="profile"
            type="hidden"
            value={profile ?? ""}
          />
          <input
            id="userId"
            name="userId"
            type="hidden"
            value={user?.id ?? ""}
          />
        </div>
        <div className={styles.buttonsContainer}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleResetClick}
          >
            Reset changes
          </button>
          <button type="submit">Save changes</button>
        </div>
      </fetcher.Form>
    </div>
  );
};

export { Settings };
