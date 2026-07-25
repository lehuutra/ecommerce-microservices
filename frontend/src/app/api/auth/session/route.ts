import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/server/auth";
import type { SessionResponse } from "@/types/auth";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json<SessionResponse>({ user });
}
