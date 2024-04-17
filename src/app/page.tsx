import { Posts } from "@/components/posts";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mt-8">
        <h1>Marketplace</h1>
        <p>A simple marketplace for your community currency</p>
      </div>
    </main>
  );
}
