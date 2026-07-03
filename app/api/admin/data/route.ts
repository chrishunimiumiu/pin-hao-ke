import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/db";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "管理员密码不正确。" }, { status: 401 });
  }

  try {
    const data = await getAdminData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "读取失败，请稍后再试。" },
      { status: 500 },
    );
  }
}

function isAuthorized(request: Request) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  return Boolean(configuredPassword) && request.headers.get("x-admin-password") === configuredPassword;
}
