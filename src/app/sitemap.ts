import type {MetadataRoute} from 'next';
import {siteUrl,indexable} from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{return indexable?['/','/visit-care','/guides/first-consultation'].map(path=>({url:siteUrl+(path==='/'?'':path),lastModified:'2026-11-23',changeFrequency:'monthly' as const,priority:path==='/'?1:.7})):[]}
