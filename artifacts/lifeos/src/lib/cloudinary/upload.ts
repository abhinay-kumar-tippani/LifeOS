import { getSupabaseClient } from "@/lib/supabase/client";

export async function uploadFileToApi(file: File): Promise<{ url: string; publicId?: string }> {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const fd = new FormData();
  fd.append("file", file);

  const apiBase = import.meta.env.VITE_API_URL ?? "";
  const res = await fetch(`${apiBase}/api/upload`, {
    method: "POST",
    body: fd,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const json = (await res.json()) as { url?: string; publicId?: string; error?: string };
  if (!res.ok || !json.url) {
    throw new Error(json.error ?? "Upload failed");
  }
  return { url: json.url, publicId: json.publicId };
}
