import 'api_config_stub.dart' if (dart.library.io) 'api_config_io.dart' as platform;

/// Backend API URL. Override: flutter run --dart-define=API_URL=http://YOUR_IP:5000
class ApiConfig {
  static const String _envUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:5000',
  );

  static String get baseUrl => platform.resolveApiUrl(_envUrl);
}
