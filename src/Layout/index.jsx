// import Header from "./Header";
import { Outlet } from "react-router-dom";
import styles from "./layout.module.scss";

export default function Layout() {
  return (
    <div className={styles.layout}>
      {/* <Header className={styles["layout__header"]} /> */}
      <main className={styles["layout__content"]}>
        <div className={styles["layout__content-inner"]}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
