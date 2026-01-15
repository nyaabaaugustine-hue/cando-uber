export function toCsv(rows, columns) {
  const header = columns.map(c => `"${c.title}"`).join(",");
  const data = rows.map(r => columns.map(c => {
    const v = typeof c.dataIndex === "string" ? r[c.dataIndex] : c.dataIndex(r);
    const s = v == null ? "" : String(v).replace(/"/g, '""');
    return `"${s}"`;
  }).join(",")).join("\n");
  return header + "\n" + data;
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
