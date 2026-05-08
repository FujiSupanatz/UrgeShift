import { NextResponse } from "next/server";
import { classifyCrisisWithLlm } from "../../../../lib/urgeshift/llm.js";

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function POST(request) {
  const body = await readJson(request);
  const result = await classifyCrisisWithLlm({
    text: body.text,
  });

  return NextResponse.json({
    status: result.status,
    source: "typhoon-next-stateless",
    llm: result.llm,
  });
}
