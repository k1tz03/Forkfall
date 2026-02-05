export default {
  // Common
  common: {
    loading: '読み込み中...',
    error: 'エラー',
    retry: '再試行',
    cancel: 'キャンセル',
    continue: '続ける',
    back: '戻る',
    post: '投稿',
    create: '作成',
    refresh: '更新',
  },

  // Onboarding
  onboarding: {
    welcome: {
      title: 'FORKFALL',
      subtitle: 'すべての選択が物語を紡ぐ。\nあなたの選択を意味あるものに。',
      getStarted: '始める',
    },
    lane: {
      title: '何があなたをここに連れてきた？',
      subtitle: 'あなたの道を選んで',
    },
    energy: {
      title: '今日の気分は？',
      subtitle: 'エネルギーレベルを設定',
    },
    ready: {
      title: '準備完了！',
      subtitle: '左右にスワイプして選択しよう。\n長押しで自分のforkを作成。',
      startForking: 'フォーキング開始',
      left: '左',
      skip: 'スキップ',
      right: '右',
    },
  },

  // Deck Screen
  deck: {
    loadingForks: 'fork読み込み中...',
    noForks: 'まだforkがありません！',
    noForksSubtitle: 'また後で来るか、自分のforkを作成しよう。',
    createFork: 'Fork作成',
    allSeen: '全部見ました！',
    allSeenSubtitle: '後でまた来てね。',
    left: '左',
    skip: 'スキップ',
    right: '右',
    holdToTwist: '長押しでツイスト',
  },

  // Create Screen
  create: {
    newFork: '新しいFork',
    twistFork: 'Forkをツイスト',
    twistingFrom: 'ツイスト元：',
    mutationType: 'ミューテーションタイプ',
    prompt: '質問',
    charsLeft: '残り{{count}}文字',
    leftOption: '左',
    rightOption: '右',
    mood: 'ムード（任意）',
    placeholderPrompt: 'どちらがいい...',
    placeholderOptionA: 'オプションA',
    placeholderOptionB: 'オプションB',
    errors: {
      fillAllFields: 'すべてのフィールドを入力してください',
      promptTooLong: '質問は90文字以内にしてください',
      labelsTooLong: 'ラベルは24文字以内にしてください',
      createFailed: 'fork作成に失敗しました',
    },
    mutations: {
      flip: '反転',
      flipDesc: 'オプションを入れ替え',
      reframe: 'リフレーム',
      reframeDesc: '新しい角度、同じ選択',
      escalate: 'エスカレート',
      escalateDesc: '賭け金を上げる',
      specific: '絞り込み',
      specificDesc: '具体的にする',
    },
  },
};
