"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useUser();
  const supabase = getSupabaseClient();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [pomo, setPomo] = useState("25");
  const [showArchived, setShowArchived] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [uploading, setUploading] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

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

  async function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
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
    toast.success("Preferences saved locally");
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

  async function deleteAccount() {
    if (!user) return;
    toast.error("Delete account requires a Supabase Edge Function or admin API. Contact support.");
    setDelOpen(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="Settings" description="Profile, preferences, and account security." />

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="avatar">Avatar</Label>
            <Input id="avatar" type="file" accept="image/*" className="mt-1" onChange={onAvatar} />
            {uploading ? <Loader2 className="mt-2 h-4 w-4 animate-spin" /> : null}
          </div>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={profile?.email ?? ""} disabled className="mt-1" />
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
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Toggle light / dark (stored in theme)</p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
              aria-label="Dark mode"
            />
          </div>
          <Button onClick={savePrefs} variant="secondary" aria-label="Save preferences">
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
            <p className="text-sm">Show archived habits in analytics (local)</p>
            <Switch checked={showArchived} onCheckedChange={setShowArchived} aria-label="Show archived" />
          </div>
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
          <Button variant="secondary" onClick={changePassword} aria-label="Change password">
            Change password
          </Button>
          <Button variant="destructive" onClick={() => setDelOpen(true)} aria-label="Delete account">
            Delete account
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Cloudinary:{" "}
            {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
              <span className="text-emerald-400">configured ({process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME})</span>
            ) : (
              <span className="text-amber-400">set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</span>
            )}
          </p>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={delOpen}
        onOpenChange={setDelOpen}
        title="Delete account?"
        description="This demo cannot erase auth users from the client. Use the Supabase dashboard or an admin API."
        confirmLabel="I understand"
        destructive
        onConfirm={deleteAccount}
      />
    </div>
  );
}
