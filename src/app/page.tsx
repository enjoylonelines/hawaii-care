import type {Metadata} from 'next';
import App from '@/App';
import {siteUrl,center} from '@/lib/site';
export const metadata:Metadata={alternates:{canonical:'/'},openGraph:{url:'/'}};
export default function Home(){
 const graph={'@context':'https://schema.org','@graph':[{'@type':'LocalBusiness','@id':siteUrl+'/#center',name:center.name,url:siteUrl,telephone:center.phone,address:{'@type':'PostalAddress',streetAddress:'소흘읍 송우로 118, 1층',addressLocality:'포천시',addressRegion:'경기도',addressCountry:'KR'}},{'@type':'Service',name:'방문요양 상담',serviceType:'방문요양',provider:{'@id':siteUrl+'/#center'},url:siteUrl+'/visit-care'}]};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(graph).replace(/</g,'\\u003c')}}/><App/></>
}
