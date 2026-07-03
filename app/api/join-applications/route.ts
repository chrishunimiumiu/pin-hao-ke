import { NextResponse } from "next/server";
import { createJoinApplication } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await createJoinApplication({
      demandId: String(body.demandId ?? ""),
      ageRange: String(body.ageRange ?? ""),
      acceptableTime: String(body.acceptableTime ?? ""),
      contact: String(body.contact ?? ""),
      note: String(body.note ?? ""),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "提交失败，请稍后再试。" },
      { status: 500 },
    );
  }
}
