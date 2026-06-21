"use client";

import { useOnboardingGate } from "@/lib/hooks/useOnboardingGate";

export function OnboardingGate() {
  useOnboardingGate();
  return null;
}