export const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?'https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL:'http://localhost:4178')).replace(/\/$/,'');
export const indexable=siteUrl.startsWith('https://')&&process.env.VERCEL_ENV!=='preview';
export const center={name:'하와이재가방문요양센터',phone:'031-541-2094',address:'경기도 포천시 소흘읍 송우로 118, 1층'};
