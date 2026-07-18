import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: "Cloudinary credentials missing in environment" },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Math.round(new Date().getTime() / 1000).toString();

    // Cloudinary signed upload requires sorted params (timestamp in this case) + API secret
    const stringToSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

    const cloudinaryFormData = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    cloudinaryFormData.append("file", blob, file.name);
    cloudinaryFormData.append("api_key", apiKey);
    cloudinaryFormData.append("timestamp", timestamp);
    cloudinaryFormData.append("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudinaryFormData,
    });

    const data = await response.json();
    if (data.error) {
      return NextResponse.json({ success: false, error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: data.secure_url });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
