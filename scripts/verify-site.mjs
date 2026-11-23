import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://localhost:4178';
const fetchText=async(path,ua)=>{const r=await fetch(base+path,{headers:ua?{'User-Agent':ua}:{}});assert.equal(r.status,200,path);return {text:await r.text(),headers:r.headers}};
const home=await fetchText('/');
for(const term of ['익숙한 집에서','031-541-2094','송우로 118','상담 신청하기','어떤 도움이 필요하세요?'])assert(home.text.includes(term),'missing server HTML: '+term);
assert(home.text.includes('application/ld+json'));assert(home.text.includes('rel="canonical"'));
const schema=JSON.parse(home.text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);assert.equal(schema['@graph'][0].name,'하와이재가방문요양센터');
for(const path of ['/visit-care','/guides/first-consultation']){const {text}=await fetchText(path);assert(text.includes('031-541-2094'));assert(text.includes('rel="canonical"'));assert(text.includes('국민건강보험공단'))}
const bot=await fetchText('/','OAI-SearchBot');assert(bot.text.includes('익숙한 집에서'));assert(bot.text.includes('031-541-2094'));
for(const path of ['/admin','/admin/login','/admin/preview']){const {text,headers}=await fetchText(path);assert(text.includes('noindex'));assert(headers.get('x-robots-tag')?.includes('noindex'));assert(!text.includes('b4ur2old@naver.com'));assert(!text.includes('INTEGRATION_TEST'))}
const robots=await fetchText('/robots.txt');assert(robots.text.includes('OAI-SearchBot'));assert(robots.text.includes('Googlebot'));
const sitemap=await fetchText('/sitemap.xml');assert(!sitemap.text.includes('/admin'));
if(process.env.EXPECT_INDEXABLE==='1'){assert(robots.text.includes('Allow: /'));assert(sitemap.text.includes('/visit-care'));assert(!home.text.includes('content="noindex'))}
else{assert(home.text.includes('noindex'));assert(robots.text.includes('Disallow: /'))}
assert.equal((await fetch(base+'/nonexistent-page')).status,404);
const old=await readFile('docs/experiments/vite-entry.html','utf8');
const baseline=old.split('<body>')[1]?.split('<script')[0]||'';
const terms=['익숙한 집에서','031-541-2094','송우로 118','상담 신청하기'];
console.log(JSON.stringify({result:'PASS',checks:['no-JavaScript HTML','public metadata','LocalBusiness JSON-LD','AI crawler HTML','admin noindex/no leakage','robots','sitemap','404'],experiment:{description:'Terms present in initial HTML before/after migration; not AI search ranking',baseline:terms.filter(t=>baseline.includes(t)).length,next:terms.filter(t=>home.text.includes(t)).length,total:terms.length}},null,2));
