function escapePdfText(value: string) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "?");
}

function wrapLine(text: string, maxLength: number) {
  const line = String(text || "").trim();
  if (!line) {
    return [""];
  }
  if (line.length <= maxLength) {
    return [line];
  }
  const words = line.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) {
      current = candidate;
    } else if (current) {
      lines.push(current);
      current = word;
    } else {
      for (let index = 0; index < word.length; index += maxLength) {
        lines.push(word.slice(index, index + maxLength));
      }
      current = "";
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

function normalizeLines(lines: string[], maxLength = 96) {
  const normalized: string[] = [];
  for (const line of lines || []) {
    normalized.push(...wrapLine(String(line || ""), maxLength));
  }
  return normalized;
}

export function buildSimplePdf(lines: string[], options: { title?: string; maxCharsPerLine?: number; linesPerPage?: number; lineHeight?: number; startX?: number; startY?: number } = {}) {
  const title = options.title || "Forge Character Export";
  const maxChars = options.maxCharsPerLine || 96;
  const linesPerPage = options.linesPerPage || 48;
  const lineHeight = options.lineHeight || 14;
  const startX = options.startX || 42;
  const startY = options.startY || 760;
  const fullLines = normalizeLines([title, "", ...(lines || [])], maxChars);
  const pageChunks: string[][] = [];
  for (let index = 0; index < fullLines.length; index += linesPerPage) {
    pageChunks.push(fullLines.slice(index, index + linesPerPage));
  }
  if (!pageChunks.length) {
    pageChunks.push([title]);
  }

  const objectMap = new Map<number, string>();
  const pageCount = pageChunks.length;
  const fontObjNum = 3 + pageCount * 2;
  const infoObjNum = fontObjNum + 1;
  objectMap.set(1, "<< /Type /Catalog /Pages 2 0 R >>");

  const kidRefs: string[] = [];
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const pageObjNum = 3 + pageIndex * 2;
    const contentObjNum = 4 + pageIndex * 2;
    kidRefs.push(`${pageObjNum} 0 R`);

    const streamLines = ["BT", "/F1 10 Tf", `${startX} ${startY} Td`];
    pageChunks[pageIndex].forEach((line, index) => {
      if (index > 0) {
        streamLines.push(`0 -${lineHeight} Td`);
      }
      streamLines.push(`(${escapePdfText(line)}) Tj`);
    });
    streamLines.push("ET");

    const streamText = `${streamLines.join("\n")}\n`;
    objectMap.set(contentObjNum, `<< /Length ${streamText.length} >>\nstream\n${streamText}endstream`);
    objectMap.set(pageObjNum, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjNum} 0 R >> >> /Contents ${contentObjNum} 0 R >>`);
  }

  objectMap.set(2, `<< /Type /Pages /Kids [${kidRefs.join(" ")}] /Count ${pageCount} >>`);
  objectMap.set(fontObjNum, "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>");
  objectMap.set(infoObjNum, `<< /Title (${escapePdfText(title)}) /Producer (Forge Character) /Creator (Forge Character) /Subject (Parsable Character Sheet) >>`);

  const maxObj = infoObjNum;
  let pdf = "%PDF-1.4\n";
  const offsets = new Array(maxObj + 1).fill(0);
  for (let objNum = 1; objNum <= maxObj; objNum += 1) {
    const content = objectMap.get(objNum);
    if (!content) {
      continue;
    }
    offsets[objNum] = pdf.length;
    pdf += `${objNum} 0 obj\n${content}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${maxObj + 1}\n0000000000 65535 f \n`;
  for (let objNum = 1; objNum <= maxObj; objNum += 1) {
    pdf += `${String(offsets[objNum] || 0).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${maxObj + 1} /Root 1 0 R /Info ${infoObjNum} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}
