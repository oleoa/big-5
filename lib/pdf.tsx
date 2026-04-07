import { renderToBuffer } from "@react-pdf/renderer";
import { BigFiveReport } from "./pdf-document";
import type { PdfData } from "./pdf-document";

export type { PdfData };

export async function gerarPDF(data: PdfData): Promise<Buffer> {
  const buffer = await renderToBuffer(<BigFiveReport data={data} />);
  return Buffer.from(buffer);
}
