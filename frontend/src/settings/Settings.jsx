import { useEffect, useState } from "react";
import styles from "./Settings.module.css";
import { useFetcher, useOutletContext } from "react-router";

const Settings = () => {
  const fetcher = useFetcher();
  const user = useOutletContext();
  const [errors, setErrors] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

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
        console.log(response);
        const result = await response.json();

        if (result.status === "success") {
          setUserInfo(result.data);
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

  return (
    <>
      <h1>Profile Settings</h1>
      <p>Update your picture and username</p>
      <form>
        <div>
          <div>
            <div>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={userInfo?.username ?? ""}
                required
                minLength="3"
                maxLength="64"
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="text"
                value={userInfo?.email ?? ""}
                required
                readOnly
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={userInfo?.password ?? ""}
                required
                readOnly
              />
            </div>
          </div>
          <div className={styles.imageSection}>
            <img
              src={userInfo?.profile}
              width="50"
              alt="Your profile picture"
              className={styles}
            />
            <label htmlFor="image">Upload a picture</label>
            <input id="image" name="image" type="file" accept="image/*" />
          </div>
        </div>
        <div>
          <button type="button">Reset changes</button>
          <button type="submit">Save changes</button>
        </div>
      </form>
    </>
  );
};

export { Settings };
