import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { AuthGuard, PublicOnlyGuard } from "@/components/auth/AuthGuard";
import DashboardLayout from "@/app/(dashboard)/layout";
import OnboardingShell from "@/components/layout/OnboardingShell";

import HomePage from "@/app/page";
import LoginPage from "@/app/(auth)/login/page";
import SignupPage from "@/app/(auth)/signup/page";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";
import CallbackPage from "@/pages/auth/CallbackPage";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import NotFoundPage from "@/app/(dashboard)/not-found";

const DashboardPage = lazy(() => import("@/app/(dashboard)/dashboard/page"));
const HabitsPage = lazy(() => import("@/app/(dashboard)/habits/page"));
const TasksPage = lazy(() => import("@/app/(dashboard)/tasks/page"));
const MatrixPage = lazy(() => import("@/app/(dashboard)/matrix/page"));
const GoalsPage = lazy(() => import("@/app/(dashboard)/goals/page"));
const JournalPage = lazy(() => import("@/app/(dashboard)/journal/page"));
const JournalNewPage = lazy(() => import("@/app/(dashboard)/journal/new/page"));
const JournalDetailPage = lazy(() => import("@/app/(dashboard)/journal/[id]/page"));
const PomodoroPage = lazy(() => import("@/app/(dashboard)/pomodoro/page"));
const AnalyticsPage = lazy(() => import("@/app/(dashboard)/analytics/page"));
const SettingsPage = lazy(() => import("@/app/(dashboard)/settings/page"));
const OnboardingPage = lazy(() => import("@/app/(dashboard)/onboarding/page"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login">
        <PublicOnlyGuard><LoginPage /></PublicOnlyGuard>
      </Route>
      <Route path="/signup">
        <PublicOnlyGuard><SignupPage /></PublicOnlyGuard>
      </Route>
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/callback" component={CallbackPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/onboarding">
        <AuthGuard>
          <OnboardingShell>
            <Suspense fallback={<PageLoader />}><OnboardingPage /></Suspense>
          </OnboardingShell>
        </AuthGuard>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/habits">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><HabitsPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/tasks">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><TasksPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/matrix">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><MatrixPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/goals">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><GoalsPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/journal">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><JournalPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/journal/new">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><JournalNewPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/journal/:id">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><JournalDetailPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/pomodoro">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><PomodoroPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/analytics">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>
        </ProtectedRoute>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ReactQueryProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster richColors position="top-center" />
        </ReactQueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
