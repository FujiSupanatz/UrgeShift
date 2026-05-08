import { NextResponse } from "next/server";
import { detectSafetyRisk } from "../../../../lib/urgeshift/safety.js";

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function POST(request) {
  const body = await readJson(request);
  const safety = detectSafetyRisk({
    freeSignal: body.text,
    typedSignal: body.text,
  });

  return NextResponse.json({
    status: safety.crisis ? "crisis" : "safe",
    reasons: safety.reasons,
  });
}
