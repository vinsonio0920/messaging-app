import { Link } from "react-router";
import { signUpMobile } from "../assets";
import styles from "./SignUp.module.css";

const SignIn = () => {
  return (
    <div className={styles.signInContainer}>
      <div className={styles.imageContainer}>
        <img
          src={signUpMobile}
          className={styles.signInImage}
          alt="An image of the earth"
          width="500"
        />
      </div>
      <section className={styles.formSection}>
        <h1>Connect to the World</h1>
        <p>
          Start talking to people all around the globe. Be social like we were
          always meant to be.
        </p>
        <form method="POST">
          <div>
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              minLength="3"
              maxLength="254"
              required
            />
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div>
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              minLength="3"
              maxLength="64"
              required
            />
          </div>
          <div>
            <button type="submit">Sign Up</button>
          </div>
        </form>
        <p>
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </section>
    </div>
  );
};

export { SignIn };
