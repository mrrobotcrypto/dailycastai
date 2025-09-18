import Image from "next/image";

export default function Home() {
  return (
    <div className="test">
      <h1>Hello Tailwind Test</h1>
      <Image src="/next.svg" alt="Next logo" width={100} height={100} />
    </div>
  );
}
