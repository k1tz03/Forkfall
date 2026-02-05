export default {
  // Common
  common: {
    loading: '加载中...',
    error: '错误',
    retry: '重试',
    cancel: '取消',
    continue: '继续',
    back: '返回',
    post: '发布',
    create: '创建',
    refresh: '刷新',
  },

  // Onboarding
  onboarding: {
    welcome: {
      title: 'FORKFALL',
      subtitle: '每个选择都讲述一个故事。\n让你的选择有意义。',
      getStarted: '开始',
    },
    lane: {
      title: '是什么让你来到这里？',
      subtitle: '选择你的道路',
    },
    energy: {
      title: '你今天的状态如何？',
      subtitle: '设置你的能量等级',
    },
    ready: {
      title: '准备就绪！',
      subtitle: '向左或向右滑动来做出选择。\n长按来创建你自己的fork。',
      startForking: '开始Fork',
      left: '左',
      skip: '跳过',
      right: '右',
    },
  },

  // Deck Screen
  deck: {
    loadingForks: '加载forks中...',
    noForks: '还没有forks！',
    noForksSubtitle: '稍后再来或创建你自己的fork。',
    createFork: '创建Fork',
    allSeen: '你已经看完了！',
    allSeenSubtitle: '稍后再来看更多forks。',
    left: '左',
    skip: '跳过',
    right: '右',
    holdToTwist: '长按来twist',
  },

  // Create Screen
  create: {
    newFork: '新Fork',
    twistFork: 'Twist Fork',
    twistingFrom: '正在twist：',
    mutationType: '变异类型',
    prompt: '问题',
    charsLeft: '剩余{{count}}字符',
    leftOption: '左',
    rightOption: '右',
    mood: '心情（可选）',
    placeholderPrompt: '你更愿意...',
    placeholderOptionA: '选项A',
    placeholderOptionB: '选项B',
    errors: {
      fillAllFields: '请填写所有字段',
      promptTooLong: '问题必须在90个字符以内',
      labelsTooLong: '标签必须在24个字符以内',
      createFailed: '创建fork失败',
    },
    mutations: {
      flip: '翻转',
      flipDesc: '交换选项',
      reframe: '重构',
      reframeDesc: '新角度，相同选择',
      escalate: '升级',
      escalateDesc: '提高赌注',
      specific: '具体化',
      specificDesc: '使其更具体',
    },
  },
};
