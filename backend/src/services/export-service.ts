import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export async function toExcelBuffer<T extends Record<string, unknown>>(rows: T[], sheetName = "Data") {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  const keys = Object.keys(rows[0] ?? { empty: "" });
  sheet.columns = keys.map((key) => ({ header: key, key, width: 22 }));
  rows.forEach((row) => sheet.addRow(row));
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

export function toPdfBuffer(title: string, rows: Record<string, unknown>[]) {
  return new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.fontSize(18).text(title, { underline: true });
    doc.moveDown();
    rows.slice(0, 100).forEach((row, index) => {
      doc.fontSize(10).text(`${index + 1}. ${JSON.stringify(row)}`);
      doc.moveDown(0.35);
    });
    doc.end();
  });
}
