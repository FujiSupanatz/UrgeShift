import { NextResponse } from "next/server";
import { buddyDraft as fallbackBuddyDraft } from "../../../../lib/urgeshift/actions.js";
import { createBuddyDraftWithLlm } from "../../../../lib/urgeshift/llm.js";

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function POST(request) {
  const body = await readJson(request);
  const result = await createBuddyDraftWithLlm({
    fallbackDraft: fallbackBuddyDraft,
    blocker: body.blocker,
    urge: body.urge,
    energy: body.energy,
  });

  return NextResponse.json({
    draft: result.draft,
    source: "typhoon-next-stateless",
    saveAllowed: false,
    llm: result.llm,
  });
}
