import { Loader2Icon } from "lucide-react";

export default function GenericLoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 mb-4 space-y-4">
      <Loader2Icon className="w-4 h-4 animate-spin" />
      <div>Loading...</div>
    </div>
  );
}
