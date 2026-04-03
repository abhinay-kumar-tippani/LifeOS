import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${(file as File).type || "application/octet-stream"};base64,${base64}`;

  try {
    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: "lifeos/uploads",
      resource_type: "auto",
    });
    return NextResponse.json({ url: uploaded.secure_url, publicId: uploaded.public_id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
