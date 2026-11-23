export interface Inquiry { kind: 'care' | 'job'; name: string; phone: string; area: string; condition: string; consent: boolean; website: string }
export async function submitInquiry(inquiry: Inquiry): Promise<void> {
 const endpoint=import.meta.env.VITE_INQUIRY_ENDPOINT;
 if(!endpoint) throw new Error('온라인 접수 연결을 준비하고 있습니다. 031-541-2094로 전화해 주세요.');
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?{apikey:import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}:{})},body:JSON.stringify(inquiry)});
 if(!response.ok) throw new Error(response.status===429?'요청이 많습니다. 잠시 후 다시 시도해 주세요.':'접수하지 못했습니다. 다시 시도하거나 센터로 전화해 주세요.');
 const result=await response.json();
 if(result.ok!==true)throw new Error('접수 결과를 확인할 수 없습니다. 센터로 전화해 주세요.');
}
