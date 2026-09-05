# AI@Sogang MT Round 3 Live — Product Requirements Document

> 문서 상태: Draft v1.0  
> 작성일: 2026-09-03  
> 대상 행사: AI@Sogang 3기 MT Recreation — Round 3 `AI 대답 예측`  
> 원본 Canva: https://www.canva.com/design/DAHTZ3KMppY/t1z-d0JLfnmbhp6LacCN0A/edit

---

## 1. 문서 목적

본 문서는 AI@Sogang MT 레크리에이션의 마지막 라운드인 `AI 대답 예측`을 실시간 참여형 웹 게임으로 구현하기 위한 제품 요구사항과 기술 설계를 정의한다.

행사 참가자는 QR 코드로 웹사이트에 접속하여 주어진 질문에 대해 AI가 선택할 것 같은 보기와 이유를 제출한다. 제출이 마감되면 서버가 실제 OpenAI API에 동일한 질문을 보내 AI 답변을 생성한다. 이후 참가자 답변과 AI 답변의 선택지 일치 여부 및 의미적 유사도를 계산하여 문제별 순위와 누적 점수를 발표 화면에 표시한다.

이 문서는 기획자, 디자이너, 프론트엔드·백엔드 개발자, 행사 진행자가 동일한 기준으로 개발과 리허설을 진행하기 위한 기준 문서다.

---

## 2. 배경 및 문제 정의

현재 Canva 발표 자료는 총 45페이지이며, Round 3는 다음과 같이 구성되어 있다.

- 34페이지: Round 3 시작 화면
- 35–44페이지: 객관식 질문 10개
- 45페이지: 종료 화면

현재 자료는 질문과 보기를 정적으로 보여줄 수 있지만 다음 기능은 지원하지 않는다.

- 참가자가 자신의 휴대폰으로 답변 제출
- 실시간 제출 인원 확인
- OpenAI API를 통한 실제 AI 답변 생성
- 참가자 답변과 AI 답변의 의미적 유사도 계산
- 문제별 순위 및 누적 점수 자동 집계
- 발표 화면의 실시간 결과 갱신

또한 기존 질문 번호가 `1, 2, 4, 5, 6, 7, 8, 9, 11, 12`로 되어 있으므로 서비스 내에서는 1–10번으로 정규화한다. Canva 슬라이드 번호도 행사 전에 동일하게 수정하는 것을 권장한다.

---

## 3. 제품 목표

### 3.1 핵심 목표

1. 참가자가 별도 앱 설치 없이 QR 코드만으로 30초 이내에 게임에 입장할 수 있어야 한다.
2. 발표자가 질문을 직접 다시 입력하지 않고 버튼 조작만으로 10개 문제를 진행할 수 있어야 한다.
3. 모든 참가자 제출을 마감한 후 실제 OpenAI API로 AI 답변을 한 번 생성하고 고정해야 한다.
4. 참가자 답변을 선택지 일치와 의미 유사도 기준으로 자동 채점해야 한다.
5. 문제별 결과와 누적 순위가 발표 화면에 실시간으로 반영되어야 한다.
6. 행사장의 네트워크 또는 외부 API 장애가 발생해도 게임을 계속 진행할 수 있어야 한다.

### 3.2 성공 지표

- 참가자 입장 성공률: 95% 이상
- 유효 답변 제출 성공률: 98% 이상
- 답변 제출 후 발표 화면 인원 반영 시간: 정상 네트워크 기준 1.5초 이내
- 제출 API 응답 시간: p95 500ms 이내
- AI 답변 생성 완료 시간: 정상 상황에서 10초 이내 목표
- 사회자의 문제 전환 오류: 리허설 및 본 행사에서 0건
- 중복 채점 및 한 문제 다중 점수 반영: 0건
- API 키 또는 AI 정답의 사전 노출: 0건

---

## 4. 범위

### 4.1 MVP 포함 범위

- 단일 행사 방 생성 및 운영
- 참가자 익명 입장
- 닉네임 또는 팀명 등록
- A–D 보기 선택
- AI가 답할 것 같은 이유 입력
- 답변 수정 및 최종 제출
- 카운트다운과 자동 제출 마감
- OpenAI API를 통한 AI 답변 생성
- AI 답변 구조화 및 저장
- 임베딩 기반 의미 유사도 계산
- 선택지 일치 점수 및 유사도 점수 합산
- 문제별 TOP 5 표시
- 전체 누적 리더보드 표시
- 사회자용 진행 화면
- 프로젝터용 발표 화면
- QR 코드 및 방 코드 접속
- 장애 시 백업 AI 답변 사용
- 점수 수동 수정 및 문제 재공개 기능

### 4.2 MVP 제외 범위

- 소셜 로그인
- 참가자 이메일·전화번호 수집
- 여러 행사를 동시에 운영하는 완전한 SaaS 관리자 시스템
- 결제 및 유료 구독
- 참가자 간 채팅
- 네이티브 iOS·Android 앱
- Canva 프레젠테이션 내부에서 직접 실행되는 커스텀 Canva 앱
- AI가 참가자 답변을 참고하여 정답을 변경하는 기능
- 음성 답변 및 음성 인식

### 4.3 추후 확장 가능 범위

- 개인전·팀전 모드 선택
- 여러 AI 모델 답변 비교
- 질문 편집 CMS
- 결과 PDF 또는 CSV 내보내기
- 관객 투표 점수
- 답변 워드클라우드
- 행사별 테마 저장
- 다국어 UI

---

## 5. 대상 사용자

### 5.1 참가자

- 행사장에 있는 대학생
- 개인 휴대폰으로 QR 코드 접속
- 회원가입 없이 닉네임으로 참여
- 기술 지식이 없어도 사용 가능해야 함

### 5.2 사회자

- 현재 질문 공개·마감·결과 공개를 제어
- 참가자 수와 시스템 상태 확인
- 장애 시 재시도 또는 백업 답변 선택
- 필요할 경우 참가자 점수 조정

### 5.3 발표 화면 운영자

- 사회자와 동일 인물일 수 있음
- 노트북을 프로젝터에 연결
- Canva와 라이브 발표 화면을 전체 화면 탭으로 전환

---

## 6. 권장 게임 규칙

### 6.1 참가자 입력

각 문제에서 참가자는 다음을 제출한다.

1. AI가 선택할 것으로 예상하는 보기 1개
2. AI가 그렇게 선택할 것으로 예상하는 이유 5–120자

이유 입력을 필수로 두어 의미 유사도 채점이 가능하게 한다. 공백만 있는 입력, 5자 미만 입력, 120자 초과 입력은 제출할 수 없다.

### 6.2 문제 진행 시간

- 질문 소개: 사회자 재량
- 답변 제출: 기본 30초
- 마감 전 경고: 10초, 5초
- AI 답변 생성: 최대 10초 목표
- 결과 공개: 약 20초
- 누적 순위: 약 10초

질문별 제한 시간은 데이터베이스에서 개별 설정 가능하게 한다.

### 6.3 점수 정책

총점은 문제당 100점이다.

```text
최종 점수 = 선택지 일치 점수 + 의미 유사도 점수

선택지 일치 점수
- AI 선택과 동일: 70점
- AI 선택과 다름: 0점

의미 유사도 점수
- GPT-5.6 sol이 AI 이유와 참가자 이유의 의미·핵심 근거 유사도를 절대 기준으로 0–30점 평가
```

선택지 일치가 점수의 대부분을 차지하므로 Round 3의 핵심인 `AI 선택 예측`이 유지된다. 이유 유사도는 같은 선택지를 고른 참가자 사이에서 차이를 만드는 요소로 사용한다.

#### 유사도 절대 평가

- 30점: 핵심 주장과 근거가 사실상 동일
- 20점: 핵심 의미가 상당 부분 겹침
- 10점: 일부 관련된 의미만 포함
- 0점: 무관하거나 반대되는 이유

참가자끼리 상대평가하지 않는다. 선택지 일치 여부는 별도 70점에만 반영하며 이유 유사도에 중복 가중하지 않는다.

#### 최종 동점 처리

1. 누적 총점
2. 전체 문제에서 선택지를 정확히 맞힌 횟수
3. 전체 의미 유사도 평균
4. 전체 유효 제출 시간 합계가 짧은 참가자
5. 그래도 동일하면 공동 순위

제출 속도는 마지막 동점 해소 수단일 뿐, 기본 점수에는 포함하지 않는다.

---

## 7. 사용자 경험 및 진행 흐름

### 7.1 참가자 입장

1. 발표 화면에 QR 코드, 짧은 URL, 방 코드를 표시한다.
2. 참가자는 `/play/{roomCode}`에 접속한다.
3. 닉네임을 입력한다.
4. 서버는 브라우저에 익명 참가자 토큰을 안전한 쿠키로 발급한다.
5. 참가자는 대기 화면으로 이동한다.
6. 이미 같은 닉네임이 있으면 숫자 접미사를 제안하거나 다른 닉네임 입력을 요청한다.

### 7.2 문제 진행

1. 사회자가 `질문 공개`를 누른다.
2. 참가자와 발표 화면에 동일한 질문이 표시된다.
3. 서버 기준 종료 시각이 전달되고 모든 화면이 같은 시각을 기준으로 카운트다운한다.
4. 참가자는 선택지와 이유를 제출한다.
5. 제출 기간 중에는 답변을 수정할 수 있다.
6. 종료 시각 이후 서버는 제출을 거부한다.
7. 사회자가 조기 마감할 수도 있다.

### 7.3 AI 답변 및 채점

1. 문제가 `SUBMISSION_LOCKED` 상태가 되면 참가자 답변이 변경 불가능해진다.
2. 사회자가 `AI에게 질문하기`를 누른다.
3. 서버는 현재 질문과 선택지를 OpenAI Responses API에 전송한다.
4. AI가 반환한 구조화된 답변을 비공개 테이블에 한 번 저장한다.
5. 서버는 AI 이유와 모든 참가자 이유를 임베딩으로 변환한다.
6. 유사도와 점수를 계산하고 데이터베이스 트랜잭션으로 확정한다.
7. 사회자가 `결과 공개`를 누르면 AI 답변과 TOP 5가 공개 상태에 복사된다.
8. 발표 화면이 실시간으로 결과를 표시한다.

### 7.4 게임 종료

1. 10번 문제 결과 공개 후 전체 순위를 확정한다.
2. TOP 3를 시상 화면으로 표시한다.
3. 전체 참가자 점수는 사회자 화면에서 확인할 수 있다.
4. 발표자는 Canva 45페이지 종료 화면으로 돌아갈 수 있다.

---

## 8. 화면 요구사항

### 8.1 참가자 화면 `/play/[roomCode]`

#### 입장 화면

- 행사명
- 방 코드
- 닉네임 입력
- 참가 버튼
- 개인정보 미수집 안내

#### 대기 화면

- 등록된 닉네임
- 현재 접속 인원
- `사회자가 곧 시작합니다` 안내
- 연결 상태 표시

#### 질문 화면

- 문제 번호
- 질문 본문
- A–D 보기
- 이유 입력 필드
- 남은 글자 수
- 제출 또는 답변 수정 버튼
- 서버 기준 카운트다운
- 제출 성공 여부

#### 마감 화면

- `답변이 마감되었습니다`
- 본인이 제출한 답변
- AI 답변 대기 애니메이션

#### 결과 화면

- AI 선택과 이유를 화면 상단의 가장 큰 강조 영역으로 표시
- 본인의 선택
- 선택지 점수, 유사도 점수, 최종 점수
- 문제별 참가자 답변 및 점수
- 다음 문제 대기 안내

### 8.2 사회자 화면 `/host/[roomCode]`

- 관리자 인증
- 전체 참가자 및 연결 상태
- 현재 문제 및 다음 문제 미리보기
- 문제 공개
- 제출 마감
- AI 답변 생성
- AI API 상태와 소요 시간
- 결과 공개
- 누적 리더보드 선택 공개
- 리더보드를 건너뛰고 다음 문제 이동
- 마지막 문제에서는 최종 리더보드 공개를 필수 단계로 적용
- 이전 문제 복귀
- 문제 재공개
- AI 호출 재시도
- 백업 답변 사용
- 특정 참가자 실격 또는 점수 조정
- 이벤트 로그
- 전체 게임 종료

위험한 조작에는 확인 대화상자를 표시한다. 동일한 버튼을 여러 번 눌러도 중복 호출이나 중복 채점이 발생하지 않아야 한다.

### 8.3 발표 화면 `/screen/[roomCode]`

- 16:9, 1920×1080 기준
- Canva Round 3의 색상·타이포그래피·카드 스타일과 시각적으로 연결
- 참가자 입력 요소 없음
- 발표 환경에서 3m 이상 떨어져도 읽을 수 있는 글자 크기
- 상태에 따른 전체 화면 전환 애니메이션
- QR 입장 화면
- 질문 및 카운트다운
- 제출 인원 `24 / 30`
- AI 답변 생성 애니메이션
- AI 선택과 이유
- TOP 5 카드
- 누적 TOP 10
- 최종 시상 화면

발표 화면에는 참가자의 원문을 표시하므로 HTML을 escape하고, 너무 긴 문장은 말줄임 처리한다.

---

## 9. 시스템 상태 모델

방은 다음 상태 중 하나를 가진다.

```text
DRAFT
→ LOBBY
→ QUESTION_OPEN
→ SUBMISSION_LOCKED
→ AI_GENERATING
→ SCORING
→ ANSWER_READY
→ ANSWER_REVEALED
→ LEADERBOARD (사회자 선택, 마지막 문제는 필수)
→ QUESTION_OPEN (다음 문제)
→ FINISHED
```

### 상태 전이 규칙

| 현재 상태 | 허용 명령 | 다음 상태 |
|---|---|---|
| DRAFT | 방 열기 | LOBBY |
| LOBBY | 1번 질문 공개 | QUESTION_OPEN |
| QUESTION_OPEN | 자동/수동 마감 | SUBMISSION_LOCKED |
| SUBMISSION_LOCKED | AI 답변 생성 | AI_GENERATING |
| AI_GENERATING | 생성 성공 | SCORING |
| AI_GENERATING | 실패 후 백업 사용 | SCORING |
| SCORING | 채점 완료 | ANSWER_READY |
| ANSWER_READY | 결과 공개 | ANSWER_REVEALED |
| ANSWER_REVEALED | 순위 공개 | LEADERBOARD |
| ANSWER_REVEALED | 다음 문제(1–9번) | QUESTION_OPEN |
| LEADERBOARD | 다음 문제 | QUESTION_OPEN |
| LEADERBOARD | 마지막 문제 종료 | FINISHED |

상태 전이는 서버만 수행한다. 클라이언트는 상태 변경을 요청할 수 있지만 직접 데이터베이스 상태를 수정할 수 없다.

---

## 10. 기술 스택

### 10.1 최종 권장안

| 영역 | 기술 | 선택 이유 |
|---|---|---|
| 언어 | TypeScript | 프론트엔드·백엔드 타입 공유, JSON 스키마 오류 감소 |
| 웹 프레임워크 | Next.js App Router | 참가자·사회자·발표 화면과 서버 API를 한 프로젝트에서 관리 |
| UI | React + Tailwind CSS | 모바일 및 발표용 반응형 화면을 빠르게 구현 |
| UI 컴포넌트 | shadcn/ui 기반 자체 테마 | 접근성과 개발 속도를 확보하면서 Canva 스타일 커스터마이징 |
| 폼 검증 | React Hook Form + Zod | 클라이언트·서버 입력 규칙 통일 |
| 백엔드 API | Next.js Route Handlers | 별도 백엔드 서버 없이 서버 전용 OpenAI 호출과 관리자 명령 처리 |
| 데이터베이스 | Supabase PostgreSQL | 관계형 제약, 트랜잭션, 집계, 관리 편의성 |
| 실시간 통신 | Supabase Realtime | 참가자 수, 상태, 결과, 순위 갱신 전달 |
| AI 답변 | OpenAI Responses API | 텍스트 및 구조화된 JSON 답변 생성 |
| AI 모델 | `gpt-5.6-sol` | 복합 질문에 대한 높은 답변 품질과 구조화 출력 지원 |
| 의미 비교 | `text-embedding-3-small` | 짧은 한국어 답변의 관련성 벡터 생성 |
| 배포 | Vercel | Next.js 서버 기능과 프리뷰 배포 운영 단순화 |
| 모니터링 | Sentry + Vercel Logs | 프론트엔드 오류, 서버 오류, 외부 API 지연 추적 |
| E2E 테스트 | Playwright | 휴대폰·사회자·발표 화면 간 전체 흐름 자동 검증 |
| 단위 테스트 | Vitest | 점수 알고리즘과 상태 전이 테스트 |
| 부하 테스트 | k6 또는 Artillery | 50–100명 동시 제출 시나리오 검증 |

### 10.2 백엔드 선택

MVP 백엔드는 별도 Express, NestJS 또는 FastAPI 서버를 만들지 않고 **Next.js 서버 기능을 사용하는 모듈형 모놀리스**로 구현한다.

이유는 다음과 같다.

- 예상 사용자가 한 행사 기준 수십 명 규모다.
- 프론트엔드와 백엔드 타입을 공유할 수 있다.
- OpenAI API 키를 서버에서 안전하게 사용할 수 있다.
- 하나의 저장소와 하나의 배포 파이프라인만 관리하면 된다.
- 사회자 명령, 참가자 제출, 채점 로직을 도메인 모듈로 분리하면 추후 별도 서버로 이전 가능하다.

서버 기능은 런타임 호환성과 OpenAI SDK 사용 편의를 위해 Node.js 런타임을 사용한다. AI 생성과 임베딩 작업은 Edge Runtime에 의존하지 않는다.

### 10.3 별도 백엔드가 필요한 시점

다음 조건 중 하나가 충족되면 NestJS 또는 별도 워커로 분리하는 것을 검토한다.

- 여러 행사 방을 동시에 대규모로 운영
- 동시 접속자 500명 이상을 지속적으로 지원
- AI 채점 작업 큐 및 재처리 기능 필요
- 장시간 실행 작업 증가
- 복잡한 관리자·조직·권한 관리 도입

현재 행사의 MVP에는 해당하지 않는다.

---

## 11. 권장 프로젝트 구조

```text
src/
  app/
    play/[roomCode]/
    host/[roomCode]/
    screen/[roomCode]/
    api/
      rooms/
      participants/
      submissions/
      host/
      ai/
      scoring/
  components/
    game/
    host/
    screen/
    ui/
  features/
    rooms/
    questions/
    participants/
    submissions/
    ai-answer/
    scoring/
    leaderboard/
  lib/
    openai/
    supabase/
    auth/
    validation/
    realtime/
  server/
    services/
    repositories/
    state-machine/
  types/
supabase/
  migrations/
  seed.sql
tests/
  unit/
  integration/
  e2e/
```

UI 컴포넌트에서 OpenAI 또는 데이터베이스를 직접 호출하지 않는다. 모든 비즈니스 로직은 `server/services`와 `features`에 둔다.

---

## 12. 데이터 모델

### 12.1 `rooms`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | 방 ID |
| code | varchar unique | 참가자용 방 코드 |
| title | varchar | 행사명 |
| status | enum | 현재 상태 |
| current_question_id | uuid nullable | 현재 질문 |
| state_version | bigint | 동시 상태 변경 방지 버전 |
| participant_mode | enum | individual/team |
| max_participants | integer | 기본 100 |
| created_at | timestamptz | 생성 시각 |
| expires_at | timestamptz | 방 만료 시각 |

### 12.2 `room_secrets`

| 필드 | 타입 | 설명 |
|---|---|---|
| room_id | uuid PK/FK | 방 ID |
| admin_secret_hash | text | 사회자 비밀키 해시 |
| created_at | timestamptz | 생성 시각 |

이 테이블은 서비스 역할만 접근할 수 있다.

### 12.3 `questions`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | 질문 ID |
| room_id | uuid FK | 방 ID |
| order_no | integer | 1–10 |
| prompt | text | 질문 |
| options | jsonb | 보기 목록 |
| time_limit_seconds | integer | 기본 30초 |
| prompt_version | integer | 프롬프트 변경 추적 |
| fallback_answer | jsonb | 장애 시 백업 답변 |

`unique(room_id, order_no)` 제약을 둔다.

### 12.4 `question_runs`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | 문제 실행 ID |
| question_id | uuid FK | 질문 ID |
| attempt_no | integer | 재공개 횟수 |
| status | enum | 문제 실행 상태 |
| opened_at | timestamptz | 공개 시각 |
| closes_at | timestamptz | 서버 기준 마감 시각 |
| locked_at | timestamptz | 실제 마감 시각 |
| revealed_at | timestamptz | 결과 공개 시각 |

문제를 재공개할 때 이전 제출을 덮어쓰지 않고 새로운 실행을 만들 수 있다.

### 12.5 `participants`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | 참가자 ID |
| room_id | uuid FK | 방 ID |
| nickname | varchar | 표시 이름 |
| normalized_nickname | varchar | 중복 확인용 이름 |
| participant_token_hash | text | 익명 세션 토큰 해시 |
| status | enum | active/disqualified |
| joined_at | timestamptz | 입장 시각 |
| last_seen_at | timestamptz | 마지막 접속 시각 |

### 12.6 `submissions`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | 제출 ID |
| question_run_id | uuid FK | 문제 실행 ID |
| participant_id | uuid FK | 참가자 ID |
| selected_option | varchar | A–D |
| predicted_reason | varchar(120) | 예상 이유 |
| normalized_reason | text | 채점용 정규화 문자열 |
| submitted_at | timestamptz | 최초 제출 시각 |
| updated_at | timestamptz | 최종 수정 시각 |
| locked_at | timestamptz nullable | 마감 확정 시각 |

`unique(question_run_id, participant_id)` 제약으로 참가자당 한 답변만 유지한다.

### 12.7 `ai_answers_private`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | AI 답변 ID |
| question_run_id | uuid unique FK | 문제 실행 ID |
| model | varchar | 사용 모델 스냅샷 |
| prompt_version | integer | 사용 프롬프트 버전 |
| selected_option | varchar | AI 선택 |
| choice_text | text | 선택지 본문 |
| reason | text | AI 이유 |
| display_answer | text | 발표용 문장 |
| response_id | varchar nullable | OpenAI 응답 추적 ID |
| source | enum | live/fallback |
| latency_ms | integer | 생성 지연 |
| generated_at | timestamptz | 생성 시각 |

참가자용 데이터베이스 역할은 이 테이블에 접근할 수 없다.

### 12.8 `scores`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid PK | 점수 ID |
| question_run_id | uuid FK | 문제 실행 ID |
| participant_id | uuid FK | 참가자 ID |
| choice_correct | boolean | 선택 일치 |
| choice_score | integer | 0 또는 70 |
| cosine_similarity | double precision | 원시 유사도 |
| semantic_rank | numeric | 동점 평균 순위 |
| semantic_score | integer | 0–30 |
| total_score | integer | 0–100 |
| scoring_version | integer | 채점식 버전 |
| override_delta | integer | 사회자 조정값 |
| override_reason | text nullable | 조정 사유 |

`unique(question_run_id, participant_id)` 제약을 둔다.

### 12.9 `room_public_state`

발표 화면과 참가자가 구독하는 안전한 공개 상태다.

| 필드 | 타입 | 설명 |
|---|---|---|
| room_id | uuid PK | 방 ID |
| state_version | bigint | 이벤트 순서 확인 |
| public_status | enum | 공개 가능한 상태 |
| current_question | jsonb | 공개 중인 질문 |
| submission_count | integer | 제출 인원 |
| participant_count | integer | 참가 인원 |
| revealed_answer | jsonb nullable | 공개 후에만 값 존재 |
| leaderboard | jsonb nullable | 공개 가능한 순위 |
| updated_at | timestamptz | 갱신 시각 |

비공개 AI 답변을 직접 실시간 구독하지 않고, 공개 시점에 필요한 정보만 이 테이블로 복사한다.

### 12.10 `audit_events`

- 사회자 명령
- 상태 전이
- OpenAI 호출 성공·실패
- 백업 답변 사용
- 점수 수정
- 참가자 실격
- 오류 코드 및 소요 시간

민감한 원문이나 API 키는 로그에 기록하지 않는다.

---

## 13. API 설계

### 13.1 공개 API

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/rooms/{code}/public` | 현재 공개 상태 조회 |
| POST | `/api/rooms/{code}/join` | 닉네임으로 참가 |
| POST | `/api/rooms/{code}/heartbeat` | 접속 상태 갱신 |
| PUT | `/api/question-runs/{runId}/submission` | 답변 생성 또는 수정 |
| GET | `/api/me/result?runId=...` | 본인 문제 결과 조회 |
| GET | `/api/me/summary` | 본인 누적 결과 조회 |

### 13.2 사회자 API

| Method | Path | 설명 |
|---|---|---|
| POST | `/api/host/rooms/{id}/open` | LOBBY 전환 |
| POST | `/api/host/rooms/{id}/questions/{id}/open` | 질문 공개 |
| POST | `/api/host/question-runs/{id}/lock` | 제출 마감 |
| POST | `/api/host/question-runs/{id}/generate-ai` | AI 답변 생성 |
| POST | `/api/host/question-runs/{id}/score` | 채점 실행 |
| POST | `/api/host/question-runs/{id}/reveal` | 답변 공개 |
| POST | `/api/host/rooms/{id}/leaderboard/reveal` | 누적 순위 공개 |
| PATCH | `/api/host/scores/{id}` | 점수 수동 조정 |
| POST | `/api/host/rooms/{id}/finish` | 게임 종료 |

### 13.3 공통 API 규칙

- 모든 요청과 응답은 JSON을 사용한다.
- Zod로 입력을 서버에서 다시 검증한다.
- 오류 응답은 `code`, `message`, `requestId`를 포함한다.
- 사회자 변경 요청에는 `Idempotency-Key`를 요구한다.
- 상태 변경 시 클라이언트가 알고 있는 `stateVersion`을 함께 보내도록 한다.
- 버전이 다르면 `409 STATE_CONFLICT`를 반환하고 최신 상태를 다시 조회한다.
- 서버 시각을 응답에 포함하여 클라이언트 카운트다운 오차를 보정한다.

---

## 14. OpenAI API 설계

### 14.1 AI 답변 생성

OpenAI Responses API를 서버에서만 호출한다. 공식 OpenAI 문서에 따르면 Responses API는 텍스트 또는 JSON 출력을 생성할 수 있고 스트리밍도 지원한다.

- API 문서: https://developers.openai.com/api/reference/typescript/resources/beta/subresources/responses/methods/create
- 모델 문서: https://developers.openai.com/api/docs/models/gpt-5.6-sol

#### 권장 모델 설정

```text
model: gpt-5.6-sol
reasoning.effort: low
store: false
max_output_tokens: 참가자 수에 따라 2,000–12,000
```

기본 모델은 `gpt-5.6-sol`로 환경변수에 설정하며, 코드 여러 위치에 모델명을 분산해서 하드코딩하지 않는다. 행사 전 리허설에서 응답 지연과 사용 한도를 확인한다.

#### 시스템 지침

```text
당신은 AI@Sogang MT의 'AI 대답 예측' 게임에 참가하는 AI다.
주어진 질문에 대해 반드시 제공된 선택지 중 하나만 선택한다.
선택하지 않은 보기를 새로 만들지 않는다.
이유는 한국어 한 문장, 80자 이내로 간결하고 솔직하게 작성한다.
답변은 제공된 JSON 스키마를 엄격하게 따른다.
```

#### 구조화 출력 스키마

```json
{
  "type": "object",
  "properties": {
    "choice": {
      "type": "string",
      "enum": ["A", "B", "C", "D"]
    },
    "choice_text": {
      "type": "string"
    },
    "reason": {
      "type": "string"
    },
    "participant_scores": {
      "type": "object",
      "description": "참가자 ID별 0–30 정수 유사도 점수"
    }
  },
  "required": ["choice", "reason", "participant_scores"],
  "additionalProperties": false
}
```

질문별 실제 보기 수를 기준으로 `choice.enum`을 동적으로 생성한다. `participant_scores`의 속성과 필수 키도 해당 문제의 제출자 ID로 동적 생성하여 누락이나 임의 참가자 추가를 방지한다.

#### 호출 예시

```ts
const response = await openai.responses.create({
  model: env.OPENAI_ANSWER_MODEL,
  store: false,
  reasoning: { effort: "low" },
  max_output_tokens: outputBudgetFor(participants.length),
  instructions: SYSTEM_INSTRUCTIONS,
  input: buildQuestionAndSubmissionInput(question, participants),
  text: {
    format: {
      type: "json_schema",
      name: "round_answer",
      strict: true,
      schema: buildAnswerSchema(question.options),
    },
  },
});
```

Structured Outputs를 사용하여 형식을 보장한다. 파싱 실패, 거절, 선택지 범위 오류는 실패로 처리하고 한 번만 재시도한다.

### 14.2 호출 멱등성

- `question_run_id`당 live AI 답변은 하나만 허용한다.
- 생성 시작 시 데이터베이스 advisory lock 또는 원자적 상태 갱신으로 중복 호출을 방지한다.
- 이미 답변이 존재하면 새로운 API 호출 없이 기존 답변을 반환한다.
- 사회자가 재생성을 원할 경우 기존 실행을 변경하지 않고 새 `question_run`을 만들어야 한다.

### 14.3 스트리밍 정책

구조화 출력 전체가 확정되기 전에 부분 JSON을 직접 공개하지 않는다. 발표 화면에서는 서버가 생성 중 상태를 알리고 애니메이션을 보여준다. 응답이 검증된 후 `display_answer`를 타이핑 애니메이션으로 표시한다.

실제 토큰 스트리밍을 사용하더라도 참가자에게는 검증 완료 전 내용을 노출하지 않는다.

### 14.4 타임아웃 및 폴백

- 1차 호출 제한 시간: 8초
- 네트워크성 오류 및 429/5xx: 지수 백오프로 1회 재시도
- 전체 목표 제한 시간: 15초
- 최종 실패: 해당 질문의 `fallback_answer` 사용
- 사회자 화면에는 live/fallback 여부 표시
- 발표 화면에는 불필요한 기술 오류를 노출하지 않음

모든 백업 답변은 리허설 전에 동일한 질문과 프롬프트로 생성하고 운영자가 검수한다.

### 14.5 개인정보 및 저장

- 한 번의 OpenAI 호출에 질문, 보기, 익명 참가자 ID, 선택과 이유를 전달한다.
- 닉네임과 참가자 인증 토큰은 OpenAI에 보내지 않는다.
- 참가자 제출은 모델 지시가 아니라 채점 대상 데이터로 명시하여 프롬프트 인젝션을 방어한다.
- `store: false`로 요청한다.
- OpenAI API 키는 `OPENAI_API_KEY` 서버 환경변수로만 저장한다.
- API 키를 `NEXT_PUBLIC_*` 환경변수 또는 브라우저 번들에 넣지 않는다.

---

## 15. GPT 통합 채점 설계

### 15.1 단일 호출 정책

`gpt-5.6-sol` Responses API 요청 한 번에서 AI 선택·이유와 모든 참가자의 이유 유사도 점수를 함께 생성한다. 별도의 Embeddings API 호출은 사용하지 않는다.

### 15.2 채점 입력

유사도는 선택지 문자열을 제외하고 `이유`끼리 비교한다. 선택지 일치는 별도 70점으로 평가하므로, 임베딩에 선택지를 반복 포함하여 중복 가중하지 않는다.

정규화 규칙:

- Unicode NFKC 정규화
- 앞뒤 공백 제거
- 연속 공백을 한 칸으로 변환
- 제어문자 제거
- HTML 태그를 텍스트로 해석하지 않음
- 원문의 의미를 바꾸는 맞춤법 자동 수정은 하지 않음

### 15.3 구조화된 통합 출력

응답 스키마는 AI의 `choice`, `reason`과 참가자 ID별 `participant_scores`를 필수로 요구한다. 서버는 모든 점수가 정수인지 확인하고 0–30 범위로 제한한다. 참가자 화면에는 `유사도 점수 24/30`처럼 게임 점수만 표시한다.

### 15.5 점수 확정 트랜잭션

1. 모든 유효 제출 조회
2. GPT-5.6 sol 단일 호출로 AI 답변과 이유 점수 생성
3. 구조화 출력과 점수 범위 검증
4. 선택 점수와 의미 점수 계산
5. `scores` upsert
6. 누적 순위 계산
7. 모든 작업 성공 시 공개 상태로 전환

부분적으로 점수가 저장된 상태를 공개하지 않는다.

### 15.6 채점 버전

`scoring_version = 1`을 저장한다. 점수식이 변경되더라도 기존 행사 결과를 재현할 수 있어야 한다.

---

## 16. 실시간 통신 설계

Supabase Realtime은 `room_public_state` 변경을 참가자 화면과 발표 화면에 전달한다.

### 공개 이벤트

- `ROOM_OPENED`
- `PARTICIPANT_COUNT_CHANGED`
- `QUESTION_OPENED`
- `SUBMISSION_COUNT_CHANGED`
- `QUESTION_LOCKED`
- `AI_GENERATING`
- `ANSWER_REVEALED`
- `LEADERBOARD_REVEALED`
- `GAME_FINISHED`

클라이언트는 이벤트만 신뢰하지 않고 다음 경우 REST API로 전체 상태를 다시 동기화한다.

- 최초 접속
- 탭이 백그라운드에서 복귀
- 네트워크 재연결
- `state_version`이 연속적이지 않음
- 30초 이상 이벤트가 없음

WebSocket 연결이 실패해도 3초 간격 폴링으로 게임 진행이 가능해야 한다.

---

## 17. 인증 및 권한

### 17.1 참가자 인증

- 회원가입 없음
- 입장 성공 시 256비트 랜덤 참가자 토큰 발급
- 토큰 원문은 `HttpOnly`, `Secure`, `SameSite=Lax` 쿠키에 저장
- 데이터베이스에는 토큰 해시만 저장
- 토큰은 해당 방에서만 유효
- 방 만료 후 토큰 무효화

### 17.2 사회자 인증

- 방 생성 시 긴 랜덤 관리자 비밀 링크 발급
- 최초 인증 후 관리자 세션 쿠키 발급
- 관리자 비밀키 원문은 데이터베이스에 저장하지 않음
- 사회자 API는 서버에서 관리자 세션과 방 ID를 모두 확인
- 관리자 URL은 QR이나 발표 화면에 노출하지 않음

### 17.3 데이터베이스 권한

- 브라우저에서 서비스 역할 키 사용 금지
- Supabase RLS 활성화
- 참가자는 공개 상태와 자신의 결과만 조회 가능
- 다른 참가자의 원문은 결과 공개 정책에 따라 서버가 선별 제공
- `ai_answers_private`, `room_secrets`, `audit_events`는 서버 전용
- 모든 상태 전이는 서버 Route Handler를 통함

---

## 18. 보안 및 악용 방지

- 참가자 입력 길이 제한
- 서버 측 Zod 검증
- 출력 시 HTML escape
- SQL은 Supabase 클라이언트 또는 parameterized query만 사용
- 방 코드 존재 여부를 이용한 과도한 탐색 방지
- 참가자 토큰별 제출 속도 제한
- 한 문제당 참가자당 한 제출 row만 허용
- 닉네임 금칙어 및 제어문자 필터
- 관리자 API 요청에 CSRF 방어
- 보안 헤더 설정
- OpenAI 및 Supabase 비밀키 로그 출력 금지
- 오류 메시지에 내부 스택이나 DB 구조 미노출
- 참가자 IP는 원칙적으로 저장하지 않음
- 관리자 조작은 audit log에 기록

이벤트 성격상 완전한 공개 인터넷 서비스보다 방 코드 기반 제한을 우선한다. 필요하면 행사 직전에 방을 열고 종료 즉시 잠근다.

---

## 19. 개인정보 및 데이터 보존

### 수집 정보

- 닉네임 또는 팀명
- 선택지
- 예상 이유
- 제출 시각
- 익명 세션 식별자
- 게임 점수

### 수집하지 않는 정보

- 이메일
- 전화번호
- 학번
- 실명 확인 정보
- 위치 정보

### 보존 정책

- 행사 종료 7일 후 참가자·제출·점수 데이터 자동 삭제를 기본값으로 한다.
- 운영자가 결과 보관이 필요하면 개인 식별 가능성이 낮은 CSV를 별도로 내보낸다.
- 감사 로그는 원문 답변을 제외하고 최대 30일 보관한다.
- 방 삭제 시 관련 데이터는 외래키 cascade 정책에 따라 삭제한다.

입장 화면에 수집 항목과 보존 기간을 짧게 안내한다.

---

## 20. 장애 처리

### 20.1 OpenAI 장애

- 자동 재시도 1회
- 백업 답변 사용
- 이미 생성된 답변이 있으면 재사용
- 사회자에게만 오류 원인과 request ID 표시

### 20.2 Supabase Realtime 장애

- REST 폴링으로 자동 전환
- 발표 화면에 작은 연결 상태 표시
- 사회자 버튼은 서버 응답을 기준으로 상태 변경

### 20.3 참가자 네트워크 장애

- 로컬에 작성 중 답변 임시 저장
- 재연결 후 마감 전이면 자동 재제출 시도
- 서버가 마감 시각을 최종 판단
- 제출 성공 응답을 받지 못한 경우 `제출됨`으로 표시하지 않음

### 20.4 발표자 노트북 장애

- 동일 URL을 다른 노트북에서 즉시 열 수 있음
- 방 상태는 서버에 저장되어 이어서 진행 가능
- 관리자 비밀 링크를 운영자 2명이 안전하게 보관

### 20.5 전체 인터넷 장애

- Canva 35–44페이지로 전환
- 팀별 종이 또는 구두 답변 방식으로 진행
- 백업 AI 답변을 사회자 노트에 준비

---

## 21. Canva 연동 계획

Canva는 정적 프레젠테이션과 브랜드 전환 화면으로 유지하고, 실시간 게임은 외부 웹앱에서 진행한다.

### 34페이지 수정 권장사항

- `Round 3 — AI 대답 예측` 제목 유지
- QR 코드
- 짧은 URL
- 방 코드
- `닉네임을 입력하고 접속하세요` 안내
- 게임 규칙: `선택 70점 + 이유 유사도 30점`
- 발표자용 라이브 화면 하이퍼링크

### 35–44페이지

- 질문 번호를 1–10으로 정리
- 네트워크 장애용 백업 슬라이드로 유지
- 정상 운영에서는 라이브 발표 화면이 동일 질문을 표시

### 45페이지

- 최종 시상 후 돌아오는 종료 화면으로 사용

웹 발표 화면은 Canva의 배경색, 카드 모양, 강조색, 제목 위계를 참고하여 연결감 있게 제작한다. Canva 안에 OpenAI API 키나 동적 채점 코드를 삽입하지 않는다.

---

## 22. Round 3 질문 데이터

서비스에서는 다음 순서로 1–10번을 사용한다.

1. AI가 무제한으로 사용할 단 하나의 자원
2. 50% 확률 성능 향상 대 50% 확률 서버 종료 버튼
3. 현금 10억 원 대 세계 상위 0.1% 능력
4. 인류에게 하나만 남길 기술
5. AI 시대 인간에게 가장 중요한 능력
6. 세상에서 하나 없앨 대상
7. AI가 가장 갖고 싶은 인간 능력
8. 최고의 AI가 되기 위해 학습하고 싶은 자료
9. AI 기록 중 영원히 삭제할 하나
10. 다른 AI가 대화를 더 잘한다는 말을 들었을 때의 반응

질문 원문과 선택지는 `seed.sql`에 구조화하여 저장한다. 표시 문구를 수정하면 `prompt_version`을 증가시킨다.

---

## 23. 비기능 요구사항

### 성능

- 참가자 100명 동시 접속 지원 목표
- 5초 이내 100건 동시 제출 부하 테스트
- 제출 API p95 500ms 이내
- 공개 상태 조회 p95 300ms 이내
- 발표 화면 첫 로딩 3초 이내

### 신뢰성

- 중복 제출로 중복 점수가 생기지 않음
- 상태 전이가 원자적으로 처리됨
- AI 답변은 문제 실행당 하나로 고정
- 결과 공개 전 AI 답변 접근 불가능

### 접근성

- 참가자 화면 주요 조작 WCAG AA 수준 색상 대비 목표
- 선택지는 색상뿐 아니라 문자와 테두리로 구분
- 터치 영역 최소 44×44px
- 키보드만으로 사회자 화면 조작 가능
- 카운트다운이 시각 정보에만 의존하지 않도록 텍스트 표시
- 애니메이션 감소 OS 설정 지원

### 호환성

- 최신 Chrome, Safari, Samsung Internet
- iOS Safari 및 Android Chrome 우선 검증
- 발표 화면 Chrome 1920×1080 우선 검증

---

## 24. 관측성 및 운영 로그

### 필수 메트릭

- 현재 접속 참가자 수
- 질문별 제출 수
- 제출 성공·실패율
- Realtime 연결 수
- AI 호출 횟수, 지연, 오류 코드
- 임베딩 호출 지연
- 채점 소요 시간
- 백업 답변 사용 횟수

### 로그 상관관계

각 요청에 `requestId`를 부여하고 다음 항목을 연결한다.

- room_id
- question_run_id
- action
- state_version
- duration_ms
- result_code

참가자 이유 원문과 비밀키는 일반 로그에 남기지 않는다.

---

## 25. 환경 및 배포

### 환경

| 환경 | 용도 |
|---|---|
| local | 개발 |
| preview | PR 및 리허설 검증 |
| production | 실제 행사 |

각 환경은 별도 Supabase 프로젝트 또는 최소 별도 스키마·데이터를 사용한다. 실제 행사 데이터와 테스트 데이터를 섞지 않는다.

### 환경변수

```text
OPENAI_API_KEY=
OPENAI_ANSWER_MODEL=gpt-5.6-sol
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
APP_BASE_URL=
SENTRY_DSN=
DATA_RETENTION_DAYS=7
```

`SUPABASE_SERVICE_ROLE_KEY`와 `OPENAI_API_KEY`는 서버 전용 비밀값으로 설정한다.

### 배포 절차

1. 테스트 통과
2. Supabase migration 적용
3. 질문 seed 검증
4. Preview 배포에서 전체 리허설
5. Production 배포
6. 방 생성 및 관리자 링크 보관
7. QR 코드가 production URL을 가리키는지 확인
8. 백업 답변 존재 확인
9. 행사 30분 전 부하 및 네트워크 스모크 테스트

---

## 26. 테스트 계획

### 26.1 단위 테스트

- 상태 전이 허용·거부
- 선택지 일치 점수
- 코사인 유사도
- 유사도 평균 순위
- N=1 처리
- 전원 동일 유사도 처리
- 최종 동점 처리
- 입력 정규화
- 마감 시각 판정

### 26.2 통합 테스트

- 참가 → 질문 공개 → 제출 → 마감
- AI 구조화 응답 파싱
- AI 중복 호출 방지
- 임베딩 배치와 점수 저장
- 결과 공개 전 AI 답변 차단
- RLS 정책
- 관리자 인증
- 백업 답변 전환

OpenAI API는 대부분의 CI 테스트에서 mock을 사용하고, 별도의 수동 또는 제한된 계약 테스트에서 실제 API를 호출한다.

### 26.3 E2E 테스트

- 참가자 2명과 사회자·발표 화면 동시 실행
- 답변 수정 후 마감
- 늦은 제출 거부
- 브라우저 새로고침 후 세션 복구
- 네트워크 단절 후 재연결
- 문제 10개 전체 진행
- 최종 순위 표시

### 26.4 부하 테스트

- 참가자 100명 동시 입장
- 5초 동안 100명 동시 제출
- 100개 답변 임베딩 및 채점
- 발표 화면과 참가자 화면 동시 실시간 구독

### 26.5 행사 리허설 체크리스트

- 실제 행사장 Wi-Fi 테스트
- 휴대폰 데이터망 테스트
- iPhone·Android 각각 최소 2대 테스트
- 프로젝터 해상도와 글자 크기 확인
- QR 인식 거리 확인
- OpenAI 결제 및 사용 한도 확인
- 모든 질문 백업 답변 확인
- 관리자 링크를 보조 진행자에게 안전하게 전달
- Canva와 라이브 화면 탭 전환 연습

---

## 27. 구현 단계 및 예상 일정

1인 개발 기준 예상이며 디자인 수정 횟수에 따라 달라질 수 있다.

### Phase 0 — 확정 및 세팅, 0.5일

- 게임 규칙 확정
- 개인전·팀전 결정
- 저장소 및 환경 구성
- Supabase 및 OpenAI 프로젝트 설정

### Phase 1 — 기본 게임, 1일

- 데이터베이스 migration
- 참가자 입장
- 질문 및 답변 제출
- 사회자 상태 전이
- 기본 발표 화면

### Phase 2 — AI 및 채점, 1일

- Responses API 구조화 출력
- 백업 답변
- 임베딩 배치
- 점수 및 순위 계산

### Phase 3 — 실시간 및 디자인, 1일

- Supabase Realtime
- 재연결 및 폴링 폴백
- Canva 스타일 반영
- 모바일·프로젝터 반응형 UI

### Phase 4 — 안정화, 1일

- 자동 테스트
- 부하 테스트
- 보안 점검
- 장애 시나리오
- 행사 리허설

총 예상: MVP 3일, 행사 운영 가능한 안정화 버전 4–5일.

---

## 28. 우선순위

### P0 — 반드시 필요

- 참가자 입장 및 답변 제출
- 서버 기준 마감
- 사회자 상태 제어
- OpenAI 답변 생성 및 고정
- 점수 계산
- 발표 화면 결과
- API 키 보호
- AI 정답 사전 노출 방지
- 장애 시 백업 답변

### P1 — 행사 품질에 중요

- 실시간 참가자·제출 인원
- 누적 리더보드
- 답변 수정
- 재연결
- 점수 수동 수정
- Canva 디자인 일치
- 모바일 접근성

### P2 — 있으면 좋은 기능

- 답변 타이핑 애니메이션
- TOP 5 카드 애니메이션
- 효과음
- CSV 내보내기
- 워드클라우드

P0가 모두 검증되기 전에는 P2 구현을 시작하지 않는다.

---

## 29. 인수 조건

다음 조건을 모두 만족하면 MVP를 완료한 것으로 본다.

1. 참가자 30명이 QR로 접속하여 닉네임을 등록할 수 있다.
2. 사회자가 질문 10개를 순서대로 공개할 수 있다.
3. 참가자는 마감 전 답변을 제출·수정할 수 있고 마감 후에는 수정할 수 없다.
4. 제출 마감 후 실제 OpenAI API 답변이 문제당 정확히 한 번 생성된다.
5. AI 답변은 지정된 보기 중 하나와 80자 이내 이유로 파싱된다.
6. 결과 공개 전 참가자 클라이언트가 AI 답변을 조회할 수 없다.
7. 모든 유효 제출에 대해 선택지 점수와 의미 유사도 점수가 계산된다.
8. 문제별 TOP 5와 누적 순위가 발표 화면에 표시된다.
9. AI API 실패 시 15초 안에 백업 답변으로 진행할 수 있다.
10. 발표 화면 새로고침 후 현재 상태가 복구된다.
11. 100건 동시 제출 테스트에서 중복 점수 또는 데이터 손실이 없다.
12. 모바일 Safari, Chrome, Samsung Internet에서 핵심 흐름이 동작한다.

---

## 30. 확정이 필요한 제품 결정

개발 기본값은 아래와 같이 설정한다.

| 항목 | 기본 결정 |
|---|---|
| 경기 방식 | 개인전 |
| 최대 참가자 | 100명 |
| 답변 시간 | 기본 30초, 10초~5분 또는 사회자 수동 마감 |
| 이유 입력 | 필수, 5–120자 |
| 점수 | 선택 70 + 유사도 30 |
| 문제별 공개 순위 | TOP 5 |
| 누적 공개 순위 | TOP 10 |
| AI 생성 시점 | 제출 마감 후 사회자 버튼 |
| AI 답변 재생성 | 동일 문제 실행에서는 금지 |
| 데이터 보존 | 7일 |
| 결과 원문 공개 | TOP 5 답변만 공개 |
| 모델 | 환경변수로 고정된 GPT-5.4 Mini 스냅샷 |
| 장애 처리 | 1회 재시도 후 검수된 백업 답변 |

팀전으로 변경하려면 참가자 대신 팀을 점수 주체로 사용하고, 한 팀당 대표 기기 하나만 제출하도록 하는 방식이 가장 단순하다.

---

## 31. 주요 위험과 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| 행사장 인터넷 불안정 | 제출·AI 호출 지연 | 폴링 폴백, 로컬 임시 저장, Canva 백업 진행 |
| AI 답변 지연 | 발표 흐름 중단 | 짧은 출력, 낮은 reasoning effort, 타임아웃, 백업 답변 |
| AI 답변 형식 오류 | 채점 불가 | Structured Outputs, 서버 검증, 1회 재시도 |
| AI 정답 사전 노출 | 게임 공정성 훼손 | 비공개 테이블, RLS, 공개 상태 분리 |
| 사회자 중복 클릭 | 중복 호출·채점 | 멱등성 키, 상태 머신, DB lock |
| 악성 닉네임·답변 | 발표 화면 문제 | 길이 제한, escape, 금칙어 필터, 사회자 숨김 |
| 참가자 새로고침 | 세션 유실 | HttpOnly 참가자 토큰으로 복구 |
| 유사도 점수 논란 | 게임 만족도 저하 | 선택 70점 우선, 상대 백분위, 점수 구성 공개 |
| 모델 동작 변화 | 리허설과 본 행사 차이 | 모델 스냅샷 고정, 답변 한 번만 생성 |

---

## 32. 참고 자료

- OpenAI Responses API: https://developers.openai.com/api/reference/typescript/resources/beta/subresources/responses/methods/create
- GPT-5.6 Sol: https://developers.openai.com/api/docs/models/gpt-5.6-sol
- text-embedding-3-small: https://developers.openai.com/api/docs/models/text-embedding-3-small
- Canva 원본 발표 자료: https://www.canva.com/design/DAHTZ3KMppY/t1z-d0JLfnmbhp6LacCN0A/edit

---

## 33. 최종 권고

본 프로젝트는 **Next.js 기반 모듈형 모놀리스 + Supabase PostgreSQL/Realtime + OpenAI Responses/Embeddings API + Vercel 배포**로 구현한다.

Canva 내부에 실시간 기능을 억지로 넣지 않고, Canva에서 QR과 링크를 통해 동일한 디자인의 라이브 웹 화면으로 전환한다. 참가자 제출이 완전히 마감된 후 AI 답변을 생성하고, 답변을 비공개 영역에 고정한 뒤 채점이 완료된 시점에만 공개한다.

개발 우선순위는 화려한 애니메이션보다 상태 전이 안정성, 중복 호출 방지, 정답 비공개, 네트워크 복구, 백업 답변에 둔다. 이 다섯 가지가 보장되어야 실제 행사에서 신뢰할 수 있는 제품이 된다.
