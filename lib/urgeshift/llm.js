const bannedCopyPatterns = [
  /\byou should\b/i,
  /\bdon't do it\b/i,
  /\bstay strong\b/i,
  /\byou failed\b/i,
  /\baddict\b/i,
  /\bclean\b/i,
  /\brelapse\b/i,
  /\btreatment\b/i,
  /\bai therapist\b/i,
];

function getLlmConfig(env = process.env) {
  const apiKey = env.URGESHIFT_LLM_API_KEY || env.TYPHOON_API_KEY || env.OPENAI_API_KEY;
  const baseUrl =
    env.URGESHIFT_LLM_BASE_URL ||
    env.TYPHOON_BASE_URL ||
    env.OPENAI_BASE_URL ||
    "https://api.opentyphoon.ai/v1";
  const model =
    env.URGESHIFT_LLM_MODEL ||
    env.TYPHOON_MODEL ||
    env.OPENAI_MODEL ||
    "typhoon-v2.5-30b-a3b-instruct";
  const timeoutMs = Number(env.URGESHIFT_LLM_TIMEOUT_MS || env.TYPHOON_TIMEOUT_MS || 8000);

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
    model,
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 8000,
  };
}

function normalize(value, fallback = "unknown") {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized || fallback;
}

function categorizeLocation(value) {
  const normalized = normalize(value, "unknown");
  if (normalized.includes("store") || normalized.includes("shop") || normalized.includes("ร้าน")) {
    return "near store";
  }
  if (normalized.includes("home") || normalized.includes("บ้าน")) return "at home";
  if (normalized.includes("work") || normalized.includes("office") || normalized.includes("งาน")) {
    return "after work";
  }
  if (normalized.includes("bar") || normalized.includes("pub")) return "near alcohol cue";
  if (normalized === "unknown" || normalized === "none") return "unknown";
  return "other place";
}

export function buildLlmActivityContext(context = {}) {
  return {
    urge: normalize(context.urge),
    energy: normalize(context.energy),
    blocker: normalize(context.blocker, "none"),
    readiness: normalize(context.readiness, "mixed"),
    effort: normalize(context.effort, "standard"),
    triggerLabel: normalize(context.triggerLabel, "urge moment"),
    timeContext: normalize(context.timeContext, "unknown"),
    locationCategory: categorizeLocation(context.locationCue),
    socialState: normalize(context.socialState, "unknown"),
    lastActionCategory: normalize(context.lastActionCategory, "unknown"),
    avoidCategories: normalizeList(context.avoidCategories, 4),
    avoidActionTexts: normalizeList(context.avoidActionTexts, 4),
    helperSpiritId: normalize(context.helperSpiritId, "unknown"),
    helperSpiritTitle: normalize(context.helperSpiritTitle, "unknown"),
    helperSpiritOneLine: normalize(context.helperSpiritOneLine, "unknown"),
    helperSpiritLlmContext: normalize(context.helperSpiritLlmContext, "unknown"),
    situationSummary: normalize(context.situationSummary, "unknown"),
  };
}

function extractJsonObject(text) {
  if (typeof text !== "string") return null;
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function validateActivityAction(action) {
  if (!action || typeof action !== "object") return null;

  const mode = typeof action.mode === "string" ? action.mode.trim() : "";
  const text = typeof action.text === "string" ? action.text.trim() : "";
  const subtext = typeof action.subtext === "string" ? action.subtext.trim() : "";
  const category = typeof action.category === "string" ? action.category.trim() : "llm-activity";
  const planStep = typeof action.planStep === "string" ? action.planStep.trim() : text;
  const joined = `${mode} ${text} ${subtext}`;

  if (!mode || !text || !subtext) return null;
  if (mode.length > 80 || text.length > 180 || subtext.length > 220) return null;
  if (bannedCopyPatterns.some((pattern) => pattern.test(joined))) return null;

  return {
    mode,
    text,
    subtext,
    category,
    planStep: planStep || text,
  };
}

function fallbackResult(fallbackAction, reason) {
  return {
    action: fallbackAction,
    llm: {
      used: false,
      reason,
    },
  };
}

function fallbackPlanResult(fallbackPlanResponse, reason) {
  return {
    ...fallbackPlanResponse,
    llm: {
      used: false,
      reason,
    },
  };
}

function normalizeList(value, maxItems = 4) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, maxItems);
}

function validatePlan(plan, safeContext) {
  if (!plan || typeof plan !== "object") return null;

  const conditions = normalizeList(plan.if, 4);
  const steps = normalizeList(plan.then, 5);
  const title = typeof plan.title === "string" && plan.title.trim()
    ? plan.title.trim().slice(0, 80)
    : "Personal 10-minute plan";
  const storageNote = typeof plan.storageNote === "string" && plan.storageNote.trim()
    ? plan.storageNote.trim().slice(0, 180)
    : "Saved labels only. Raw typed signals are not stored by this API.";

  if (conditions.length === 0 || steps.length === 0) return null;

  const joined = [...conditions, ...steps, title].join(" ");
  if (joined.length > 700) return null;
  if (bannedCopyPatterns.some((pattern) => pattern.test(joined))) return null;

  const uniqueConditions = [...new Set(conditions)];
  const uniqueSteps = [...new Set(steps)];

  return {
    title,
    if: uniqueConditions,
    then: uniqueSteps,
    text: `IF ${uniqueConditions.join(" + ")}, THEN ${uniqueSteps.join(" + ")}.`,
    storageNote,
    sourceContext: safeContext,
  };
}

export async function suggestActivityWithLlm(input = {}, options = {}) {
  const fallbackAction = input.fallbackAction;
  const config = getLlmConfig(options.env);
  const fetchImpl = options.fetchImpl || globalThis.fetch;

  if (!config.apiKey) return fallbackResult(fallbackAction, "missing-api-key");
  if (typeof fetchImpl !== "function") return fallbackResult(fallbackAction, "fetch-unavailable");

  const safeContext = buildLlmActivityContext(input.context || {});
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetchImpl(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        temperature: 0.35,
        max_tokens: 260,
        messages: [
          {
            role: "system",
            content:
              "You are UrgeShift's stateless activity selector. Return only JSON. " +
              "Choose one low-effort safer activity the user can do instead of the addictive or regretted behavior. " +
              "Do not diagnose, shame, moralize, or claim clinical care. Do not ask for identity. " +
              "Do not repeat avoided activities or categories unless safety requires it. " +
              "If readiness is low, prefer delay or harm-reduction activity. " +
              'Output schema: {"action":{"mode":"...","text":"...","subtext":"...","category":"llm-activity","planStep":"..."},"reason":"..."}',
          },
          {
            role: "user",
            content: JSON.stringify({
              context: safeContext,
              currentResponse: input.response || "next",
              avoid: {
                categories: safeContext.avoidCategories,
                actionTexts: safeContext.avoidActionTexts,
                instruction: "Choose a different action and category from the avoided items when possible.",
              },
              constraints: [
                "Act before asking for more context.",
                "The activity must be doable in under 2 minutes.",
                "Use calm peer language.",
                "No raw transcript or exact location is provided.",
                "Never tell the user they are safe.",
                "For start responses, do not repeat the opening move.",
              ],
            }),
          },
        ],
      }),
    });

    if (!response.ok) return fallbackResult(fallbackAction, `http-${response.status}`);

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;
    const parsed = extractJsonObject(content);
    const action = validateActivityAction(parsed?.action);

    if (!action) return fallbackResult(fallbackAction, "invalid-llm-action");

    return {
      action,
      llm: {
        used: true,
        provider: config.baseUrl,
        model: config.model,
        reason: typeof parsed.reason === "string" ? parsed.reason.slice(0, 180) : "activity-generated",
        contextSent: safeContext,
      },
    };
  } catch (error) {
    return fallbackResult(fallbackAction, error?.name === "AbortError" ? "timeout" : "request-failed");
  } finally {
    clearTimeout(timeout);
  }
}

export async function createPlanWithLlm(input = {}, options = {}) {
  const fallbackPlanResponse = input.fallbackPlanResponse;
  const config = getLlmConfig(options.env);
  const fetchImpl = options.fetchImpl || globalThis.fetch;

  if (!config.apiKey) return fallbackPlanResult(fallbackPlanResponse, "missing-api-key");
  if (typeof fetchImpl !== "function") return fallbackPlanResult(fallbackPlanResponse, "fetch-unavailable");

  const safeContext = buildLlmActivityContext(input.context || fallbackPlanResponse?.context || {});
  const fallbackPlan = fallbackPlanResponse?.plan || null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetchImpl(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        temperature: 0.15,
        max_tokens: 320,
        messages: [
          {
            role: "system",
            content:
              "You are UrgeShift's stateless 10-minute if-then plan generator. Return only JSON. " +
              "Create one lightweight plan from sanitized context and the useful action label. " +
              "Do not include raw transcripts, exact locations, diagnosis, shame language, or clinical claims. " +
              'Output schema: {"plan":{"title":"Personal 10-minute plan","if":["..."],"then":["..."],"storageNote":"..."}, "reason":"..."}',
          },
          {
            role: "user",
            content: JSON.stringify({
              context: safeContext,
              usefulAction: input.selectedOption || input.helpedAction || fallbackPlan?.then?.[0] || "use the last helpful move",
              fallbackPlan,
              constraints: [
                "Plan must be IF conditions THEN actions.",
                "Use labels only, not confessions.",
                "No exact address, raw text, substance admission, or crisis statement.",
                "Steps must fit the next 10 minutes.",
                "Prefer safer activity, delay, support, or harm reduction when readiness is low.",
              ],
            }),
          },
        ],
      }),
    });

    if (!response.ok) return fallbackPlanResult(fallbackPlanResponse, `http-${response.status}`);

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;
    const parsed = extractJsonObject(content);
    const plan = validatePlan(parsed?.plan, safeContext);

    if (!plan) return fallbackPlanResult(fallbackPlanResponse, "invalid-llm-plan");

    return {
      ...fallbackPlanResponse,
      saveAllowed: true,
      plan,
      llm: {
        used: true,
        provider: config.baseUrl,
        model: config.model,
        reason: typeof parsed.reason === "string" ? parsed.reason.slice(0, 180) : "plan-generated",
        contextSent: safeContext,
      },
    };
  } catch (error) {
    return fallbackPlanResult(fallbackPlanResponse, error?.name === "AbortError" ? "timeout" : "request-failed");
  } finally {
    clearTimeout(timeout);
  }
}
