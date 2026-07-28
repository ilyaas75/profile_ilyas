import 'package:flutter/material.dart';

import '../models/profile.dart';
import '../services/profile_service.dart';

class ProfileAvatar extends StatelessWidget {
  final Profile profile;
  final double size;

  const ProfileAvatar({super.key, required this.profile, this.size = 100});

  @override
  Widget build(BuildContext context) {
    final imageUrl = ProfileService.resolveAvatarUrl(profile.avatar);

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: const Color(0xFF1E293B),
        border: Border.all(color: const Color(0xFF54C5F8).withValues(alpha: 0.5), width: 2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF54C5F8).withValues(alpha: 0.25),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: imageUrl.isNotEmpty
          ? Image.network(
              imageUrl,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => _initials(),
              loadingBuilder: (context, child, progress) {
                if (progress == null) return child;
                return const Center(
                  child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF54C5F8)),
                );
              },
            )
          : _initials(),
    );
  }

  Widget _initials() {
    return Center(
      child: Text(
        profile.initials,
        style: TextStyle(
          fontSize: size * 0.32,
          fontWeight: FontWeight.bold,
          foreground: Paint()
            ..shader = const LinearGradient(
              colors: [Color(0xFF54C5F8), Color(0xFF3B82F6)],
            ).createShader(const Rect.fromLTWH(0, 0, 80, 40)),
        ),
      ),
    );
  }
}
