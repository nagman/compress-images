import { dirname } from 'path';
import { fileURLToPath } from 'url';

// __dirname is not native with ESM
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
