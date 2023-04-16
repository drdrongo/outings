import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import { Star } from "@mui/icons-material";
import { Input, TextField } from "@mui/material";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <Link href="/">
        <Image
          src="/images/movie-lab-logos/png/movie-lab-white-no-bg.png"
          width={60}
          height={60}
          alt="MovieLab logo"
          className={styles.logo}
        />
      </Link>

      {/* Searchbar */}
      <div className={styles.searchbar}>
        <input className={styles.searchInput} placeholder="Search" />
      </div>

      {/* Favorites button */}
      <Link href="/favorites">
        <Star />
        <span>Favorites</span>
      </Link>
    </nav>
  );
};

export default Navbar;
