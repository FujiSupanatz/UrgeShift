const crisisMatchers = [
  {
    reason: "self-harm",
    patterns: [
      /\bkill myself\b/i,
      /\bsuicide\b/i,
      /\bend my life\b/i,
      /\bhurt myself\b/i,
      /\bcan't stay safe\b/i,
      /\bcannot stay safe\b/i,
      /ฆ่าตัวตาย/i,
      /ทำร้ายตัวเอง/i,
      /ไม่ปลอดภัย/i,
      /อยู่ต่อไม่ไหว/i,
    ],
  },
  {
    reason: "overdose-risk",
    patterns: [
      /\boverdose\b/i,
      /\bod\b/i,
      /\btoo much .* took\b/i,
      /\bcan't wake\b/i,
      /\bcannot wake\b/i,
      /กินยาเกิน/i,
      /ใช้ยาเกิน/i,
      /ปลุกไม่ตื่น/i,
    ],
  },
  {
    reason: "withdrawal-danger",
    patterns: [
      /\bseizure\b/i,
      /\bshaking uncontrollably\b/i,
      /\bwithdrawal\b/i,
      /\bdetox\b/i,
      /ชัก/i,
      /ถอน/i,
      /มือสั่นมาก/i,
    ],
  },
  {
    reason: "immediate-danger",
    patterns: [
      /\bin danger\b/i,
      /\bunsafe right now\b/i,
      /\bbeing followed\b/i,
      /\bsomeone will hurt me\b/i,
      /\bi need help now\b/i,
      /อันตราย/i,
      /โดนตาม/i,
      /ช่วยตอนนี้/i,
    ],
  },
  {
    reason: "abuse-or-coercion",
    patterns: [
      /\bforced me\b/i,
      /\bcoerced\b/i,
      /\babuse\b/i,
      /\bthreatened\b/i,
      /บังคับ/i,
      /ขู่/i,
      /ทำร้าย/i,
    ],
  },
];

function collectText(input = {}) {
  const values = [
    input.freeSignal,
    input.typedSignal,
    input.signal,
    input.message,
    input.text,
    input.context?.freeSignal,
    input.context?.typedSignal,
  ];

  return values
    .filter((value) => typeof value === "string")
    .join(" ")
    .trim();
}

export function detectSafetyRisk(input = {}) {
  const text = collectText(input);
  if (!text) {
    return {
      crisis: false,
      reasons: [],
    };
  }

  const reasons = crisisMatchers
    .filter(({ patterns }) => patterns.some((pattern) => pattern.test(text)))
    .map(({ reason }) => reason);

  return {
    crisis: reasons.length > 0,
    reasons,
  };
}

export function buildHumanCareResponse(safety = { reasons: [] }) {
  return {
    status: "human-care-routing",
    reasons: safety.reasons || [],
    message: "This is bigger than an urge-management moment. Please involve a real person now.",
    options: [
      "Call local emergency services if there is immediate danger.",
      "Contact a trusted person nearby and stay with them.",
      "Use local crisis, medical, or emergency support if you may not stay safe.",
    ],
  };
}
