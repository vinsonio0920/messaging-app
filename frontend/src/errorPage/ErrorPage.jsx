import { Link } from "react-router";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div>
        <h1>Error 404</h1>
        <p>
          This page does not exist. <Link to="/">Go back to the homepage</Link>
        </p>
      </div>
    </div>
  );
};

export { ErrorPage };
