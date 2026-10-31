import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const windows = process.platform === 'win32';
const args = process.argv.slice(2);
const result = spawnSync(
  windows ? 'cmd.exe' : './gradlew',
  windows ? ['/d', '/c', 'gradlew.bat', ...args, '--console=plain'] : [...args, '--console=plain'],
  {cwd: fileURLToPath(new URL('../android', import.meta.url)), stdio: 'inherit'},
);
if (result.error) throw result.error;
process.exitCode = result.status === null ? 1 : result.status;
