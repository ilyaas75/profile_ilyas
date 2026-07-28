import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../models/profile.dart';

class ProfileService {
  static String resolveAvatarUrl(String? avatar) {
    if (avatar == null || avatar.trim().isEmpty) return '';
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
    if (avatar.startsWith('/uploads/')) return '${ApiConfig.baseUrl}$avatar';
    if (avatar.startsWith('/')) return '${ApiConfig.baseUrl}$avatar';
    return '${ApiConfig.baseUrl}/$avatar';
  }

  Future<Profile> fetchPrimary() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/api/profile?primary=true');
    final response = await http.get(uri).timeout(const Duration(seconds: 8));

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      return Profile.fromJson(json);
    }

    throw Exception('Failed to load profile (${response.statusCode})');
  }
}
