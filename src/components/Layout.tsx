import { ReactNode } from "react";
import styles from "./Layout.module.css";
import Footer from "./Footer";
import clsx from 'clsx';

interface Props {
  children?: ReactNode;
  className?: string;
}

export default function Layout({ children, className }: Props) {
  return (
    <div className={styles.heroContainer} >
      <div className={clsx(styles.contentContainer, className)}>
        {children}
      </div>

      <Footer />
    </div>
  );
}
