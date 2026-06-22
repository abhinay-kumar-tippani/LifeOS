"use client";


import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";

export function AvatarUpload({
  name,
  email,
  avatarUrl,
  uploading,
  onFileSelect,
}: {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  uploading: boolean;
  onFileSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initial = (name ?? email ?? "?").slice(0, 1).toUpperCase();

  return (
    <div className="space-y-3">
      <Label>Avatar</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border border-border/60">
          <AvatarImage src={avatarUrl ?? undefined} alt={name ?? "Profile avatar"} />
          <AvatarFallback className="text-lg">{initial}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            id="avatar-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            aria-label="Upload avatar"
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {uploading ? "Uploading…" : "Upload photo"}
          </Button>
          <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Max 5 MB.</p>
        </div>
      </div>
    </div>
  );
}
