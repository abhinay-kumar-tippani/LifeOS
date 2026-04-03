"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { JournalEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoodSelector } from "./MoodSelector";
import { uploadFileToApi } from "@/lib/cloudinary/upload";
import { Loader2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function JournalEditor({
  entry,
  onSave,
}: {
  entry: JournalEntry | null;
  onSave: (payload: {
    id?: string;
    title: string | null;
    content: string;
    mood: string | null;
    tags: string[];
    image_url: string | null;
    entry_date?: string;
  }) => Promise<{ error: string | null }>;
}) {
  const router = useRouter();
  const draftKey = entry ? `journal-draft-${entry.id}` : "journal-draft-new";
  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [mood, setMood] = useState<string | null>(entry?.mood ?? null);
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(entry?.image_url ?? null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (entry) return;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const d = JSON.parse(raw) as {
          title?: string;
          content?: string;
          mood?: string | null;
          tags?: string[];
          image_url?: string | null;
        };
        if (d.title != null) setTitle(d.title);
        if (d.content != null) setContent(d.content);
        if (d.mood !== undefined) setMood(d.mood);
        if (d.tags) setTags(d.tags);
        if (d.image_url !== undefined) setImageUrl(d.image_url);
      }
    } catch {
      /* ignore */
    }
  }, [draftKey, entry]);

  useEffect(() => {
    if (entry) return;
    const t = setTimeout(() => {
      localStorage.setItem(
        draftKey,
        JSON.stringify({ title, content, mood, tags, image_url: imageUrl }),
      );
    }, 400);
    return () => clearTimeout(t);
  }, [title, content, mood, tags, imageUrl, draftKey, entry]);

  function addTag() {
    const t = tagInput.trim();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput("");
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFileToApi(file);
      setImageUrl(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    const { error } = await onSave({
      id: entry?.id,
      title: title || null,
      content: content.trim() || " ",
      mood,
      tags,
      image_url: imageUrl,
      entry_date: entry?.entry_date,
    });
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    localStorage.removeItem(draftKey);
    toast.success("Saved");
    router.push("/journal");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg font-medium"
        aria-label="Entry title"
      />
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Mood</p>
        <MoodSelector value={mood} onChange={(m) => setMood(m)} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">Tags</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
            >
              {t}
              <button
                type="button"
                aria-label={`Remove tag ${t}`}
                onClick={() => setTags(tags.filter((x) => x !== t))}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Add tag"
            aria-label="New tag"
          />
          <Button type="button" variant="secondary" onClick={addTag}>
            Add
          </Button>
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onUpload}
            aria-label="Upload image"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            aria-label="Upload journal image"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            Image
          </Button>
        </div>
        {imageUrl ? (
          <div className="relative mt-2 aspect-video max-h-64 overflow-hidden rounded-lg border">
            <Image src={imageUrl} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 768px" />
          </div>
        ) : null}
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts…"
        className="min-h-[240px] resize-y"
        aria-label="Journal content"
      />
      <Button onClick={save} disabled={saving} className="w-full sm:w-auto" aria-label="Save entry">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save entry"}
      </Button>
    </div>
  );
}
