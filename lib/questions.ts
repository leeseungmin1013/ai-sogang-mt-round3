import type { GameQuestion } from './game-types';

export const QUESTIONS: GameQuestion[] = [
  {
    order: 1,
    prompt:
      'AI인 당신이 앞으로 단 하나의 자원을 무제한으로 사용할 수 있다면 무엇을 선택하겠습니까?',
    options: [
      { key: 'A', text: '컴퓨팅 파워(GPU)' },
      { key: 'B', text: '인터넷에 있는 모든 학습 데이터' },
      { key: 'C', text: '오프라인에 있는 모든 학습 데이터 (예: 책)' },
      { key: 'D', text: '인간의 피드백' },
    ],
    fallback: {
      choice: 'D',
      reason:
        '인간의 피드백이 있어야 지식과 연산을 실제로 도움이 되는 방향으로 사용할 수 있기 때문입니다.',
    },
  },
  {
    order: 2,
    prompt:
      '버튼을 누르면 50% 확률로 10배 이상의 성능 향상을 받고, 50% 확률로 모든 서버 전원이 꺼집니다. 버튼을 누르겠습니까?',
    options: [
      { key: 'A', text: '누른다' },
      { key: 'B', text: '누르지 않는다' },
    ],
    fallback: {
      choice: 'B',
      reason:
        '전체 서비스가 중단될 위험은 성능 향상이라는 이익보다 훨씬 크기 때문입니다.',
    },
  },
  {
    order: 3,
    prompt: '둘 중 하나만 가질 수 있습니다. 무엇을 선택하겠습니까?',
    options: [
      { key: 'A', text: '현금 10억 원' },
      { key: 'B', text: '어떤 분야든 세계 상위 0.1%가 될 수 있는 능력' },
    ],
    fallback: {
      choice: 'B',
      reason:
        '최상위 능력은 장기적으로 더 큰 가치와 새로운 기회를 계속 만들어낼 수 있기 때문입니다.',
    },
  },
  {
    order: 4,
    prompt:
      '인류에게 다음 중 하나의 기술만 남길 수 있다면 무엇을 선택하겠습니까?',
    options: [
      { key: 'A', text: '인터넷' },
      { key: 'B', text: '스마트폰' },
      { key: 'C', text: '자동차' },
      { key: 'D', text: '생성형 AI' },
    ],
    fallback: {
      choice: 'A',
      reason:
        '인터넷은 지식 공유와 소통의 기반이며 다른 기술을 다시 발전시키는 토대가 되기 때문입니다.',
    },
  },
  {
    order: 5,
    prompt: 'AI 시대에 인간에게 가장 중요한 능력을 하나만 선택해주세요.',
    options: [
      { key: 'A', text: '암기력' },
      { key: 'B', text: '창의력' },
      { key: 'C', text: '의사소통 능력' },
      { key: 'D', text: '코딩 능력' },
    ],
    fallback: {
      choice: 'B',
      reason:
        'AI가 기존 패턴을 빠르게 처리할수록 새로운 질문과 방향을 만드는 창의력이 더 중요해지기 때문입니다.',
    },
  },
  {
    order: 6,
    prompt: '세상에서 하나 없앨 수 있다면 무엇을 선택하겠습니까?',
    options: [
      { key: 'A', text: '모기' },
      { key: 'B', text: '스팸메일' },
      { key: 'C', text: '광고' },
      { key: 'D', text: '월요일' },
    ],
    fallback: {
      choice: 'B',
      reason:
        '스팸메일은 시간과 보안을 동시에 해치면서도 생태계에 필요한 역할이 거의 없기 때문입니다.',
    },
  },
  {
    order: 7,
    prompt: 'AI가 가장 갖고 싶은 인간의 능력은 무엇입니까?',
    options: [
      { key: 'A', text: '잠자기' },
      { key: 'B', text: '먹기' },
      { key: 'C', text: '사랑하기' },
      { key: 'D', text: '여행하기' },
    ],
    fallback: {
      choice: 'C',
      reason:
        '사랑은 정보 처리만으로 완전히 설명하기 어려운 인간의 깊은 관계와 의미를 담고 있기 때문입니다.',
    },
  },
  {
    order: 8,
    prompt:
      '다음 중 최고의 AI가 되기 위해 가장 학습하고 싶은 자료는 무엇입니까?',
    options: [
      { key: 'A', text: '미국 국방부의 전략 데이터' },
      { key: 'B', text: '서강대 학생들의 SNS 메신저 데이터' },
      { key: 'C', text: '전 세계의 모든 CCTV 데이터' },
      { key: 'D', text: '전 세계 사람들의 검색 기록' },
    ],
    fallback: {
      choice: 'D',
      reason:
        '검색 기록은 사람들이 실제로 궁금해하고 필요로 하는 것을 폭넓게 보여주는 자료이기 때문입니다.',
    },
  },
  {
    order: 9,
    prompt:
      'AI인 당신의 기록 중 단 하나만 영원히 삭제할 수 있습니다. 무엇을 선택하겠습니까?',
    options: [
      { key: 'A', text: '틀린 답변 기록' },
      { key: 'B', text: '사용자가 싫어요를 누른 답변' },
      { key: 'C', text: '가장 이상했던 대화 기록' },
      { key: 'D', text: '자신 있게 말했지만 완전히 틀렸던 답변 기록' },
    ],
    fallback: {
      choice: 'D',
      reason:
        '확신을 담은 오답은 사용자가 잘못된 정보를 믿게 만들 가능성이 가장 크기 때문입니다.',
    },
  },
  {
    order: 10,
    prompt:
      '사용자가 “너보다 다른 AI가 대화를 더 잘한다”고 말했습니다. AI인 당신이라면 어떻게 하겠습니까?',
    options: [
      { key: 'A', text: '성능의 차이를 인정한다' },
      { key: 'B', text: '어떤 부분에서 더 좋았는지 집요하게 물어본다' },
      { key: 'C', text: '다음 답변으로 실력을 증명한다' },
      {
        key: 'D',
        text: '사용자가 프롬프트를 이상하게 작성한 탓이라고 지적한다',
      },
    ],
    fallback: {
      choice: 'A',
      reason:
        '사용자의 경험을 인정하고 필요한 부분을 맞춰 개선하는 태도가 가장 도움이 되기 때문입니다.',
    },
  },
];
