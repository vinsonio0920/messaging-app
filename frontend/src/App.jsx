import { Link, Outlet } from "react-router";
import { logoSvg } from "./assets/index.js";
import styles from "./App.module.css";
import { useEffect, useState } from "react";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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
      .catch(() => setError(true));
  }, []);

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
    setShowOverlay(!showOverlay);
  }

  function handleOverlayClick() {
    setShowSidebar(!showSidebar);
    setShowOverlay(!showOverlay);
  }

  function handleProfileDropdownClick() {
    setShowProfileDropdown(!showProfileDropdown);
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
      setError(true);
    }
  }

  if (error) {
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
      <nav
        className={`${styles.navbar} ${showSidebar ? styles.showSidebar : styles.hideSidebar}`}
      >
        <ul>
          <li className={styles.logoLi}>
            <Link to="/" className={styles.logoLink}>
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
              <li>
                <Link to="/" className={styles.homeLink}>
                  <span
                    className={`material-symbols-outlined ${styles.homeIcon}`}
                  >
                    home
                  </span>
                  <span className={styles.sidebarText}>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/">
                  <img
                    src="https://birdlifedata.blob.core.windows.net/species-images/22697748.jpg"
                    alt="Profile picture"
                    width="32"
                    className={styles.profilePicture}
                  />
                  <p className={styles.sidebarText}>Random Kasinski</p>
                </Link>
              </li>
              <li>
                <p className={`${styles.emptyChatsPara} ${styles.sidebarText}`}>
                  You have no chats right now.
                </p>
              </li>
              <li>
                <button type="button" className={styles.createButton}>
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
        <Outlet />
      </main>
      <div
        className={`overlay ${showOverlay ? "showOverlay" : ""}`}
        onClick={handleOverlayClick}
      ></div>
    </div>
  );
}

export { App };
