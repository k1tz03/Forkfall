import 'package:flutter/services.dart' show rootBundle;
import 'package:fusible_core/fusible_core.dart';

/// Loads the compiled content bundle shipped as an asset and exposes the
/// engine. Everything downstream is deterministic and offline.
class ContentService {
  late final Content content;
  late final Engine engine;

  Future<void> load() async {
    final jsonStr = await rootBundle.loadString('assets/content.json');
    content = loadContentFromJson(jsonStr);
    engine = Engine(content);
  }
}
