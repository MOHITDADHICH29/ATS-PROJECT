function escapePdfText(value: string) {
  return value.replace(/[\\()]/g, "\\$&").replace(/[^\x20-\x7e]/g, " ");
}

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^candidate-[a-z0-9-]+\.pdf$/i.test(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const label = escapePdfText(filename.replace(/\.pdf$/i, "").replace(/-/g, " "));
  const content = `BT\n/F1 20 Tf\n72 740 Td\n(Impact ATS - Synthetic Demo Resume) Tj\n0 -34 Td\n/F1 12 Tf\n(${label}) Tj\n0 -28 Td\n(This document is a prototype preview, not an original candidate resume.) Tj\n0 -22 Td\n(Upload a text-based PDF to test resume extraction and explainable scoring.) Tj\nET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}\nendstream`,
  ];
  let document = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(new TextEncoder().encode(document).length);
    document += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = new TextEncoder().encode(document).length;
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) document += `${String(offset).padStart(10, "0")} 00000 n \n`;
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Response(document, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "no-store",
    },
  });
}
