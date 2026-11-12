import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Smartphone,
  Terminal,
  FileCode,
  Shield,
  Layers,
  ChevronRight,
  Download,
} from 'lucide-react';

interface FlutterGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterGuideModal: React.FC<FlutterGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'build' | 'pubspec' | 'manifest' | 'code' | 'ios'>('build');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const pubspecContent = `name: m2a_mobile
description: "M2A Mobile App - Live Channels, Multi Tools & Blogger Feed Sync"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.5.1
  video_player: ^2.8.6
  chewie: ^1.8.1
  webview_flutter: ^4.7.0
  http: ^1.2.1
  wakelock_plus: ^1.2.0
  google_mobile_ads: ^5.0.0
  share_plus: ^9.0.0
  url_launcher: ^6.2.6
  cached_network_image: ^3.3.1
  shared_preferences: ^2.2.3
  flutter_html: ^3.0.0-beta.2
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/channels.json
    - assets/apps.json
    - assets/games.json`;

  const manifestContent = `<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.marketing2advertising.m2a">

    <!-- Permissions required for live HLS TV, webview, and wake lock -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:label="M2A"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true">

        <!-- Google AdMob App ID (Replace with your AdMob App ID) -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713"/>

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">

            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme" />

            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>

            <!-- Deep linking for marketing2advertising.com -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="www.marketing2advertising.com" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const iosPlistContent = `<!-- ios/Runner/Info.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>M2A</string>
    <key>CFBundleDisplayName</key>
    <string>M2A</string>
    <key>CFBundleIdentifier</key>
    <string>com.marketing2advertising.m2a</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>GADApplicationIdentifier</key>
    <string>ca-app-pub-3940256099942544~1458002511</string>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
    <key>UIBackgroundModes</key>
    <array>
        <string>audio</string>
    </array>
</dict>
</plist>`;

  const flutterMainContent = `// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: M2AApp()));
}

class M2AApp extends StatelessWidget {
  const M2AApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'M2A',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0B0B0F),
        primaryColor: const Color(0xFFF59E0B),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFF59E0B),
          secondary: Color(0xFFE11D48),
          surface: Color(0xFF14141E),
        ),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    TVScreen(),
    FirimuScreen(),
    AppsScreen(),
    GamesScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        backgroundColor: const Color(0xFF0B0B0F),
        selectedItemColor: const Color(0xFFF59E0B),
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.tv), label: 'TV'),
          BottomNavigationBarItem(icon: Icon(Icons.movie), label: 'Firimu'),
          BottomNavigationBarItem(icon: Icon(Icons.apps), label: 'Apps'),
          BottomNavigationBarItem(icon: Icon(Icons.sports_esports), label: 'Games'),
        ],
      ),
    );
  }
}

// TV Screen with Chewie & video_player
class TVScreen extends StatefulWidget {
  const TVScreen({super.key});
  @override
  State<TVScreen> createState() => _TVScreenState();
}

class _TVScreenState extends State<TVScreen> {
  VideoPlayerController? _videoPlayerController;
  ChewieController? _chewieController;
  bool _isLoading = true;
  bool _isError = false;

  final String streamUrl = "https://live-onesignal.royalmedia.co.ke/live/jgB35emfPsiW5aFjKJjbjg.m3u8";

  @override
  void initState() {
    super.initState();
    _initializePlayer(streamUrl);
  }

  Future<void> _initializePlayer(String url) async {
    setState(() {
      _isLoading = true;
      _isError = false;
    });

    try {
      _videoPlayerController = VideoPlayerController.networkUrl(Uri.parse(url));
      await _videoPlayerController!.initialize();
      _chewieController = ChewieController(
        videoPlayerController: _videoPlayerController!,
        autoPlay: true,
        isLive: true,
        aspectRatio: 16 / 9,
      );
      setState(() => _isLoading = false);
    } catch (e) {
      setState(() {
        _isLoading = false;
        _isError = true;
      });
    }
  }

  @override
  void dispose() {
    _videoPlayerController?.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live TV Channels'), backgroundColor: Colors.transparent),
      body: Column(
        children: [
          AspectRatio(
            aspectRatio: 16 / 9,
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFFF59E0B)))
                : _isError
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('Network not well – Try Again', style: TextStyle(color: Colors.white)),
                            ElevatedButton(
                              onPressed: () => _initializePlayer(streamUrl),
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      )
                    : Chewie(controller: _chewieController!),
          ),
          const Expanded(child: Center(child: Text('Channel Catalog Loaded from channels.json'))),
        ],
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(body: Center(child: Text('Home Feed')));
}

class FirimuScreen extends StatelessWidget {
  const FirimuScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(body: Center(child: Text('Firimu & Blogs')));
}

class AppsScreen extends StatelessWidget {
  const AppsScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(body: Center(child: Text('Multi Apps')));
}

class GamesScreen extends StatelessWidget {
  const GamesScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(body: Center(child: Text('15 Free Games')));
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5">
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#101018] border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#14141e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                M2A Flutter & Native APK/AAB Builder
              </h2>
              <p className="text-[10px] text-slate-400">
                Android & iOS Source Code, Permissions & Google Play Publication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 p-2 bg-[#0d0d14] border-b border-white/10 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('build')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === 'build' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Build APK Steps
          </button>
          <button
            onClick={() => setActiveTab('pubspec')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === 'pubspec' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            pubspec.yaml
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === 'manifest' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            AndroidManifest.xml
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === 'code' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Flutter main.dart
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === 'ios' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            iOS Info.plist
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'build' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <h4 className="font-bold text-sm text-white mb-1">
                  Ready to deploy to Android & Google Play
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Follow these step-by-step commands to build your release APK for testing or release Android App Bundle (AAB) for Google Play submission.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-black border border-white/10 space-y-2">
                  <div className="font-bold text-amber-400 flex items-center justify-between">
                    <span>Step 1: Create Flutter Project & Install Dependencies</span>
                    <button
                      onClick={() =>
                        copyCode(
                          'step1',
                          'flutter create --org com.marketing2advertising m2a_app\ncd m2a_app\nflutter pub get'
                        )
                      }
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedSection === 'step1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto">
                    flutter create --org com.marketing2advertising m2a_app{'\n'}
                    cd m2a_app{'\n'}
                    flutter pub get
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-black border border-white/10 space-y-2">
                  <div className="font-bold text-amber-400 flex items-center justify-between">
                    <span>Step 2: Generate Release Keystore for Google Play</span>
                    <button
                      onClick={() =>
                        copyCode(
                          'step2',
                          'keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload'
                        )
                      }
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedSection === 'step2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto">
                    keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-black border border-white/10 space-y-2">
                  <div className="font-bold text-amber-400 flex items-center justify-between">
                    <span>Step 3: Build APK (for phone install) & AAB (for Play Store)</span>
                    <button
                      onClick={() =>
                        copyCode(
                          'step3',
                          'flutter build apk --release\nflutter build appbundle --release'
                        )
                      }
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedSection === 'step3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto">
                    # Build universal testing APK:{'\n'}
                    flutter build apk --release{'\n\n'}
                    # Build Google Play AAB:{'\n'}
                    flutter build appbundle --release
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pubspec' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">pubspec.yaml dependencies</span>
                <button
                  onClick={() => copyCode('pubspec', pubspecContent)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 flex items-center gap-1 text-[11px] font-bold"
                >
                  {copiedSection === 'pubspec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy pubspec.yaml
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-black border border-white/10 font-mono text-[11px] text-slate-200 overflow-x-auto max-h-[380px]">
                {pubspecContent}
              </pre>
            </div>
          )}

          {activeTab === 'manifest' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">AndroidManifest.xml permissions & deep links</span>
                <button
                  onClick={() => copyCode('manifest', manifestContent)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 flex items-center gap-1 text-[11px] font-bold"
                >
                  {copiedSection === 'manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy AndroidManifest
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-black border border-white/10 font-mono text-[11px] text-slate-200 overflow-x-auto max-h-[380px]">
                {manifestContent}
              </pre>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">lib/main.dart implementation</span>
                <button
                  onClick={() => copyCode('main_dart', flutterMainContent)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 flex items-center gap-1 text-[11px] font-bold"
                >
                  {copiedSection === 'main_dart' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy main.dart
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-black border border-white/10 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[380px]">
                {flutterMainContent}
              </pre>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">ios/Runner/Info.plist configuration</span>
                <button
                  onClick={() => copyCode('ios', iosPlistContent)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 flex items-center gap-1 text-[11px] font-bold"
                >
                  {copiedSection === 'ios' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy Info.plist
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-black border border-white/10 font-mono text-[11px] text-slate-200 overflow-x-auto max-h-[380px]">
                {iosPlistContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#14141e] flex justify-between items-center">
          <span className="text-[10px] text-slate-500">M2A App Framework · Architecture Guide</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
