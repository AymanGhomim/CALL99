export function downloadTextFile(fileName: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadReport(fileName: string, rows: Array<[string, string | number]>): void {
  const content = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  downloadTextFile(fileName, content);
}
