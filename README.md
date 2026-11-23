# 하와이재가방문요양센터

포천 지역 방문요양 안내·돌봄 상담·요양보호사 구직 문의를 위한 랜딩페이지 프로토타입.

## 실행

Node.js 20.19+ 또는 22.12+.

```sh
npm ci
npm run dev
```

http://localhost:4178

```sh
npm run check
npm run build
```

## 구성

React · TypeScript · Vite · Tailwind CSS · shadcn/ui (Radix) · Lucide.
기존 디자인과 SVG 일러스트를 유지하며 Select, Tabs, Accordion, Input, Label, Button을 shadcn/ui로 구현.
src/landing.html은 고정 콘텐츠, src/App.tsx는 대화형 컴포넌트, src/styles.css는 센터 디자인을 담당한다.

## 현재 범위

상담 입력은 시연용이며 저장·전송하지 않는다. 실제 후기·인력 규모·운영 실적은 기재하지 않았다.
센터 사진, 운영자 소개, 사업자 정보, 연락처·주소 및 서비스 문구는 정식 게시 전 센터 확인이 필요하다.

## 문의 저장 계획 (미구현)

별도 Supabase 프로젝트의 PostgreSQL에 저장할 예정.
홈페이지 → 서버 접수 API(검증, 스팸 방지) → inquiries 테이블 → 센터 관리자 화면.
공개 저장소에는 코드와 스키마만 포함하며 문의 데이터, 비밀 키, 실제 고객 정보는 포함하지 않는다.
이름, 연락처, 문의 종류, 희망 지역·시간, 접수 시각, 상담 상태를 우선 수집한다.
민감한 건강정보는 초기 문의에서 수집하지 않는 방향이다.
관리자 인증·권한을 설정하고 문의 테이블의 공개 조회를 차단한다.
개인정보 수집 동의, 보유·삭제 기간과 운영 담당자는 실제 접수 연결 전에 확정한다.
