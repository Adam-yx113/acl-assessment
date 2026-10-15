import assert from "node:assert/strict";
import test from "node:test";
import {
  aclRsiItems,
  calculateScores,
  classifyLysholm,
  classifyVas,
  ikdcItems,
  lysholmItems,
  validatePatient
} from "../shared/scales.js";

test("IKDC standardizes by answered maximum score", () => {
  const answers = {
    [ikdcItems[0].id]: 8,
    [ikdcItems[1].id]: 6
  };
  const scores = calculateScores(answers);
  assert.equal(scores.ikdc.raw, 14);
  assert.equal(scores.ikdc.max, 20);
  assert.equal(scores.ikdc.score, 70);
});

test("ACL-RSI reverses negative items before averaging", () => {
  const answers = {};
  for (const item of aclRsiItems) {
    answers[item.id] = item.reversed ? 100 : 80;
  }
  const scores = calculateScores(answers);
  const positiveCount = aclRsiItems.filter((item) => !item.reversed).length;
  const expected = (positiveCount * 80) / aclRsiItems.length;
  assert.equal(scores.aclRsi.score, Math.round(expected * 10) / 10);
  assert.equal(scores.aclRsi.raw, Math.round(expected * 1.2 * 10) / 10);
});

test("blank answers do not produce scale scores", () => {
  const scores = calculateScores({});
  assert.equal(scores.ikdc.score, null);
  assert.equal(scores.lysholm.score, null);
  assert.equal(scores.aclRsi.score, null);
  assert.equal(scores.aclRsi.raw, null);
  assert.equal(scores.vas.score, null);
});

test("custom IKDC raw maximum is 102 and ACL-RSI raw maximum is 120", () => {
  const answers = {};
  for (const item of ikdcItems) answers[item.id] = Math.max(...item.options.map((option) => option[1]));
  for (const item of aclRsiItems) answers[item.id] = item.reversed ? 0 : 100;
  const scores = calculateScores(answers);
  assert.equal(scores.ikdc.raw, 102);
  assert.equal(scores.ikdc.max, 102);
  assert.equal(scores.aclRsi.raw, 120);
});

test("Lysholm classification boundaries", () => {
  assert.equal(classifyLysholm(95), "优秀");
  assert.equal(classifyLysholm(94), "良好");
  assert.equal(classifyLysholm(84), "良好");
  assert.equal(classifyLysholm(83), "一般");
  assert.equal(classifyLysholm(65), "一般");
  assert.equal(classifyLysholm(64), "差");
});

test("VAS classification boundaries", () => {
  assert.equal(classifyVas(0), "无痛");
  assert.equal(classifyVas(1), "轻度疼痛");
  assert.equal(classifyVas(3), "轻度疼痛");
  assert.equal(classifyVas(4), "中度疼痛");
  assert.equal(classifyVas(6), "中度疼痛");
  assert.equal(classifyVas(7), "重度疼痛");
  assert.equal(classifyVas(10), "重度疼痛");
});

test("Lysholm total is sum of eight items", () => {
  const answers = {};
  for (const item of lysholmItems) {
    answers[item.id] = item.options[0][1];
  }
  const scores = calculateScores(answers);
  assert.equal(scores.lysholm.score, 100);
  assert.equal(scores.lysholm.label, "优秀");
});

test("surgery date is required only for surgical treatment", () => {
  const patient = {
    name: "测试",
    age: 30,
    sex: "男",
    clinicNo: "M001",
    side: "左",
    surgeryStatus: "否",
    surgeryDate: "",
    assessmentDate: "2026-06-29"
  };
  assert.deepEqual(validatePatient(patient), []);
  patient.surgeryStatus = "是";
  assert.ok(validatePatient(patient).includes("手术时间"));
});
