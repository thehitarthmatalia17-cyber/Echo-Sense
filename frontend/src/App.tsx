import React, { useState, useEffect, useRef } from 'react';
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
import { audioService } from './services/audioService';
import { speechService } from './services/speechService';
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
import { TestIndividualEarPage } from './pages/TestIndividualEarPage';
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
  // 1: Registration
  // 2: Ear Selection / Calibration Mode
  // 3: Test 1 (Sentence Repetition)
  // 4: Test 2 (Word Contrast)
  // 5: Test 3 (Pure Tone Frequency)
  // 6: Test 4 (Individual Ear Assessment: Left & Right Ear)
  // 7: Final Comprehensive Results Report
  const [screeningStep, setScreeningStep] = useState<number>(1);

  // Ear Testing Mode ('left' | 'right' | 'both')
  const [testedEarMode, setTestedEarMode] = useState<EarMode>('both');

  // Track if user launched a standalone test vs full sequence
  const [activeStandaloneTest, setActiveStandaloneTest] = useState<'test1' | 'test2' | 'test3' | 'ear_assessment' | null>(null);

  // Test Summaries & Results
  const [test1Summary, setTest1Summary] = useState<RepetitionTestSummary | null>(null);
  const [test2Summary, setTest2Summary] = useState<MisheardTestSummary | null>(null);
  const [test3Summary, setTest3Summary] = useState<FrequencyTestSummary | null>(null);
  const [test4LeftResult, setTest4LeftResult] = useState<EarScreeningResult | null>(null);
  const [test4RightResult, setTest4RightResult] = useState<EarScreeningResult | null>(null);

  // Skipped tracking & statuses
  const [skippedTests, setSkippedTests] = useState<string[]>([]);
  const [testStatuses, setTestStatuses] = useState<Record<string, 'completed' | 'skipped' | 'not_taken'>>({
    test1: 'not_taken',
    test2: 'not_taken',
    test3: 'not_taken',
    test4: 'not_taken',
  });

  const [screeningReport, setScreeningReport] = useState<ScreeningReportData | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);

  // Exit & Restart Modals
  const [showExitConfirmModal, setShowExitConfirmModal] = useState<boolean>(false);
  const [showRestartConfirmModal, setShowRestartConfirmModal] = useState<boolean>(false);

  // 1. Initialize from LocalStorage (User Profile and Active In-Progress Assessment Session)
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

    const savedState = localStorage.getItem('echosense_active_assessment_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.screeningStep && parsed.screeningStep < 7) {
          setScreeningStep(parsed.screeningStep);
        }
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
        if (parsed.testedEarMode) setTestedEarMode(parsed.testedEarMode);
        if (parsed.activeStandaloneTest !== undefined) setActiveStandaloneTest(parsed.activeStandaloneTest);
        if (parsed.test1Summary) setTest1Summary(parsed.test1Summary);
        if (parsed.test2Summary) setTest2Summary(parsed.test2Summary);
        if (parsed.test3Summary) setTest3Summary(parsed.test3Summary);
        if (parsed.test4LeftResult) setTest4LeftResult(parsed.test4LeftResult);
        if (parsed.test4RightResult) setTest4RightResult(parsed.test4RightResult);
        if (parsed.skippedTests) setSkippedTests(parsed.skippedTests);
        if (parsed.testStatuses) setTestStatuses(parsed.testStatuses);
      } catch (e) {
        // Ignored
      }
    }
  }, []);

  // 2. Persist in-progress active assessment session state to localStorage on every state change
  useEffect(() => {
    if (activeTab === 'screening' && screeningStep > 1 && screeningStep < 7) {
      const stateToSave = {
        screeningStep,
        activeTab,
        testedEarMode,
        activeStandaloneTest,
        test1Summary,
        test2Summary,
        test3Summary,
        test4LeftResult,
        test4RightResult,
        skippedTests,
        testStatuses,
      };
      localStorage.setItem('echosense_active_assessment_state', JSON.stringify(stateToSave));
    }
  }, [
    activeTab,
    screeningStep,
    testedEarMode,
    activeStandaloneTest,
    test1Summary,
    test2Summary,
    test3Summary,
    test4LeftResult,
    test4RightResult,
    skippedTests,
    testStatuses,
  ]);

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    if (userProfile?.id) {
      api.updateLanguage(userProfile.id, lang);
    }
  };

  // Launch assessment from Landing Page -> Directs to the dedicated 4-Test Selection Page
  const handleStartAssessment = () => {
    audioService.stopAll();
    speechService.stopAll();
    setActiveTab('tests');
  };

  // Launch a specific test chosen from the 4 options on the Hearing Tests Selection Page
  const handleLaunchSpecificTest = (
    testType: 'test1' | 'test2' | 'test3' | 'ear_assessment' | 'full_sequence',
    earMode?: EarMode
  ) => {
    audioService.stopAll();
    speechService.stopAll();

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
        setScreeningStep(6); // Step 6: Individual Ear Assessment
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

    if (activeStandaloneTest === 'ear_assessment') {
      setScreeningStep(6); // Individual Ear Assessment
    } else if (activeStandaloneTest === 'test3') {
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
    audioService.stopAll();
    speechService.stopAll();
    setScreeningStep(3); // Advance to Test 1 (Repetition)
  };

  // Final Report Generation and Submission
  const submitAndGenerateReport = async (overrides?: {
    rep?: RepetitionTestSummary | null;
    mish?: MisheardTestSummary | null;
    freq?: FrequencyTestSummary | null;
    leftRes?: EarScreeningResult | null;
    rightRes?: EarScreeningResult | null;
    skipped?: string[];
    statuses?: Record<string, 'completed' | 'skipped' | 'not_taken'>;
  }) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmittingReport(true);

    const rep = overrides?.rep !== undefined ? overrides.rep : test1Summary;
    const mish = overrides?.mish !== undefined ? overrides.mish : test2Summary;
    const freq = overrides?.freq !== undefined ? overrides.freq : test3Summary;
    const leftRes = overrides?.leftRes !== undefined ? overrides.leftRes : test4LeftResult;
    const rightRes = overrides?.rightRes !== undefined ? overrides.rightRes : test4RightResult;
    const skipped = overrides?.skipped !== undefined ? overrides.skipped : skippedTests;
    const statuses = overrides?.statuses !== undefined ? overrides.statuses : testStatuses;

    const targetUserId = userProfile?.id || 'anonymous-user';
    try {
      const report = await api.submitScreening(
        targetUserId,
        rep,
        mish,
        freq,
        testedEarMode,
        leftRes || undefined,
        rightRes || undefined,
        skipped,
        statuses
      );
      setScreeningReport(report);
    } catch (err) {
      console.warn("Failed to submit screening report:", err);
    } finally {
      setIsSubmittingReport(false);
      isSubmittingRef.current = false;
      setScreeningStep(7); // Show Final Comprehensive Results Page
      localStorage.removeItem('echosense_active_assessment_state');
    }
  };

  // Step 3 Complete: Test 1 Repetition Detection
  const handleTest1Complete = (summary: RepetitionTestSummary) => {
    audioService.stopAll();
    speechService.stopAll();
    setTest1Summary(summary);
    const updatedStatuses = { ...testStatuses, test1: 'completed' as const };
    setTestStatuses(updatedStatuses);

    if (activeStandaloneTest === 'test1') {
      submitAndGenerateReport({
        rep: summary,
        statuses: updatedStatuses,
      });
    } else {
      setScreeningStep(4); // Advance to Test 2 (Word Contrast)
    }
  };

  // Step 4 Complete: Test 2 Misheard Word Detection
  const handleTest2Complete = (summary: MisheardTestSummary) => {
    audioService.stopAll();
    speechService.stopAll();
    setTest2Summary(summary);
    const updatedStatuses = { ...testStatuses, test2: 'completed' as const };
    setTestStatuses(updatedStatuses);

    if (activeStandaloneTest === 'test2') {
      submitAndGenerateReport({
        mish: summary,
        statuses: updatedStatuses,
      });
    } else {
      setScreeningStep(5); // Advance to Test 3 (Pure Tone Frequency)
    }
  };

  // Step 5 Complete: Test 3 Frequency Recognition
  const handleTest3Complete = (summary: FrequencyTestSummary) => {
    audioService.stopAll();
    speechService.stopAll();
    setTest3Summary(summary);
    const updatedStatuses = { ...testStatuses, test3: 'completed' as const };
    setTestStatuses(updatedStatuses);

    if (activeStandaloneTest === 'test3') {
      submitAndGenerateReport({
        freq: summary,
        statuses: updatedStatuses,
      });
    } else {
      setScreeningStep(6); // Advance to Test 4 (Individual Ear Assessment)
    }
  };

  // Step 6 Complete: Test 4 Individual Ear Assessment
  const handleTest4Complete = (leftRes?: EarScreeningResult, rightRes?: EarScreeningResult) => {
    audioService.stopAll();
    speechService.stopAll();
    if (leftRes) setTest4LeftResult(leftRes);
    if (rightRes) setTest4RightResult(rightRes);
    const updatedStatuses = { ...testStatuses, test4: 'completed' as const };
    setTestStatuses(updatedStatuses);

    submitAndGenerateReport({
      leftRes: leftRes || test4LeftResult,
      rightRes: rightRes || test4RightResult,
      statuses: updatedStatuses,
    });
  };

  // Skip Test Handler for any active test
  const handleSkipTest = (testKey: 'test1' | 'test2' | 'test3' | 'test4') => {
    audioService.stopAll();
    speechService.stopAll();

    if (testKey === 'test1') {
      setTest1Summary(null);
      const updatedSkipped = [...skippedTests.filter(t => t !== 'Sentence Repetition (Test 1)'), 'Sentence Repetition (Test 1)'];
      const updatedStatuses = { ...testStatuses, test1: 'skipped' as const };
      setSkippedTests(updatedSkipped);
      setTestStatuses(updatedStatuses);

      if (activeStandaloneTest === 'test1') {
        submitAndGenerateReport({
          rep: null,
          skipped: updatedSkipped,
          statuses: updatedStatuses,
        });
      } else {
        setScreeningStep(4); // Advance to Test 2
      }
    } else if (testKey === 'test2') {
      setTest2Summary(null);
      const updatedSkipped = [...skippedTests.filter(t => t !== 'Word Contrast (Test 2)'), 'Word Contrast (Test 2)'];
      const updatedStatuses = { ...testStatuses, test2: 'skipped' as const };
      setSkippedTests(updatedSkipped);
      setTestStatuses(updatedStatuses);

      if (activeStandaloneTest === 'test2') {
        submitAndGenerateReport({
          mish: null,
          skipped: updatedSkipped,
          statuses: updatedStatuses,
        });
      } else {
        setScreeningStep(5); // Advance to Test 3
      }
    } else if (testKey === 'test3') {
      setTest3Summary(null);
      const updatedSkipped = [...skippedTests.filter(t => t !== 'Pure Tones (Test 3)'), 'Pure Tones (Test 3)'];
      const updatedStatuses = { ...testStatuses, test3: 'skipped' as const };
      setSkippedTests(updatedSkipped);
      setTestStatuses(updatedStatuses);

      if (activeStandaloneTest === 'test3') {
        submitAndGenerateReport({
          freq: null,
          skipped: updatedSkipped,
          statuses: updatedStatuses,
        });
      } else {
        setScreeningStep(6); // Advance to Test 4
      }
    } else if (testKey === 'test4') {
      setTest4LeftResult(null);
      setTest4RightResult(null);
      const updatedSkipped = [...skippedTests.filter(t => t !== 'Individual Ear Assessment (Test 4)'), 'Individual Ear Assessment (Test 4)'];
      const updatedStatuses = { ...testStatuses, test4: 'skipped' as const };
      setSkippedTests(updatedSkipped);
      setTestStatuses(updatedStatuses);

      // Skips 4th test -> Final Report generated immediately with skipped test clearly marked
      submitAndGenerateReport({
        leftRes: null,
        rightRes: null,
        skipped: updatedSkipped,
        statuses: updatedStatuses,
      });
    }
  };

  // Switch to testing the opposite ear from the results page
  const handleTestOppositeEar = (oppositeEar: EarMode) => {
    audioService.stopAll();
    speechService.stopAll();
    setTestedEarMode(oppositeEar);
    setActiveStandaloneTest('ear_assessment');
    setScreeningStep(6); // Launch Test 4 for the opposite ear
  };

  // Explicit confirmation before exiting an active test session
  const handleConfirmExit = () => {
    audioService.stopAll();
    speechService.stopAll();
    localStorage.removeItem('echosense_active_assessment_state');
    setScreeningStep(1);
    setTest1Summary(null);
    setTest2Summary(null);
    setTest3Summary(null);
    setTest4LeftResult(null);
    setTest4RightResult(null);
    setSkippedTests([]);
    setTestStatuses({
      test1: 'not_taken',
      test2: 'not_taken',
      test3: 'not_taken',
      test4: 'not_taken',
    });
    setActiveTab('tests');
  };

  // Restart session button handler (clears temporary active state, keeps History permanent)
  const handleRestartSession = async () => {
    audioService.stopAll();
    speechService.stopAll();
    localStorage.removeItem('echosense_active_assessment_state');
    setTest1Summary(null);
    setTest2Summary(null);
    setTest3Summary(null);
    setTest4LeftResult(null);
    setTest4RightResult(null);
    setSkippedTests([]);
    setTestStatuses({
      test1: 'not_taken',
      test2: 'not_taken',
      test3: 'not_taken',
      test4: 'not_taken',
    });
    setScreeningReport(null);
    setScreeningStep(1);
    setActiveTab('tests');
  };

  const stepLabels = [
    'Registration',
    'Ear Mode',
    'Test 1: Repetition',
    'Test 2: Word Contrast',
    'Test 3: Pure Tones',
    'Test 4: Ear Assessment',
    'Final Report',
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
          audioService.stopAll();
          speechService.stopAll();
          if (activeTab === 'screening' && screeningStep > 2 && screeningStep < 7 && tab !== 'screening') {
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
            onExploreFeatures={(tab) => {
              audioService.stopAll();
              speechService.stopAll();
              setActiveTab(tab);
            }}
          />
        )}

        {/* Hearing Tests Selection Page (All 4 Available Testing Options) */}
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
            
            {/* Sequential Progress Stepper (7 Steps) */}
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
                testNumber={1}
                totalTests={4}
                onComplete={handleTest1Complete}
                onSkip={() => handleSkipTest('test1')}
                onExitRequest={() => setShowExitConfirmModal(true)}
                onNextTest={() => setScreeningStep(4)}
              />
            )}

            {/* Step 4: Test 2 Misheard Word Contrast */}
            {screeningStep === 4 && (
              <TestMisheardPage
                currentLanguage={currentLanguage}
                activeEar={testedEarMode}
                testNumber={2}
                totalTests={4}
                onComplete={handleTest2Complete}
                onSkip={() => handleSkipTest('test2')}
                onExitRequest={() => setShowExitConfirmModal(true)}
                onNextTest={() => setScreeningStep(5)}
              />
            )}

            {/* Step 5: Test 3 Frequency Recognition */}
            {screeningStep === 5 && (
              <TestFrequencyPage
                currentLanguage={currentLanguage}
                activeEar={testedEarMode}
                testNumber={3}
                totalTests={4}
                onComplete={handleTest3Complete}
                onSkip={() => handleSkipTest('test3')}
                onExitRequest={() => setShowExitConfirmModal(true)}
                onNextTest={() => setScreeningStep(6)}
              />
            )}

            {/* Step 6: Test 4 Individual Ear Assessment */}
            {screeningStep === 6 && (
              <TestIndividualEarPage
                currentLanguage={currentLanguage}
                initialEar={testedEarMode === 'right' ? 'right' : 'left'}
                testNumber={4}
                totalTests={4}
                onComplete={(leftRes, rightRes) => handleTest4Complete(leftRes, rightRes)}
                onSkip={() => handleSkipTest('test4')}
                onExitRequest={() => setShowExitConfirmModal(true)}
              />
            )}

            {/* Step 7: Final Comprehensive Results Page */}
            {screeningStep === 7 && (
              <div className="space-y-6">
                <ResultsPage
                  report={
                    screeningReport || {
                      id: 'report-' + Date.now(),
                      testId: `ES-${Date.now().toString(36).toUpperCase()}`,
                      userId: userProfile?.id || 'default-user',
                      userName: userProfile?.fullName || 'User',
                      age: userProfile?.age || 30,
                      preferredLanguage: currentLanguage,
                      timestamp: new Date().toISOString(),
                      testedEar: testedEarMode,
                      leftEarResult: test4LeftResult || undefined,
                      rightEarResult: test4RightResult || undefined,
                      repetitionTest: test1Summary || null,
                      misheardTest: test2Summary || null,
                      frequencyTest: test3Summary || null,
                      skippedTests: skippedTests,
                      testStatuses: testStatuses,
                      detectedFrequencyRanges: ['Speech Frequency Band (250–4,000 Hz)'],
                      missedFrequencyRanges: [],
                      concernLevel: 'LOW',
                      concernReason:
                        'Preliminary hearing assessment completed. Your responses were evaluated only on tests completed during this session.',
                      disclaimer:
                        'These tests are experimental and are not medically validated diagnostic procedures. EchoSense only provides preliminary hearing-related screening observations.',
                      thankYouMessage:
                        'Thank you for using EchoSense. Continue monitoring your hearing and consult a certified audiologist or physician for comprehensive evaluation.',
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
                        className="w-full sm:w-auto px-6 py-3 bg-[#FFC700] hover:bg-[#E5B200] text-black font-black uppercase text-xs tracking-wider border-2 border-black shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl cursor-pointer"
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