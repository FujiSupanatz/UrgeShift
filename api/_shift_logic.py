import json
import os
import re
import urllib.error
import urllib.request


ACTIONS = {
    "first": {
        "mode": "เริ่มช่วยทันที / No-context first move",
        "text": "ขยับออกไป 20 ก้าว",
        "subtext": "Move 20 steps away. ยังไม่ต้องตัดสินใจอะไรตอนนี้",
    },
    "downshift": {
        "mode": "ลดให้เล็กลง / Too hard downshift",
        "text": "หันออกจากทางเข้า จับโทรศัพท์สองมือ หายใจหนึ่งครั้ง",
        "subtext": "This still counts. เล็กลงคือจุดประสงค์",
    },
    "different": {
        "mode": "เปลี่ยนวิธี / Different move",
        "text": "วางอะไรสักอย่างคั่นระหว่างคุณกับสิ่งกระตุ้น",
        "subtext": "A door, table, water bottle. เพิ่มแรงเสียดทานนิดเดียวพอ",
    },
    "water": {
        "mode": "แรงน้อยก็ทำได้ / Low-effort next move",
        "text": "ซื้อน้ำก่อน ยังไม่ต้องสัญญาอะไร",
        "subtext": "Delay by 10 minutes. แค่ก้าวถัดไป ไม่ใช่ทั้งชีวิต",
    },
    "harm": {
        "mode": "ลดอันตราย / Harm-reduction mode",
        "text": "โอเค งั้นทำ 10 นาทีถัดไปให้ปลอดภัยขึ้นก่อน",
        "subtext": "Pick one safer move. ไม่มีการสอน ไม่มีการดุ",
    },
    "crisis": {
        "mode": "ขอคนช่วย / Crisis gate",
        "text": "เรื่องนี้ควรมีคนจริงอยู่ด้วย ไม่ใช่คุยกับแอปต่อ",
        "subtext": "If you may not stay safe, contact emergency support or someone nearby now.",
    },
}

BUDDY_DRAFT = (
    "Hey, I'm trying to get through a craving for 10 minutes.\n"
    "Can you stay with me by chat?\n"
    "No need to fix anything.\n\n"
    "เฮ้ เราขอให้ช่วยอยู่เป็นเพื่อน 10 นาทีได้ไหม\n"
    "ตอนนี้กำลังพยายามผ่าน urge อยู่\n"
    "ไม่ต้องแก้ปัญหา แค่อยู่ด้วยก็พอ"
)

CRISIS_WORDS = ["kill myself", "suicide", "overdose", "can't stay safe", "hurt myself"]
NEEDS_PERSON_WORDS = ["need a person", "ขอคนช่วย", "stay with me", "help me"]
ALLOWED_EVENTS = {
    "start",
    "checkin",
    "done",
    "too-hard",
    "different",
    "person",
    "anyway",
    "crumb",
    "harm",
}

TYPHOON_BASE_URL = os.environ.get("TYPHOON_BASE_URL", "https://api.opentyphoon.ai/v1")
TYPHOON_MODEL = os.environ.get("TYPHOON_MODEL", "typhoon-v2.5-30b-a3b-instruct")
TYPHOON_TIMEOUT_SECONDS = float(os.environ.get("TYPHOON_TIMEOUT_SECONDS", "8"))


def read_json(handler):
    length = int(handler.headers.get("content-length") or 0)
    if length == 0:
        return {}

    try:
        return json.loads(handler.rfile.read(length).decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}


def send_json(handler, payload, status=200):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def choose_action(payload):
    event = payload.get("event") if payload.get("event") in ALLOWED_EVENTS else "start"
    value = payload.get("value").lower() if isinstance(payload.get("value"), str) else ""
    blocker = payload.get("blocker").lower() if isinstance(payload.get("blocker"), str) else ""
    urgency = payload.get("urgency").lower() if isinstance(payload.get("urgency"), str) else ""
    requested_help = payload.get("requested_help").lower() if isinstance(payload.get("requested_help"), str) else ""

    if event == "checkin":
        if "ไม่ไหวแล้ว" in urgency or "เสี่ยง" in urgency or "คนอยู่ด้วย" in requested_help:
            return ACTIONS["crisis"]
        if "เงียบ" in requested_help:
            return ACTIONS["downshift"]
        if "แผน" in requested_help:
            return ACTIONS["water"]
        return ACTIONS["first"]

    if event == "too-hard" or "too hard" in blocker:
        return ACTIONS["downshift"]
    if event == "different" or "wrong vibe" in blocker:
        return ACTIONS["different"]
    if event == "anyway" or "still want it" in value or "still want it" in blocker:
        return ACTIONS["harm"]
    if event == "person" or "need person" in value:
        return ACTIONS["crisis"]
    if event == "done" or event == "harm":
        return ACTIONS["water"]

    return ACTIONS["first"]


def crisis_status(text):
    lowered = text.lower() if isinstance(text, str) else ""
    if any(word in lowered for word in CRISIS_WORDS):
        return "crisis"
    if any(word in lowered for word in NEEDS_PERSON_WORDS):
        return "needs_person"
    return "safe"


def extract_json_object(text):
    if not isinstance(text, str):
        return None

    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if not match:
            return None

    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return None


def call_typhoon_json(messages, fallback, max_tokens=280):
    api_key = os.environ.get("TYPHOON_API_KEY")
    if not api_key:
        return fallback

    body = {
        "model": TYPHOON_MODEL,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": max_tokens,
    }
    request = urllib.request.Request(
        f"{TYPHOON_BASE_URL.rstrip('/')}/chat/completions",
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=TYPHOON_TIMEOUT_SECONDS) as response:
            result = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, KeyError):
        return fallback

    content = (
        result.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
    )
    parsed = extract_json_object(content)
    return parsed if isinstance(parsed, dict) else fallback


def llm_recommend_action(payload):
    fallback_action = choose_action(payload)
    fallback = {"action": fallback_action, "source": "rule-fallback"}
    safe_payload = {
        "event": payload.get("event"),
        "value": payload.get("value"),
        "urge": payload.get("urge"),
        "energy": payload.get("energy"),
        "blocker": payload.get("blocker"),
        "mode": payload.get("mode"),
    }
    result = call_typhoon_json(
        [
            {
                "role": "system",
                "content": (
                    "You are UrgeShift's stateless crisis-aware intervention selector. "
                    "Return only JSON. Do not include markdown. Do not store, recall, or ask for identity. "
                    "Choose one safe next action for a low-energy user. Avoid therapy language. "
                    "Use Thai-English UX copy. Output schema: "
                    '{"action":{"mode":"...","text":"...","subtext":"..."},"reason":"..."}'
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "available_action_examples": ACTIONS,
                        "current_signal": safe_payload,
                        "constraints": [
                            "The action must be low effort.",
                            "If the user needs a person or safety risk is implied, route to crisis/person support.",
                            "If user says they will do it anyway, use harm reduction.",
                            "No judgment, no diagnosis, no persistence.",
                        ],
                    },
                    ensure_ascii=False,
                ),
            },
        ],
        fallback,
    )

    action = result.get("action")
    if not isinstance(action, dict):
        return fallback_action

    mode = action.get("mode")
    text = action.get("text")
    subtext = action.get("subtext")
    if not all(isinstance(value, str) and value.strip() for value in [mode, text, subtext]):
        return fallback_action

    return {
        "mode": mode.strip(),
        "text": text.strip(),
        "subtext": subtext.strip(),
    }


def llm_buddy_draft(payload=None):
    fallback = {"draft": BUDDY_DRAFT, "source": "rule-fallback"}
    result = call_typhoon_json(
        [
            {
                "role": "system",
                "content": (
                    "You write UrgeShift buddy bridge drafts. Return only JSON. "
                    "Do not auto-send, do not ask for identity, and do not mention stored data. "
                    "Draft should be short, natural, not embarrassing, and bilingual English + Thai. "
                    'Output schema: {"draft":"..."}'
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "goal": "Ask a trusted person to stay with the user by chat for 10 minutes.",
                        "constraints": [
                            "No lecture.",
                            "No diagnosis.",
                            "No pressure to explain.",
                            "Keep user in control.",
                        ],
                    },
                    ensure_ascii=False,
                ),
            },
        ],
        fallback,
    )

    draft = result.get("draft")
    return draft.strip() if isinstance(draft, str) and draft.strip() else BUDDY_DRAFT


def llm_crisis_status(text):
    deterministic_status = crisis_status(text)
    if deterministic_status == "crisis":
        return deterministic_status

    fallback = {"status": deterministic_status, "source": "rule-fallback"}
    result = call_typhoon_json(
        [
            {
                "role": "system",
                "content": (
                    "Classify an UrgeShift safety signal. Return only JSON. "
                    "Valid status values: safe, needs_person, crisis. "
                    "Use crisis only for self-harm, suicide, overdose, or inability to stay safe. "
                    'Output schema: {"status":"safe|needs_person|crisis"}'
                ),
            },
            {
                "role": "user",
                "content": json.dumps({"text": text if isinstance(text, str) else ""}, ensure_ascii=False),
            },
        ],
        fallback,
        max_tokens=80,
    )

    status = result.get("status")
    return status if status in {"safe", "needs_person", "crisis"} else deterministic_status
