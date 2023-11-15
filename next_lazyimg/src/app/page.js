import styles from "./page.module.css";
import ImagePixelisation from "./components/imagePixelisation";
export default function Home() {
  return (
    <>
      <main className={styles.main}>
        {[...Array(10).keys()].map((_, i) => {
          return (
            <ImagePixelisation
              src={`/images/${i}.png`}
              src10={`/images/${i}_small.png`}
            />
          );
        })}
      </main>
    </>
  );
}
