import ExcelJS from "exceljs";

function scoreText(value) {
  return value === null || value === undefined ? "" : `${value}`;
}

function addSummarySheet(workbook, records) {
  const sheet = workbook.addWorksheet("汇总", { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = [
    { header: "记录ID", key: "id", width: 10 },
    { header: "提交时间", key: "createdAt", width: 22 },
    { header: "姓名", key: "name", width: 14 },
    { header: "年龄", key: "age", width: 8 },
    { header: "性别", key: "sex", width: 8 },
    { header: "门诊就诊号", key: "clinicNo", width: 18 },
    { header: "患侧", key: "side", width: 8 },
    { header: "是否手术", key: "surgeryStatus", width: 10 },
    { header: "手术时间", key: "surgeryDate", width: 14 },
    { header: "评测时间", key: "assessmentDate", width: 14 },
    { header: "IKDC得分", key: "ikdc", width: 12 },
    { header: "IKDC原始分", key: "ikdcRaw", width: 12 },
    { header: "Lysholm得分", key: "lysholm", width: 14 },
    { header: "Lysholm等级", key: "lysholmLabel", width: 12 },
    { header: "Tegner当前", key: "tegner", width: 12 },
    { header: "Tegner伤前", key: "tegnerPreinjury", width: 12 },
    { header: "ACL-RSI得分", key: "aclRsi", width: 14 },
    { header: "ACL-RSI原始分(满分120)", key: "aclRsiRaw", width: 22 },
    { header: "ACL-RSI判断", key: "aclRsiLabel", width: 24 },
    { header: "VAS得分", key: "vas", width: 10 },
    { header: "VAS等级", key: "vasLabel", width: 12 }
  ];

  for (const record of records) {
    const { patient, scores } = record;
    sheet.addRow({
      id: record.id,
      createdAt: record.createdAt,
      ...patient,
      ikdc: scoreText(scores.ikdc.score),
      ikdcRaw: `${scores.ikdc.raw}/${scores.ikdc.max}`,
      lysholm: scoreText(scores.lysholm.score),
      lysholmLabel: scores.lysholm.label,
      tegner: scoreText(scores.tegner.score),
      tegnerPreinjury: scoreText(scores.tegner.preinjury),
      aclRsi: scoreText(scores.aclRsi.score),
      aclRsiRaw: scoreText(scores.aclRsi.raw),
      aclRsiLabel: scores.aclRsi.label,
      vas: scoreText(scores.vas.score),
      vasLabel: scores.vas.label
    });
  }
}

function addDetailSheet(workbook, records) {
  const sheet = workbook.addWorksheet("题项明细", { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = [
    { header: "记录ID", key: "id", width: 10 },
    { header: "姓名", key: "name", width: 14 },
    { header: "评测时间", key: "assessmentDate", width: 14 },
    { header: "量表", key: "scale", width: 12 },
    { header: "题项ID", key: "itemId", width: 18 },
    { header: "题目", key: "question", width: 48 },
    { header: "选择项", key: "selectedLabel", width: 38 },
    { header: "原始分", key: "rawScore", width: 10 },
    { header: "最终计分", key: "finalScore", width: 10 },
    { header: "反向计分", key: "reversed", width: 10 }
  ];

  for (const record of records) {
    for (const detail of record.details || []) {
      sheet.addRow({
        id: record.id,
        name: record.patient.name,
        assessmentDate: record.patient.assessmentDate,
        ...detail,
        reversed: detail.reversed ? "是" : "否"
      });
    }
  }
}

function styleWorkbook(workbook) {
  for (const sheet of workbook.worksheets) {
    const header = sheet.getRow(1);
    header.font = { bold: true, color: { argb: "FFFFFFFF" } };
    header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2F5D62" } };
    header.alignment = { vertical: "middle", horizontal: "center" };
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } }
        };
        cell.alignment = { vertical: "middle", wrapText: true };
      });
    });
  }
}

export async function buildWorkbook(records) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ACL Outcome Assessment";
  workbook.created = new Date();
  addSummarySheet(workbook, records);
  addDetailSheet(workbook, records);
  styleWorkbook(workbook);
  return workbook;
}

export async function downloadWorkbook(records, filename = "acl-assessments.xlsx") {
  const workbook = await buildWorkbook(records);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
