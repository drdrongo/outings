import { ReactNode } from "react";
import styles from "./Layout.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface Props {
  children?: ReactNode;
  className?: string;
  // any props that come into the component
}

export default function Layout({ children, className }: Props) {
  return (
    <div className={styles.heroContainer}>
      {/* <Navbar /> */}
      <div className={[styles.contentContainer, className].filter(cl => cl && cl.length > 0).join(' ')}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
