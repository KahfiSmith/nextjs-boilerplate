import { NextResponse } from "next/server";

import { getHealthStatus } from "@/lib/services/health.service";

export async function GET() {
  const status = await getHealthStatus();

  return NextResponse.json({ data: { status } }, { status: 200 });
}
