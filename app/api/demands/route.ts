import { NextResponse } from "next/server";
import { createDemand } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentPeople = Number(body.currentPeople);
    const targetPeople = Number(body.targetPeople);

    if (!Number.isFinite(currentPeople) || !Number.isFinite(targetPeople) || currentPeople >= targetPeople) {
      return NextResponse.json(
        { message: "目标人数要大于当前人数，这样才方便继续找拼课搭子哦。" },
        { status: 400 },
      );
    }

    await createDemand({
      area: String(body.area ?? ""),
      ageRange: String(body.ageRange ?? ""),
      courseCategory: String(body.courseCategory ?? ""),
      courseDetail: String(body.courseDetail ?? ""),
      courseGoal: String(body.courseGoal ?? ""),
      availableTime: String(body.availableTime ?? ""),
      duration: String(body.duration ?? ""),
      currentPeople,
      targetPeople,
      budget: String(body.budget ?? ""),
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
