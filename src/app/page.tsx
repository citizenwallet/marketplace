import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, Link2Icon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mt-8">
        <h1>Marketplace</h1>
        <p>A simple marketplace for your community currency</p>
        <div className="mt-8">
          <Button>
            <Link href={process.env.DISCORD_INVITE_URL ?? "/"}>
              <span className="flex items-center gap-2">
                Launch my own marketplace{" "}
                <ExternalLinkIcon className="w-4 h-4" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
