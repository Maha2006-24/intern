import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const legacyDataPath = path.resolve(__dirname, '../../db.json');

async function readLegacyData() {
  const raw = await fs.readFile(legacyDataPath, 'utf-8');
  return JSON.parse(raw);
}

async function writeLegacyData(data) {
  await fs.writeFile(legacyDataPath, JSON.stringify(data, null, 2), 'utf-8');
}

function createLegacyId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export { createLegacyId, readLegacyData, writeLegacyData };
