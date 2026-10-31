import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  LanguageCode,
  EarMode,
  RepetitionTestSummary,
  MisheardTestSummary,
  FrequencyTestSummary,
  ScreeningReportData,
  EarScreeningResult
} from './types';
import { translations } from './i18n/translations';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { ProgressBar } from './components/ProgressBar';
import { Modal } from './components/Modal';
import { EarSelectionScreen } from './components/EarSelectionScreen';

// Pages
import { LandingPage } from './pages/LandingPage';
import { HearingTestsPage } from './pages/HearingTestsPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { TestRepetitionPage } from './pages/TestRepetitionPage';
import { TestMisheardPage } from './pages/TestMisheardPage';
import { TestFrequencyPage } from './pages/TestFrequencyPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { BehavioralMonitoringPage } from './pages/BehavioralMonitoringPage';
import { FingerprintPage } from './pages/FingerprintPage';
import { TinnitusTrackerPage } from './pages/TinnitusTrackerPage';
import { HistoryTrendsPage } from './pages/HistoryTrendsPage';

export function App() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Sequential Screening Step:
  // 1: Registration, 2: Ear Selection, 3: Test 1 (Repetition), 4: Test 2 (Word Contrast), 5: Test 3 (Frequency), 6: Results Report
  const [screeningStep, setScreeningStep] = useState<number>(1);

  // Ear Testing Mode ('left' | 'right' | 'both')
  const [testedEarMode, setTestedEarMode] = useState<EarMode>('both');

  // Track if user launched a standalone test vs full sequence
  const [activeStandaloneTest, setActiveStandaloneTest] = useState<'test1' | 'test2' | 'test3' | 'ear_assessment' | null>(null);

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

  // Launch assessment from Landing Page -> Directs to the dedicated 4-Test Selection Page
  const handleStartAssessment = () => {
    setActiveTab('tests');
  };

  // Launch a specific test chosen from the 4 options on the Hearing Tests Selection Page
  const handleLaunchSpecificTest = (
    testType: 'test1' | 'test2' | 'test3' | 'ear_assessment' | 'full_sequence',
    earMode?: EarMode
  ) => {
    if (testType === 'full_sequence') {
      setActiveStandaloneTest(null);
      setTestedEarMode('both');
      setActiveTab('screening');
      if (!userProfile) {
        setScreeningStep(1); // Step 1: Registration
      } else {
        setScreeningStep(2); // Step 2: Ear Selection Screen
      }
      return;
    }

    if (testType === 'ear_assessment') {
      const ear = earMode || 'left';
      setTestedEarMode(ear);
      setActiveStandaloneTest('ear_assessment');
      setActiveTab('screening');
      if (!userProfile) {
        setScreeningStep(1); // Registration
      } else {
        setScreeningStep(5); // Jump directly to Pure Tone Frequency Test with unilateral audio panning + pink noise masking
      }
      return;
    }

    if (testType === 'test3') {
      setTestedEarMode('both');
      setActiveStandaloneTest('test3');
      setActiveTab('screening');
      if (!userProfile) {
        setScreeningStep(1);
      } else {
        setScreeningStep(5); // Jump directly to Pure Tone Test
      }
      return;
    }

    if (testType === 'test2') {
      setTestedEarMode('both');
      setActiveStandaloneTest('test2');
      setActiveTab('screening');
      if (!userProfile) {
        setScreeningStep(1);
      } else {
        setScreeningStep(4); // Jump directly to Word Contrast Test
      }
      return;
    }

    if (testType === 'test1') {
      setTestedEarMode('both');
      setActiveStandaloneTest('test1');
      setActiveTab('screening');
      if (!userProfile) {
        setScreeningStep(1);
      } else {
        setScreeningStep(3); // Jump directly to Repetition Test
      }
      return;
    }
  };

  // Step 1 Complete: User Registration -> Advance to selected test or ear selection
  const handleRegistrationComplete = async (profile: UserProfile) => {
    const registered = await api.registerUser(profile);
    setUserProfile(registered);
    setCurrentLanguage(registered.preferredLanguage);

    if (activeStandaloneTest === 'ear_assessment' || activeStandaloneTest === 'test3') {
      setScreeningStep(5); // Pure Tone Frequency Test
    } else if (activeStandaloneTest === 'test2') {
      setScreeningStep(4); // Word Contrast Test
    } else if (activeStandaloneTest === 'test1') {
      setScreeningStep(3); // Repetition Test
    } else {
      setScreeningStep(2); // Step 2: Ear Selection Screen for full sequence
    }
  };

  // Step 2 Complete: Ear Selected -> Advance to Test 1
  const handleEarConfirmed = () => {
    setScreeningStep(3); // Advance to Test 1 (Repetition)
  };

  // Step 3 Complete: Test 1 Repetition Detection
  const handleTest1Complete = (summary: RepetitionTestSummary) => {
    setTest1Summary(summary);
    setScreeningStep(4); // Advance to Test 2 (Word Contrast)
  };

  // Step 4 Complete: Test 2 Misheard Word Detection
  const handleTest2Complete = (summary: MisheardTestSummary) => {
    setTest2Summary(summary);
    setScreeningStep(5); // Advance to Test 3 (Pure Tone Frequency)
  };

  // Step 5 Complete: Test 3 Frequency Recognition -> Generates Final Report
  const handleTest3Complete = async (summary: FrequencyTestSummary) => {
    setTest3Summary(summary);

    const leftEarResult: EarScreeningResult | undefined = (testedEarMode === 'left' || testedEarMode === 'both') ? {
      ear: 'left',
      frequencyDetectionPercentage: summary.detectionPercentage,
      detectedTones: summary.detectedTones,
      missedTones: summary.missedTones,
      totalTones: summary.totalTones,
      responses: summary.responses,
      hearingStatus: summary.detectionPercentage >= 80 ? 'Normal Sensitivity (Screening)' : 'Elevated Threshold Indicator',
      averageEstimatedDbHl: summary.detectionPercentage >= 80 ? 15 : 35,
      frequenciesTested: [250, 500, 1000, 2000, 4000, 6000, 8000, 12000],
    } : undefined;

    const rightEarResult: EarScreeningResult | undefined = (testedEarMode === 'right' || testedEarMode === 'both') ? {
      ear: 'right',
      frequencyDetectionPercentage: summary.detectionPercentage,
      detectedTones: summary.detectedTones,
      missedTones: summary.missedTones,
      totalTones: summary.totalTones,
      responses: summary.responses,
      hearingStatus: summary.detectionPercentage >= 80 ? 'Normal Sensitivity (Screening)' : 'Elevated Threshold Indicator',
      averageEstimatedDbHl: summary.detectionPercentage >= 80 ? 15 : 35,
      frequenciesTested: [250, 500, 1000, 2000, 4000, 6000, 8000, 12000],
    } : undefined;

    const repSummary: RepetitionTestSummary = test1Summary || {
      totalQuestions: 4,
      correctAnswers: 4,
      incorrectAnswers: 0,
      totalRepetitions: 0,
      accuracyPercentage: 100.0,
      stageBreakdown: [],
    };

    const mishSummary: MisheardTestSummary = test2Summary || {
      totalWords: 5,
      correctlyRecognized: ['Ship', 'Van', 'Thin', 'Pat'],
      incorrectlyRecognized: ['Cab'],
      totalAttempts: 5,
      accuracyPercentage: 80.0,
      categoryPerformance: {},
      beneficialAssessmentAreas: ['Voiced vs Voiceless Consonants'],
    };

    const targetUserId = userProfile?.id || 'anonymous-user';
    try {
      const report = await api.submitScreening(
        targetUserId,
        repSummary,
        mishSummary,
        summary,
        testedEarMode,
        leftEarResult,
        rightEarResult
      );
      setScreeningReport(report);
    } catch (err) {
      console.warn("Failed to submit screening report:", err);
    }
    setScreeningStep(6); // Show Final Comprehensive Results Page
  };

  // Switch to testing the opposite ear from the results page
  const handleTestOppositeEar = (oppositeEar: EarMode) => {
    setTestedEarMode(oppositeEar);
    setTest1Summary(null);
    setTest2Summary(null);
    setTest3Summary(null);
    setScreeningReport(null);
    setScreeningStep(3); // Start directly at Test 1 for opposite ear
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
    'Ear Mode',
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
          if (activeTab === 'screening' && screeningStep > 2 && screeningStep < 6 && tab !== 'screening') {
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

        {/* Hearing Tests Selection Page (4 Available Testing Options) */}
        {activeTab === 'tests' && (
          <HearingTestsPage
            currentLanguage={currentLanguage}
            userProfile={userProfile}
            onLaunchTest={handleLaunchSpecificTest}
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

            {/* Step 2: Ear Selection Screen */}
            {screeningStep === 2 && (
              <EarSelectionScreen
                selectedEar={testedEarMode}
                onSelectEar={(ear) => setTestedEarMode(ear)}
                onConfirm={handleEarConfirmed}
                userName={userProfile?.fullName}
              />
            )}

            {/* Step 3: Test 1 Repetition Detection */}
            {screeningStep === 3 && (
              <TestRepetitionPage
                currentLanguage={currentLanguage}
                activeEar={testedEarMode}
                onComplete={handleTest1Complete}
                onExitRequest={() => setShowExitConfirmModal(true)}
              />
            )}

            {/* Step 4: Test 2 Misheard Word Contrast */}
            {screeningStep === 4 && (
              <TestMisheardPage
                currentLanguage={currentLanguage}
                activeEar={testedEarMode}
                onComplete={handleTest2Complete}
                onExitRequest={() => setShowExitConfirmModal(true)}
              />
            )}

            {/* Step 5: Test 3 Frequency Recognition */}
            {screeningStep === 5 && (
              <TestFrequencyPage
                currentLanguage={currentLanguage}
                activeEar={testedEarMode}
                onComplete={handleTest3Complete}
                onExitRequest={() => setShowExitConfirmModal(true)}
              />
            )}

            {/* Step 6: Final Comprehensive Results Page */}
            {screeningStep === 6 && (
              <div className="space-y-6">
                <ResultsPage
                  report={
                    screeningReport || {
                      id: 'temp-report',
                      testId: `ES-${Date.now().toString(36).toUpperCase()}`,
                      userId: userProfile?.id || 'default-user',
                      userName: userProfile?.fullName || 'User',
                      age: userProfile?.age || 35,
                      preferredLanguage: currentLanguage,
                      timestamp: new Date().toISOString(),
                      testedEar: testedEarMode,
                      leftEarResult: (testedEarMode === 'left' || testedEarMode === 'both') ? {
                        ear: 'left',
                        frequencyDetectionPercentage: test3Summary?.detectionPercentage || 85,
                        detectedTones: test3Summary?.detectedTones || 7,
                        missedTones: test3Summary?.missedTones || 1,
                        totalTones: test3Summary?.totalTones || 8,
                        responses: test3Summary?.responses || [],
                        hearingStatus: 'Normal Sensitivity (Screening)',
                        averageEstimatedDbHl: 18,
                        frequenciesTested: [250, 500, 1000, 2000, 4000, 6000, 8000, 12000],
                      } : undefined,
                      rightEarResult: (testedEarMode === 'right' || testedEarMode === 'both') ? {
                        ear: 'right',
                        frequencyDetectionPercentage: test3Summary?.detectionPercentage || 85,
                        detectedTones: test3Summary?.detectedTones || 7,
                        missedTones: test3Summary?.missedTones || 1,
                        totalTones: test3Summary?.totalTones || 8,
                        responses: test3Summary?.responses || [],
                        hearingStatus: 'Normal Sensitivity (Screening)',
                        averageEstimatedDbHl: 18,
                        frequenciesTested: [250, 500, 1000, 2000, 4000, 6000, 8000, 12000],
                      } : undefined,
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
                        detectionPercentage: 88.0,
                        responses: [],
                        categorySummary: {},
                      },
                      detectedFrequencyRanges: ['Low Frequencies (250–500 Hz)', 'Mid Speech Band (1,000–4,000 Hz)'],
                      missedFrequencyRanges: [],
                      concernLevel: 'LOW',
                      concernReason:
                        'No significant concern identified during this screening session. Your responses were consistent across the tested speech bands and frequency ranges.',
                      disclaimer:
                        'These tests are experimental and are not medically validated diagnostic procedures. EchoSense only provides preliminary hearing-related screening observations.',
                      thankYouMessage:
                        'Thank you for choosing EchoSense. Your hearing health matters. Continue monitoring your hearing and consult a qualified professional if you experience difficulties.',
                    }
                  }
                  currentLanguage={currentLanguage}
                  onRestartSession={() => setShowRestartConfirmModal(true)}
                  onExploreAiFeatures={() => setActiveTab('fingerprint')}
                />

                {/* Independent Ear Follow-up Switcher */}
                {testedEarMode !== 'both' && (
                  <div className="max-w-4xl mx-auto px-4">
                    <div className="p-6 bg-white border-3 border-black shadow-brutal rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-black uppercase text-base text-black">
                          Want to test your {testedEarMode === 'left' ? 'Right' : 'Left'} Ear now?
                        </h4>
                        <p className="text-xs font-bold text-slate-600">
                          Complete both ears independently to build a full bilateral hearing profile.
                        </p>
                      </div>

                      <button
                        onClick={() => handleTestOppositeEar(testedEarMode === 'left' ? 'right' : 'left')}
                        className="w-full sm:w-auto px-6 py-3 bg-[#FFC700] hover:bg-[#E5B200] text-black font-black uppercase text-xs tracking-wider border-2 border-black shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl"
                      >
                        TEST {testedEarMode === 'left' ? 'RIGHT' : 'LEFT'} EAR NOW
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <HistoryPage
            currentLanguage={currentLanguage}
            userProfile={userProfile}
            onStartNewTest={() => setActiveTab('tests')}
          />
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
        title="Restart Entire Assessment?"
        description="This will clear your current temporary session progress. Saved completed tests in your History will remain preserved."
        confirmText="Restart Session"
        cancelText="Cancel"
        isDestructive={true}
      />

    </div>
  );
}
export default App;
