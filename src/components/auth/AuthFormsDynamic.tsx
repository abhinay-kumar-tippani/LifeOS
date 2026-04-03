"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

/**
 * Password managers and browser extensions often inject attributes (fdprocessedid, inline styles, etc.)
 * into inputs before React hydrates, causing SSR/client HTML mismatches. Loading forms only on the client
 * avoids hydrating those nodes from the server snapshot.
 */
export const LoginFormDynamic = dynamic(
  () => import("./LoginForm").then((m) => ({ default: m.LoginForm })),
  { ssr: false, loading: () => <LoadingSpinner /> },
);

export const SignupFormDynamic = dynamic(
  () => import("./SignupForm").then((m) => ({ default: m.SignupForm })),
  { ssr: false, loading: () => <LoadingSpinner /> },
);
