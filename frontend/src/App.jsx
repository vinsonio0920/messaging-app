import { Link, Outlet } from "react-router";
import { logoSvg } from "./assets/index.js";
import styles from "./App.module.css";
import { useState } from "react";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  function handleSidebarClick() {
    setShowSidebar(!showSidebar);
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
            <img
              src="https://i.pinimg.com/236x/13/74/20/137420f5b9c39bc911e472f5d20f053e.jpg"
              alt="Your profile picture"
              width="40"
              className={styles.profilePicture}
            />
            <p className={styles.sidebarText}>Test Profile</p>
            <button
              type="button"
              className={`${styles.dropdownButton} ${styles.sidebarText}`}
            >
              <span
                className={`material-symbols-outlined ${styles.dropdownIcon}`}
              >
                keyboard_arrow_down
              </span>
            </button>
            {/* profile settings here */}
          </li>
        </ul>
      </nav>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}

export { App };
