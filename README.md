# 하와이재가방문요양센터
포천 지역 방문요양 안내·돌봄 상담·요양보호사 구직 문의 웹사이트.

## 실행
Next.js 16 App Router · React · TypeScript · Tailwind CSS · shadcn/ui(Radix) · Supabase.
Node.js 20.19+ 또는 22.12+.
```sh
npm ci
npm run dev
```
http://localhost:4178
```sh
npm run check
npm run build
npm run preview
npm test
```
preview는 빌드된 Next 서버를 백그라운드로 실행한다. 기존 4178 서버가 있으면 새로 시작하지 말고 해당 서버 상태부터 확인한다.
.env.example을 참고하여 .env.local에 NEXT_PUBLIC_ 접수 URL·publishable 키·JWT 게이트웨이 호환 anon 키를 설정한다. 이들은 공개 클라이언트용 값이다. 서비스 키는 브라우저나 저장소에 넣지 않는다.

## 페이지
- /: 디자인을 유지한 사전 렌더링 홈페이지
- /visit-care: 포천 방문요양·센터·이용 절차
- /guides/first-consultation: 첫 상담 준비 안내
- /admin/login: Supabase Auth 이메일/비밀번호 로그인
- /admin: 관리자 문의 목록·검색·상태 변경·전화 연결
- /admin/preview: 가상 예시 데이터만 표시, DB 조회 없음

## SEO / AI 검색
Next 정적 HTML에 핵심 정보와 FAQ 답변을 포함하고 페이지별 제목·설명·canonical·Open Graph를 제공한다.
홈에 LocalBusiness와 Service JSON-LD를 제공한다. robots.txt는 검색·AI 검색 수집기를 허용하되 관리자 경로를 제외한다.
공개 URL이 없는 로컬 환경과 Vercel preview는 noindex, production의 유효 HTTPS URL은 색인 대상으로 설정한다.
NEXT_PUBLIC_SITE_URL로 canonical origin을 지정할 수 있고, 미지정 시 Vercel의 VERCEL_PROJECT_PRODUCTION_URL을 사용한다.
관리자 경로는 metadata와 HTTP X-Robots-Tag로 noindex. 실제 보안은 인증과 RLS로 통제한다.
관리자/접수 API는 sitemap에 포함하지 않는다.
기술 실험과 실제 AI 검색 노출 실험 계획: docs/validation.md.
`node scripts/verify-production.mjs`는 .example 테스트 origin으로 production 색인 분기를 검증한다. 실행 후 일반 환경으로 다시 빌드해야 한다.
AI 검색 노출·인용률 향상은 아직 측정하지 않았다.

## 문의 데이터
hobeom 조직 / 서울 리전 Supabase hawaii-care (jmcucqvwizayidzlllsg).
브라우저 → submit-inquiry Edge Function → PostgreSQL inquiries.
원본 IP 대신 해시로 시간당 5건 제한, 입력·동의 검증, 허니팟.
접수일부터 90일 보관, 매일 한국시간 03:15 만료 레코드 삭제.
care_admins 등록 계정만 문의의 허용 컬럼 조회 및 status 변경이 가능하다.
비관리자는 읽기/수정 불가, 관리자는 원본 연락처 변경·직접 삽입·관리자 권한 부여 불가.
`node scripts/verify-inquiries.mjs`는 INTEGRATION_TEST_NEXT 테스트 문의를 실제 생성한다. 검증 후 이 테스트만 삭제한다.
기존 INTEGRATION_TEST 레코드 1건은 사용자가 확인할 수 있게 남겨둔 데이터다.

## Vercel 배포
DevSpace 기기에서 Vercel 계정에 로그인해야 한다.
```sh
npx vercel login
npx vercel project inspect hawaii-care
node scripts/deploy-vercel.mjs
```
기존 같은 이름의 프로젝트가 있으면 이 저장소의 프로젝트인지 먼저 확인한다.
배포 스크립트는 공개 클라이언트 환경변수만 build/runtime에 전달한다.
서비스 역할 키·관리자 비밀번호·.env.local은 배포 소스에 포함하지 않는다.
임시 claim 배포는 영구 SEO 주소로 사용하지 않는다.
배포 후 확정된 origin을 Edge Function INQUIRY_ALLOWED_ORIGINS에 추가하거나 함수의 허용 목록을 갱신하고, 실제 공개 URL에서 문의 전송을 다시 검증해야 한다.
공개 도메인이 확정되면 canonical·robots·sitemap을 재검사하고 네이버·Google·Bing의 소유권 확인/사이트맵 제출을 진행한다.
브라우저 시각·로그인 클릭 검증은 아직 미실행.
