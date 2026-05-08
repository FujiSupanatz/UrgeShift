async function postJson(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function recommendShift(payload, fallbackAction) {
  try {
    return await postJson("/api/shift/recommend", payload);
  } catch {
    return { action: fallbackAction };
  }
}

export async function fetchBuddyDraft(fallbackDraft) {
  try {
    const result = await postJson("/api/shift/buddy-draft", {});
    return result.draft || fallbackDraft;
  } catch {
    return fallbackDraft;
  }
}

export async function checkCrisis(text) {
  try {
    return await postJson("/api/shift/crisis-check", { text });
  } catch {
    return { status: "safe" };
  }
}
