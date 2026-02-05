export default {
  // Common
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    retry: 'Réessayer',
    cancel: 'Annuler',
    continue: 'Continuer',
    back: 'Retour',
    post: 'Publier',
    create: 'Créer',
    refresh: 'Actualiser',
  },

  // Onboarding
  onboarding: {
    welcome: {
      title: 'FORKFALL',
      subtitle: 'Chaque choix raconte une histoire.\nFais le tien compter.',
      getStarted: 'Commencer',
    },
    lane: {
      title: "Qu'est-ce qui t'amène ici ?",
      subtitle: 'Choisis ta voie',
    },
    energy: {
      title: "Quelle est ton humeur aujourd'hui ?",
      subtitle: "Définis ton niveau d'énergie",
    },
    ready: {
      title: 'Tu es prêt !',
      subtitle: 'Swipe à gauche ou à droite pour faire ton choix.\nMaintiens pour twister et créer ton propre fork.',
      startForking: 'Commencer à forker',
      left: 'Gauche',
      skip: 'Passer',
      right: 'Droite',
    },
  },

  // Deck Screen
  deck: {
    loadingForks: 'Chargement des forks...',
    noForks: 'Pas encore de forks !',
    noForksSubtitle: 'Reviens bientôt ou crée ton propre fork.',
    createFork: 'Créer un Fork',
    allSeen: 'Tu as tout vu !',
    allSeenSubtitle: 'Reviens plus tard pour plus de forks.',
    left: 'Gauche',
    skip: 'Passer',
    right: 'Droite',
    holdToTwist: 'Maintenir pour twister',
  },

  // Create Screen
  create: {
    newFork: 'Nouveau Fork',
    twistFork: 'Twister le Fork',
    twistingFrom: 'Twist à partir de :',
    mutationType: 'Type de mutation',
    prompt: 'Question',
    charsLeft: '{{count}} caractères restants',
    leftOption: 'Gauche',
    rightOption: 'Droite',
    mood: 'Humeur (optionnel)',
    placeholderPrompt: 'Tu préfères...',
    placeholderOptionA: 'Option A',
    placeholderOptionB: 'Option B',
    errors: {
      fillAllFields: 'Remplis tous les champs',
      promptTooLong: 'La question doit faire 90 caractères ou moins',
      labelsTooLong: 'Les labels doivent faire 24 caractères ou moins',
      createFailed: 'Échec de la création du fork',
    },
    mutations: {
      flip: 'Inverser',
      flipDesc: 'Échanger les options',
      reframe: 'Reformuler',
      reframeDesc: 'Nouvel angle, mêmes choix',
      escalate: 'Intensifier',
      escalateDesc: 'Monter les enjeux',
      specific: 'Préciser',
      specificDesc: 'Rendre plus spécifique',
    },
  },
};
