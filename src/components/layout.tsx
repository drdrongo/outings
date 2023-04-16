import { ReactNode } from "react";
import styles from "./layout.module.css";
import Navbar from "./navbar";
import Footer from "./footer";

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

export default function Layout({ children }: Props) {
  return (
    <div className={styles.container}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
