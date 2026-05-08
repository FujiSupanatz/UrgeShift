import { NextResponse } from "next/server";
import { createShiftSession } from "../../../../lib/urgeshift/planEngine.js";
import { suggestActivityWithLlm } from "../../../../lib/urgeshift/llm.js";

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function POST(request) {
  const body = await readJson(request);
  const result = createShiftSession(body);

  if (result.safety?.crisis) {
    return NextResponse.json(result);
  }

  const suggestion = await suggestActivityWithLlm({
    context: result.context,
    response: "start",
    fallbackAction: result.action,
  });

  return NextResponse.json({
    ...result,
    action: suggestion.action,
    llm: suggestion.llm,
    reasonCodes: suggestion.llm.used
      ? ["safety-first", "low-effort-first", "shift-now", "llm-activity"]
      : ["safety-first", "low-effort-first", "shift-now"],
  });
}
