import { Link, useFetcher } from "react-router";
import { logoSvg } from "../assets";
import styles from "./SignIn.module.css";

const InputErrorPara = ({ message }) => {
  console.log(message);
  return <p className={styles.inputErrorPara}>{message}</p>;
};

const SignIn = () => {
  const fetcher = useFetcher();

  const isValid = fetcher.data?.status === "success";

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <img src={logoSvg} width="40" height="40" alt="Logo" />
        </div>
        <h1>Sign In</h1>
        <fetcher.Form method="post" noValidate>
          {fetcher.data && !isValid ? (
            <InputErrorPara message={fetcher.data.errors[0].message} />
          ) : null}
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              className={fetcher.data && !isValid ? styles.invalid : null}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={fetcher.data && !isValid ? styles.invalid : null}
              required
            />
          </div>
          <button type="submit">Sign in</button>
        </fetcher.Form>
        <p className={styles.signInPara}>
          Don't have an account yet? <Link to="/sign-up">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export { SignIn };
