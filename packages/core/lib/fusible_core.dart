/// FUSIBLE — deterministic, data-driven rules engine for a football
/// Reigns-like. Pure Dart, no Flutter, no I/O, no wall-clock: everything is
/// reproducible from a seed and a list of choices.
library fusible_core;

export 'src/condition.dart' show EvalContext, evalWhen, kKnownPaths, kKnownPathPrefixes, kKnownCalls;
export 'src/content.dart';
export 'src/draw/director.dart';
export 'src/effects.dart';
export 'src/engine.dart';
export 'src/goldens.dart';
export 'src/rng.dart';
export 'src/seed_codec.dart';
export 'src/sfx.dart';
export 'src/standings.dart';
export 'src/state.dart';
export 'src/naming.dart';
export 'src/text.dart' show formatText, placeholdersOf, kKnownPlaceholders, kNamePlaceholders;
export 'src/world.dart';

import 'dart:convert';
import 'src/content.dart';

/// Parse a compiled content bundle (the JSON produced by build_content).
Content loadContentFromJson(String jsonStr) =>
    Content.fromJson(json.decode(jsonStr) as Map<String, dynamic>);
