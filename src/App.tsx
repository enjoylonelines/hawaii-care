import {useState} from 'react';
import parse,{Element,domToReact,type HTMLReactParserOptions,type DOMNode} from 'html-react-parser';
import landing from './landing.html?raw';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import {Accordion,AccordionItem,AccordionTrigger,AccordionContent} from '@/components/ui/accordion';
const faqs=[{"q":"장기요양등급이 없어도 상담할 수 있나요?","a":"네. 등급이 없거나 등급 여부를 모르셔도 상담 문의를 하실 수 있습니다. 장기요양보험을 통한 실제 서비스 이용 가능 여부는 인정 결과와 이용 조건에 따라 확인해야 합니다."},{"q":"방문요양 비용은 얼마나 드나요?","a":"이용 시간과 횟수, 장기요양등급, 본인부담 경감 여부 등에 따라 달라집니다. 상담 시 이용 조건을 확인한 뒤 안내받으실 수 있습니다."},{"q":"문의하면 바로 이용할 수 있나요?","a":"먼저 희망 지역과 일정, 필요한 돌봄 내용을 확인합니다. 가능한 요양보호사를 찾거나 채용하는 과정이 필요할 수 있어 시작일은 상담 후 조율합니다."},{"q":"요양보호사로 일하고 싶어요.","a":"아래 상담 화면에서 ‘요양보호사 구직’을 선택해 문의 흐름을 확인할 수 있습니다. 실제 구직 문의는 센터 대표 전화로 연락해 주세요."}];
export default function App(){
 const [kind,setKind]=useState('care');
 const [condition,setCondition]=useState('잘 모르겠어요');
 const [done,setDone]=useState(false);
 function changeKind(value:string){setKind(value);setCondition(value==='job'?'자격증이 있어요':'잘 모르겠어요');setDone(false)}
 const options:HTMLReactParserOptions={replace(node){
 if(!(node instanceof Element))return;
 if(node.name==='form'&&node.attribs.id==='consult')return <form className="form" id="consult" onSubmit={e=>{e.preventDefault();setDone(true)}}>
 <Tabs value={kind} onValueChange={changeKind}><TabsList className="tabs" aria-label="문의 종류"><TabsTrigger className="tab" value="care">돌봄 상담</TabsTrigger><TabsTrigger className="tab" value="job">요양보호사 구직</TabsTrigger></TabsList></Tabs>
 <h3>{kind==='job'?'어디에서 일하고 싶으신가요?':'어떤 돌봄을 찾고 계신가요?'}</h3>
 <p className="note">입력 흐름을 살펴보는 시안입니다. 실제 개인정보 대신 예시를 입력해 주세요.</p>
 <Label htmlFor="name">이름</Label><Input id="name" placeholder="예: 홍길동" autoComplete="off" required maxLength={30}/>
 <Label htmlFor="phone">연락처</Label><Input id="phone" type="tel" placeholder="예: 010-0000-0000" autoComplete="off" required maxLength={20}/>
 <div className="row"><div><Label htmlFor="area">희망 지역</Label><Input id="area" placeholder="예: 소흘읍" required maxLength={50}/></div>
 <div><Label htmlFor="condition">{kind==='job'?'요양보호사 자격':'장기요양등급'}</Label>
 <Select value={condition} onValueChange={setCondition}><SelectTrigger id="condition"><SelectValue/></SelectTrigger><SelectContent position="popper" sideOffset={6}>{(kind==='job'?['자격증이 있어요','취득 예정이에요','상담이 필요해요']:['잘 모르겠어요','등급이 있어요','신청 전이에요','신청 중이에요','본인 또는 가족이 아니에요']).map(v=><SelectItem value={v} key={v}>{v}</SelectItem>)}</SelectContent></Select></div></div>
 <Button className="btn" type="submit">상담 흐름 미리보기</Button><p className="note">이 화면에서는 접수가 진행되지 않습니다.</p>
 {done&&<div className="feedback" role="status">미리보기 완료. 입력 내용은 저장·전송되지 않았습니다. 실제 상담은 센터 대표 전화로 문의해 주세요.</div>}
 </form>;
 if(node.name==='section'&&node.attribs.class==='faq')return <section className="faq"><div className="wrap section"><div className="eyebrow">자주 묻는 질문</div><h2>처음 알아볼 때 궁금한 것들.</h2><Accordion type="multiple">{faqs.map((f,i)=><AccordionItem className="faq-item" key={f.q} value={String(i)}><AccordionTrigger className="faq-trigger">{f.q}</AccordionTrigger><AccordionContent className="faq-content"><p>{f.a}</p></AccordionContent></AccordionItem>)}</Accordion></div></section>;
 if(node.attribs.id==='job-link')return <Button className="btn light" onClick={()=>{changeKind('job');document.getElementById('contact')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.getElementById('name')?.focus({preventScroll:true})}}>요양보호사 구직 문의</Button>;
 if(node.name==='a'&&node.attribs.class?.split(' ').includes('btn'))return <Button asChild className={node.attribs.class}><a href={node.attribs.href} target={node.attribs.target} rel={node.attribs.rel}>{domToReact(node.children as DOMNode[],options)}</a></Button>;
 }};
 return <>{parse(landing,options)}</>;
}
