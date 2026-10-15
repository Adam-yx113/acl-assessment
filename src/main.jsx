import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  aclRsiItems,
  buildAnswerDetails,
  calculateScores,
  ikdcItems,
  lysholmItems,
  patientFields,
  tegnerOptions,
  validateAnswers,
  validatePatient,
  vasItem
} from "../shared/scales.js";
import { downloadWorkbook } from "../shared/exportWorkbook.js";
import "./styles.css";

const STORAGE_KEY = "acl-assessments-v1";

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

const today = new Date().toISOString().slice(0, 10);

function defaultPatient() {
  return {
    name: "",
    age: "",
    sex: "",
    clinicNo: "",
    side: "",
    surgeryStatus: "",
    surgeryDate: "",
    assessmentDate: today
  };
}

function defaultAnswers() {
  const answers = { tegner_current: "", tegner_preinjury: "", vas: "" };
  for (const item of [...ikdcItems, ...lysholmItems, ...aclRsiItems]) {
    answers[item.id] = "";
  }
  return answers;
}

function Field({ field, value, onChange }) {
  if (field.type === "select") {
    return (
      <label className="field">
        <span>{field.label}</span>
        <select value={value} onChange={(event) => onChange(field.key, event.target.value)}>
          <option value="">请选择</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="field">
      <span>{field.label}</span>
      <input
        type={field.type}
        min={field.min}
        max={field.max}
        value={value}
        readOnly={field.readOnly}
        aria-readonly={field.readOnly || undefined}
        onChange={(event) => onChange(field.key, event.target.value)}
      />
    </label>
  );
}

function OptionGrid({ item, value, onChange, compact = false, scoreOnly = false, hideScore = false }) {
  return (
    <div className={`option-grid ${compact ? "compact" : ""} ${scoreOnly ? "score-only" : ""} ${hideScore ? "hide-score" : ""}`}>
      {item.options.map(([label, score]) => (
        <label key={`${item.id}-${score}`} className={String(value) === String(score) ? "option selected" : "option"}>
          <input type="radio" name={item.id} value={score} checked={String(value) === String(score)} onChange={() => onChange(item.id, score)} />
          {!scoreOnly && <span>{label}</span>}
          {!hideScore && <strong>{score}</strong>}
        </label>
      ))}
    </div>
  );
}

function ScaleSection({ title, hint, children }) {
  return (
    <section className="scale-section">
      <div className="section-title">
        <h2>{title}</h2>
        {hint && <p>{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Question({ item, value, onChange, compact, scoreOnly, hideScore, className = "" }) {
  return (
    <div className={`question ${className}`}>
      <div>
        <h3>{item.text}</h3>
        {item.note && <p className="note">{item.note}</p>}
      </div>
      <OptionGrid item={item} value={value} onChange={onChange} compact={compact} scoreOnly={scoreOnly} hideScore={hideScore} />
    </div>
  );
}

function VasScaleVisual({ value }) {
  const selected = value === "" || value == null ? null : Number(value);
  const faces = [
    { score: 0, mood: "smile", label: "无痛" },
    { score: 2, mood: "soft", label: "轻度" },
    { score: 5, mood: "flat", label: "中度" },
    { score: 8, mood: "sad", label: "重度" },
    { score: 10, mood: "pain", label: "剧痛" }
  ];

  return (
    <div className="vas-visual" aria-label="VAS疼痛视觉量表">
      <div className="vas-faces">
        {faces.map((face) => (
          <div className="vas-face" key={face.score}>
            <svg viewBox="0 0 64 64" role="img" aria-label={face.label}>
              <circle cx="32" cy="32" r="28" />
              <circle className="eye" cx="23" cy="27" r="3.8" />
              <circle className="eye" cx="41" cy="27" r="3.8" />
              {face.mood === "smile" && <path className="mouth" d="M21 38 Q32 49 43 38" />}
              {face.mood === "soft" && <path className="mouth" d="M23 40 Q32 45 41 40" />}
              {face.mood === "flat" && <path className="mouth" d="M23 40 L41 40" />}
              {face.mood === "sad" && <path className="mouth" d="M22 44 Q32 35 42 44" />}
              {face.mood === "pain" && (
                <>
                  <path className="mouth" d="M23 46 Q32 35 41 46" />
                  <path className="tear" d="M18 33 C12 41 14 48 21 48 C27 48 29 41 23 34 Z" />
                  <path className="tear" d="M46 33 C40 41 42 48 49 48 C55 48 57 41 51 34 Z" />
                </>
              )}
            </svg>
            <span>{face.label}</span>
          </div>
        ))}
      </div>
      <div className="vas-ruler">
        <div className="vas-fill" style={{ width: selected === null ? "0%" : `${selected * 10}%` }} />
        {Array.from({ length: 11 }, (_, score) => (
          <span key={score} className={selected === score ? "active" : ""}>
            {score}
          </span>
        ))}
      </div>
      <div className="vas-bands">
        <span>无痛</span>
        <span>轻度疼痛 1-3</span>
        <span>中度疼痛 4-6</span>
        <span>重度疼痛 7-10</span>
      </div>
    </div>
  );
}

function ScorePanel({ scores }) {
  const rows = [
    ["IKDC", scores.ikdc.score == null ? null : scores.ikdc.raw, 102],
    ["Lysholm", scores.lysholm.score, 100],
    ["Tegner", scores.tegner.score, 10],
    ["ACL-RSI", scores.aclRsi.score, 100],
    ["VAS", scores.vas.score, 10]
  ];

  return (
    <aside className="score-panel">
      <div className="score-panel-head">
        <div>
          <span className="eyebrow">Assessment summary</span>
          <h2>实时评分</h2>
        </div>
        <span className="live-dot">实时</span>
      </div>
      <div className="score-list">
        {rows.map(([name, score, total]) => (
          <div className={`score-row ${score == null ? "" : "complete"}`} key={name}>
            <span>{name}</span>
            <div className="score-values">
              <span><small>本次得分</small><strong>{score == null ? "--" : score}</strong></span>
              <span><small>总分</small><strong>{total}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function TegnerSelect({ name, label, value, onChange }) {
  return (
    <label className="field full">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(name, event.target.value)}>
        <option value="">请选择活动水平</option>
        {tegnerOptions.map(([score, text]) => (
          <option key={`${name}-${score}`} value={score}>
            {score}分：{text}
          </option>
        ))}
      </select>
    </label>
  );
}

function History({ records, onRefresh, onDelete }) {
  return (
    <section className="history">
      <div className="history-head">
        <h2>历史记录</h2>
        <button className="ghost" type="button" onClick={onRefresh}>
          刷新
        </button>
      </div>
      <p className="note" style={{ margin: "0 0 12px" }}>
        静态版：记录保存在本机浏览器 localStorage；邮件发送不可用。清除浏览器数据会导致记录丢失。
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>评测时间</th>
              <th>IKDC</th>
              <th>Lysholm</th>
              <th>ACL-RSI</th>
              <th>VAS</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="8">暂无记录</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.patient.name}</td>
                  <td>{record.patient.assessmentDate}</td>
                  <td>{record.scores.ikdc.score}</td>
                  <td>{record.scores.lysholm.score}</td>
                  <td>{record.scores.aclRsi.score}</td>
                  <td>{record.scores.vas.score}</td>
                  <td>
                    <button className="small ghost" type="button" onClick={() => onDelete(record.id)}>
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function App() {
  const [patient, setPatient] = useState(defaultPatient);
  const [answers, setAnswers] = useState(defaultAnswers);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const scores = useMemo(() => calculateScores(answers), [answers]);
  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value !== "" && value != null).length,
    [answers]
  );
  const totalAnswerCount = Object.keys(answers).length;
  const completion = Math.round((answeredCount / totalAnswerCount) * 100);

  const updatePatient = (key, value) => setPatient((current) => ({
    ...current,
    [key]: value,
    ...(key === "surgeryStatus" && value === "否" ? { surgeryDate: "" } : {})
  }));
  const updateAnswer = (key, value) => setAnswers((current) => ({ ...current, [key]: value }));

  function refreshRecords() {
    setRecords(loadRecords());
  }

  useEffect(() => {
    refreshRecords();
  }, []);

  async function submitAssessment(event) {
    event.preventDefault();
    setMessage("");
    const patientErrors = validatePatient(patient);
    const answerErrors = validateAnswers(answers);
    if (patientErrors.length || answerErrors.length) {
      setMessage(`请补全信息：${[...patientErrors, answerErrors.length ? "所有量表必答项" : ""].filter(Boolean).join("、")}`);
      return;
    }

    setBusy(true);
    try {
      const existing = loadRecords();
      const nextId = existing.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
      const record = {
        id: nextId,
        createdAt: new Date().toISOString(),
        patient: { ...patient },
        answers: { ...answers },
        scores: calculateScores(answers),
        details: buildAnswerDetails(answers)
      };
      const next = [record, ...existing];
      persistRecords(next);
      setRecords(next);
      setMessage(`已保存到本机浏览器 #${record.id}（静态版）`);
      setPatient(defaultPatient());
      setAnswers(defaultAnswers());
    } catch (error) {
      setMessage(error.message || "保存失败");
    } finally {
      setBusy(false);
    }
  }

  function deleteRecord(id) {
    const next = loadRecords().filter((row) => row.id !== id);
    persistRecords(next);
    setRecords(next);
    setMessage(`已删除记录 #${id}`);
  }

  async function exportExcel() {
    setMessage("");
    setBusy(true);
    try {
      const list = loadRecords();
      if (!list.length) {
        setMessage("暂无记录可导出。");
        return;
      }
      await downloadWorkbook(list);
      setMessage(`已导出 ${list.length} 条记录到 Excel。`);
    } catch (error) {
      setMessage(error.message || "导出失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">ACL</div>
          <div>
            <span className="eyebrow">Clinical Outcome Assessment for ACL-Related Knee Injuries</span>
            <h1>ACL损伤相关膝关节临床疗效评测</h1>
            <p>IKDC · Lysholm · Tegner · ACL-RSI · VAS</p>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="header-stat">
            <span>量表完成度</span>
            <strong>{completion}%</strong>
          </div>
          <button className="export" type="button" disabled={busy} onClick={exportExcel}>
            导出 Excel
          </button>
        </div>
      </header>

      <div className="progress-track" aria-label={`量表完成度 ${completion}%`}>
        <span style={{ width: `${completion}%` }} />
      </div>

      <div className="message" role="status" style={{ background: "#eef6f4", color: "#1f4d4f" }}>
        当前为 GitHub Pages 静态版：量表与计分可离线使用；记录保存在本机浏览器；可导出 Excel；邮件发送不可用。
      </div>
      {message && <div className="message" role="status">{message}</div>}

      <form onSubmit={submitAssessment} className="layout">
        <div className="content">
          <section className="patient-card">
            <div className="section-title">
              <span className="section-index">01</span>
              <div>
                <h2>患者基本信息</h2>
                <p>用于识别本次评测记录，请完整填写。</p>
              </div>
            </div>
            <div className="field-grid">
              {patientFields.filter((field) => field.key !== "surgeryDate" || patient.surgeryStatus !== "否").map((field) => (
                <Field key={field.key} field={field} value={patient[field.key]} onChange={updatePatient} />
              ))}
            </div>
          </section>

          <ScaleSection title="IKDC主观膝关节评估表" hint="根据过去一周膝关节状况选择最符合的一项。">
            {ikdcItems.map((item) => (
              <Question
                key={item.id}
                item={item}
                value={answers[item.id]}
                onChange={updateAnswer}
                compact={item.options.length > 5}
                hideScore={item.id === "ikdc_self"}
                className={item.id === "ikdc_self" ? "numeric-rating-question" : ""}
              />
            ))}
          </ScaleSection>

          <ScaleSection title="Lysholm膝关节评分" hint="8个项目相加得到总分，并自动判定等级。">
            {lysholmItems.map((item) => (
              <Question key={item.id} item={item} value={answers[item.id]} onChange={updateAnswer} />
            ))}
          </ScaleSection>

          <ScaleSection title="Tegner活动水平评分" hint="记录当前活动水平，可同时记录受伤前或发病前活动水平。">
            <div className="field-grid">
              <TegnerSelect name="tegner_current" label="当前活动水平" value={answers.tegner_current} onChange={updateAnswer} />
              <TegnerSelect name="tegner_preinjury" label="受伤前/发病前活动水平" value={answers.tegner_preinjury} onChange={updateAnswer} />
            </div>
          </ScaleSection>

          <ScaleSection title="ACL-RSI重返运动心理指数量表" hint="0代表完全不同意，100代表完全同意；负向题自动反向计分。">
            {aclRsiItems.map((item) => (
              <Question key={item.id} item={item} value={answers[item.id]} onChange={updateAnswer} compact scoreOnly />
            ))}
          </ScaleSection>

          <ScaleSection title="VAS疼痛评分" hint="0为无痛，10为剧痛。">
            <VasScaleVisual value={answers.vas} />
            <Question item={vasItem} value={answers.vas} onChange={updateAnswer} compact scoreOnly className="vas-question" />
          </ScaleSection>

          <div className="actions">
            <div className="action-note">
              <strong>{answeredCount}/{totalAnswerCount}</strong>
              <span>个量表项目已完成</span>
            </div>
            <button type="button" className="ghost" onClick={() => setAnswers(defaultAnswers())}>
              清空量表
            </button>
            <button type="submit" disabled={busy}>
              {busy ? "处理中..." : "保存评测"}
            </button>
          </div>
        </div>

        <ScorePanel scores={scores} />
      </form>

      <History records={records} onRefresh={refreshRecords} onDelete={deleteRecord} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
