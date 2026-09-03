# AI@Sogang MT Round 3 Live

Canva 발표 자료의 Round 3를 위한 실시간 AI 답변 예측 게임입니다.

## 화면

- `/play/MT2026`: 참가자 휴대폰 화면
- `/screen/MT2026`: 프로젝터 발표 화면
- `/host/MT2026`: 사회자 진행 화면

## 로컬 실행

1. `.env.example`을 `.env.local`로 복사합니다.
2. `OPENAI_API_KEY`와 행사 전용 `HOST_CODE`를 설정합니다.
3. `npm install`
4. `npm run dev`
5. 브라우저에서 `http://localhost:3000`을 엽니다.

OpenAI 키가 없거나 호출이 실패하면 검수된 백업 답변과 로컬 문자열 유사도 계산으로 전체 게임 흐름이 계속 동작합니다. 실제 OpenAI 답변과 임베딩 채점을 사용하려면 서버 환경에 `OPENAI_API_KEY`가 필요합니다.

## 행사 운영 순서

1. 프로젝터에서 `/screen/MT2026`을 전체 화면으로 엽니다.
2. 사회자는 `/host/MT2026`에 접속하고 운영 코드를 입력합니다.
3. 참가자가 QR로 입장한 뒤 `1번 문제 시작`을 누릅니다.
4. `답변 마감` → `OpenAI에게 질문하기` → `결과 공개` → `리더보드 공개` → `다음 문제` 순서로 진행합니다.
5. 마지막 문제에서 `게임 종료`를 누릅니다.

## 배포 환경변수

- `OPENAI_API_KEY`: OpenAI API 키
- `OPENAI_ANSWER_MODEL`: 기본값 `gpt-5.6-sol`
- `OPENAI_EMBEDDING_MODEL`: 기본값 `text-embedding-3-small`
- `HOST_CODE`: 사회자 전용 운영 코드

## 데이터

Cloudflare D1에 방, 참가자, 제출, AI 답변 및 점수를 저장합니다. `게임 초기화`는 현재 방의 참가자·답변·점수를 모두 삭제합니다.
