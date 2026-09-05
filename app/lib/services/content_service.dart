import 'dart:convert' show utf8;

import 'package:flutter/services.dart' show rootBundle;
import 'package:fusible_core/fusible_core.dart';

import '../ui/widgets/portrait.dart';

/// Loads the compiled content bundle shipped as an asset and exposes the
/// engine. Everything downstream is deterministic and offline.
class ContentService {
  late final Content content;
  late final Engine engine;

  Future<void> load() async {
    // We decode the bundle ourselves rather than calling rootBundle.loadString:
    // loadString offloads UTF-8 decoding to a background isolate (via compute())
    // once an asset passes 50 KB, and that isolate never resolves under
    // flutter_test, hanging every widget test. rootBundle.load() returns the
    // bytes without an isolate; a one-time main-thread decode of the content
    // bundle at startup is negligible (and web already decodes synchronously).
    final data = await rootBundle.load('assets/content.json');
    final jsonStr = utf8.decode(data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes));
    content = loadContentFromJson(jsonStr);
    engine = Engine(content);
    // Les fiches de portrait (content/portraits.yaml) alimentent le paper doll.
    Portrait.install(content.portraits);
  }
}
