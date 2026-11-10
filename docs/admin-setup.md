# 다온설비 관리자 패널

- 운영 경로: https://daon-tau.vercel.app/admin (daon-sewer.vercel.app/admin에서도 동일)
- 데이터베이스: Supabase 프로젝트 `daon-analytics` (`huumdhwjutsqwmkpuyqm`), 서울 리전
- 빌드 설정: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- 프런트엔드에는 공개용 publishable key만 포함합니다. service role key는 사용하지 않습니다.

## 관리자 계정 연결

누구나 `/admin`에서 이메일과 비밀번호로 가입할 수 있습니다. 이메일 인증 후에는 관리자 승인 대기 상태가 됩니다. `mrjohnny1215@gmail.com` 계정만 관리자 메뉴의 **관리자 가입 승인**에서 요청을 승인하거나 거부할 수 있습니다.
승인된 계정만 `daon_admins`에 등록되어 기록을 조회할 수 있습니다. 비밀번호는 Supabase Auth에서 확인하며 앱 코드나 Vercel 환경변수에 저장하지 않습니다.
Supabase Authentication → URL Configuration의 Site URL을 `https://daon-tau.vercel.app/admin`으로 설정하고,
Redirect URLs에 두 운영 도메인의 `/admin` 경로를 등록합니다.
메일 인증을 마치면 관리자 계정이 승인 대기 목록에 표시됩니다.

## 저장 항목과 통계 정의

- `daon_events`: 서버 저장 시각, 익명 세션 UUID, page_view/phone_click, 구글/네이버/직접·미상/기타,
  유입 유형, 캠페인, 경로, 버튼 위치, 모바일/PC.
- 손님 전화번호, IP, 원본 Referer URL, 원본 URL 쿼리, 상세 기기 정보는 저장하지 않습니다.
- 세션은 탭 단위이며 마지막 활동 후 30분에 만료합니다. 같은 세션·페이지의 방문은 한 번 기록합니다.
- 1.5초 이내 연속 전화 클릭을 중복 처리합니다. 실제 수신·통화 연결은 추적하지 않습니다.
- 기간은 한국 시간 자정부터 계산하며 최근 90일까지 조회합니다. CSV는 최대 최신 10,000건입니다.
- 전화 클릭률 = 클릭한 고유 세션 / 방문한 고유 세션. 광고 차단이나 저장소 제한 시 일부 누락될 수 있습니다.
- 추적 링크의 source/medium/campaign은 방문과 클릭에 동일하게 적용합니다.

## 접근 제어

모든 공개 테이블에 RLS를 적용했습니다.
익명 방문자는 이벤트 삽입만 가능하며 서버 시각을 지정하거나 조회·수정·삭제할 수 없습니다.
인증 계정도 `daon_admins`에 등록되어야 이벤트를 읽을 수 있습니다.
이메일 인증 완료 시 `daon_admin_requests`에 승인 요청이 생성됩니다. 승인·거부 RPC는 고정된 소유자 사용자 ID만 실행할 수 있으며, 요청 테이블은 RLS가 켜져 있고 anon/authenticated 직접 접근을 허용하지 않습니다.
집계 함수 `daon_summary`는 security invoker로 RLS를 따릅니다.
공개 수집 엔드포인트이므로 위조·봇 클릭은 완전히 방지되지 않습니다. 통계는 결제나 청구의 근거로 사용하지 않습니다.

## 검증

`npm test`는 유입 분류, 캠페인 유지, 동일 세션 연결, 만료, 저장소 차단을 확인합니다.
`npm run build`로 배포 빌드를 확인합니다.
DB 익명 쓰기, 익명 조회 거부, 서버 시각 위조 거부, 일반 로그인 계정 조회 차단을 별도로 검증했습니다.

## 방문자 분석 확장

- 2026-10-28 추가: `visitor_id`(브라우저 localStorage, 90일 만료), 국가 코드, 운영체제, 브라우저, 태블릿 구분.
- 국가는 `/api/collect` 서버에서 Vercel 국가 헤더를 읽습니다. 클라이언트 전송의 country/OS/browser 값은 무시합니다.
- 서버는 raw IP나 전체 user-agent를 DB에 저장하지 않습니다. 국가와 기기 정보는 추정치입니다.
- 관리자 '방문자 분석'에서 국가·기기·활동별 필터, 방문자 ID별 이력, CSV를 제공합니다.
- 기존 데이터에는 새 정보를 역으로 붙이지 않으며 '미확인·기존 기록'으로 표시합니다.
- 사이트 푸터에서 수집 항목을 안내하고, 브라우저별 수집 중단을 지원합니다. 저장소 차단 또는 삭제·새 기기·시크릿 모드에서는 동일인을 연결할 수 없습니다.
- 기본 조회 범위는 90일이며 DB 자동 삭제 정책은 별도 구성하지 않았습니다.
