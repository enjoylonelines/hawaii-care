const origins=(Deno.env.get('INQUIRY_ALLOWED_ORIGINS')||'http://localhost:4178,http://127.0.0.1:4178,https://hawaii-care.vercel.app').split(',');
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':origins.includes(origin)?origin:origins[0],'Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin','Cache-Control':'no-store'};
 const respond=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers});
 if(!origins.includes(origin))return respond(403,{error:'origin_not_allowed'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return respond(405,{error:'method_not_allowed'});
 if(!req.headers.get('content-type')?.includes('application/json'))return respond(415,{error:'json_required'});
 if(Number(req.headers.get('content-length')||0)>4096)return respond(413,{error:'payload_too_large'});
 try{
 const raw=await req.text();if(raw.length>4096)return respond(413,{error:'payload_too_large'});
 let body;try{body=JSON.parse(raw)}catch{return respond(400,{error:'invalid_json'})}
 if(!body||typeof body!=='object'||Array.isArray(body))return respond(400,{error:'invalid_input'});
 if(body.website)return respond(400,{error:'invalid_input'});
 const clean=(v:unknown,max:number)=>typeof v==='string'&&v.trim().length<=max?v.trim():'';
 const kind=clean(body.kind,4),name=clean(body.name,30),phone=clean(body.phone,20).replace(/[-\s]/g,''),area=clean(body.area,50),condition=clean(body.condition,50);
 const options=kind==='job'?['자격증이 있어요','취득 예정이에요','상담이 필요해요']:['잘 모르겠어요','등급이 있어요','신청 전이에요','신청 중이에요','본인 또는 가족이 아니에요'];
 if(!['care','job'].includes(kind)||!name||!area||!/^0[0-9]{8,10}$/.test(phone)||!options.includes(condition)||body.consent!==true)return respond(400,{error:'invalid_input'});
 const url=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const ip=(req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim();
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+key));
 const sourceHash=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
 const saved=await fetch(url+'/rest/v1/rpc/submit_care_inquiry',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({payload:{kind,name,phone,area,condition},source_hash:sourceHash})});
 if(!saved.ok){const details=await saved.text();return respond(details.includes('RATE_LIMIT')?429:503,{error:details.includes('RATE_LIMIT')?'rate_limit':'storage_unavailable'})}
 return respond(201,{ok:true});
 }catch{return respond(503,{error:'temporarily_unavailable'})}
});