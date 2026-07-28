class Profile {
  final String id;
  final String name;
  final String title;
  final String tagline;
  final String availability;
  final String avatar;
  final List<String> stackFocus;
  final List<String> specialties;

  const Profile({
    required this.id,
    required this.name,
    required this.title,
    required this.tagline,
    required this.availability,
    required this.avatar,
    required this.stackFocus,
    required this.specialties,
  });

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      id: json['_id'] as String? ?? '',
      name: json['name'] as String? ?? 'Ilyas Hassan Mohamed',
      title: json['title'] as String? ?? 'Software Developer',
      tagline: json['tagline'] as String? ?? '',
      availability: json['availability'] as String? ?? 'Open to Opportunities',
      avatar: json['avatar'] as String? ?? '',
      stackFocus: List<String>.from(json['stackFocus'] as List? ?? []),
      specialties: List<String>.from(json['specialties'] as List? ?? []),
    );
  }

  static const Profile fallback = Profile(
    id: '',
    name: 'Ilyas Hassan Mohamed',
    title: 'Software Developer & Flutter Developer',
    tagline: 'I build modern mobile apps & websites',
    availability: 'Open to Opportunities',
    avatar: '',
    stackFocus: ['React', 'Node.js', 'MongoDB', 'Flutter'],
    specialties: ['Multimedia', 'UI/UX', 'Creative Coding'],
  );

  String get initials {
    final parts = name.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty).toList();
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts[0].substring(0, parts[0].length >= 2 ? 2 : 1).toUpperCase();
    return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
  }
}
