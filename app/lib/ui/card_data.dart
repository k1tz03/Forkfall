import 'package:fusible_core/fusible_core.dart';

import 'widgets/vignette.dart';

/// Dérive la vignette d'une carte du moteur, comme l'aperçu web (preview.dart) :
/// speakerName / speakerLabel / expression / kind / sablier / camp viennent du
/// payload ; sans locuteur, c'est toi (coach / joueur, nom du protagoniste).
VignetteData vignetteFor(Pending p, GameState s, Content content, {String? expression, int? number}) {
  final payload = p.payload;
  final speaker = p.speaker;
  final ch = speaker == null ? null : content.characters[speaker];
  final selfId = s.role == 'joueur' ? 'joueur' : 'coach';
  final roleName = content.roles[s.role]?.name ?? s.role;
  final name = (payload['speakerName'] as String?) ?? ch?.name ?? (speaker ?? s.entities.protagonist);
  final label = (payload['speakerLabel'] as String?) ?? ch?.label ?? (speaker == null ? roleName : '');

  return VignetteData(
    characterId: speaker ?? selfId,
    expression: expression ?? (payload['expression'] as String?) ?? 'neutre',
    camp: (payload['camp'] as String?) ?? ch?.camp,
    genre: s.entities.genre,
    name: name,
    label: label,
    number: number ?? s.turn,
    sablier: payload['sablier'] == true,
    kindTag: VignetteData.kindTagFor(payload['kind'] as String?),
    reaction: payload['kind'] == 'reaction',
  );
}

/// Texte du tampon de fin (§6) : RETRAITÉ pour les fins dorées, EN GARDE À VUE
/// pour les fins judiciaires, VIRÉ sinon.
String stampTextFor(String? endingId, {required bool golden}) {
  if (golden) return 'Retraité';
  if (const {'grand_deballage', 'en_coupable', 'jp_panama'}.contains(endingId)) return 'En garde à vue';
  return 'Viré';
}
