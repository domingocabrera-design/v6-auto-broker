export function parseCSV(csv: string) {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const obj: any = {};
    headers.forEach((h, i) => (obj[h.trim()] = cols[i]?.trim()));
    return obj;
  });
}
