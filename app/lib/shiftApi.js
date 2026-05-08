async function postJson(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function startShiftSession(payload, fallbackAction) {
  try {
    return await postJson("/api/shift/start", payload);
  } catch {
    return { action: fallbackAction, session: { status: "local fallback" } };
  }
}

export async function respondToShift(payload, fallbackAction) {
  try {
    return await postJson("/api/shift/respond", payload);
  } catch {
    return { action: fallbackAction, session: { status: "local fallback" } };
  }
}

export async function createPlanPreview(payload) {
  try {
    return await postJson("/api/plans", payload);
  } catch {
    return {
      saveAllowed: true,
      plan: {
        text: "IF urge moment, THEN use the last helpful move + wait 10 minutes.",
      },
    };
  }
}

export async function recommendShift(payload, fallbackAction) {
  return respondToShift(
    {
      response: payload?.event || "next",
      context: payload,
      selectedOption: payload?.selectedOption,
    },
    fallbackAction,
  );
}

export async function recommendCheckInShift(payload, fallbackAction) {
  try {
    return await postJson("/api/shift/recommend", {
      ...payload,
      event: "checkin",
    });
  } catch {
    return { action: fallbackAction };
  }
}

export async function fetchBuddyDraft(fallbackDraft) {
  const result = await respondToShift(
    {
      response: "person",
      context: {
        blocker: "need person",
      },
    },
    null,
  );

  return result?.buddyDraft || fallbackDraft;
}

export async function checkCrisis(text) {
  const result = await respondToShift(
    {
      response: "typed-signal",
      freeSignal: text,
      context: {
        typedSignal: text,
      },
    },
    null,
  );

  return {
    status: result?.safety?.crisis ? "crisis" : "safe",
    reasons: result?.safety?.reasons || [],
  };
}
