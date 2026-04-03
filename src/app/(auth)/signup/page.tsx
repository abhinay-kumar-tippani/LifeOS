import Link from "next/link";
import { SignupFormDynamic } from "@/components/auth/AuthFormsDynamic";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f] dark">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <Link href="/" className="mb-10 text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
        <SignupFormDynamic />
      </div>
    </div>
  );
}
