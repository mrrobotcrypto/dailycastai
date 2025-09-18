import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Hello with Images</h1>
      <Image src="/next.svg" alt="Next logo" width={100} height={100} />
      <Image src="/vercel.svg" alt="Vercel logo" width={100} height={100} />
    </div>
  );
}
