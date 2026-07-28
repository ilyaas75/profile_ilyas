import 'dart:io';

String resolveApiUrl(String url) {
  if (Platform.isAndroid &&
      (url.contains('localhost') || url.contains('127.0.0.1'))) {
    return url
        .replaceAll('localhost', '10.0.2.2')
        .replaceAll('127.0.0.1', '10.0.2.2');
  }
  return url;
}
