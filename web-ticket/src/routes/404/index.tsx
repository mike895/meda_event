import { Link } from "react-router-dom";
import styles from "./style.module.css";
export default function Custom404() {
  return (
    <div id={styles["notfound"]}>
      <div className={styles["notfound"]}>
        <div className={styles["notfound-404"]}></div>
        <h1>404</h1>
        <h2>{"Oops! Page Not Found"}</h2>
        <p>
          {`Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable`}
        </p>
        <Link to="/">{"Back to Home"}</Link>
      </div>
    </div>
  );
}
