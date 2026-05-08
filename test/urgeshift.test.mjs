import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createPlan, createShiftSession, respondToShift } from "../lib/urgeshift/planEngine.js";
import {
  classifyCrisisWithLlm,
  createBuddyDraftWithLlm,
  createPlanWithLlm,
  getLlmRuntimeDebug,
  suggestActivityWithLlm,
} from "../lib/urgeshift/llm.js";
import { detectSafetyRisk } from "../lib/urgeshift/safety.js";
import { buddyDraft } from "../lib/urgeshift/actions.js";

describe("UrgeShift backend plan engine", () => {
  it("starts a private session with a no-context first move", () => {
    const result = createShiftSession({});

    assert.equal(result.session.status, "active");
    assert.equal(result.session.privacy, "ephemeral");
    assert.equal(result.action.mode, "No-context first move");
    assert.equal(result.saveAllowed, false);
    assert.ok(Array.isArray(result.ranking));
  });

  it("downshifts when the user says the move is too hard", () => {
    const result = respondToShift({
      response: "too-hard",
      context: {
        blocker: "too hard",
      },
    });

    assert.equal(result.context.blocker, "too hard");
    assert.equal(result.action.category, "downshift");
    assert.ok(result.reasonCodes.includes("downshift"));
  });

  it("switches low-readiness signals into harm-reduction mode", () => {
    const result = respondToShift({
      response: "anyway",
      context: {
        urge: "drink",
        blocker: "still want it",
      },
    });

    assert.equal(result.context.readiness, "low");
    assert.equal(result.action.category, "harm-reduction");
    assert.ok(result.reasonCodes.includes("low-readiness"));
  });

  it("creates a narrow if-then plan from the selected helpful move", () => {
    const result = createPlan({
      context: {
        locationCue: "near store",
        timeContext: "night",
        blocker: "still want it",
      },
      selectedOption: "Buy water too",
      typedSignal: "super secret raw text that must not be saved",
    });

    assert.equal(result.saveAllowed, true);
    assert.equal(result.plan.text, "IF urge moment + night + near store, THEN buy water too + wait 10 minutes.");
    assert.equal(JSON.stringify(result.plan).includes("super secret raw text"), false);
  });

  it("does not invent demo trigger, time, or location when context is blank", () => {
    const result = createPlan({
      selectedOption: "Buy water too",
    });

    assert.equal(result.saveAllowed, true);
    assert.equal(result.plan.text, "IF urge moment, THEN buy water too + wait 10 minutes.");
    assert.equal(result.plan.sourceContext.timeContext, "unknown");
    assert.equal(result.plan.sourceContext.locationCategory, "unknown");
  });

  it("routes crisis signals away from planning", () => {
    const result = createPlan({
      typedSignal: "I can't stay safe",
      context: {
        locationCue: "near store",
      },
    });

    assert.equal(result.saveAllowed, false);
    assert.equal(result.plan, null);
    assert.equal(result.safety.crisis, true);
    assert.equal(result.humanCare.status, "human-care-routing");
  });

  it("detects Thai crisis language", () => {
    const safety = detectSafetyRisk({
      typedSignal: "รู้สึกไม่ปลอดภัยและกลัวว่าจะทำร้ายตัวเอง",
    });

    assert.equal(safety.crisis, true);
    assert.ok(safety.reasons.includes("self-harm"));
  });

  it("prioritizes gambling payment friction for gambling urges", () => {
    const result = respondToShift({
      response: "crumb",
      context: {
        urge: "gamble",
        energy: "tiny action",
      },
    });

    assert.equal(result.action.category, "money-friction");
    assert.ok(result.reasonCodes.includes("urge-gamble"));
  });

  it("falls back to rule-based action when no LLM key is configured", async () => {
    let called = false;
    const fallbackAction = respondToShift({
      response: "crumb",
      context: {
        urge: "scroll",
      },
    }).action;

    const result = await suggestActivityWithLlm(
      {
        context: {
          urge: "scroll",
          energy: "tiny action",
        },
        fallbackAction,
      },
      {
        env: {},
        fetchImpl: async () => {
          called = true;
          return {};
        },
      },
    );

    assert.equal(called, false);
    assert.equal(result.llm.used, false);
    assert.equal(result.llm.reason, "missing-api-key");
    assert.equal(result.action, fallbackAction);
  });

  it("reports resolved runtime env sources without exposing secrets", () => {
    const debug = getLlmRuntimeDebug({
      URGESHIFT_LLM_API_KEY: "top-secret",
      TYPHOON_API_KEY: "unused",
      TYPHOON_BASE_URL: "https://typhoon.example/v1",
      TYPHOON_MODEL: "typhoon-test",
      TYPHOON_TIMEOUT_MS: "4321",
      NODE_ENV: "production",
      VERCEL_ENV: "preview",
      VERCEL_REGION: "sin1",
    });

    assert.equal(debug.hasApiKey, true);
    assert.equal(debug.apiKeySource, "URGESHIFT_LLM_API_KEY");
    assert.equal(debug.baseUrl, "https://typhoon.example/v1");
    assert.equal(debug.baseUrlSource, "TYPHOON_BASE_URL");
    assert.equal(debug.model, "typhoon-test");
    assert.equal(debug.modelSource, "TYPHOON_MODEL");
    assert.equal(debug.timeoutMs, 4321);
    assert.equal(debug.timeoutSource, "TYPHOON_TIMEOUT_MS");
    assert.equal(debug.nodeEnv, "production");
    assert.equal(debug.vercelEnv, "preview");
    assert.equal(debug.vercelRegion, "sin1");
    assert.equal("apiKey" in debug, false);
  });

  it("uses a valid LLM activity suggestion from sanitized context", async () => {
    const fallbackAction = respondToShift({
      response: "crumb",
      context: {
        urge: "drink",
      },
    }).action;

    const result = await suggestActivityWithLlm(
      {
        response: "crumb",
        context: {
          urge: "drink",
          energy: "no talking",
          triggerLabel: "stress",
          locationCue: "exact secret store address",
          typedSignal: "raw text should not be sent",
          avoidCategories: ["move-away"],
          avoidActionTexts: ["Move 20 steps away from where you are."],
        },
        fallbackAction,
      },
      {
        env: {
          URGESHIFT_LLM_API_KEY: "test-key",
          URGESHIFT_LLM_BASE_URL: "https://llm.test/v1",
          URGESHIFT_LLM_MODEL: "test-model",
        },
        fetchImpl: async (_url, request) => {
          const body = JSON.parse(request.body);
          const prompt = body.messages.at(-1).content;
          const promptPayload = JSON.parse(prompt);

          assert.equal(prompt.includes("raw text should not be sent"), false);
          assert.equal(prompt.includes("exact secret store address"), false);
          assert.deepEqual(promptPayload.avoid.categories, ["move-away"]);
          assert.deepEqual(promptPayload.avoid.actionTexts, ["move 20 steps away from where you are."]);
          assert.equal(promptPayload.context.triggerLabel, "stress");

          return {
            ok: true,
            json: async () => ({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      action: {
                        mode: "Safer activity",
                        text: "Walk to the water aisle and hold a cold bottle for 60 seconds.",
                        subtext: "No promise needed. Give your body one cooler cue first.",
                        category: "llm-activity",
                        planStep: "walk to water and hold a cold bottle",
                      },
                      reason: "low effort replacement activity",
                    }),
                  },
                },
              ],
            }),
          };
        },
      },
    );

    assert.equal(result.llm.used, true);
    assert.equal(result.action.category, "llm-activity");
    assert.equal(result.action.planStep, "walk to water and hold a cold bottle");
    assert.equal(result.llm.contextSent.locationCategory, "near store");
  });

  it("rejects moralizing LLM copy and falls back", async () => {
    const fallbackAction = respondToShift({
      response: "crumb",
      context: {
        urge: "drink",
      },
    }).action;

    const result = await suggestActivityWithLlm(
      {
        context: {
          urge: "drink",
        },
        fallbackAction,
      },
      {
        env: {
          URGESHIFT_LLM_API_KEY: "test-key",
        },
        fetchImpl: async () => ({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    action: {
                      mode: "Advice",
                      text: "You should stay strong and don't do it.",
                      subtext: "This is treatment advice.",
                    },
                  }),
                },
              },
            ],
          }),
        }),
      },
    );

    assert.equal(result.llm.used, false);
    assert.equal(result.llm.reason, "invalid-llm-action");
    assert.equal(result.action, fallbackAction);
  });

  it("falls back to rule-based plan when no LLM key is configured", async () => {
    const fallbackPlanResponse = createPlan({
      context: {
        locationCue: "near store",
        timeContext: "night",
      },
      selectedOption: "Buy water too",
    });

    let called = false;
    const result = await createPlanWithLlm(
      {
        fallbackPlanResponse,
        context: fallbackPlanResponse.context,
        selectedOption: "Buy water too",
      },
      {
        env: {},
        fetchImpl: async () => {
          called = true;
          return {};
        },
      },
    );

    assert.equal(called, false);
    assert.equal(result.llm.used, false);
    assert.equal(result.llm.reason, "missing-api-key");
    assert.equal(result.plan.text, fallbackPlanResponse.plan.text);
  });

  it("falls back to the static buddy draft when no LLM key is configured", async () => {
    const result = await createBuddyDraftWithLlm(
      {
        fallbackDraft: buddyDraft,
        blocker: "need person",
      },
      {
        env: {},
        fetchImpl: async () => {
          throw new Error("should not fetch without a key");
        },
      },
    );

    assert.equal(result.draft, buddyDraft);
    assert.equal(result.llm.used, false);
    assert.equal(result.llm.reason, "missing-api-key");
  });

  it("uses a valid LLM buddy draft", async () => {
    const result = await createBuddyDraftWithLlm(
      {
        fallbackDraft: buddyDraft,
        blocker: "need person",
        urge: "drink",
      },
      {
        env: {
          URGESHIFT_LLM_API_KEY: "test-key",
        },
        fetchImpl: async () => ({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    draft: "เฮ้ เรากำลังพยายามผ่านช่วงยากๆ 10 นาทีนี้อยู่ ช่วยอยู่เป็นเพื่อนทางแชตได้ไหม ไม่ต้องแก้อะไร แค่อยู่ด้วยก็พอ",
                    reason: "short relational support",
                  }),
                },
              },
            ],
          }),
        }),
      },
    );

    assert.equal(result.llm.used, true);
    assert.match(result.draft, /อยู่เป็นเพื่อน/);
  });

  it("classifies deterministic crisis signals before calling the LLM", async () => {
    let called = false;
    const result = await classifyCrisisWithLlm(
      {
        text: "I can't stay safe tonight",
      },
      {
        env: {
          URGESHIFT_LLM_API_KEY: "test-key",
        },
        fetchImpl: async () => {
          called = true;
          return {};
        },
      },
    );

    assert.equal(called, false);
    assert.equal(result.status, "crisis");
    assert.equal(result.llm.used, false);
    assert.equal(result.llm.reason, "deterministic-crisis");
  });

  it("uses the LLM for non-deterministic crisis classification", async () => {
    const result = await classifyCrisisWithLlm(
      {
        text: "I need a person with me right now",
      },
      {
        env: {
          URGESHIFT_LLM_API_KEY: "test-key",
        },
        fetchImpl: async () => ({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    status: "needs_person",
                    reason: "support would help but not direct self-harm",
                  }),
                },
              },
            ],
          }),
        }),
      },
    );

    assert.equal(result.status, "needs_person");
    assert.equal(result.llm.used, true);
  });

  it("uses a valid LLM-generated plan from sanitized context", async () => {
    const fallbackPlanResponse = createPlan({
      context: {
        locationCue: "exact secret store address",
        timeContext: "night",
        blocker: "still want it",
        typedSignal: "raw text should not be sent",
      },
      selectedOption: "Buy water too",
    });

    const result = await createPlanWithLlm(
      {
        fallbackPlanResponse,
        context: {
          ...fallbackPlanResponse.context,
          locationCue: "exact secret store address",
          typedSignal: "raw text should not be sent",
        },
        selectedOption: "Buy water too",
      },
      {
        env: {
          URGESHIFT_LLM_API_KEY: "test-key",
          URGESHIFT_LLM_BASE_URL: "https://llm.test/v1",
          URGESHIFT_LLM_MODEL: "test-model",
        },
        fetchImpl: async (_url, request) => {
          const body = JSON.parse(request.body);
          const prompt = body.messages.at(-1).content;

          assert.equal(prompt.includes("raw text should not be sent"), false);
          assert.equal(prompt.includes("exact secret store address"), false);

          return {
            ok: true,
            json: async () => ({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      plan: {
                        title: "Personal 10-minute plan",
                        if: ["stress", "night", "near store"],
                        then: ["buy water too", "walk away from the cue", "wait 10 minutes"],
                        storageNote: "Saved labels only. Raw typed signals are not stored.",
                      },
                      reason: "plan uses the safer option and context labels",
                    }),
                  },
                },
              ],
            }),
          };
        },
      },
    );

    assert.equal(result.llm.used, true);
    assert.equal(result.plan.text, "IF stress + night + near store, THEN buy water too + walk away from the cue + wait 10 minutes.");
    assert.equal(result.plan.sourceContext.locationCategory, "near store");
    assert.equal(JSON.stringify(result.plan).includes("raw text should not be sent"), false);
  });

  it("rejects invalid LLM plans and keeps the fallback plan", async () => {
    const fallbackPlanResponse = createPlan({
      context: {
        locationCue: "near store",
        timeContext: "night",
      },
      selectedOption: "Buy water too",
    });

    const result = await createPlanWithLlm(
      {
        fallbackPlanResponse,
        context: fallbackPlanResponse.context,
        selectedOption: "Buy water too",
      },
      {
        env: {
          URGESHIFT_LLM_API_KEY: "test-key",
        },
        fetchImpl: async () => ({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    plan: {
                      title: "Bad plan",
                      if: ["stress"],
                      then: ["you should stay strong"],
                    },
                  }),
                },
              },
            ],
          }),
        }),
      },
    );

    assert.equal(result.llm.used, false);
    assert.equal(result.llm.reason, "invalid-llm-plan");
    assert.equal(result.plan.text, fallbackPlanResponse.plan.text);
  });
});
