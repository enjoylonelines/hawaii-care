import type {MetadataRoute} from 'next';
import {siteUrl,indexable} from '@/lib/site';
export default function robots():MetadataRoute.Robots{return {rules:[{userAgent:'*',allow:indexable?'/':undefined,disallow:indexable?['/admin','/api/']:['/']},{userAgent:['OAI-SearchBot','ChatGPT-User','PerplexityBot','Bingbot','Googlebot'],allow:indexable?'/':undefined,disallow:indexable?['/admin','/api/']:['/']}],...(indexable?{sitemap:siteUrl+'/sitemap.xml'}:{})}}
