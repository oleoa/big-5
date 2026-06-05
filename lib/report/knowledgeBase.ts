import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Carrega a base de conhecimento Big Five (data/knowledge-base-big-five.md)
 * como um File pronto para upload na OpenAI (POST /v1/files).
 *
 * O ficheiro é incluído no bundle serverless via `outputFileTracingIncludes`
 * no next.config.ts.
 */
export async function loadKnowledgeFile(): Promise<File> {
  const filePath = path.join(process.cwd(), 'data', 'knowledge-base-big-five.md');
  const md = await readFile(filePath, 'utf8');
  return new File([md], 'knowledge-base-big-five.md', { type: 'text/markdown' });
}
