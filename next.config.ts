import type {NextConfig} from 'next';
const config:NextConfig={poweredByHeader:false,async headers(){return [{source:'/admin/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow, noarchive'},{key:'Cache-Control',value:'private, no-store'}]}]}};
export default config;