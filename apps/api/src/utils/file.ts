import fs from 'fs';
import { join } from 'path';

export const deleteFile = (path: string, fileName: string) => {
  fs.unlinkSync(join(__dirname, `${path}/${fileName}`));
};
