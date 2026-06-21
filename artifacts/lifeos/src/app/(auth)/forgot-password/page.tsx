import { Link } from "wouter";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <Link href="/login" className="mb-10 text-sm text-muted-foreground hover:text-foreground">
          ← Back to sign in
        </Link>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
