export const actions = {
  first: {
    mode: "เริ่มช่วยทันที / No-context first move",
    text: "ขยับออกไป 20 ก้าว",
    subtext: "Move 20 steps away. ยังไม่ต้องตัดสินใจอะไรตอนนี้"
  },
  downshift: {
    mode: "ลดให้เล็กลง / Too hard downshift",
    text: "หันออกจากทางเข้า จับโทรศัพท์สองมือ หายใจหนึ่งครั้ง",
    subtext: "This still counts. เล็กลงคือจุดประสงค์"
  },
  different: {
    mode: "เปลี่ยนวิธี / Different move",
    text: "วางอะไรสักอย่างคั่นระหว่างคุณกับสิ่งกระตุ้น",
    subtext: "A door, table, water bottle. เพิ่มแรงเสียดทานนิดเดียวพอ"
  },
  water: {
    mode: "แรงน้อยก็ทำได้ / Low-effort next move",
    text: "ซื้อน้ำก่อน ยังไม่ต้องสัญญาอะไร",
    subtext: "Delay by 10 minutes. แค่ก้าวถัดไป ไม่ใช่ทั้งชีวิต"
  },
  harm: {
    mode: "ลดอันตราย / Harm-reduction mode",
    text: "โอเค งั้นทำ 10 นาทีถัดไปให้ปลอดภัยขึ้นก่อน",
    subtext: "Pick one safer move. ไม่มีการสอน ไม่มีการดุ"
  },
  crisis: {
    mode: "ขอคนช่วย / Crisis gate",
    text: "เรื่องนี้ควรมีคนจริงอยู่ด้วย ไม่ใช่คุยกับแอปต่อ",
    subtext: "If you may not stay safe, contact emergency support or someone nearby now."
  },
  stopped: {
    mode: "หยุดเซสชัน / Session stopped",
    text: "ไม่ต้องรู้สึกผิด จะออกตอนนี้หรือเริ่มใหม่ก็ได้",
    subtext: "Stopping is user control, not failure."
  }
};

export const crumbSteps = [
  {
    key: "urge",
    prompt: "urge แบบไหน / What kind?",
    options: ["ดื่ม / Drink", "สูบ / Vape", "ไถฟีด / Scroll", "พนัน / Gamble", "อื่นๆ / Other"]
  },
  {
    key: "energy",
    prompt: "แรงตอนนี้ / Energy?",
    options: ["ไม่คุย / No talking", "ทำเล็กๆ / Tiny action", "คุยได้ / Can talk"]
  },
  {
    key: "blocker",
    prompt: "ติดตรงไหน / What blocked you?",
    options: ["ยากเกินไป / Too hard", "ไม่ใช่ / Wrong vibe", "ยังอยากทำ / Still want it", "ขอคนช่วย / Need person"]
  }
];

export const harmReductionMoves = [
  "กินก่อน / Eat first",
  "ซื้อน้ำด้วย / Buy water too",
  "ขยับออกไป / Move away",
  "ตั้งจุดหยุด / Set endpoint",
  "ทักใครสักคน / Message someone"
];

export const buddyDraft =
  "Hey, I'm trying to get through a craving for 10 minutes.\n" +
  "Can you stay with me by chat?\n" +
  "No need to fix anything.\n\n" +
  "เฮ้ เราขอให้ช่วยอยู่เป็นเพื่อน 10 นาทีได้ไหม\n" +
  "ตอนนี้กำลังพยายามผ่าน urge อยู่\n" +
  "ไม่ต้องแก้ปัญหา แค่อยู่ด้วยก็พอ";

export const cadenceLabels = {
  daily: "วันนี้ / Daily",
  everyOtherDay: "วันเว้นวัน / Every other day",
  weekly: "รายสัปดาห์ / Weekly"
};

export function normalize(value) {
  return value.toLowerCase();
}
