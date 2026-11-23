// Legacy entry point retained for convenience. The package check script uses TypeScript.
import {spawnSync} from 'node:child_process';
const result=spawnSync('npm',['run','check'],{stdio:'inherit'});
process.exit(result.status??1);
