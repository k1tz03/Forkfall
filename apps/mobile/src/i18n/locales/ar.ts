export default {
  // Common
  common: {
    loading: 'جار التحميل...',
    error: 'خطأ',
    retry: 'حاول مرة أخرى',
    cancel: 'إلغاء',
    continue: 'متابعة',
    back: 'رجوع',
    post: 'نشر',
    create: 'إنشاء',
    refresh: 'تحديث',
  },

  // Onboarding
  onboarding: {
    welcome: {
      title: 'FORKFALL',
      subtitle: 'كل اختيار يروي قصة.\nاجعل اختيارك ذا معنى.',
      getStarted: 'ابدأ',
    },
    lane: {
      title: 'ما الذي جاء بك إلى هنا؟',
      subtitle: 'اختر مسارك',
    },
    energy: {
      title: 'ما هو مزاجك اليوم؟',
      subtitle: 'حدد مستوى طاقتك',
    },
    ready: {
      title: 'أنت جاهز!',
      subtitle: 'اسحب يسارًا أو يمينًا للاختيار.\nاضغط مطولاً لإنشاء fork خاص بك.',
      startForking: 'ابدأ الفوركينج',
      left: 'يسار',
      skip: 'تخطي',
      right: 'يمين',
    },
  },

  // Deck Screen
  deck: {
    loadingForks: 'جار تحميل الفوركس...',
    noForks: 'لا توجد فوركس بعد!',
    noForksSubtitle: 'عد قريبًا أو أنشئ fork خاص بك.',
    createFork: 'إنشاء Fork',
    allSeen: 'لقد شاهدتها كلها!',
    allSeenSubtitle: 'عد لاحقًا لمزيد من الفوركس.',
    left: 'يسار',
    skip: 'تخطي',
    right: 'يمين',
    holdToTwist: 'اضغط مطولاً للتويست',
  },

  // Create Screen
  create: {
    newFork: 'Fork جديد',
    twistFork: 'تويست Fork',
    twistingFrom: 'تويست من:',
    mutationType: 'نوع التحول',
    prompt: 'السؤال',
    charsLeft: '{{count}} حرف متبقي',
    leftOption: 'يسار',
    rightOption: 'يمين',
    mood: 'المزاج (اختياري)',
    placeholderPrompt: 'هل تفضل...',
    placeholderOptionA: 'الخيار أ',
    placeholderOptionB: 'الخيار ب',
    errors: {
      fillAllFields: 'يرجى ملء جميع الحقول',
      promptTooLong: 'يجب أن يكون السؤال 90 حرفًا أو أقل',
      labelsTooLong: 'يجب أن تكون التسميات 24 حرفًا أو أقل',
      createFailed: 'فشل في إنشاء fork',
    },
    mutations: {
      flip: 'اقلب',
      flipDesc: 'بدل الخيارات',
      reframe: 'إعادة صياغة',
      reframeDesc: 'زاوية جديدة، نفس الخيارات',
      escalate: 'تصعيد',
      escalateDesc: 'رفع المخاطر',
      specific: 'تحديد',
      specificDesc: 'اجعله محددًا',
    },
  },
};
