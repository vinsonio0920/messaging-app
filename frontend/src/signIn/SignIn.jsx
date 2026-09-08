import { Link } from "react-router";
import { logoSvg } from "../assets";
import styles from "./SignIn.module.css";

const SignIn = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <img src={logoSvg} width="40" height="40" alt="Logo" />
        </div>
        <h1>Sign In</h1>
        <form method="post">
          <div>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Sign in</button>
        </form>
        <p className={styles.signInPara}>
          Don't have an account yet? <Link to="/sign-up">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export { SignIn };
