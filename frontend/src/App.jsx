import { Link, Outlet } from "react-router";
import { logoSvg } from "./assets/index.js";
import styles from "./App.module.css";
import { useEffect, useState } from "react";
import { MessageForm } from "./messageForm/MessageForm.jsx";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSidebarOverlay, setShowSidebarOverlay] = useState(false);
  const [showFormOverlay, setShowFormOverlay] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [errors, setErrors] = useState([]);

  // Checks if the user is signed in
  useEffect(() => {
    const url = `${import.meta.env.VITE_SERVER_URL}/check-authentication`;
    const jwtToken = localStorage.getItem("jwtToken");

    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        jwtToken: jwtToken,
      }),
    })
      .then((response) => response.json())
      .then((response) => setUser(response))
      .catch(() => setErrors((prevState) => [...prevState, "auth"]));
  }, []);

  // fetch all user chats for list
  // also update chat after user made friends!
  useEffect(() => {
    if (!user) return;

    async function fetchChats() {
      try {
        // also add auth bearer token here later
        const url = `${import.meta.env.VITE_SERVER_URL}/chats`;

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
          setChats(result.data);
        } else {
          throw new Error("Error fetching the chats!");
        }
      } catch (error) {
        console.error(error);
        setErrors((prevState) => [...prevState, "chats"]);
      }
    }

    fetchChats();
  }, [user]);

  // remove dropdown on any click that isn't the profile's
  useEffect(() => {
    window.addEventListener("click", (event) => {
      if (
        event.target.dataset.type !== "profile" &&
        event.target.parentNode.dataset.type !== "profile"
      ) {
        setShowProfileDropdown(false);
      }
    });
  }, []);

  function handleSidebarClick() {
    setShowSidebar(!showSidebar);
    setShowSidebarOverlay(!showSidebarOverlay);
  }

  function handleSidebarOverlayClick() {
    setShowSidebarOverlay(false);
    setShowSidebar(false);
  }

  function handleFormOverlayClick() {
    setShowMessageForm(false);
    setShowFormOverlay(false);
  }

  function handleProfileDropdownClick() {
    setShowProfileDropdown(!showProfileDropdown);
  }

  function handleAddMessageClick() {
    setShowMessageForm(true);
    setShowFormOverlay(true);
  }

  function handleSidebarLiClick() {
    setShowSidebarOverlay(false);
    setShowSidebar(false);
  }

  async function handleSignOutClick() {
    const url = `${import.meta.env.VITE_SERVER_URL}/sign-out`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      const result = await response.json();

      if (result.status === "success") {
        // remove jwtToken on localStorage and update user state
        localStorage.removeItem("jwtToken");
        setUser(false);
      } else {
        console.error(result);
        return result;
      }
    } catch {
      setErrors(true);
    }
  }

  if (errors && errors.includes("auth")) {
    return (
      <div className={styles.errorContainer}>
        <p>
          There was an error with the authentication check. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {showMessageForm && <MessageForm user={user} />}
      <nav
        className={`${styles.navbar} ${showSidebar ? styles.showSidebar : styles.hideSidebar}`}
      >
        <ul>
          <li className={styles.logoLi}>
            <Link
              to="/"
              className={styles.logoLink}
              onClick={handleSidebarLiClick}
            >
              <img src={logoSvg} width="40" height="40" alt="Logo" />
              <span className={styles.sidebarText}>Message</span>
            </Link>
            <button
              type="button"
              className={styles.sidebarButton}
              onClick={handleSidebarClick}
            >
              <span
                className={`material-symbols-outlined ${styles.sidebarIcon}`}
              >
                <span className={styles.menuIcon}>menu</span>
                <span className={styles.openSidebarIcon}>
                  arrow_forward_ios
                </span>
                <span className={styles.closeSidebarIcon}>arrow_back_ios</span>
              </span>
            </button>
          </li>
          <li className={styles.messagesParentLi}>
            <ul className={styles.messagesUl}>
              <li onClick={handleSidebarLiClick}>
                <Link to="/" className={styles.homeLink}>
                  <span
                    className={`material-symbols-outlined ${styles.homeIcon}`}
                  >
                    home
                  </span>
                  <span className={styles.sidebarText}>Home</span>
                </Link>
              </li>
              {errors.includes("chats") && (
                <li className={styles.chatsError}>
                  <span
                    className={`material-symbols-outlined ${styles.errorIcon}`}
                  >
                    error
                  </span>
                  <span className={styles.sidebarText}>
                    There was an error getting the chats. Please try again
                    later.
                  </span>
                </li>
              )}
              {chats.length > 0
                ? chats.map((chat) => {
                    const userInfo = chat.members.filter(
                      (member) => member.id !== user.id,
                    )[0];
                    return (
                      <li key={userInfo.id} onClick={handleSidebarLiClick}>
                        <Link to={`/chats/${chat.id}`}>
                          <img
                            src={userInfo.profile}
                            alt={`${userInfo.username}'s profile picture`}
                            width="32"
                            className={styles.profilePicture}
                          />
                          <p className={styles.sidebarText}>
                            {userInfo.username}
                          </p>
                        </Link>
                      </li>
                    );
                  })
                : !errors.includes("chats") && (
                    <li>
                      <p
                        className={`${styles.emptyChatsPara} ${styles.sidebarText}`}
                      >
                        You have no chats right now.
                      </p>
                    </li>
                  )}
              <li>
                <button
                  type="button"
                  className={styles.createButton}
                  onClick={handleAddMessageClick}
                >
                  <span
                    className={`material-symbols-outlined ${styles.createIcon}`}
                  >
                    add
                  </span>
                  <span className={styles.sidebarText}>Create a new chat</span>
                </button>
              </li>
            </ul>
          </li>
          <li className={styles.profileLi}>
            {user ? (
              <div className={styles.profileContainer}>
                <button
                  type="button"
                  data-type="profile"
                  className={`${styles.dropdownButton} ${styles.signedInButton}`}
                  onClick={handleProfileDropdownClick}
                >
                  <img
                    src={user.profile}
                    alt="Your profile picture"
                    width="40"
                    className={styles.profilePicture}
                  />
                  <p className={styles.sidebarText}>{user.username}</p>
                  <span
                    className={`material-symbols-outlined ${styles.dropdownIcon} ${styles.sidebarText}`}
                  >
                    keyboard_arrow_down
                  </span>
                </button>
                <ul
                  className={`${styles.profileDropdown} ${showProfileDropdown ? null : styles.hidden}`}
                >
                  <li>
                    <button
                      type="button"
                      data-type="profile"
                      onClick={handleSignOutClick}
                    >
                      <span
                        className={`material-symbols-outlined ${styles.signOutIcon}`}
                      >
                        logout
                      </span>
                      Sign out
                    </button>
                  </li>
                  <li>
                    <Link to="/settings" className={styles.settingsLink}>
                      <span
                        className={`material-symbols-outlined ${styles.settingsIcon}`}
                      >
                        settings
                      </span>
                      Settings
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className={`${styles.dropdownButton} ${styles.notSignedInButton}`}
              >
                <span
                  className={`material-symbols-outlined ${styles.signInIcon}`}
                >
                  login
                </span>
                <p className={styles.sidebarText}>Sign in</p>
              </Link>
            )}
          </li>
        </ul>
      </nav>
      <main className={styles.mainContent}>
        <Outlet context={user} />
      </main>
      <div
        className={`overlay ${showSidebarOverlay ? "showOverlay" : ""}`}
        onClick={handleSidebarOverlayClick}
      ></div>
      <div
        className={`form-overlay ${showFormOverlay ? "showOverlay" : ""}`}
        onClick={handleFormOverlayClick}
      ></div>
    </div>
  );
}

export { App };
