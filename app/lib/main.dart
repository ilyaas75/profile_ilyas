import 'package:flutter/material.dart';

import '../models/profile.dart';
import '../services/profile_service.dart';
import '../widgets/profile_avatar.dart';

void main() {
  runApp(const PortfolioApp());
}

class PortfolioApp extends StatelessWidget {
  const PortfolioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ilyas Hassan Mohamed',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF54C5F8),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const PortfolioHomePage(),
    );
  }
}

class PortfolioHomePage extends StatefulWidget {
  const PortfolioHomePage({super.key});

  @override
  State<PortfolioHomePage> createState() => _PortfolioHomePageState();
}

class _PortfolioHomePageState extends State<PortfolioHomePage> {
  final ProfileService _profileService = ProfileService();
  late Future<Profile> _profileFuture;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  void _loadProfile() {
    setState(() {
      _profileFuture = _profileService.fetchPrimary().catchError((_) => Profile.fallback);
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Profile>(
      future: _profileFuture,
      builder: (context, snapshot) {
        final profile = snapshot.data ?? Profile.fallback;
        final loading = snapshot.connectionState == ConnectionState.waiting;

        return Scaffold(
          body: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF020617), Color(0xFF0F172A), Color(0xFF020617)],
              ),
            ),
            child: SafeArea(
              child: RefreshIndicator(
                onRefresh: () async {
                  _loadProfile();
                  await _profileFuture;
                },
                color: const Color(0xFF54C5F8),
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const SizedBox(height: 32),
                      if (loading)
                        const SizedBox(
                          width: 100,
                          height: 100,
                          child: CircularProgressIndicator(color: Color(0xFF54C5F8)),
                        )
                      else
                        ProfileAvatar(profile: profile, size: 110),
                      const SizedBox(height: 24),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)),
                        ),
                        child: Text(
                          profile.availability,
                          style: const TextStyle(
                            color: Color(0xFF34D399),
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        profile.name,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        profile.title,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 16, color: Color(0xFFCBD5E1)),
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        alignment: WrapAlignment.center,
                        children: profile.stackFocus
                            .map(
                              (tech) => Chip(
                                label: Text(tech, style: const TextStyle(fontSize: 12)),
                                backgroundColor: const Color(0xFF1E293B),
                                side: const BorderSide(color: Color(0xFF334155)),
                              ),
                            )
                            .toList(),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        profile.tagline,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 15, color: Color(0xFF94A3B8)),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        alignment: WrapAlignment.center,
                        children: profile.specialties
                            .map(
                              (s) => Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      const Color(0xFF54C5F8).withValues(alpha: 0.2),
                                      const Color(0xFF3B82F6).withValues(alpha: 0.2),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  s,
                                  style: const TextStyle(color: Color(0xFF54C5F8), fontSize: 12),
                                ),
                              ),
                            )
                            .toList(),
                      ),
                      const SizedBox(height: 48),
                      const Text(
                        'Flutter Mobile Portfolio',
                        style: TextStyle(color: Color(0xFF64748B), fontSize: 13),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Synced from API · ${ProfileService.resolveAvatarUrl(profile.avatar).isNotEmpty ? 'Photo loaded' : 'Pull down to refresh'}',
                        style: const TextStyle(color: Color(0xFF475569), fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
