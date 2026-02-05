export default {
  // Common
  common: {
    loading: 'Laden...',
    error: 'Fehler',
    retry: 'Erneut versuchen',
    cancel: 'Abbrechen',
    continue: 'Weiter',
    back: 'Zurück',
    post: 'Posten',
    create: 'Erstellen',
    refresh: 'Aktualisieren',
  },

  // Onboarding
  onboarding: {
    welcome: {
      title: 'FORKFALL',
      subtitle: 'Jede Wahl erzählt eine Geschichte.\nMach deine bedeutsam.',
      getStarted: 'Los geht\'s',
    },
    lane: {
      title: 'Was führt dich hierher?',
      subtitle: 'Wähle deinen Weg',
    },
    energy: {
      title: 'Was ist deine Stimmung heute?',
      subtitle: 'Setze dein Energielevel',
    },
    ready: {
      title: 'Du bist bereit!',
      subtitle: 'Wische nach links oder rechts um zu wählen.\nHalte gedrückt um deinen eigenen Fork zu erstellen.',
      startForking: 'Starte Forking',
      left: 'Links',
      skip: 'Überspringen',
      right: 'Rechts',
    },
  },

  // Deck Screen
  deck: {
    loadingForks: 'Lade Forks...',
    noForks: 'Noch keine Forks!',
    noForksSubtitle: 'Komm bald wieder oder erstelle deinen eigenen Fork.',
    createFork: 'Fork erstellen',
    allSeen: 'Du hast alle gesehen!',
    allSeenSubtitle: 'Komm später für mehr Forks wieder.',
    left: 'Links',
    skip: 'Überspringen',
    right: 'Rechts',
    holdToTwist: 'Halten zum Twisten',
  },

  // Create Screen
  create: {
    newFork: 'Neuer Fork',
    twistFork: 'Fork Twisten',
    twistingFrom: 'Twisten von:',
    mutationType: 'Mutationstyp',
    prompt: 'Frage',
    charsLeft: '{{count}} Zeichen übrig',
    leftOption: 'Links',
    rightOption: 'Rechts',
    mood: 'Stimmung (optional)',
    placeholderPrompt: 'Würdest du lieber...',
    placeholderOptionA: 'Option A',
    placeholderOptionB: 'Option B',
    errors: {
      fillAllFields: 'Bitte fülle alle Felder aus',
      promptTooLong: 'Die Frage muss 90 Zeichen oder weniger haben',
      labelsTooLong: 'Labels müssen 24 Zeichen oder weniger haben',
      createFailed: 'Fork konnte nicht erstellt werden',
    },
    mutations: {
      flip: 'Umdrehen',
      flipDesc: 'Optionen tauschen',
      reframe: 'Umrahmen',
      reframeDesc: 'Neuer Blickwinkel, gleiche Optionen',
      escalate: 'Eskalieren',
      escalateDesc: 'Den Einsatz erhöhen',
      specific: 'Eingrenzen',
      specificDesc: 'Spezifischer machen',
    },
  },
};
