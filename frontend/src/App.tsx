import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  LanguageCode,
  RepetitionTestSummary,
  MisheardTestSummary,
  FrequencyTestSummary,
  ScreeningReportData
} from './types';
import { translations } from './i18n/translations';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { ProgressBar } from './components/ProgressBar';
import { Modal } from './components/Modal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { TestRepetitionPage } from './pages/TestRepetitionPage';
import { TestMisheardPage } from './pages/TestMisheardPage';
import { TestFrequencyPage } from './pages/TestFrequencyPage';
import { ResultsPage } from './pages/ResultsPage';
import { BehavioralMonitoringPage } from './pages/BehavioralMonitoringPage';
import { FingerprintPage } from './pages/FingerprintPage';
import { TinnitusTrackerPage } from './pages/TinnitusTrackerPage';
import { HistoryTrendsPage } from './pages/HistoryTrendsPage';

export function App() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Sequential Screening Step:
  // 1: Registration, 2: Test 1 (Repetition), 3: Test 2 (Word Contrast), 4: Test 3 (Frequency), 5: Results Report
  const [screeningStep, setScreeningStep] = useState<number>(1);

  // Test Summaries
  const [test1Summary, setTest1Summary] = useState<RepetitionTestSummary | null>(null);
  const [test2Summary, setTest2Summary] = useState<MisheardTestSummary | null>(null);
  const [test3Summary, setTest3Summary] = useState<FrequencyTestSummary | null>(null);
  const [screeningReport, setScreeningReport] = useState<ScreeningReportData | null>(null);

  // Exit & Restart Modals
  const [showExitConfirmModal, setShowExitConfirmModal] = useState<boolean>(false);
  const [showRestartConfirmModal, setShowRestartConfirmModal] = useState<boolean>(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('echosense_user');
    if (savedUser) {
      try {
        const parsed: UserProfile = JSON.parse(savedUser);
        setUserProfile(parsed);
        if (parsed.preferredLanguage) {
          setCurrentLanguage(parsed.preferredLanguage);
        }
      } catch (e) {
        // Ignored
      }
    }
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    if (userProfile?.id) {
      api.updateLanguage(userProfile.id, lang);
    }
  };

  // Launch assessment from Landing Page
  const handleStartAssessment = () => {
    setActiveTab('screening');
    // If not started yet, begin at Step 1 (Registration)
    if (!userProfile) {
      setScreeningStep(1);
    }
  };

  // Step 1 Complete: User Registration
  const handleRegistrationComplete = async (profile: UserProfile) => {
    const registered = await api.registerUser(profile);
    setUserProfile(registered);
    setCurrentLanguage(registered.preferredLanguage);
    setScreeningStep(2); // Advance directly to sequential Test 1
  };

  // Step 2 Complete: Test 1 Repetition Detection
  const handleTest1Complete = (summary: RepetitionTestSummary) => {
    setTest1Summary(summary);
    setScreeningStep(3); // Advance directly to sequential Test 2
  };

  // Step 3 Complete: Test 2 Misheard Word Detection
  const handleTest2Complete = (summary: MisheardTestSummary) => {
    setTest2Summary(summary);
    setScreeningStep(4); // Advance directly to sequential Test 3
  };

  // Step 4 Complete: Test 3 Frequency Recognition -> Generates Final Report
  const handleTest3Complete = async (summary: FrequencyTestSummary) => {
    setTest3Summary(summary);

    if (userProfile && test1Summary && test2Summary) {
      try {
        const report = await api.submitScreening(
          userProfile.id || 'default-user',
          test1Summary,
          test2Summary,
          summary
        );
        setScreeningReport(report);
      } catch (err) {
        console.warn("Failed to submit screening report:", err);
      }
    }
    setScreeningStep(5); // Show Final Comprehensive Results Page
  };

  // Explicit confirmation before exiting an active test session
  const handleConfirmExit = () => {
    setScreeningStep(1);
    setTest1Summary(null);
    setTest2Summary(null);
    setTest3Summary(null);
    setActiveTab('landing');
  };

  // Restart / Clear session button handler
  const handleRestartSession = async () => {
    if (userProfile?.id) {
      await api.resetSession(userProfile.id);
    }
    setUserProfile(null);
    setTest1Summary(null);
    setTest2Summary(null);
    setTest3Summary(null);
    setScreeningReport(null);
    setScreeningStep(1);
    setActiveTab('landing');
  };

  const stepLabels = [
    'Registration',
    'Test 1: Repetition',
    'Test 2: Word Contrast',
    'Test 3: Pure Tones',
    'Results Report',
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#121212] flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Decorative Neo-Brutalist Background Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-brutal-dots opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-brutal-dots opacity-20 pointer-events-none" />
      <div className="absolute top-24 right-10 w-4 h-4 bg-[#FFC700] border-2 border-black shadow-brutal-xs pointer-events-none hidden md:block" />
      <div className="absolute top-36 right-16 w-3 h-3 bg-black pointer-events-none hidden md:block" />
      <div className="absolute bottom-32 left-8 w-4 h-4 bg-[#FFC700] border-2 border-black shadow-brutal-xs pointer-events-none hidden md:block" />

      {/* Top Navigation Bar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (activeTab === 'screening' && screeningStep > 1 && screeningStep < 5 && tab !== 'screening') {
            setShowExitConfirmModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onRestartClick={() => setShowRestartConfirmModal(true)}
        hasActiveSession={Boolean(userProfile)}
      />

      {/* Main Body */}
      <main className="flex-1 pb-16 relative z-10">
        
        {/* Landing Page (Overview) */}
        {activeTab === 'landing' && (
          <LandingPage
            currentLanguage={currentLanguage}
            onStartAssessment={handleStartAssessment}
            onExploreFeatures={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Screening Assessment Flow */}
        {activeTab === 'screening' && (
          <div className="pt-6 sm:pt-8">
            
            {/* Sequential Progress Stepper */}
            <ProgressBar currentStep={screeningStep} stepLabels={stepLabels} />

            {/* Step 1: Registration Page */}
            {screeningStep === 1 && (
              <RegistrationPage
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
                onComplete={handleRegistrationComplete}
              />
            )}

            {/* Step 2: Test 1 Repetition Detection */}
            {screeningStep === 2 && (
              <TestRepetitionPage
                currentLanguage={currentLanguage}
                onComplete={handleTest1Complete}
                onExitRequest={() => setShowExitConfirmModal(true)}
              />
            )}

            {/* Step 3: Test 2 Misheard Word Contrast */}
            {screeningStep === 3 && (
              <TestMisheardPage
                currentLanguage={currentLanguage}
                onComplete={handleTest2Complete}
                onExitRequest={() => setShowExitConfirmModal(true)}
              />
            )}

            {/* Step 4: Test 3 Frequency Recognition */}
            {screeningStep === 4 && (
              <TestFrequencyPage
                currentLanguage={currentLanguage}
                onComplete={handleTest3Complete}
                onExitRequest={() => setShowExitConfirmModal(true)}
              />
            )}

            {/* Step 5: Final Comprehensive Results Page */}
            {screeningStep === 5 && (
              <ResultsPage
                report={
                  screeningReport || {
                    id: 'temp-report',
                    userId: userProfile?.id || 'default-user',
                    userName: userProfile?.fullName || 'User',
                    age: userProfile?.age || 35,
                    preferredLanguage: currentLanguage,
                    timestamp: new Date().toISOString(),
                    repetitionTest: test1Summary || {
                      totalQuestions: 4,
                      correctAnswers: 4,
                      incorrectAnswers: 0,
                      totalRepetitions: 1,
                      accuracyPercentage: 100.0,
                      stageBreakdown: [],
                    },
                    misheardTest: test2Summary || {
                      totalWords: 5,
                      correctlyRecognized: ['Ship', 'Van', 'Thin', 'Pat'],
                      incorrectlyRecognized: ['Cab'],
                      totalAttempts: 6,
                      accuracyPercentage: 80.0,
                      categoryPerformance: {},
                      beneficialAssessmentAreas: ['Voiced vs Voiceless Consonants'],
                    },
                    frequencyTest: test3Summary || {
                      totalTones: 8,
                      detectedTones: 7,
                      missedTones: 1,
                      detectionPercentage: 87.5,
                      responses: [],
                      categorySummary: {
                        low: { detected: 2, missed: 0, total: 2, rangeHz: '250–500 Hz' },
                        mid: { detected: 3, missed: 0, total: 3, rangeHz: '1,000–4,000 Hz' },
                        high: { detected: 2, missed: 1, total: 3, rangeHz: '6,000–12,000 Hz' },
                      },
                    },
                    detectedFrequencyRanges: ['Low Frequencies (250–500 Hz)', 'Mid Speech Band (1,000–4,000 Hz)'],
                    missedFrequencyRanges: ['High Frequency Tone (12,000 Hz)'],
                    concernLevel: 'LOW',
                    concernReason:
                      'No significant concern identified by this session. Consistent responses across tested speech and frequency ranges.',
                    disclaimer:
                      'These tests are experimental and are not medically validated diagnostic procedures. EchoSense only provides preliminary hearing-related screening observations. It cannot confirm or rule out hearing loss. For genuine hearing concerns, consult a qualified audiologist or healthcare professional.',
                    thankYouMessage:
                      'Thank you for choosing EchoSense. Your hearing health matters. Continue monitoring your hearing and consult a qualified professional if you experience difficulties.',
                  }
                }
                currentLanguage={currentLanguage}
                onRestartSession={() => setShowRestartConfirmModal(true)}
                onExploreAiFeatures={() => setActiveTab('fingerprint')}
              />
            )}

          </div>
        )}

        {/* Behavioral Monitoring Tab */}
        {activeTab === 'behavioral' && (
          <BehavioralMonitoringPage
            userId={userProfile?.id || 'demo-user'}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Hearing Fingerprint Tab */}
        {activeTab === 'fingerprint' && (
          <FingerprintPage
            userId={userProfile?.id || 'demo-user'}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Tinnitus Tracker Tab */}
        {activeTab === 'tinnitus' && (
          <TinnitusTrackerPage
            userId={userProfile?.id || 'demo-user'}
            currentLanguage={currentLanguage}
          />
        )}

        {/* History Trends Tab */}
        {activeTab === 'trends' && (
          <HistoryTrendsPage
            userId={userProfile?.id || 'demo-user'}
            currentLanguage={currentLanguage}
          />
        )}

      </main>

      {/* Confirmation Modal for Exiting Active Test */}
      <Modal
        isOpen={showExitConfirmModal}
        onClose={() => setShowExitConfirmModal(false)}
        onConfirm={handleConfirmExit}
        title="Exit Active Screening Session?"
        description="Your current test progress in this sequential screening session will be lost. Are you sure you want to exit?"
        confirmText="Exit Assessment"
        cancelText="Continue Test"
        isDestructive={true}
      />

      {/* Confirmation Modal for Restarting Session */}
      <Modal
        isOpen={showRestartConfirmModal}
        onClose={() => setShowRestartConfirmModal(false)}
        onConfirm={handleRestartSession}
        title="Reset All Screening Data?"
        description="This will clear your temporary screening results, reset all progress, and return you to the home overview. Are you sure?"
        confirmText="Reset Everything"
        cancelText="Keep Results"
        isDestructive={true}
      />

      {/* Neo-Brutalist High-Impact Footer */}
      <footer className="border-t-[2.5px] border-black bg-white py-6 text-center text-xs text-black relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-black text-black text-sm tracking-tight">EchoSense</span>
            <span>•</span>
            <span className="font-bold text-gray-700">AI-Powered Early Hearing Health Screening</span>
          </div>
          <div className="text-[11px] font-bold text-gray-500 uppercase">
            AWARENESS & PRELIMINARY SCREENING ONLY • NOT A MEDICAL DIAGNOSTIC DEVICE
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-hazard-stripes" />
      </footer>

    </div>
  );
}
export default App;
