import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: config.env.imagekit.publicKey,
  urlEndpoint: config.env.imagekit.urlEndpoint,
  privateKey: config.env.imagekit.privateKey,
});

export async function GET() {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}
