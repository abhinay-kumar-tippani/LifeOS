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

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
