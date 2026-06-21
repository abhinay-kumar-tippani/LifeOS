export async function uploadFileToApi(file: File): Promise<{ url: string; publicId?: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = (await res.json()) as { url?: string; publicId?: string; error?: string };
  if (!res.ok || !json.url) {
    throw new Error(json.error ?? "Upload failed");
  }
  return { url: json.url, publicId: json.publicId };
}
