"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z
  .object({
    full_name: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords must match",
    path: ["confirm"],
  });

type Values = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const supabase = getSupabaseClient();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", password: "", confirm: "" },
  });

  async function onSubmit(values: Values) {
    setFormError(null);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.full_name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/callback`,
      },
    });
    if (error) {
      setFormError(error.message);
      return;
    }
    setEmailSent(true);
  }

  async function signInGoogle() {
    setFormError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback?next=/dashboard`,
      },
    });
    if (error) setFormError(error.message);
  }

  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-6">
        <div className="text-5xl">📧</div>
        <div className="flex flex-col gap-2 max-w-sm">
          <h2 className="text-2xl font-bold text-white">
            Check your email
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            We sent a confirmation link to your email address.
            Click the link in the email to activate your
            LifeOS account and get started.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Did not receive it? Check your spam or junk folder.
          </p>
        </div>
        
        <a
          href="/login"
          className="text-indigo-400 hover:text-indigo-300 text-sm underline underline-offset-4 transition-colors cursor-pointer"
        >
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8 rounded-2xl border border-border/60 bg-card/50 p-8 shadow-2xl backdrop-blur-md">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Start your LifeOS workspace.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="signup-name">Full name</FormLabel>
                <FormControl>
                  <Input id="signup-name" autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="signup-email">Email</FormLabel>
                <FormControl>
                  <Input id="signup-email" type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="signup-password">Password</FormLabel>
                <FormControl>
                  <Input id="signup-password" type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="signup-confirm">Confirm password</FormLabel>
                <FormControl>
                  <Input id="signup-confirm" type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting} aria-label="Create account">
            {form.formState.isSubmitting ? "Creating…" : "Create account"}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-gray-600 text-xs">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={signInGoogle}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors duration-150 cursor-pointer"
        aria-label="Sign up with Google"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
          <path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.5V5.43H1.83a8 8 0 0 0 0 7.14z"/>
          <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8 8 0 0 0 1.83 5.43L4.5 7.5a4.77 4.77 0 0 1 4.48-3.92z"/>
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
