import {spawn} from 'node:child_process';
if(process.argv.includes('--background')){
 const child=spawn(process.execPath,[new URL(import.meta.url).pathname],{cwd:process.cwd(),detached:true,stdio:'ignore',env:process.env});
 child.unref(); console.log('Preview starting at http://localhost:4178 (PID '+child.pid+')');
}else{
 const {createServer}=await import('vite');
 const server=await createServer({server:{host:'0.0.0.0',port:4178,strictPort:true}});
 await server.listen();server.printUrls();
}
