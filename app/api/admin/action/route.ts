import { NextResponse } from "next/server";
import {
  approveJoinApplication,
  rejectJoinApplication,
  updateDemandStatus,
} from "@/lib/db";

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "管理员密码不正确。" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const action = String(body.action ?? "");
    const id = String(body.id ?? "");

    if (!id) {
      return NextResponse.json({ message: "缺少记录 ID。" }, { status: 400 });
    }

    if (action === "approve-demand") await updateDemandStatus(id, "active");
    else if (action === "reject-demand") await updateDemandStatus(id, "rejected");
    else if (action === "approve-join") await approveJoinApplication(id);
    else if (action === "reject-join") await rejectJoinApplication(id);
    else if (action === "complete-demand") await updateDemandStatus(id, "completed");
    else return NextResponse.json({ message: "未知操作。" }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "操作失败，请稍后再试。" },
      { status: 500 },
    );
  }
}

function isAuthorized(request: Request) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  return Boolean(configuredPassword) && request.headers.get("x-admin-password") === configuredPassword;
}
