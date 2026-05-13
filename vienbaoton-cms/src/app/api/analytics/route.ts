import { NextResponse } from "next/server";
import { computeAnalytics } from "@/lib/analytics";

export const revalidate = 300;

export async function GET() {
  try {
    const data = await computeAnalytics();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Analytics API] Error:", error);
    return NextResponse.json(
      { error: "Failed to compute analytics", details: String(error) },
      { status: 500 }
    );
  }
}
