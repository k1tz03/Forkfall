export default {
  // Common
  common: {
    loading: 'Загрузка...',
    error: 'Ошибка',
    retry: 'Повторить',
    cancel: 'Отмена',
    continue: 'Продолжить',
    back: 'Назад',
    post: 'Опубликовать',
    create: 'Создать',
    refresh: 'Обновить',
  },

  // Onboarding
  onboarding: {
    welcome: {
      title: 'FORKFALL',
      subtitle: 'Каждый выбор рассказывает историю.\nСделай свой значимым.',
      getStarted: 'Начать',
    },
    lane: {
      title: 'Что привело тебя сюда?',
      subtitle: 'Выбери свой путь',
    },
    energy: {
      title: 'Какое у тебя настроение сегодня?',
      subtitle: 'Установи уровень энергии',
    },
    ready: {
      title: 'Ты готов!',
      subtitle: 'Свайпай влево или вправо чтобы выбрать.\nУдерживай чтобы создать свой fork.',
      startForking: 'Начать форкинг',
      left: 'Влево',
      skip: 'Пропустить',
      right: 'Вправо',
    },
  },

  // Deck Screen
  deck: {
    loadingForks: 'Загрузка форков...',
    noForks: 'Пока нет форков!',
    noForksSubtitle: 'Возвращайся позже или создай свой fork.',
    createFork: 'Создать Fork',
    allSeen: 'Ты всё посмотрел!',
    allSeenSubtitle: 'Возвращайся позже за новыми форками.',
    left: 'Влево',
    skip: 'Пропустить',
    right: 'Вправо',
    holdToTwist: 'Удерживай для твиста',
  },

  // Create Screen
  create: {
    newFork: 'Новый Fork',
    twistFork: 'Твист Fork',
    twistingFrom: 'Твист от:',
    mutationType: 'Тип мутации',
    prompt: 'Вопрос',
    charsLeft: 'Осталось {{count}} символов',
    leftOption: 'Влево',
    rightOption: 'Вправо',
    mood: 'Настроение (необязательно)',
    placeholderPrompt: 'Ты бы предпочёл...',
    placeholderOptionA: 'Вариант А',
    placeholderOptionB: 'Вариант Б',
    errors: {
      fillAllFields: 'Пожалуйста, заполни все поля',
      promptTooLong: 'Вопрос должен быть не более 90 символов',
      labelsTooLong: 'Метки должны быть не более 24 символов',
      createFailed: 'Не удалось создать fork',
    },
    mutations: {
      flip: 'Перевернуть',
      flipDesc: 'Поменять варианты',
      reframe: 'Переосмыслить',
      reframeDesc: 'Новый взгляд, те же выборы',
      escalate: 'Усилить',
      escalateDesc: 'Повысить ставки',
      specific: 'Уточнить',
      specificDesc: 'Сделать конкретнее',
    },
  },
};
