import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
const env={...process.env,NEXT_PUBLIC_SITE_URL:'https://hawaii-care.example',VERCEL_ENV:'production'};
const run=(command,args,extraEnv)=>new Promise((resolve,reject)=>{const p=spawn(command,args,{env:extraEnv||env,stdio:'inherit'});p.on('error',reject);p.on('exit',code=>code===0?resolve():reject(new Error(command+' exited '+code)))});
await run('npm',['run','build']);
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','4180'],{env,stdio:'ignore'});
try{
 let ready=false;for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:4180')).ok){ready=true;break}}catch{}await delay(500)}
 if(!ready)throw new Error('production test server not ready');
 await run(process.execPath,['scripts/verify-site.mjs'],{...env,TEST_BASE_URL:'http://127.0.0.1:4180',EXPECT_INDEXABLE:'1'});
 console.log('PASS: production indexability, sitemap and crawler policy. .example is test-only, not a published address.');
}finally{server.kill()}
