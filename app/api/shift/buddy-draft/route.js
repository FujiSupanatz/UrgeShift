import { NextResponse } from "next/server";
import { respondToShift } from "../../../../lib/urgeshift/planEngine.js";

export async function POST() {
  const result = respondToShift({
    response: "person",
    context: {
      blocker: "need person",
    },
  });

  return NextResponse.json({
    draft: result.buddyDraft,
    action: result.action,
    saveAllowed: false,
  });
}
