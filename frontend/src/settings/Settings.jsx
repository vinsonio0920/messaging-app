import { useEffect, useState } from "react";
import styles from "./Settings.module.css";
import { useFetcher, useOutletContext } from "react-router";

const Settings = () => {
  const fetcher = useFetcher();
  const user = useOutletContext();
  const [errors, setErrors] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState(
    localStorage.getItem("profileUsername") ?? "",
  );
  const [profile, setProfile] = useState(
    localStorage.getItem("profileImage") ?? null,
  );
  const [makeDefaultProfile, setMakeDefaultProfile] = useState(false);

  let formError = null;
  let profileError = false;

  if (fetcher.data?.errors) {
    formError = fetcher.data?.errors[0].msg;
  } else if (errors.includes("fileType")) {
    formError = "Only image files are accepted";
    profileError = true;
  } else if (errors.includes("fileSize")) {
    formError = "File must not exceed 2 MB";
    profileError = true;
  } else if (errors.includes("reader")) {
    formError = "There was an error reading the file. Please try again later";
    profileError = true;
  }

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
          if (!localStorage.getItem("profileUsername")) {
            setUsername(user?.username);
            localStorage.setItem("profileUsername", user?.username);
          }
          if (!localStorage.getItem("profileImage")) {
            setProfile(user?.profile);
            localStorage.setItem("profileImage", user?.profile);
          }
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
    localStorage.setItem("profileUsername", event.target.value);
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
      localStorage.setItem("profileImage", e.target.result);
      setMakeDefaultProfile(false);
    };
    reader.onerror = () => {
      setErrors((prevState) => [...prevState, "reader"]);
    };

    reader.readAsDataURL(file);
  }

  function handleProfileRemoveClick() {
    setProfile(import.meta.env.VITE_DEFAULT_PROFILE_URL);
    localStorage.removeItem("profileImage");
    setMakeDefaultProfile(true);
  }

  function handleResetClick() {
    // reset back to user's information
    setUsername(user.username);
    localStorage.setItem("profileUsername", user.username);
    setProfile(user?.profile);
    localStorage.setItem("profileImage", user?.profile);
    setMakeDefaultProfile(false);
  }

  if (errors.includes("userInfo")) {
    return (
      <div className={styles.fetchErrorContainer}>
        <p>
          There was an error getting the user information. Please try again
          later.
        </p>
      </div>
    );
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
                className={
                  fetcher.data?.errors?.find(
                    (error) => error.path === "username",
                  ) && styles.invalid
                }
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
            <div className={styles.profileContainer}>
              <img
                src={profile}
                width="50"
                alt="Your profile picture"
                className={`${styles.profilePicture} ${profileError && styles.invalidProfile}`}
              />
              {profile !== import.meta.env.VITE_DEFAULT_PROFILE_URL && (
                <button
                  type="button"
                  className={styles.profileRemove}
                  aria-label="Remove profile picture"
                  onClick={handleProfileRemoveClick}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
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
          <input
            id="makeDefaultProfile"
            name="makeDefaultProfile"
            type="hidden"
            value={makeDefaultProfile}
          />
          <input
            id="previousUsername"
            name="previousUsername"
            type="hidden"
            value={user.username}
          />
        </div>
        <div className={styles.formErrorContainer}>
          {formError && <p>{formError}</p>}
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
