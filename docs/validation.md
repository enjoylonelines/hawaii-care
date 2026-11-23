# Next.js·SEO·AI 검색 검증
검증일: 2026-11-23. 실행 환경: DevSpace, main.

## 변경
Vite CSR → Next.js 16 App Router 정적 사전 렌더링.
홈페이지·방문요양 안내·첫 상담 가이드를 공개 경로로 분리.
페이지별 제목·설명·canonical, Open Graph, LocalBusiness/Service JSON-LD, robots.txt, sitemap.xml.
확인되지 않은 후기·별점·가격·실적·운영시간·공단 평가 등급은 추가하지 않음.
관리자 경로는 메타 태그와 X-Robots-Tag로 noindex. 인증·DB RLS가 실제 접근을 통제.

## 기술 실험 결과
- 기존 Vite 첫 HTML: 핵심 문자열(소개·전화·주소·신청 버튼) 0/4.
- Next 첫 HTML: 동일 문자열 4/4.
- OAI-SearchBot UA: 소개·전화가 JavaScript 실행 없이 포함됨.
- 공개 3페이지의 HTML·canonical·공식 출처 연결 검사 통과.
- 관리자 3경로 noindex 및 초기 HTML의 실제 계정/문의 비노출 확인.
- 로컬 noindex·전체 수집 차단, 공개 production 수집 허용·sitemap 분기 모두 통과.
- production 분기 실험의 .example 도메인은 검증용이며 배포 주소가 아님.
- 잘못된 경로 404 확인.
- 타입 검사 및 Next production build 통과.
- 문의 Edge Function 실제 입력 1건 저장 확인 후 해당 테스트 데이터만 삭제. 비동의·다른 origin·익명 조회 거부.
- 지정 관리자 JWT 역할을 사용한 DB 검사에서 관리자 등록 1건 및 문의 조회 가능 확인.
- 배포 후 cloud browser에서 데스크톱 첫 화면, FAQ 펼침, 문의 폼 직접 입력·동의·제출 및 접수 완료 표시를 확인했다. 해당 레코드가 DB에 저장된 것을 조회하고 검증 레코드만 삭제했다. 관리자 로그인 화면 렌더링은 확인했으며 자격증명 입력/로그인 클릭 및 모바일 화면 검증은 미실행.

위 수치는 크롤링 가능한 HTML의 개선이다. 실제 AI 검색 순위·인용률 향상 수치가 아니다.

## 배포 후 AI 검색 실험
수집/색인 확인 후 ChatGPT 검색·Google AI 검색·Copilot에서 질문별 최소 3회 확인.
매 회차에 날짜, 서비스, 검색 활성 여부, 위치 조건, 질문 원문, 센터 언급, 공식 URL 인용, 사실 오류를 기록한다.
질문 예:
1. 하와이재가방문요양센터 홈페이지 찾아줘
2. 포천 소흘읍 방문요양센터 상담할 곳 찾아줘
3. 송우리에서 혼자 사는 부모님 방문요양 어디에 문의할까
4. 포천 방문요양 이용 절차 알려줘
5. 장기요양등급 없이 포천에서 방문요양 상담 가능한가
브랜드 질문과 비브랜드 질문을 나눠 센터 언급률과 공식 URL 인용률을 계산한다.
한 번의 응답을 확률이나 성과로 일반화하지 않는다.
AI 유입·전화 클릭·접수 전환은 개인정보 없는 집계 이벤트를 도입한 뒤 별도 측정한다.

## 외부 확인 필요
공개 URL 수집·색인, 네이버/구글/빙 소유권 확인 및 검색 관리 도구 등록, 스마트플레이스의 센터 정보 통일.
실제 서비스 지역·운영자 정보·센터 사진은 운영자 확인 후 반영.
Vercel hobeom's projects 팀에 배포 완료: https://hawaii-care.vercel.app . 공개 URL 전체 기술 검증 통과. canonical·사이트맵의 동일 production 도메인 확인. Supabase 허용 origin에 production 도메인 추가 완료. 공개 브라우저 실제 접수 → 성공 표시 → DB 저장까지 확인했다. 네이버·Google·Bing 소유권 확인 및 검색 수집/실제 AI 인용률은 아직 미검증.
