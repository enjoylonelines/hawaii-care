import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const args=[require.resolve('next/dist/bin/next'),process.env.PREVIEW_MODE==='development'?'dev':'start','--hostname','0.0.0.0','--port','4178'];
if(process.argv.includes('--background')){const child=spawn(process.execPath,args,{cwd:process.cwd(),detached:true,stdio:'ignore',env:process.env});child.unref();console.log('Next.js preview starting http://localhost:4178 PID '+child.pid)}else{spawn(process.execPath,args,{stdio:'inherit',env:process.env})}
