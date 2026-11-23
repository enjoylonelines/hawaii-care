import type {Metadata} from 'next';
import {siteUrl,indexable,center} from '@/lib/site';
import '@/styles.css';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'포천 방문요양 상담 | 하와이재가방문요양센터',template:'%s | 하와이재가방문요양센터'},description:'포천시 소흘읍 하와이재가방문요양센터. 방문요양 이용 절차, 필요한 도움과 희망 일정에 따른 요양보호사 연결 상담을 안내합니다.',robots:{index:indexable,follow:indexable},openGraph:{type:'website',locale:'ko_KR',siteName:center.name,title:'포천 방문요양 상담 | 하와이재가방문요양센터',description:'익숙한 집에서 이어가는 일상. 포천 방문요양 이용 절차와 상담을 안내합니다.'},twitter:{card:'summary',title:center.name}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ko"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap" rel="stylesheet"/></head><body>{children}</body></html>}
