export const EMAIL_TO = "yxbest113@sina.com";

export const patientFields = [
  { key: "name", label: "姓名", type: "text", required: true },
  { key: "age", label: "年龄", type: "number", required: true, min: 18, max: 50 },
  { key: "sex", label: "性别", type: "select", required: true, options: ["男", "女"] },
  { key: "clinicNo", label: "门诊就诊号", type: "text", required: true },
  { key: "side", label: "患侧", type: "select", required: true, options: ["左", "右"] },
  { key: "surgeryStatus", label: "是否手术", type: "select", required: true, options: ["是", "否"] },
  { key: "surgeryDate", label: "手术时间", type: "date", required: true },
  { key: "assessmentDate", label: "评测时间", type: "date", required: true, readOnly: true }
];

export const ikdcItems = [
  {
    id: "ikdc_pain",
    text: "您最大程度的疼痛程度是多少？",
    options: [
      ["无疼痛", 10],
      ["轻微", 8],
      ["中度", 6],
      ["严重", 4],
      ["极度疼痛", 0]
    ]
  },
  {
    id: "ikdc_stiff_swollen",
    text: "在您的膝关节或腿部，您是否有僵硬或肿胀的感觉？",
    options: [
      ["无", 10],
      ["轻度", 8],
      ["中度", 6],
      ["严重", 4],
      ["极度", 0]
    ]
  },
  {
    id: "ikdc_locking",
    text: "您的膝关节是否出现“交锁”或“卡住”？",
    note: "文档未标明分值，系统按“无=10，有=0”计入IKDC标准化总分。",
    options: [
      ["无", 10],
      ["有", 0]
    ]
  },
  {
    id: "ikdc_instability",
    text: "您的膝关节是否出现不稳感、“打软腿”或“要跪下去”的感觉？",
    note: "文档未标明分值，系统按“无=10，有=0”计入IKDC标准化总分。",
    options: [
      ["无", 10],
      ["有", 0]
    ]
  },
  ...["上楼", "下楼", "膝伸直时负重", "跪地", "下蹲"].map((text, index) => ({
    id: `ikdc_daily_${index + 1}`,
    text,
    options: [
      ["总是受限", 0],
      ["经常受限", 1],
      ["有时受限", 2],
      ["很少受限", 3],
      ["从不受限", 4]
    ]
  })),
  ...["跑步（直线）", "跳跃并落地", "转身和旋转", "停止和起动"].map((text, index) => ({
    id: `ikdc_sport_${index + 1}`,
    text,
    options: [
      ["极度受限", 0],
      ["非常受限", 2],
      ["中度受限", 4],
      ["轻度受限", 6],
      ["完全不受限", 8]
    ]
  })),
  {
    id: "ikdc_self",
    text: "如果10分代表伤前/患病前膝关节功能完全正常，0分代表无法进行任何日常活动，您会给现在的功能打几分？",
    options: Array.from({ length: 11 }, (_, value) => [`${value}分`, value])
  }
];

export const lysholmItems = [
  {
    id: "lysholm_limp",
    text: "跛行",
    options: [
      ["无跛行", 5],
      ["轻度或间歇性：长时间或剧烈运动后出现", 3],
      ["重度或持续性：一直存在", 0]
    ]
  },
  {
    id: "lysholm_support",
    text: "支撑",
    options: [
      ["不需要：行走时不需要支撑物", 5],
      ["手杖或拐杖：行走时需要支撑物", 2],
      ["不能承重：行走时完全不能承重", 0]
    ]
  },
  {
    id: "lysholm_locking",
    text: "交锁",
    options: [
      ["无交锁或无卡顿感", 15],
      ["有卡顿感但无真正交锁", 10],
      ["偶尔交锁，自己能解锁", 6],
      ["经常交锁，需就医解锁", 2],
      ["体检时交锁", 0]
    ]
  },
  {
    id: "lysholm_instability",
    text: "不稳",
    options: [
      ["从不打软", 25],
      ["仅剧烈运动或竞技时偶尔不稳", 20],
      ["一般运动时经常不稳", 15],
      ["日常活动时偶尔不稳", 10],
      ["日常活动时经常不稳", 5],
      ["每一步都不稳", 0]
    ]
  },
  {
    id: "lysholm_pain",
    text: "疼痛",
    options: [
      ["无任何疼痛", 25],
      ["仅剧烈运动时轻微疼痛", 20],
      ["剧烈运动时明显疼痛", 15],
      ["行走超过2公里后疼痛", 10],
      ["行走不足2公里后疼痛", 5],
      ["持续疼痛", 0]
    ]
  },
  {
    id: "lysholm_swelling",
    text: "肿胀",
    options: [
      ["无肿胀", 10],
      ["剧烈运动后肿胀", 6],
      ["日常运动后肿胀", 2],
      ["持续肿胀", 0]
    ]
  },
  {
    id: "lysholm_stairs",
    text: "上楼",
    options: [
      ["上下楼正常，无任何困难", 10],
      ["轻度困难，需要扶扶手或稍微注意", 6],
      ["每一步都困难", 2],
      ["无法上楼", 0]
    ]
  },
  {
    id: "lysholm_squat",
    text: "下蹲",
    options: [
      ["可以轻松下蹲", 5],
      ["轻度困难，但能完成", 4],
      ["膝关节弯曲不能超过90度", 2],
      ["极度困难且伴有疼痛", 1],
      ["无法下蹲", 0]
    ]
  }
];

export const tegnerOptions = [
  [10, "竞技体育：足球（国家或国际级）"],
  [9, "竞技体育：足球（低级联赛）、冰球、摔跤、体操等"],
  [8, "竞技体育：球拍运动、田径、摩托车越野赛、羽毛球等；娱乐体育：足球、冰球、篮球等"],
  [7, "竞技体育：网球、跑步等；娱乐体育：球拍运动、田径、摩托车越野赛、手球、篮球等"],
  [6, "娱乐体育：网球、篮球、手球、跑步等；体力工作：建筑、林业、采矿等"],
  [5, "娱乐体育：自行车、越野滑雪等；繁重工作"],
  [4, "娱乐体育：跑步、平地网球，每周至少2-5次；中度体力工作"],
  [3, "娱乐体育：骑行、越野滑雪，每周最多2-3次；轻体力工作"],
  [2, "娱乐体育：平地跑步、骑行等，偶尔进行；轻度工作"],
  [1, "娱乐体育：仅限游泳、平地步行等；久坐工作"],
  [0, "病休/残疾：因膝关节问题无法工作或运动"]
];

export const aclRsiItems = [
  "您对膝关节能否完全恢复有信心吗？",
  "在未来的运动中，您担心会再次受伤吗？",
  "您相信受伤的膝关节能够承受运动的要求吗？",
  "您担心膝关节会在运动中突然“垮掉”吗？",
  "当您做运动时，您会想到受伤的膝关节吗？",
  "您对膝关节的功能满意吗？",
  "您害怕在运动时扭伤膝关节吗？",
  "您对膝关节在不同运动场景下的表现有信心吗？",
  "您担心需要限制运动来保护膝关节吗？",
  "您对膝关节的外观（肿胀等）感到困扰吗？",
  "您害怕在运动时膝关节会再次受伤吗？",
  "您对能够恢复到受伤前的运动水平乐观吗？"
].map((text, index) => ({
  id: `acl_rsi_${index + 1}`,
  text,
  reversed: [2, 4, 5, 7, 9, 10, 11].includes(index + 1),
  options: Array.from({ length: 11 }, (_, i) => {
    const value = i * 10;
    return [`${value}`, value];
  })
}));

export const vasItem = {
  id: "vas",
  text: "VAS疼痛评分",
  options: Array.from({ length: 11 }, (_, value) => [`${value}`, value])
};

export const allScaleItems = [
  ...ikdcItems.map((item) => ({ ...item, scale: "IKDC" })),
  ...lysholmItems.map((item) => ({ ...item, scale: "Lysholm" })),
  ...aclRsiItems.map((item) => ({ ...item, scale: "ACL-RSI" })),
  { ...vasItem, scale: "VAS" }
];

const round1 = (value) => Math.round(value * 10) / 10;

export function maxScore(item) {
  return Math.max(...item.options.map((option) => option[1]));
}

export function selectedScore(item, value) {
  if (value === "" || value == null) return null;
  const numeric = Number(value);
  const option = item.options.find((candidate) => Number(candidate[1]) === numeric);
  return option ? Number(option[1]) : null;
}

export function selectedLabel(item, value) {
  const numeric = Number(value);
  const option = item.options.find((candidate) => Number(candidate[1]) === numeric);
  return option ? option[0] : "";
}

export function classifyLysholm(score) {
  if (score >= 95) return "优秀";
  if (score >= 84) return "良好";
  if (score >= 65) return "一般";
  return "差";
}

export function classifyVas(score) {
  if (score === 0) return "无痛";
  if (score <= 3) return "轻度疼痛";
  if (score <= 6) return "中度疼痛";
  return "重度疼痛";
}

export function classifyAclRsi(score) {
  return score > 75 ? "心理上已准备好重返运动" : "心理准备度仍需关注";
}

export function calculateScores(answers) {
  const ikdcAnswered = ikdcItems
    .map((item) => ({ item, value: selectedScore(item, answers[item.id]) }))
    .filter(({ value }) => value !== null);
  const ikdcRaw = ikdcAnswered.reduce((sum, row) => sum + row.value, 0);
  const ikdcMax = ikdcAnswered.reduce((sum, row) => sum + maxScore(row.item), 0);
  const ikdc = ikdcMax ? round1((ikdcRaw / ikdcMax) * 100) : null;

  const lysholmAnswered = lysholmItems
    .map((item) => selectedScore(item, answers[item.id]))
    .filter((value) => value !== null);
  const lysholm = lysholmAnswered.length
    ? lysholmAnswered.reduce((sum, value) => sum + value, 0)
    : null;
  const tegnerCurrent = answers.tegner_current === "" || answers.tegner_current == null ? null : Number(answers.tegner_current);
  const tegnerPreinjury = answers.tegner_preinjury === "" || answers.tegner_preinjury == null ? null : Number(answers.tegner_preinjury);

  const aclScores = aclRsiItems
    .map((item) => {
      const raw = selectedScore(item, answers[item.id]);
      if (raw === null) return null;
      return item.reversed ? 100 - raw : raw;
    })
    .filter((value) => value !== null);
  const aclRsi = aclScores.length ? round1(aclScores.reduce((sum, value) => sum + value, 0) / aclScores.length) : null;
  const aclRsiRaw = aclScores.length ? round1(aclScores.reduce((sum, value) => sum + value / 10, 0)) : null;

  const vas = selectedScore(vasItem, answers.vas);

  return {
    ikdc: { score: ikdc, raw: ikdcRaw, max: ikdcMax, label: ikdc === null ? "" : `${ikdc}/100` },
    lysholm: { score: lysholm, max: 100, label: lysholm === null ? "" : classifyLysholm(lysholm) },
    tegner: {
      score: tegnerCurrent,
      preinjury: tegnerPreinjury,
      label: tegnerCurrent === null ? "" : `${tegnerCurrent}/10`
    },
    aclRsi: {
      score: aclRsi,
      raw: aclRsiRaw,
      max: 100,
      rawMax: 120,
      label: aclRsi === null ? "" : classifyAclRsi(aclRsi)
    },
    vas: { score: vas, max: 10, label: vas === null ? "" : classifyVas(vas) }
  };
}

export function buildAnswerDetails(answers) {
  const details = [];
  for (const item of allScaleItems) {
    const raw = selectedScore(item, answers[item.id]);
    if (raw === null) continue;
    const finalScore = item.scale === "ACL-RSI" && item.reversed ? 100 - raw : raw;
    details.push({
      scale: item.scale,
      itemId: item.id,
      question: item.text,
      selectedLabel: selectedLabel(item, answers[item.id]),
      rawScore: raw,
      finalScore,
      reversed: Boolean(item.reversed)
    });
  }

  for (const key of ["tegner_current", "tegner_preinjury"]) {
    if (answers[key] === "" || answers[key] == null) continue;
    const score = Number(answers[key]);
    const option = tegnerOptions.find(([value]) => value === score);
    details.push({
      scale: "Tegner",
      itemId: key,
      question: key === "tegner_current" ? "当前活动水平" : "受伤前/发病前活动水平",
      selectedLabel: option ? option[1] : `${score}`,
      rawScore: score,
      finalScore: score,
      reversed: false
    });
  }

  return details;
}

export function validatePatient(patient) {
  const missing = patientFields
    .filter((field) => field.required)
    .filter((field) => field.key !== "surgeryDate" || patient.surgeryStatus !== "否")
    .filter((field) => patient[field.key] === "" || patient[field.key] == null)
    .map((field) => field.label);
  const age = Number(patient.age);
  if (patient.age !== "" && (Number.isNaN(age) || age < 18 || age > 50)) {
    missing.push("年龄需为18-50岁");
  }
  return missing;
}

export function validateAnswers(answers) {
  const required = [
    ...ikdcItems.map((item) => item.id),
    ...lysholmItems.map((item) => item.id),
    "tegner_current",
    ...aclRsiItems.map((item) => item.id),
    "vas"
  ];
  return required.filter((key) => answers[key] === "" || answers[key] == null);
}
