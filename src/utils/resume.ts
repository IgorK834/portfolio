import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { profile } from '../data/profile';

/** True once the CV PDF has been dropped into public/ at profile.resumeUrl. Evaluated at build time. */
export const hasResumePdf = existsSync(join(process.cwd(), 'public', profile.resumeUrl));
