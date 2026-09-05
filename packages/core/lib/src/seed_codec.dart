/// The "Code de Carrière": a compact, shareable code that encodes the content
/// version, the run seed, the starting postulat and the sequence of swipes,
/// so friends can replay the exact same career without any server
/// (docs/brainstorm section 7).
library;

/// Crockford base32 alphabet (no I, L, O, U to avoid ambiguity).
const String _alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

String _encode32(List<int> bytes) {
  final buffer = StringBuffer();
  int acc = 0;
  int bits = 0;
  for (final b in bytes) {
    acc = (acc << 8) | (b & 0xFF);
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      buffer.write(_alphabet[(acc >> bits) & 0x1F]);
    }
  }
  if (bits > 0) {
    buffer.write(_alphabet[(acc << (5 - bits)) & 0x1F]);
  }
  return buffer.toString();
}

List<int> _decode32(String code) {
  final bytes = <int>[];
  int acc = 0;
  int bits = 0;
  for (final ch in code.toUpperCase().split('')) {
    if (ch == '-' || ch == ' ') continue;
    final v = _alphabet.indexOf(ch);
    if (v < 0) continue;
    acc = (acc << 5) | v;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.add((acc >> bits) & 0xFF);
    }
  }
  return bytes;
}

class CareerCode {
  final int contentVersion;
  final int seed;
  final int postulat;
  final List<bool> swipes; // true = right, false = left

  const CareerCode({
    required this.contentVersion,
    required this.seed,
    required this.postulat,
    required this.swipes,
  });

  /// Short "seed only" form (version + seed + postulat), for "play my career".
  String get seedCode {
    final bytes = <int>[
      contentVersion & 0xFF,
      (seed >>> 24) & 0xFF,
      (seed >>> 16) & 0xFF,
      (seed >>> 8) & 0xFF,
      seed & 0xFF,
      postulat & 0xFF,
    ];
    return _group(_encode32(bytes));
  }

  /// Full form with the swipe bitstring, for ghost/duel/replay.
  String get fullCode {
    final bytes = <int>[
      contentVersion & 0xFF,
      (seed >>> 24) & 0xFF,
      (seed >>> 16) & 0xFF,
      (seed >>> 8) & 0xFF,
      seed & 0xFF,
      postulat & 0xFF,
      (swipes.length >>> 8) & 0xFF,
      swipes.length & 0xFF,
    ];
    int acc = 0;
    int bits = 0;
    for (final s in swipes) {
      acc = (acc << 1) | (s ? 1 : 0);
      bits++;
      if (bits == 8) {
        bytes.add(acc & 0xFF);
        acc = 0;
        bits = 0;
      }
    }
    if (bits > 0) bytes.add((acc << (8 - bits)) & 0xFF);
    return _group(_encode32(bytes));
  }

  static String _group(String s) {
    final buffer = StringBuffer();
    for (int i = 0; i < s.length; i++) {
      if (i > 0 && i % 5 == 0) buffer.write('-');
      buffer.write(s[i]);
    }
    return buffer.toString();
  }

  static CareerCode? decode(String code) {
    final bytes = _decode32(code);
    if (bytes.length < 6) return null;
    final contentVersion = bytes[0];
    final seed = (bytes[1] << 24) | (bytes[2] << 16) | (bytes[3] << 8) | bytes[4];
    final postulat = bytes[5];
    final swipes = <bool>[];
    if (bytes.length >= 8) {
      final count = (bytes[6] << 8) | bytes[7];
      int idx = 8;
      int produced = 0;
      while (produced < count && idx < bytes.length) {
        final byte = bytes[idx++];
        for (int b = 7; b >= 0 && produced < count; b--) {
          swipes.add(((byte >> b) & 1) == 1);
          produced++;
        }
      }
    }
    return CareerCode(
      contentVersion: contentVersion,
      seed: seed & 0xFFFFFFFF,
      postulat: postulat,
      swipes: swipes,
    );
  }
}
