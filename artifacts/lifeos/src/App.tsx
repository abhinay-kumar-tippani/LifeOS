import { Switch, Route, Router as WouterRouter } from "wouter";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";

import HomePage from "@/app/page";
import LoginPage from "@/app/(auth)/login/page";
import SignupPage from "@/app/(auth)/signup/page";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";
import CallbackPage from "@/pages/auth/CallbackPage";
import DashboardLayout from "@/app/(dashboard)/layout";
import DashboardPage from "@/app/(dashboard)/dashboard/page";
import HabitsPage from "@/app/(dashboard)/habits/page";
import TasksPage from "@/app/(dashboard)/tasks/page";
import MatrixPage from "@/app/(dashboard)/matrix/page";
import GoalsPage from "@/app/(dashboard)/goals/page";
import JournalPage from "@/app/(dashboard)/journal/page";
import PomodoroPage from "@/app/(dashboard)/pomodoro/page";
import AnalyticsPage from "@/app/(dashboard)/analytics/page";
import SettingsPage from "@/app/(dashboard)/settings/page";
import OnboardingPage from "@/app/(dashboard)/onboarding/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import NotFoundPage from "@/app/(dashboard)/not-found";

function DashboardRoute({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/callback" component={CallbackPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/onboarding">
        <DashboardRoute><OnboardingPage /></DashboardRoute>
      </Route>
      <Route path="/dashboard">
        <DashboardRoute><DashboardPage /></DashboardRoute>
      </Route>
      <Route path="/habits">
        <DashboardRoute><HabitsPage /></DashboardRoute>
      </Route>
      <Route path="/tasks">
        <DashboardRoute><TasksPage /></DashboardRoute>
      </Route>
      <Route path="/matrix">
        <DashboardRoute><MatrixPage /></DashboardRoute>
      </Route>
      <Route path="/goals">
        <DashboardRoute><GoalsPage /></DashboardRoute>
      </Route>
      <Route path="/journal">
        <DashboardRoute><JournalPage /></DashboardRoute>
      </Route>
      <Route path="/journal/:id">
        <DashboardRoute><JournalPage /></DashboardRoute>
      </Route>
      <Route path="/pomodoro">
        <DashboardRoute><PomodoroPage /></DashboardRoute>
      </Route>
      <Route path="/analytics">
        <DashboardRoute><AnalyticsPage /></DashboardRoute>
      </Route>
      <Route path="/settings">
        <DashboardRoute><SettingsPage /></DashboardRoute>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster richColors position="top-center" />
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

export default App;
