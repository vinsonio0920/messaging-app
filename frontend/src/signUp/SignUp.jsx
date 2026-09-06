import { Link } from "react-router";
import { logoSvg, signUpMobile } from "../assets";
import styles from "./SignUp.module.css";

const SignUp = () => {
  return (
    <div className={styles.signInContainer}>
      <div className={styles.imageContainer}>
        <div className={styles.logoContainer}>
          <img src={logoSvg} width="40" height="40" alt="Logo" />
          <span>Message</span>
        </div>
        <img
          src={signUpMobile}
          className={styles.signInImage}
          alt="An image of the earth"
          width="500"
        />
      </div>
      <section className={styles.formSection}>
        <div className={styles.formContainer}>
          <h1>Connect to the World</h1>
          <p>
            The advent of the internet has connected us more than the biggest of
            expectations. Join in on the fun and create an account.
          </p>
          <form method="POST">
            <div>
              <label htmlFor="email">Email</label>
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
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <div>
              <label htmlFor="username">Username</label>
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
          <p className={styles.signInPara}>
            Already have an account? <Link to="/sign-in">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export { SignUp };
