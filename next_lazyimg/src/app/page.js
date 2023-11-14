import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        {[...Array(7).keys()].map((_, i) => {
          return <img src={`/images/${i}.png`} />;
        })}
      </main>
    </>
  );
}
