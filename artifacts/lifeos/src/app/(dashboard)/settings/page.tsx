
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { uploadFileToApi } from "@/lib/cloudinary/upload";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { AvatarUpload } from "@/components/settings/AvatarUpload";
import { DataExport } from "@/components/settings/DataExport";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useUser();
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [pomo, setPomo] = useState("25");
  const [showArchived, setShowArchived] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("recovery") === "true") {
      toast.info("Set your new password below");
    }
  }, []);

  useEffect(() => {
    setName(profile?.full_name ?? "");
  }, [profile?.full_name]);

  useEffect(() => {
    const p = localStorage.getItem("lifeos-pomo");
    const a = localStorage.getItem("lifeos-archived");
    if (p) setPomo(p);
    if (a) setShowArchived(a === "1");
  }, []);

  async function saveProfile() {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated");
      refreshProfile?.();
    }
  }

  async function onAvatarFile(file: File) {
    if (!user) return;
    setUploading(true);
    try {
      const { url } = await uploadFileToApi(file);
      const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
      if (error) toast.error(error.message);
      else {
        toast.success("Avatar saved");
        refreshProfile?.();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function savePrefs() {
    localStorage.setItem("lifeos-pomo", pomo);
    localStorage.setItem("lifeos-archived", showArchived ? "1" : "0");
    void queryClient.invalidateQueries({ queryKey: ["analytics"] });
    toast.success("Preferences saved");
  }

  function handleArchivedToggle(checked: boolean) {
    setShowArchived(checked);
    localStorage.setItem("lifeos-archived", checked ? "1" : "0");
    void queryClient.invalidateQueries({ queryKey: ["analytics"] });
  }

  async function changePassword() {
    if (pw.length < 8) {
      toast.error("Password too short");
      return;
    }
    if (pw !== pw2) {
      toast.error("Passwords do not match");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      setPw("");
      setPw2("");
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);

      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setDeleteError("Session error: " + sessionError.message);
        return;
      }

      if (!data.session?.access_token) {
        setDeleteError("No active session found. Please log out and log in again.");
        return;
      }

      const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`;

      const response = await fetch(edgeFunctionUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await supabase.auth.signOut();
        navigate("/");
      } else {
        let errorMessage = "Failed to delete account. Please try again.";
        try {
          const body = await response.json();
          if (body.error) errorMessage = body.error;
        } catch {
          /* ignore */
        }
        setDeleteError(errorMessage);
      }
    } catch {
      setDeleteError("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="Settings" description="Profile, preferences, and account security." />

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AvatarUpload
            name={profile?.full_name}
            email={profile?.email}
            avatarUrl={profile?.avatar_url}
            uploading={uploading}
            onFileSelect={onAvatarFile}
          />
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile?.email ?? ""} disabled className="mt-1" />
            <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>
          <Button onClick={saveProfile} aria-label="Save profile">
            Save profile
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pomo">Default Pomodoro (minutes)</Label>
            <Input id="pomo" value={pomo} onChange={(e) => setPomo(e.target.value)} className="mt-1" />
            <p className="mt-1 text-xs text-muted-foreground">Use 15, 25, or 50. Applied to new focus sessions.</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Toggle light / dark</p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
              aria-label="Dark mode"
            />
          </div>
          <Button onClick={savePrefs} aria-label="Save preferences">
            Save preferences
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Habit preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
            <div>
              <p className="text-sm font-medium">Show archived habits in analytics</p>
              <p className="text-xs text-muted-foreground">Saved locally on this device</p>
            </div>
            <Switch checked={showArchived} onCheckedChange={handleArchivedToggle} aria-label="Show archived habits" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Your data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Download all your data as a single JSON file — habits, journal entries, tasks, goals, and Pomodoro sessions.
          </p>
          <DataExport />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="npw">New password</Label>
            <Input
              id="npw"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="mt-1"
              autoComplete="new-password"
            />
          </div>
          <div>
            <Label htmlFor="npw2">Confirm password</Label>
            <Input
              id="npw2"
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              className="mt-1"
              autoComplete="new-password"
            />
          </div>
          <Button onClick={changePassword} aria-label="Change password">
            Change password
          </Button>
          {deleteError ? <p className="text-sm text-destructive">{deleteError}</p> : null}
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
            Delete account
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete your account?"
        description="This permanently deletes your profile, habits, journal entries, tasks, and Pomodoro history. This cannot be undone."
        confirmLabel={deleting ? "Deleting…" : "Delete account"}
        destructive
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
