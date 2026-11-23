import {spawn} from 'node:child_process';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const keys=['NEXT_PUBLIC_INQUIRY_ENDPOINT','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const args=['--yes','vercel','deploy','--prod','--yes','--project','hawaii-care','--create-if-missing'];
for(const key of keys){if(!process.env[key])throw new Error('Missing '+key);args.push('--build-env',key+'='+process.env[key],'--env',key+'='+process.env[key])}
if(process.env.NEXT_PUBLIC_SITE_URL)args.push('--build-env','NEXT_PUBLIC_SITE_URL='+process.env.NEXT_PUBLIC_SITE_URL);
const p=spawn('npx',args,{stdio:'inherit',env:process.env});p.on('exit',code=>process.exitCode=code??1);
