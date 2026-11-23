# 하와이재가방문요양센터

포천 지역 방문요양 안내·돌봄 상담·요양보호사 구직 문의 랜딩페이지.

## 실행
Node.js 20.19+ 또는 22.12+.
```sh
npm ci
npm run dev
```
http://localhost:4178

```sh
npm run check
node check.mjs
npm run build
```

React · TypeScript · Vite · Tailwind CSS · shadcn/ui (Radix) · Lucide.
기존 디자인과 SVG 일러스트를 유지하며 Select, Tabs, Accordion, Input, Label, Button을 shadcn/ui로 구현.
src/landing.html은 고정 콘텐츠, src/App.tsx는 대화형 컴포넌트, src/styles.css는 센터 디자인을 담당한다.

## 문의 접수
hobeom 조직, 서울 리전 Supabase 프로젝트: hawaii-care (jmcucqvwizayidzlllsg).
폼 → submit-inquiry Edge Function → PostgreSQL inquiries 테이블.
관리자 로그인은 /admin/login, 문의 관리는 /admin이다. /admin/preview는 예시 데이터만 표시하며 DB를 조회하지 않는다. Supabase Auth 이메일/비밀번호 로그인 후 care_admins에 등록된 user_id만 조회·상태 변경할 수 있다. 회원가입 UI는 제공하지 않는다. 실제 관리자 이메일을 확정한 뒤 Auth 사용자 생성 및 care_admins 등록이 필요하다. 로그인 계정은 아직 만들지 않았다.
공개·비관리자 로그인 사용자의 조회·수정·직접 삽입을 차단했다. 관리자는 문의 상세 조회 및 status만 변경할 수 있고 연락처·원본 문의를 수정하거나 관리자 권한을 스스로 부여할 수 없다. DB 트랜잭션으로 관리자·비관리자 접근 및 컬럼 권한을 검증하고 테스트 사용자를 롤백했다. 스키마 변경 참조는 supabase/admin-schema.sql에 기록했다.
서비스 키는 Edge Function 환경에만 있고 공개 저장소·브라우저에 포함하지 않는다.
서버 입력 검증, 개인정보 수집 동의, 허니팟, IP 해시별 시간당 5건 제한을 적용했다.
원본 IP는 저장하지 않는다. 문의는 접수 후 90일 만료되며 매일 한국시간 03:15에 만료 데이터를 삭제한다.
접수 오류 시 성공으로 표시하지 않는다.

.env.example을 참고하여 .env.local에 접수 URL, 공개 publishable 키와 JWT 게이트웨이 호환용 anon 키를 설정한다.
로컬 프로젝트에는 설정되어 있다. 공개용 키도 코드와 분리해 관리하며 실제 문의 데이터·비밀 키는 저장소에 포함하지 않는다.
현재 CORS는 localhost:4178과 127.0.0.1:4178만 허용한다.
실제 배포 시 Edge Function의 INQUIRY_ALLOWED_ORIGINS 환경변수에 정확한 사이트 origin을 지정해야 한다.
supabase/schema.sql은 적용된 스키마 참조본이며 기존 DB에 재실행하는 설치 스크립트가 아니다.

## 검증
실제 Edge Function 접수, DB 기록 확인, 비동의 요청 거부, 다른 origin 거부, 익명 조회 차단을 확인했다.
`node scripts/verify-inquiries.mjs`는 테스트 문의를 실제 생성한다. 실행 후 name=INTEGRATION_TEST, area=TEST_DELETE인 기록만 삭제해야 한다.
타입·프로덕션 빌드·서버 렌더링 회귀검사를 통과했다. 브라우저 시각·조작 검증은 별도 필요하다.
센터 사진·운영자·사업자 정보 및 서비스 문구는 운영자 확인 후 보강한다.
