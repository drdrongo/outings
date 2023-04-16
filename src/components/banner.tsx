import styles from "./banner.module.css";

const Banner: React.FC = () => {
  /*
  Banner should be a tall thing with a call to action, right?
  */
  return (
    <section className={styles.banner}>
      <div className={styles.firstHalf}>
        <h1 className={styles.header}>Find your next favorite movie</h1>
      </div>
      <div className={styles.secondHalf}></div>
    </section>
  );
};

export default Banner;
