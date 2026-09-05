/// Deterministic 32-bit PRNG (mulberry32) with web-safe multiplication.
///
/// The whole game uses this generator, seeded from the run seed and carried
/// inside [GameState], so that "same seed + same choices" always reproduces
/// the same run on native AND on JavaScript (see docs/brainstorm section 9).
/// A separate cosmetic stream (shakes, confetti) must never touch this one.
library;

/// 32-bit unsigned multiply that never exceeds 2^53, so the result is identical
/// on the Dart VM (64-bit ints) and on the web (doubles).
int mul32(int a, int b) {
  a &= 0xFFFFFFFF;
  b &= 0xFFFFFFFF;
  final int aHi = (a >>> 16) & 0xFFFF;
  final int aLo = a & 0xFFFF;
  // aLo*b <= 65535 * 4.29e9 ~= 2.8e14 < 2^53, aHi*b likewise.
  return ((aLo * b) + (((aHi * b) & 0xFFFF) << 16)) & 0xFFFFFFFF;
}

class Rng {
  int _state;

  Rng(int seed) : _state = seed & 0xFFFFFFFF;

  Rng.fromState(this._state);

  int get state => _state & 0xFFFFFFFF;

  /// Next raw 32-bit value.
  int next() {
    _state = (_state + 0x6D2B79F5) & 0xFFFFFFFF;
    int t = _state;
    t = mul32(t ^ (t >>> 15), t | 1);
    t = (t ^ (t + mul32(t ^ (t >>> 7), t | 61))) & 0xFFFFFFFF;
    return (t ^ (t >>> 14)) & 0xFFFFFFFF;
  }

  /// Uniform double in [0, 1).
  double nextDouble() => next() / 4294967296.0;

  /// Uniform int in [0, max).
  int nextInt(int max) {
    if (max <= 0) return 0;
    return next() % max;
  }

  /// Inclusive int in [min, max].
  int range(int min, int max) {
    if (max <= min) return min;
    return min + nextInt(max - min + 1);
  }

  /// Weighted index pick; returns -1 if all weights are <= 0.
  int weightedIndex(List<double> weights) {
    double total = 0;
    for (final w in weights) {
      if (w > 0) total += w;
    }
    if (total <= 0) return -1;
    double r = nextDouble() * total;
    for (int i = 0; i < weights.length; i++) {
      final w = weights[i];
      if (w <= 0) continue;
      r -= w;
      if (r < 0) return i;
    }
    // Floating point guard: return the last positive-weight index.
    for (int i = weights.length - 1; i >= 0; i--) {
      if (weights[i] > 0) return i;
    }
    return -1;
  }
}

/// Deterministic FNV-1a 32-bit hash, used to derive daily/weekly challenge
/// seeds from a date string without any server.
int fnv1a32(String s) {
  int h = 0x811c9dc5;
  for (final c in s.codeUnits) {
    h ^= c & 0xFF;
    h = mul32(h, 0x01000193);
  }
  return h & 0xFFFFFFFF;
}
