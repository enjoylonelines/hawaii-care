'use client';
import {useEffect,useState,type FormEvent} from 'react';
import {supabase} from './lib/supabase';
import {Button} from './components/ui/button';
import {Input} from './components/ui/input';
import {Label} from './components/ui/label';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from './components/ui/select';
import {Search,Phone,RefreshCw,LogOut,Inbox,Clock,CheckCircle2,ShieldCheck,X} from 'lucide-react';
import {Dialog as DialogPrimitive} from 'radix-ui';
import './admin.css';
type Status='new'|'contacted'|'closed';
type Inquiry={id:string;kind:string;name:string;phone:string;area:string;condition:string;status:Status;created_at:string};
const labels:Record<Status,string>={new:'신규',contacted:'연락 완료',closed:'상담 종료'};
const columns='id,kind,name,phone,area,condition,status,created_at';
const demoRows:Inquiry[]=[
{id:'demo-1',kind:'care',name:'김○○ (예시)',phone:'010-0000-0000',area:'소흘읍',condition:'등급이 있어요',status:'new',created_at:'2026-11-23T08:00:00Z'},
{id:'demo-2',kind:'job',name:'이○○ (예시)',phone:'010-0000-0000',area:'포천시',condition:'자격증이 있어요',status:'contacted',created_at:'2026-11-23T06:30:00Z'},
{id:'demo-3',kind:'care',name:'박○○ (예시)',phone:'010-0000-0000',area:'선단동',condition:'신청 전이에요',status:'closed',created_at:'2026-11-22T07:15:00Z'}
];
export default function Admin({preview=false}:{preview?:boolean}){
 const [auth,setAuth]=useState<'loading'|'login'|'allowed'|'denied'>(preview?'allowed':'loading');
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [rows,setRows]=useState<Inquiry[]>(preview?demoRows:[]),[selected,setSelected]=useState<Inquiry|null>(null);
 const [filter,setFilter]=useState('all'),[query,setQuery]=useState(''),[saving,setSaving]=useState(false);
 async function loadRows(){if(preview)return;if(!supabase)return;setBusy(true);setError('');const {data,error}=await supabase.from('inquiries').select(columns).order('created_at',{ascending:false}).limit(500);if(error)setError('문의 목록을 불러오지 못했습니다. 다시 시도해 주세요.');else setRows(data as Inquiry[]);setBusy(false)}
 useEffect(()=>{
 if(preview||!supabase){if(!preview){setAuth('login');setError('로그인 연결을 확인해 주세요.')}return}
 let active=true;
 async function verify(){
 const {data,error}=await supabase!.auth.getUser();if(!active)return;
 if(error||!data.user){setRows([]);setSelected(null);setAuth('login');return}
 setEmail(data.user.email||'');
 const result=await supabase!.from('care_admins').select('user_id').eq('user_id',data.user.id).maybeSingle();
 if(!active)return;
 if(result.error||!result.data){setRows([]);setSelected(null);setAuth('denied');return}
 setAuth('allowed');await loadRows();
 }
 void verify();const {data:sub}=supabase.auth.onAuthStateChange(()=>{setTimeout(()=>{if(active)void verify()},0)});
 return()=>{active=false;sub.subscription.unsubscribe()}
 },[]);
 async function login(e:FormEvent){e.preventDefault();if(!supabase)return;setBusy(true);setError('');const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});setPassword('');if(error)setError('이메일 또는 비밀번호를 확인해 주세요.');setBusy(false)}
 async function logout(){if(preview){window.location.href='/admin/login';return}setRows([]);setSelected(null);await supabase?.auth.signOut();setAuth('login')}
 async function updateStatus(status:Status){
 if(!selected)return;setSaving(true);setError('');
 if(preview){const next={...selected,status};setRows(r=>r.map(row=>row.id===next.id?next:row));setSelected(next);setSaving(false);return}
 const {data,error}=await supabase!.from('inquiries').update({status}).eq('id',selected.id).select(columns).single();
 if(error)setError('상태를 저장하지 못했습니다. 다시 시도해 주세요.');else{setRows(r=>r.map(row=>row.id===selected.id?data as Inquiry:row));setSelected(data as Inquiry)}setSaving(false)
 }
 const fmt=(date:string)=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(date));
 if(auth==='loading')return <div className="admin-login"><p role="status">로그인을 확인하고 있습니다.</p></div>;
 if(auth==='login'||auth==='denied')return <div className="admin-login"><a href="/" className="admin-wordmark">✳ 하와이 <span>재가방문요양센터</span></a><div className="login-card"><div className="login-icon"><ShieldCheck size={30}/></div><p className="admin-kicker">센터 운영 관리</p><h1>관리자 로그인</h1><p className="admin-muted">센터 관리자 계정으로 접속해 주세요.</p>{auth==='denied'?<><div className="admin-error" role="alert">이 계정에는 관리자 권한이 없습니다.</div><Button className="btn" onClick={logout}>다른 계정으로 로그인</Button></>:<form onSubmit={login}><Label htmlFor="email">이메일</Label><Input id="email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/><Label htmlFor="password">비밀번호</Label><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/>{error&&<p className="admin-error" role="alert">{error}</p>}<Button className="btn" type="submit" disabled={busy}>{busy?'로그인 중…':'로그인'}</Button></form>}<a className="demo-link" href="/admin/preview">예시 데이터로 관리 화면 보기</a></div><a href="/" className="admin-back">센터 홈페이지로 돌아가기</a></div>;
 const visible=rows.filter(r=>(filter==='all'||r.status===filter)&&(!query||[r.name,r.phone,r.area].some(v=>v.includes(query))));
 return <div className="admin-shell"><aside className="admin-side"><a href="/" className="admin-wordmark">✳ 하와이<span>재가방문요양센터</span></a><div className="admin-side-label">센터 운영 관리</div><a className="admin-nav-active" href={preview?'/admin/preview':'/admin'}><Inbox size={20}/>상담 문의</a><p className="admin-side-bottom">어르신과 가족의 첫 문의,<br/>한 건씩 꼼꼼하게.</p></aside><div className="admin-main"><header className="admin-top"><span>상담 문의 관리</span><div><span className="admin-muted">{preview?'화면 미리보기':email}</span><Button className="admin-logout" variant="ghost" onClick={logout}><LogOut size={17}/> {preview?'로그인 화면':'로그아웃'}</Button></div></header><main className="admin-content">{preview&&<div className="admin-demo">예시 데이터로 보는 관리 화면입니다. 실제 문의는 로그인 후 확인할 수 있습니다.</div>}<div className="admin-title"><div><p className="admin-kicker">하와이재가방문요양센터</p><h1>상담 문의</h1><p className="admin-muted">새로운 문의를 확인하고 상담 진행 상황을 관리하세요.</p></div><Button variant="outline" className="admin-refresh" onClick={()=>void loadRows()} disabled={busy||preview}><RefreshCw size={17}/>새로고침</Button></div><div className="admin-stats">{([{key:'new',icon:Inbox},{key:'contacted',icon:Clock},{key:'closed',icon:CheckCircle2}] as const).map(({key,icon:Icon})=><button key={key} className={'admin-stat '+(filter===key?'active':'')} onClick={()=>setFilter(filter===key?'all':key)}><div><span>{labels[key]}</span><b>{rows.filter(r=>r.status===key).length}<small>건</small></b></div><Icon size={27}/></button>)}</div><section className="admin-list"><div className="admin-list-head"><div className="admin-filters">{['all','new','contacted','closed'].map(s=><button aria-pressed={filter===s} className={filter===s?'active':''} key={s} onClick={()=>setFilter(s)}>{s==='all'?'전체':labels[s as Status]}</button>)}</div><label className="admin-search"><Search size={18}/><Input aria-label="이름, 연락처, 지역 검색" placeholder="이름, 연락처, 지역 검색" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>{error&&<div role="alert" className="admin-error">{error}</div>}<div className="admin-table-scroll"><table><thead><tr><th>상태</th><th>이름 / 연락처</th><th>문의 유형</th><th>희망 지역</th><th>접수일</th><th><span className="sr-only">상세 보기</span></th></tr></thead><tbody>{visible.map(r=><tr key={r.id}><td><span className={'admin-badge '+r.status}>{labels[r.status]}</span></td><td><b>{r.name}</b><span className="admin-contact-number">{r.phone}</span></td><td>{r.kind==='care'?'돌봄 상담':'요양보호사 구직'}</td><td>{r.area}</td><td>{fmt(r.created_at)}</td><td><Button variant="ghost" onClick={()=>setSelected(r)}>상세 보기</Button></td></tr>)}</tbody></table>{!visible.length&&<div className="admin-empty"><Inbox size={34}/><h3>{busy?'불러오는 중입니다.':'표시할 문의가 없습니다.'}</h3><p>필터나 검색어를 확인해 주세요.</p></div>}</div><div className="admin-list-foot">총 {visible.length}건 · 최신 500건까지 표시</div></section></main></div><DialogPrimitive.Root open={!!selected} onOpenChange={open=>{if(!open&&!saving)setSelected(null)}}><DialogPrimitive.Portal><DialogPrimitive.Overlay className="admin-overlay"/>{selected&&<DialogPrimitive.Content className="admin-detail" aria-describedby={undefined}><Button variant="ghost" className="detail-close" aria-label="상세 닫기" onClick={()=>setSelected(null)} disabled={saving}><X/></Button><p className="admin-kicker">상담 문의 상세</p><DialogPrimitive.Title asChild><h2 id="detail-title">{selected.name}</h2></DialogPrimitive.Title><span className={'admin-badge '+selected.status}>{labels[selected.status]}</span><dl><dt>문의 유형</dt><dd>{selected.kind==='care'?'돌봄 상담':'요양보호사 구직'}</dd><dt>연락처</dt><dd>{selected.phone}</dd><dt>희망 지역</dt><dd>{selected.area}</dd><dt>{selected.kind==='care'?'장기요양등급':'요양보호사 자격'}</dt><dd>{selected.condition}</dd><dt>접수일</dt><dd>{fmt(selected.created_at)}</dd></dl><Label htmlFor="status">상담 상태</Label><Select value={selected.status} onValueChange={v=>void updateStatus(v as Status)} disabled={saving}><SelectTrigger id="status"><SelectValue/></SelectTrigger><SelectContent>{(Object.keys(labels) as Status[]).map(s=><SelectItem value={s} key={s}>{labels[s]}</SelectItem>)}</SelectContent></Select>{saving&&<p role="status">저장 중…</p>}{error&&<p role="alert" className="admin-error">{error}</p>}{!preview&&<a className="btn detail-call" href={'tel:'+selected.phone}><Phone size={18}/>전화 걸기</a>}</DialogPrimitive.Content>}</DialogPrimitive.Portal></DialogPrimitive.Root></div>
}
