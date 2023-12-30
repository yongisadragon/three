import Paragraph from "../components/Paragraph";

const paragraph = " Lorem ipsum dolor sit amet consectetur, adipisicing elit. ";

export default function Home() {
  return (
    <main>
      <div style={{ height: "100vh" }}></div>
      <Paragraph value={paragraph} />
      <div style={{ height: "100vh" }}></div>
    </main>
  );
}
