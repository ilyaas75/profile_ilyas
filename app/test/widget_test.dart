import 'package:flutter_test/flutter_test.dart';
import 'package:ilyas_portfolio/main.dart';

void main() {
  testWidgets('Portfolio app loads', (WidgetTester tester) async {
    await tester.pumpWidget(const PortfolioApp());
    await tester.pump();

    expect(find.byType(PortfolioHomePage), findsOneWidget);
  });
}
