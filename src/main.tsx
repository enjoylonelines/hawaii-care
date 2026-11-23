import React,{lazy,Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
const Admin=lazy(()=>import('./Admin'));
import './styles.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode>{window.location.pathname.startsWith('/admin')?<Suspense fallback={<p role="status">관리 화면을 불러오고 있습니다.</p>}><Admin/></Suspense>:<App/>}</React.StrictMode>);
