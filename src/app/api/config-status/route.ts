import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(process.env.GEMINI_API_KEY?.trim());

  return NextResponse.json(
    { configured },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
