import {useState,type FormEvent} from 'react';
import {submitInquiry} from '@/lib/inquiries';
import {Accessibility,House,MessagesSquare} from 'lucide-react';
import parse,{Element,domToReact,type HTMLReactParserOptions,type DOMNode} from 'html-react-parser';
import landing from './landing.html?raw';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import {Accordion,AccordionItem,AccordionTrigger,AccordionContent} from '@/components/ui/accordion';
const faqs=[{"q":"장기요양등급이 없어도 상담할 수 있나요?","a":"네. 등급이 없거나 등급 여부를 모르셔도 상담 문의를 하실 수 있습니다. 장기요양보험을 통한 실제 서비스 이용 가능 여부는 인정 결과와 이용 조건에 따라 확인해야 합니다."},{"q":"방문요양 비용은 얼마나 드나요?","a":"이용 시간과 횟수, 장기요양등급, 본인부담 경감 여부 등에 따라 달라집니다. 상담 시 이용 조건을 확인한 뒤 안내받으실 수 있습니다."},{"q":"문의하면 바로 이용할 수 있나요?","a":"먼저 희망 지역과 일정, 필요한 돌봄 내용을 확인합니다. 가능한 요양보호사를 찾거나 채용하는 과정이 필요할 수 있어 시작일은 상담 후 조율합니다."},{"q":"요양보호사로 일하고 싶어요.","a":"아래 상담 신청에서 ‘요양보호사 구직’을 선택하고 희망 지역을 알려주세요. 센터 대표 전화로도 문의하실 수 있습니다."}];
export default function App(){
 const [kind,setKind]=useState('care');
 const [condition,setCondition]=useState('잘 모르겠어요');
 const [done,setDone]=useState(false);
 const [pending,setPending]=useState(false);
 const [error,setError]=useState('');
 async function handleSubmit(e:FormEvent<HTMLFormElement>){
 e.preventDefault();if(pending)return;
 const form=e.currentTarget,data=new FormData(form);setPending(true);setDone(false);setError('');
 try{await submitInquiry({kind:kind as 'care'|'job',name:String(data.get('name')||'').trim(),phone:String(data.get('phone')||'').trim(),area:String(data.get('area')||'').trim(),condition,consent:data.get('consent')==='on',website:String(data.get('website')||'')});setDone(true);form.reset()}
 catch(err){setError(err instanceof Error?err.message:'접수하지 못했습니다. 다시 시도해 주세요.')}
 finally{setPending(false)}
 }
 function changeKind(value:string){setKind(value);setCondition(value==='job'?'자격증이 있어요':'잘 모르겠어요');setDone(false);setError('')}
 const options:HTMLReactParserOptions={replace(node){
 if(!(node instanceof Element))return;
 if(node.name==='form'&&node.attribs.id==='consult')return <form className="form" id="consult" onSubmit={handleSubmit}>
 <Tabs value={kind} onValueChange={changeKind}><TabsList className="tabs" aria-label="문의 종류"><TabsTrigger className="tab" value="care">돌봄 상담</TabsTrigger><TabsTrigger className="tab" value="job">요양보호사 구직</TabsTrigger></TabsList></Tabs>
 <h3>{kind==='job'?'어디에서 일하고 싶으신가요?':'어떤 돌봄을 찾고 계신가요?'}</h3>

 <Label htmlFor="name">이름</Label><Input name="name" id="name" placeholder="예: 홍길동" autoComplete="off" required maxLength={30}/>
 <Label htmlFor="phone">연락처</Label><Input name="phone" id="phone" type="tel" placeholder="예: 010-0000-0000" autoComplete="off" required maxLength={20}/>
 <div className="row"><div><Label htmlFor="area">희망 지역</Label><Input name="area" id="area" placeholder="예: 소흘읍" required maxLength={50}/></div>
 <div><Label htmlFor="condition">{kind==='job'?'요양보호사 자격':'장기요양등급'}</Label>
 <Select value={condition} onValueChange={setCondition}><SelectTrigger id="condition"><SelectValue/></SelectTrigger><SelectContent position="popper" sideOffset={6}>{(kind==='job'?['자격증이 있어요','취득 예정이에요','상담이 필요해요']:['잘 모르겠어요','등급이 있어요','신청 전이에요','신청 중이에요','본인 또는 가족이 아니에요']).map(v=><SelectItem value={v} key={v}>{v}</SelectItem>)}</SelectContent></Select></div></div>
 <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{display:'none'}}/>
 <label className="consent"><input name="consent" type="checkbox" required/>상담 연락을 위한 이름·연락처·지역·문의 내용 수집에 동의합니다. 접수일로부터 90일간 보관 후 삭제합니다.</label>
 <Button className="btn" type="submit" disabled={pending}>{pending?'접수 중…':'상담 신청하기'}</Button>
 {done&&<div className="feedback" role="status">상담 신청이 접수되었습니다. 센터에서 확인 후 연락드리겠습니다.</div>}
 {error&&<div className="feedback error" role="alert">{error}</div>}
 </form>;
 if(node.name==='section'&&node.attribs.class==='faq')return <section className="faq"><div className="wrap section"><div className="eyebrow">자주 묻는 질문</div><h2>처음 알아볼 때 궁금한 것들.</h2><Accordion type="multiple">{faqs.map((f,i)=><AccordionItem className="faq-item" key={f.q} value={String(i)}><AccordionTrigger className="faq-trigger">{f.q}</AccordionTrigger><AccordionContent className="faq-content"><p>{f.a}</p></AccordionContent></AccordionItem>)}</Accordion></div></section>;
 if(node.attribs.class==='icon'){const icon=node.children[0];const text=icon&&'data' in icon?icon.data:'';const Icon=text==='♧'?Accessibility:text==='⌂'?House:MessagesSquare;return <div className="icon" aria-hidden="true"><Icon size={28} strokeWidth={1.6}/></div>}
 if(node.attribs.id==='job-link')return <Button className="btn light" onClick={()=>{changeKind('job');document.getElementById('contact')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.getElementById('name')?.focus({preventScroll:true})}}>요양보호사 구직 문의</Button>;
 if(node.name==='a'&&node.attribs.class?.split(' ').includes('btn'))return <Button asChild className={node.attribs.class}><a href={node.attribs.href} target={node.attribs.target} rel={node.attribs.rel}>{domToReact(node.children as DOMNode[],options)}</a></Button>;
 }};
 return <>{parse(landing,options)}</>;
}
