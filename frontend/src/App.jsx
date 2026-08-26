import { Link, Outlet } from "react-router";
import { logoSvg } from "./assets/index.js";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <ul>
          <li className={styles.logoLi}>
            <Link to="/" className={styles.logoLink}>
              <img src={logoSvg} width="40" height="40" alt="Logo" />
              <span>Message</span>
            </Link>
            <button type="button" className={styles.logoButton}>
              <span className={`material-symbols-outlined ${styles.logoIcon}`}>
                menu
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
                  Home
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
                  <p>Random Kasinski</p>
                </Link>
              </li>
              <li>
                <p className={styles.emptyChatsPara}>
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
                  Create a new chat
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
            <p>Test Profile</p>
            <button type="button" className={styles.dropdownButton}>
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
