import { Link, useFetcher } from "react-router";
import { logoSvg, signUpMobile } from "../assets";
import styles from "./SignUp.module.css";

const InputErrorPara = ({ message }) => {
  return <p className={styles.inputErrorPara}>{message}</p>;
};

const SignUp = () => {
  const fetcher = useFetcher();

  const formErrors = {};
  fetcher.data?.errors.map((error) => {
    formErrors[error.path] = error.msg;
  });

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
          <fetcher.Form method="POST" noValidate>
            <div className={styles.fieldContainer}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={formErrors["email"] ? styles.invalid : null}
                minLength="3"
                maxLength="254"
                required
              />
              {formErrors["email"] ? (
                <InputErrorPara message={formErrors["email"]} />
              ) : null}
            </div>
            <div className={styles.fieldContainer}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={formErrors["password"] ? styles.invalid : null}
                required
              />
              {formErrors["password"] ? (
                <InputErrorPara message={formErrors["password"]} />
              ) : null}
            </div>
            <div className={styles.fieldContainer}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className={formErrors["username"] ? styles.invalid : null}
                minLength="3"
                maxLength="64"
                required
              />
              {formErrors["username"] ? (
                <InputErrorPara message={formErrors["username"]} />
              ) : null}
            </div>
            <div>
              <button type="submit">Sign Up</button>
            </div>
          </fetcher.Form>
          <p className={styles.signInPara}>
            Already have an account? <Link to="/sign-in">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export { SignUp };
