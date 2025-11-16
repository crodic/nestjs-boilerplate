import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function deleteFile(relativePath: string): Promise<boolean> {
  try {
    const absolutePath = join(process.cwd(), relativePath);

    if (!existsSync(absolutePath)) {
      console.warn(`File not found: ${absolutePath}`);
      return false;
    }

    await unlink(absolutePath);
    console.log(`File deleted: ${absolutePath}`);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
