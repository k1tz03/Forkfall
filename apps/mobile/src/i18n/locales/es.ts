export default {
  // Common
  common: {
    loading: 'Cargando...',
    error: 'Error',
    retry: 'Reintentar',
    cancel: 'Cancelar',
    continue: 'Continuar',
    back: 'Volver',
    post: 'Publicar',
    create: 'Crear',
    refresh: 'Actualizar',
  },

  // Onboarding
  onboarding: {
    welcome: {
      title: 'FORKFALL',
      subtitle: 'Cada elección cuenta una historia.\nHaz que la tuya cuente.',
      getStarted: 'Empezar',
    },
    lane: {
      title: '¿Qué te trae por aquí?',
      subtitle: 'Elige tu camino',
    },
    energy: {
      title: '¿Cuál es tu vibra hoy?',
      subtitle: 'Establece tu nivel de energía',
    },
    ready: {
      title: '¡Ya estás listo!',
      subtitle: 'Desliza a la izquierda o derecha para elegir.\nMantén pulsado para crear tu propio fork.',
      startForking: 'Empezar a forkear',
      left: 'Izquierda',
      skip: 'Saltar',
      right: 'Derecha',
    },
  },

  // Deck Screen
  deck: {
    loadingForks: 'Cargando forks...',
    noForks: '¡Aún no hay forks!',
    noForksSubtitle: 'Vuelve pronto o crea tu propio fork.',
    createFork: 'Crear Fork',
    allSeen: '¡Los has visto todos!',
    allSeenSubtitle: 'Vuelve más tarde para más forks.',
    left: 'Izquierda',
    skip: 'Saltar',
    right: 'Derecha',
    holdToTwist: 'Mantener para twistear',
  },

  // Create Screen
  create: {
    newFork: 'Nuevo Fork',
    twistFork: 'Twistear Fork',
    twistingFrom: 'Twisteando desde:',
    mutationType: 'Tipo de mutación',
    prompt: 'Pregunta',
    charsLeft: '{{count}} caracteres restantes',
    leftOption: 'Izquierda',
    rightOption: 'Derecha',
    mood: 'Estado de ánimo (opcional)',
    placeholderPrompt: '¿Preferirías...',
    placeholderOptionA: 'Opción A',
    placeholderOptionB: 'Opción B',
    errors: {
      fillAllFields: 'Por favor completa todos los campos',
      promptTooLong: 'La pregunta debe tener 90 caracteres o menos',
      labelsTooLong: 'Las etiquetas deben tener 24 caracteres o menos',
      createFailed: 'Error al crear el fork',
    },
    mutations: {
      flip: 'Invertir',
      flipDesc: 'Intercambiar opciones',
      reframe: 'Reformular',
      reframeDesc: 'Nuevo ángulo, mismas opciones',
      escalate: 'Escalar',
      escalateDesc: 'Subir las apuestas',
      specific: 'Especificar',
      specificDesc: 'Hacerlo específico',
    },
  },
};
