import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const server=await createServer({server:{middlewareMode:true}});
try{
 const {default:App}=await server.ssrLoadModule('/src/App.tsx');
 const html=renderToStaticMarkup(createElement(App));
 for(const text of ['홈페이지 시안','홈페이지 프로토타입','반영 예정','확인 예정','실제 개인정보 대신','상담 흐름 미리보기'])assert(!html.includes(text),'stale placeholder: '+text);
 assert(html.includes('data-slot="accordion-trigger"'));
 assert(html.includes('data-slot="select-trigger"'));
 assert(html.includes('name="phone"'));
 assert(html.includes('name="consent"'));
 assert(html.includes('상담 신청하기'));
 const css=await readFile('src/styles.css','utf8');
 assert(css.includes('border:0;background:transparent;color:var(--ink)'));
 console.log('PASS: server render, shadcn controls, consent, placeholder removal, FAQ reset');
}finally{await server.close()}
