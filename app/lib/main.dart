import 'package:flutter/material.dart';

import 'services/content_service.dart';
import 'state/game_controller.dart';
import 'theme.dart';
import 'ui/ending_screen.dart';
import 'ui/game_screen.dart';
import 'ui/title_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final content = ContentService();
  await content.load();
  runApp(FusibleApp(controller: GameController(content.engine)));
}

class FusibleApp extends StatelessWidget {
  final GameController controller;
  const FusibleApp({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FUSIBLE',
      debugShowCheckedModeBanner: false,
      theme: fusibleTheme(Brightness.light),
      darkTheme: fusibleTheme(Brightness.dark),
      home: _Root(controller: controller),
    );
  }
}

class _Root extends StatefulWidget {
  final GameController controller;
  const _Root({required this.controller});

  @override
  State<_Root> createState() => _RootState();
}

class _RootState extends State<_Root> {
  GameController get c => widget.controller;

  @override
  void initState() {
    super.initState();
    c.addListener(_onChange);
  }

  @override
  void dispose() {
    c.removeListener(_onChange);
    super.dispose();
  }

  void _onChange() => setState(() {});

  @override
  Widget build(BuildContext context) {
    if (c.ended) {
      return EndingScreen(controller: c, onNewRun: c.succeed);
    }
    if (c.playing) {
      return GameScreen(controller: c);
    }
    return TitleScreen(controller: c, onStart: () {});
  }
}
