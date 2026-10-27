# 다온설비 관리자 패널

- 운영 경로: https://daon-tau.vercel.app/admin (daon-sewer.vercel.app/admin에서도 동일)
- 데이터베이스: Supabase 프로젝트 `daon-analytics` (`huumdhwjutsqwmkpuyqm`), 서울 리전
- 빌드 설정: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- 프런트엔드에는 공개용 publishable key만 포함합니다. service role key는 사용하지 않습니다.

## 관리자 계정 연결

운영자 이메일을 확인한 다음 Supabase SQL Editor에서 승인합니다. 이메일은 사용자에게 직접 받은 값을 사용합니다.

```sql
insert into daon_private.admin_allowlist(email)
values (lower('사용자가 확인한 이메일')) on conflict do nothing;
-- 이미 인증한 계정이 있다면 권한을 동기화합니다.
insert into public.daon_admins(user_id)
select id from auth.users
where lower(email) in (select email from daon_private.admin_allowlist)
and email_confirmed_at is not null
on conflict do nothing;
```

운영자는 `/admin`에서 계정 등록 → 이메일 인증 → 로그인을 진행합니다.
Supabase Authentication → URL Configuration의 Site URL을 `https://daon-tau.vercel.app/admin`으로 설정하고,
Redirect URLs에 두 운영 도메인의 `/admin` 경로를 등록합니다.
메일 인증을 마치면 관리자 화면으로 돌아와 로그인합니다. 초기 설정 전에는 승인된 계정이 없으므로 통계 접근은 차단됩니다.

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
관리자 허용 이메일은 비공개 `daon_private` 스키마에 저장하고, 이메일 인증 완료 시 트리거로 권한을 부여합니다.
집계 함수 `daon_summary`는 security invoker로 RLS를 따릅니다.
공개 수집 엔드포인트이므로 위조·봇 클릭은 완전히 방지되지 않습니다. 통계는 결제나 청구의 근거로 사용하지 않습니다.

## 검증

`npm test`는 유입 분류, 캠페인 유지, 동일 세션 연결, 만료, 저장소 차단을 확인합니다.
`npm run build`로 배포 빌드를 확인합니다.
DB 익명 쓰기, 익명 조회 거부, 서버 시각 위조 거부, 일반 로그인 계정 조회 차단을 별도로 검증했습니다.
