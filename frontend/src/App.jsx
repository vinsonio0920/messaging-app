import { Link } from "react-router";
import { logoSvg } from "./assets/index.js";

function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <div>
              <img src={logoSvg} width="40" height="40" alt="Logo" />
              <Link to="/">Message</Link>
            </div>
          </li>
          <li>
            <Link to="/">
              <span className="material-symbols-outlined">home</span>
              Home
            </Link>
          </li>
          <li className="messagesList">
            <ul>
              <li>
                <img
                  src="https://birdlifedata.blob.core.windows.net/species-images/22697748.jpg"
                  alt="Profile picture"
                  width="40"
                />
                <p>Random Kasinski</p>
              </li>
              <li>You have no messages right now.</li>
              <li>
                <button type="button">
                  <span className="material-symbols-outlined">add</span>
                  Create a new chat
                </button>
              </li>
            </ul>
          </li>
          <li>
            <img src="" alt="Your profile picture" width="40" />
            <p>Test Profile</p>
            <span className="material-symbols-outlined">
              keyboard_arrow_down
            </span>
            {/* profile settings here */}
          </li>
        </ul>
      </nav>
    </>
  );
}

export { App };
