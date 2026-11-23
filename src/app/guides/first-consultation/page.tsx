import type {Metadata} from 'next';
import GuideLayout from '@/components/GuideLayout';
export const metadata:Metadata={title:'방문요양 첫 상담 준비·등급 유무별 안내',description:'장기요양등급을 모르거나 처음 방문요양을 알아볼 때 준비할 내용과 하와이재가방문요양센터 상담 방법을 안내합니다.',alternates:{canonical:'/guides/first-consultation'}};
export default function Page(){return <GuideLayout title="방문요양 첫 상담, 무엇을 준비하나요?" description="모든 정보를 알고 계실 필요는 없습니다. 현재 알고 있는 내용부터 알려주세요.">
<h2>장기요양등급을 모르는데 상담할 수 있나요?</h2><p>네. 등급이 없거나 등급 여부를 모르셔도 센터에 상담을 문의할 수 있습니다. 보험을 통한 실제 이용 가능 여부는 인정 결과와 이용 조건을 확인해야 합니다. 센터의 상담이 공단의 등급 판정을 대신하지는 않습니다.</p>
<h2>첫 전화에서 알려주면 좋은 내용</h2><ul><li>어르신이 거주하는 지역과 문의하는 분의 연락처</li><li>식사·이동·세면 등 혼자 하기 어려운 일</li><li>희망하는 요일·시간과 돌봄 시작 시점</li><li>장기요양등급의 유무 또는 신청 진행 상황</li><li>요양보호사와 생활할 때 중요하게 생각하는 점</li></ul>
<h2>등급이 있다면 무엇을 확인하나요?</h2><p>장기요양인정서와 개인별장기요양이용계획서가 있다면 상담 시 내용을 확인할 수 있습니다. 온라인 첫 문의에는 서류나 주민등록번호를 올리지 않아도 됩니다. 필요한 자료는 센터와 상담하며 안내받으세요.</p>
<h2>시작하기 전에 물어볼 질문</h2><ul><li>희망 지역과 시간에 배정이 가능한가요?</li><li>가능한 시작일과 예상 비용은 어떻게 되나요?</li><li>일정이 바뀌거나 요양보호사 연결이 어려우면 어떻게 안내받나요?</li><li>이용 중 불편한 점은 누구에게 연락하나요?</li></ul>
<p><a href="/visit-care">센터 위치와 방문요양 연결 과정 보기</a></p>
<h2>공식 제도 안내</h2><p>등급 인정과 신청에 관한 최신 안내는 <a href="https://www.longtermcare.or.kr/" target="_blank" rel="noopener noreferrer">국민건강보험공단 노인장기요양보험</a>에서 확인해 주세요.</p>
</GuideLayout>}
