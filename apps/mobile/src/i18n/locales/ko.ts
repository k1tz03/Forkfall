export default {
  // Common
  common: {
    loading: '로딩 중...',
    error: '오류',
    retry: '다시 시도',
    cancel: '취소',
    continue: '계속',
    back: '뒤로',
    post: '게시',
    create: '만들기',
    refresh: '새로고침',
  },

  // Onboarding
  onboarding: {
    welcome: {
      title: 'FORKFALL',
      subtitle: '모든 선택은 이야기를 만듭니다.\n당신의 선택을 의미 있게.',
      getStarted: '시작하기',
    },
    lane: {
      title: '무엇이 당신을 여기로 이끌었나요?',
      subtitle: '당신의 길을 선택하세요',
    },
    energy: {
      title: '오늘의 기분은 어떤가요?',
      subtitle: '에너지 레벨을 설정하세요',
    },
    ready: {
      title: '준비 완료!',
      subtitle: '왼쪽 또는 오른쪽으로 스와이프하여 선택하세요.\n길게 눌러 나만의 fork를 만드세요.',
      startForking: '포킹 시작',
      left: '왼쪽',
      skip: '건너뛰기',
      right: '오른쪽',
    },
  },

  // Deck Screen
  deck: {
    loadingForks: 'fork 로딩 중...',
    noForks: '아직 fork가 없어요!',
    noForksSubtitle: '나중에 다시 오거나 나만의 fork를 만드세요.',
    createFork: 'Fork 만들기',
    allSeen: '모두 봤어요!',
    allSeenSubtitle: '나중에 더 많은 fork를 보러 오세요.',
    left: '왼쪽',
    skip: '건너뛰기',
    right: '오른쪽',
    holdToTwist: '길게 눌러 트위스트',
  },

  // Create Screen
  create: {
    newFork: '새 Fork',
    twistFork: 'Fork 트위스트',
    twistingFrom: '트위스트 원본:',
    mutationType: '변형 타입',
    prompt: '질문',
    charsLeft: '{{count}}자 남음',
    leftOption: '왼쪽',
    rightOption: '오른쪽',
    mood: '기분 (선택사항)',
    placeholderPrompt: '어떤 것을 더 원하시나요...',
    placeholderOptionA: '옵션 A',
    placeholderOptionB: '옵션 B',
    errors: {
      fillAllFields: '모든 필드를 입력해주세요',
      promptTooLong: '질문은 90자 이하여야 합니다',
      labelsTooLong: '라벨은 24자 이하여야 합니다',
      createFailed: 'fork 생성 실패',
    },
    mutations: {
      flip: '뒤집기',
      flipDesc: '옵션 교환',
      reframe: '재구성',
      reframeDesc: '새로운 관점, 같은 선택',
      escalate: '에스컬레이트',
      escalateDesc: '판돈을 올려',
      specific: '구체화',
      specificDesc: '더 구체적으로',
    },
  },
};
