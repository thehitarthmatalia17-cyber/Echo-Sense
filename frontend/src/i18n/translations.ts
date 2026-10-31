import { LanguageCode } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  nav: {
    screening: string;
    behavioral: string;
    fingerprint: string;
    tinnitus: string;
    trends: string;
    restart: string;
  };
  registration: {
    title: string;
    subtitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    ageLabel: string;
    agePlaceholder: string;
    languageLabel: string;
    consentText: string;
    consentNote: string;
    startButton: string;
    validationName: string;
    validationAge: string;
  };
  test1: {
    title: string;
    subtitle: string;
    instruction: string;
    stageLabel: string;
    repeatButton: string;
    repetitionsCount: string;
    inputPlaceholder: string;
    submitAnswer: string;
    nextStage: string;
    feedbackCorrect: string;
    feedbackIncorrect: string;
    summaryTitle: string;
    totalQuestions: string;
    correctAnswers: string;
    incorrectAnswers: string;
    totalRepeats: string;
    accuracy: string;
    proceedToTest2: string;
  };
  test2: {
    title: string;
    subtitle: string;
    instruction: string;
    playWord: string;
    replayWord: string;
    recordPronunciation: string;
    listeningMic: string;
    processingSpeech: string;
    spokenWord: string;
    feedbackMatch: string;
    feedbackRetry: string;
    attemptsCount: string;
    categoryLabel: string;
    summaryTitle: string;
    pronunciationDisclaimer: string;
    proceedToTest3: string;
    micFallbackHint: string;
  };
  test3: {
    title: string;
    subtitle: string;
    quietNotice: string;
    headphoneNotice: string;
    startToneTest: string;
    playingTone: string;
    questionText: string;
    heardButton: string;
    notHeardButton: string;
    categoryLow: string;
    categoryMid: string;
    categoryHigh: string;
    progressLabel: string;
    deviceDisclaimer: string;
    summaryTitle: string;
    viewFinalReport: string;
  };
  results: {
    title: string;
    subtitle: string;
    patientInfo: string;
    testDate: string;
    testSummary: string;
    concernIndicator: string;
    concernLow: string;
    concernModerate: string;
    concernHigh: string;
    concernLowNote: string;
    concernModNote: string;
    concernHighNote: string;
    test1Result: string;
    test2Result: string;
    test3Result: string;
    frequencyProfile: string;
    detectedRanges: string[];
    missedRanges: string[];
    thankYouMessage: string;
    medicalDisclaimer: string;
    restartButton: string;
    confirmRestartTitle: string;
    confirmRestartDesc: string;
    cancel: string;
    confirm: string;
    exploreAiFeatures: string;
  };
  behavioral: {
    title: string;
    subtitle: string;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitButton: string;
    submittedSuccess: string;
    recentLogs: string;
    disclaimer: string;
  };
  fingerprint: {
    title: string;
    subtitle: string;
    compositeScore: string;
    compositeExplanation: string;
    strengthsTitle: string;
    vulnerabilitiesTitle: string;
    recommendationsTitle: string;
    runAiAnalysis: string;
    aiReportTitle: string;
    normalStatus: string;
    anomalyStatus: string;
  };
  tinnitus: {
    title: string;
    subtitle: string;
    soundTypes: string;
    ringing: string;
    buzzing: string;
    humming: string;
    whistling: string;
    frequencyLabel: string;
    durationLabel: string;
    earLabel: string;
    severityLabel: string;
    submitButton: string;
    educationalNotice: string;
    historyTitle: string;
  };
  trends: {
    title: string;
    subtitle: string;
    totalTests: string;
    overallTrajectory: string;
    stable: string;
    improving: string;
    declining: string;
    accuracyChartTitle: string;
    frequencyChartTitle: string;
    noHistoryNotice: string;
  };
}

export const languages: { code: LanguageCode; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: "EchoSense",
    tagline: "Listen Beyond the Silence.",
    nav: {
      screening: "Screening Tests",
      behavioral: "Daily Monitoring",
      fingerprint: "Hearing Fingerprint",
      tinnitus: "Tinnitus Tracker",
      trends: "Trends",
      restart: "Restart Session"
    },
    registration: {
      title: "Hearing Health Screening",
      subtitle: "Personalized early screening for speech recognition and auditory frequency sensitivity.",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      ageLabel: "Age",
      agePlaceholder: "e.g. 34",
      languageLabel: "Preferred Language",
      consentText: "I consent to acoustic audio tone generation and speech playback for this screening.",
      consentNote: "EchoSense is an early awareness tool and does not store raw telephone recordings or replace medical diagnostic evaluations.",
      startButton: "Begin Sequential Hearing Screening",
      validationName: "Please enter your name (minimum 2 characters).",
      validationAge: "Please enter a valid age between 5 and 120."
    },
    test1: {
      title: "Test 1: Repetition Detection Test",
      subtitle: "Evaluating speech recognition accuracy across 6 frequency-modulated acoustic stages.",
      instruction: "Listen carefully to the spoken sentence below. You may use the REPEAT button if needed, then type exactly what you heard.",
      stageLabel: "Acoustic Stage",
      repeatButton: "Replay Audio",
      repetitionsCount: "Repeats requested",
      inputPlaceholder: "Type the exact words or sentence you heard...",
      submitAnswer: "Submit & Verify",
      nextStage: "Proceed to Next Stage",
      feedbackCorrect: "Correct response detected!",
      feedbackIncorrect: "Discrepancy noted in response.",
      summaryTitle: "Repetition Test Performance",
      totalQuestions: "Total Stages Evaluated",
      correctAnswers: "Correct Recognitions",
      incorrectAnswers: "Misheard Sentences",
      totalRepeats: "Total Replay Requests",
      accuracy: "Recognition Accuracy",
      proceedToTest2: "Proceed to Test 2: Misheard Word Detection"
    },
    test2: {
      title: "Test 2: Misheard Word Detection Test",
      subtitle: "Assessing acoustic phoneme discrimination across commonly confused minimal pairs.",
      instruction: "Listen carefully to the target word, replay if needed, and select which word you heard.",
      playWord: "Play Word",
      replayWord: "Replay Word",
      recordPronunciation: "Select Heard Word",
      listeningMic: "Playing audio...",
      processingSpeech: "Evaluating distinction...",
      spokenWord: "Selected Word",
      feedbackMatch: "Accurately distinguished phoneme pair!",
      feedbackRetry: "Phonemic ambiguity detected. Retrying category with alternate minimal pair.",
      attemptsCount: "Attempts in category",
      categoryLabel: "Phonetic Category",
      summaryTitle: "Misheard Word Detection Summary",
      pronunciationDisclaimer: "This minimal-pair assessment evaluates acoustic phoneme discrimination without microphone dependence, avoiding hardware and accent bias.",
      proceedToTest3: "Proceed to Test 3: Frequency Recognition",
      micFallbackHint: "Select Option A or Option B corresponding to what you heard."
    },
    test3: {
      title: "Test 3: Frequency Recognition Test",
      subtitle: "Evaluating pure sinusoidal tone detection across Low, Mid, and High auditory frequencies.",
      quietNotice: "Ensure you are in a quiet room with minimal ambient noise.",
      headphoneNotice: "Headphones or high-quality earphones are strongly recommended for accurate results.",
      startToneTest: "Begin Tone Presentation",
      playingTone: "Playing pure audio tone...",
      questionText: "Did you hear the sound?",
      heardButton: "HEARD TONE",
      notHeardButton: "NOT HEARD",
      categoryLow: "Low Frequency (250 Hz - 500 Hz)",
      categoryMid: "Mid Frequency (1,000 Hz - 4,000 Hz)",
      categoryHigh: "High Frequency (6,000 Hz - 12,000 Hz)",
      progressLabel: "Tone Assessment Progress",
      deviceDisclaimer: "Important: Device speakers, volume limits, and headphone acoustic profiles affect sound reproduction. This is not a calibrated audiogram.",
      summaryTitle: "Frequency Detection Summary",
      viewFinalReport: "View Comprehensive Screening Report"
    },
    results: {
      title: "Comprehensive Hearing Screening Report",
      subtitle: "Multi-parameter screening observations across speech recognition, phonemic distinction, and frequency detection.",
      patientInfo: "User Information",
      testDate: "Screening Date & Time",
      testSummary: "Sequential Test Scores",
      concernIndicator: "Hearing Concern Indicator",
      concernLow: "LOW CONCERN",
      concernModerate: "MODERATE CONCERN",
      concernHigh: "HIGH CONCERN",
      concernLowNote: "No significant concern identified by this session. Consistent responses across tested speech and frequency ranges. (A low concern result does not clinically rule out hearing loss).",
      concernModNote: "Some inconsistent responses or subtle hearing difficulties observed across specific frequencies or spoken phrases.",
      concernHighNote: "Multiple concerning screening observations detected across speech clarity and frequency detection. Professional audiological assessment recommended.",
      test1Result: "Repetition Detection Test",
      test2Result: "Misheard Word Discrimination",
      test3Result: "Frequency Range Detection",
      frequencyProfile: "Auditory Frequency Span Profile",
      detectedRanges: ["Low Frequencies (250 - 500 Hz)", "Mid Speech Band (1,000 - 4,000 Hz)", "High Frequency Band (6,000 - 12,000 Hz)"],
      missedRanges: [],
      thankYouMessage: "Thank you for choosing EchoSense. Your hearing health matters. Continue monitoring your hearing and consult a qualified professional if you experience difficulties.",
      medicalDisclaimer: "These tests are experimental and are not medically validated diagnostic procedures. EchoSense only provides preliminary hearing-related screening observations. It cannot confirm or rule out hearing loss. For genuine hearing concerns, consult a qualified audiologist or healthcare professional.",
      restartButton: "Restart / Clear Test Session",
      confirmRestartTitle: "Restart Screening Session?",
      confirmRestartDesc: "This will clear current session responses, reset all test progress, and return you to the initial registration page.",
      cancel: "Cancel",
      confirm: "Confirm & Reset",
      exploreAiFeatures: "Explore AI Behavioral & Fingerprint Tools"
    },
    behavioral: {
      title: "Behavioral Hearing Monitoring",
      subtitle: "Log your daily conversation and telephone listening experiences over time.",
      q1: "Did you need to increase phone call volume above normal?",
      q2: "Did you ask someone to repeat what they said during a call?",
      q3: "Did you misunderstand or misinterpret words during the conversation?",
      q4: "Did background noise make following the conversation particularly difficult?",
      notesLabel: "Context Notes (Optional)",
      notesPlaceholder: "e.g. In a busy cafe, speaker was soft-spoken...",
      submitButton: "Record Listening Log",
      submittedSuccess: "Behavioral observation recorded successfully.",
      recentLogs: "Recent Listening Logs",
      disclaimer: "Privacy Guarantee: EchoSense never records telephone calls or accesses restricted audio. All logs are self-reported."
    },
    fingerprint: {
      title: "Personalized AI Hearing Fingerprint",
      subtitle: "Multi-dimensional auditory profile synthesized from your test responses, acoustic memory, and behavioral logs.",
      compositeScore: "Composite Hearing Health Index",
      compositeExplanation: "Aggregate score synthesizing speech clarity, frequency span, phoneme distinction, and listening comfort.",
      strengthsTitle: "Auditory Strengths",
      vulnerabilitiesTitle: "Areas Requiring Attention",
      recommendationsTitle: "Personalized Auditory Recommendations",
      runAiAnalysis: "Run AI Isolation Forest Behavioral Analysis",
      aiReportTitle: "AI Behavioral Anomaly Detection (Scikit-Learn Isolation Forest)",
      normalStatus: "Baseline Pattern Consistent",
      anomalyStatus: "Acoustic Pattern Deviation Detected"
    },
    tinnitus: {
      title: "Tinnitus Experience Tracker",
      subtitle: "Optional monitoring tool to track phantom auditory perceptions such as ringing or humming.",
      soundTypes: "Sound Qualities Experienced",
      ringing: "Ringing",
      buzzing: "Buzzing",
      humming: "Humming",
      whistling: "Whistling",
      frequencyLabel: "Occurrence Frequency",
      durationLabel: "Typical Duration",
      earLabel: "Affected Ear",
      severityLabel: "Perceived Impact (1 = Minimal, 10 = Severe)",
      submitButton: "Save Tinnitus Record",
      educationalNotice: "Educational Note: Tinnitus can occur with or without hearing loss. Temporary ringing after loud concerts or stress is common. Persistent tinnitus should be discussed with an ENT physician.",
      historyTitle: "Tinnitus Severity History"
    },
    trends: {
      title: "Hearing Trend Analytics",
      subtitle: "Longitudinal tracking of your recognition accuracy, frequency sensitivity, and behavioral indicators.",
      totalTests: "Total Screenings Completed",
      overallTrajectory: "Overall Trajectory",
      stable: "Stable Listening Baseline",
      improving: "Positive Trend / Familiarity",
      declining: "Declining Sensitivity Observed",
      accuracyChartTitle: "Speech Recognition Accuracy Over Time",
      frequencyChartTitle: "Frequency Detection % Across Sessions",
      noHistoryNotice: "Complete multiple screening sessions over time to unlock historical trajectory analytics."
    }
  },
  hi: {
    appName: "इको सेंस (EchoSense)",
    tagline: "खामोशी के पार सुनें।",
    nav: {
      screening: "जांच परीक्षण",
      behavioral: "दैनिक निगरानी",
      fingerprint: "हियरिंग फिंगरप्रिंट",
      tinnitus: "टिनिटस ट्रैकर",
      trends: "प्रवृत्तियाँ",
      restart: "सत्र रीसेट करें"
    },
    registration: {
      title: "श्रवण स्वास्थ्य प्रारंभिक स्क्रीनिंग",
      subtitle: "वाणी पहचान और ध्वनि आवृत्ति संवेदनशीलता के लिए एआई-संचालित प्रारंभिक जांच।",
      fullNameLabel: "पूरा नाम",
      fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
      ageLabel: "आयु",
      agePlaceholder: "उदा. 34",
      languageLabel: "पसंदीदा भाषा",
      consentText: "मैं इस स्क्रीनिंग के लिए ऑडियो टोन और भाषण प्लेबैक के उपयोग की सहमति देता हूँ।",
      consentNote: "इको सेंस केवल एक जागरूकता उपकरण है और किसी प्रमाणित नैदानिक जांच का विकल्प नहीं है।",
      startButton: "श्रवण परीक्षण प्रारंभ करें",
      validationName: "कृपया अपना नाम दर्ज करें (कम से कम 2 अक्षर)।",
      validationAge: "कृपया 5 से 120 के बीच वैध आयु दर्ज करें।"
    },
    test1: {
      title: "परीक्षण 1: पुनरावृत्ति पहचान परीक्षण",
      subtitle: "6 विभिन्न आवृत्ति-संशोधित ऑडियो चरणों में वाणी पहचान सटीकता का मूल्यांकन।",
      instruction: "बोले गए वाक्य को ध्यान से सुनें। आवश्यकता होने पर 'ऑडियो पुनः सुनें' बटन दबाएं, फिर जो सुना उसे टाइप करें।",
      stageLabel: "ध्वनि चरण",
      repeatButton: "ऑडियो पुनः सुनें",
      repetitionsCount: "पुनरावृत्ति संख्या",
      inputPlaceholder: "जो शब्द या वाक्य आपने सुना, यहाँ टाइप करें...",
      submitAnswer: "उत्तर सबमिट करें",
      nextStage: "अगले चरण पर जाएं",
      feedbackCorrect: "सटीक उत्तर पहचाना गया!",
      feedbackIncorrect: "उत्तर में अंतर दर्ज किया गया।",
      summaryTitle: "पुनरावृत्ति परीक्षण परिणाम",
      totalQuestions: "कुल चरण",
      correctAnswers: "सही उत्तर",
      incorrectAnswers: "गलत उत्तर",
      totalRepeats: "कुल पुनरावृत्तियाँ",
      accuracy: "सटीकता प्रतिशत",
      proceedToTest2: "परीक्षण 2 पर जाएं: भ्रमित शब्द पहचान"
    },
    test2: {
      title: "परीक्षण 2: भ्रमित शब्द पहचान परीक्षण",
      subtitle: "समान ध्वनि वाले शब्दों (जैसे शिप/शीप, फैन/वैन) में भेद करने की क्षमता का मूल्यांकन।",
      instruction: "शब्द को ध्यान से सुनें, आवश्यकता हो तो पुनः सुनें, और जो शब्द आपने सुना उसे चुनें।",
      playWord: "शब्द सुनें",
      replayWord: "पुनः सुनें",
      recordPronunciation: "सुना हुआ शब्द चुनें",
      listeningMic: "ऑडियो बज रहा है...",
      processingSpeech: "जाँच हो रही है...",
      spokenWord: "चुना हुआ शब्द",
      feedbackMatch: "सटीक ध्वनि भेद पहचाना गया!",
      feedbackRetry: "समान ध्वनि में भ्रम। उसी श्रेणी से अन्य शब्द प्रस्तुत किया जा रहा है।",
      attemptsCount: "प्रयास संख्या",
      categoryLabel: "ध्वनि श्रेणी",
      summaryTitle: "भ्रमित शब्द परीक्षण सारांश",
      pronunciationDisclaimer: "यह ध्वनि भेद अभ्यास बिना किसी माइक्रोफ़ोन की आवश्यकता के ध्वनियों की स्पष्ट पहचान करता है।",
      proceedToTest3: "परीक्षण 3 पर जाएं: आवृत्ति पहचान",
      micFallbackHint: "विकल्प A या विकल्प B में से जो शब्द सुना, उस पर क्लिक करें।"
    },
    test3: {
      title: "परीक्षण 3: आवृत्ति पहचान परीक्षण",
      subtitle: "निम्न, मध्यम और उच्च शुद्ध ध्वनि आवृत्तियों की पहचान का मूल्यांकन।",
      quietNotice: "सुनिश्चित करें कि आप शांत कमरे में हैं।",
      headphoneNotice: "सटीक परिणामों के लिए हेडफ़ोन या ईयरफ़ोन की सिफारिश की जाती है।",
      startToneTest: "आवृत्ति परीक्षण प्रारंभ करें",
      playingTone: "टोन बज रही है...",
      questionText: "क्या आपने आवाज़ सुनी?",
      heardButton: "आवाज़ सुनाई दी",
      notHeardButton: "सुनाई नहीं दी",
      categoryLow: "निम्न आवृत्ति (250 Hz - 500 Hz)",
      categoryMid: "मध्यम आवृत्ति (1,000 Hz - 4,000 Hz)",
      categoryHigh: "उच्च आवृत्ति (6,000 Hz - 12,000 Hz)",
      progressLabel: "परीक्षण प्रगति",
      deviceDisclaimer: "महत्वपूर्ण: डिवाइस स्पीकर और वॉल्यूम परिणामों को प्रभावित करते हैं। यह कैलिब्रेटेड ऑडियोग्राम नहीं है।",
      summaryTitle: "आवृत्ति पहचान सारांश",
      viewFinalReport: "विस्तृत स्क्रीनिंग रिपोर्ट देखें"
    },
    results: {
      title: "विस्तृत श्रवण स्क्रीनिंग रिपोर्ट",
      subtitle: "वाणी पहचान, ध्वनि भेद और आवृत्ति संवेदनशीलता का समग्र विश्लेषण।",
      patientInfo: "उपयोगकर्ता जानकारी",
      testDate: "परीक्षण तिथि व समय",
      testSummary: "परीक्षण परिणाम",
      concernIndicator: "श्रवण चिंता संकेतक",
      concernLow: "कम चिंता (सामान्य)",
      concernModerate: "मध्यम चिंता",
      concernHigh: "उच्च चिंता (परामर्श अनुशंसित)",
      concernLowNote: "इस सत्र में कोई महत्वपूर्ण चिंता नहीं पाई गई। (कम चिंता का परिणाम श्रवण हानि को पूरी तरह खारिज नहीं करता)।",
      concernModNote: "कुछ आवृत्तियों या शब्दों में असंगत प्रतिक्रियाएँ पाई गईं।",
      concernHighNote: "परीक्षणों में कई चिंताजनक प्रेक्षण पाए गए। ऑडियोलॉजिस्ट से परामर्श की सिफारिश की जाती है।",
      test1Result: "पुनरावृत्ति पहचान परीक्षण",
      test2Result: "भ्रमित शब्द भेद परीक्षण",
      test3Result: "आवृत्ति पहचान परीक्षण",
      frequencyProfile: "आवृत्ति संवेदनशीलता प्रोफ़ाइल",
      detectedRanges: ["निम्न आवृत्तियाँ (250-500 Hz)", "मध्यम वाणी बैंड (1,000-4,000 Hz)", "उच्च आवृत्तियाँ (6,000-12,000 Hz)"],
      missedRanges: [],
      thankYouMessage: "Thank you for choosing EchoSense. Your hearing health matters. Continue monitoring your hearing and consult a qualified professional if you experience difficulties.",
      medicalDisclaimer: "These tests are experimental and are not medically validated diagnostic procedures. EchoSense only provides preliminary hearing-related screening observations. It cannot confirm or rule out hearing loss. For genuine hearing concerns, consult a qualified audiologist or healthcare professional.",
      restartButton: "सत्र रीसेट करें / पुनः प्रारंभ करें",
      confirmRestartTitle: "क्या आप परीक्षण पुनः प्रारंभ करना चाहते हैं?",
      confirmRestartDesc: "वर्तमान परिणाम साफ़ हो जाएंगे और आप पंजीकरण पृष्ठ पर वापस आ जाएंगे।",
      cancel: "रद्द करें",
      confirm: "हाँ, रीसेट करें",
      exploreAiFeatures: "एआई व्यवहार एवं फिंगरप्रिंट उपकरण देखें"
    },
    behavioral: {
      title: "व्यवहार श्रवण निगरानी",
      subtitle: "फ़ोन कॉल और रोज़मर्रा की बातचीत के अपने अनुभव दर्ज करें।",
      q1: "क्या आपको कॉल वॉल्यूम सामान्य से अधिक बढ़ाना पड़ा?",
      q2: "क्या आपने बातचीत में किसी बात को दोहराने के लिए कहा?",
      q3: "क्या कॉल के दौरान शब्दों को समझने में भ्रम हुआ?",
      q4: "क्या पृष्ठभूमि के शोर ने बातचीत को कठिन बना दिया?",
      notesLabel: "संदर्भ नोट्स (वैकल्पिक)",
      notesPlaceholder: "उदा. शोरगुल वाले स्थान पर कॉल थी...",
      submitButton: "अवलोकन सहेजें",
      submittedSuccess: "व्यवहार अवलोकन सफलतापूर्वक सहेजा गया।",
      recentLogs: "हाल के अवलोकन",
      disclaimer: "गोपनीयता आश्वासन: इको सेंस कॉल रिकॉर्ड नहीं करता। सभी डेटा स्व-रिपोर्टेड है।"
    },
    fingerprint: {
      title: "व्यक्तिगत एआई हियरिंग फिंगरप्रिंट",
      subtitle: "आपके परीक्षण उत्तरों और व्यवहार लॉग से तैयार बहुआयामी श्रवण प्रोफ़ाइल।",
      compositeScore: "समग्र श्रवण स्वास्थ्य सूचकांक",
      compositeExplanation: "वाणी स्पष्टता, आवृत्ति विस्तार, ध्वनि भेद और सुनने की सहजता का संयुक्त स्कोर।",
      strengthsTitle: "मजबूत श्रवण क्षेत्र",
      vulnerabilitiesTitle: "ध्यान देने योग्य क्षेत्र",
      recommendationsTitle: "व्यक्तिगत सुझाव",
      runAiAnalysis: "एआई आइसोलेशन फ़ॉरेस्ट व्यवहार विश्लेषण चलाएं",
      aiReportTitle: "एआई विसंगति जांच रिपोर्ट (Scikit-Learn Isolation Forest)",
      normalStatus: "बेसलाइन पैटर्न सामान्य",
      anomalyStatus: "पैटर्न में असामान्य बदलाव देखा गया"
    },
    tinnitus: {
      title: "टिनिटस अनुभव ट्रैकर",
      subtitle: "कान में बजने वाली सीटी या भनभनाहट की निगरानी करें।",
      soundTypes: "अनुभव की गई ध्वनियाँ",
      ringing: "घंटी जैसी आवाज़",
      buzzing: "भनभनाहट",
      humming: "गुंजन",
      whistling: "सीटी जैसी आवाज़",
      frequencyLabel: "होने की आवृत्ति",
      durationLabel: "अवधि",
      earLabel: "प्रभावित कान",
      severityLabel: "गंभीरता (1 = नगण्य, 10 = अत्यधिक)",
      submitButton: "रिकॉर्ड सहेजें",
      educationalNotice: "शैक्षणिक नोट: टिनिटस श्रवण हानि के बिना भी हो सकता है। यदि यह लगातार रहे, तो ईएनटी विशेषज्ञ से परामर्श लें।",
      historyTitle: "टिनिटस इतिहास"
    },
    trends: {
      title: "श्रवण प्रवृत्ति विश्लेषण",
      subtitle: "समय के साथ अपनी वाणी पहचान और आवृत्ति संवेदनशीलता पर नज़र रखें।",
      totalTests: "पूर्ण किए गए परीक्षण",
      overallTrajectory: "समग्र प्रवृत्ति",
      stable: "स्थिर श्रवण बेसलाइन",
      improving: "सुधार देखा गया",
      declining: "संवेदनशीलता में कमी",
      accuracyChartTitle: "समय के साथ पहचान सटीकता",
      frequencyChartTitle: "आवृत्ति पहचान % सत्रवार",
      noHistoryNotice: "प्रवृत्ति विश्लेषण देखने के लिए कम से कम दो परीक्षण सत्र पूर्ण करें।"
    }
  },
  kn: {
    appName: "ಎಕೋ ಸೆನ್ಸ್ (EchoSense)",
    tagline: "ಮೌನದ ಆಚೆಗೆ ಆಲಿಸಿ.",
    nav: {
      screening: "ಶ್ರವಣ ಪರೀಕ್ಷೆಗಳು",
      behavioral: "ದೈನಂದಿನ ಮೇಲ್ವಿಚಾರಣೆ",
      fingerprint: "ಹಿಯರಿಂಗ್ ಫಿಂಗರ್‌ಪ್ರಿಂಟ್",
      tinnitus: "ಟಿನ್ನಿಟಸ್ ಟ್ರ್ಯಾಕರ್",
      trends: "ಪ್ರವೃತ್ತಿಗಳು",
      restart: "ಮರುಪ್ರಾರಂಭಿಸಿ"
    },
    registration: {
      title: "ಶ್ರವಣ ಆರೋಗ್ಯ ತಪಾಸಣೆ",
      subtitle: "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಶ್ರವಣ ಆವರ್ತನ ಸೂಕ್ಷ್ಮತೆಗಾಗಿ AI ಆಧಾರಿತ ಆರಂಭಿಕ ತಪಾಸಣೆ.",
      fullNameLabel: "ಪೂರ್ಣ ಹೆಸರು",
      fullNamePlaceholder: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
      ageLabel: "ವಯಸ್ಸು",
      agePlaceholder: "ಉದಾ. 34",
      languageLabel: "ಆದ್ಯತೆಯ ಭಾಷೆ",
      consentText: "ಆಡಿಯೋ ಟೋನ್ ಪ್ಲೇಬ್ಯಾಕ್ ಮತ್ತು ಶ್ರವಣ ಪರೀಕ್ಷೆಗಾಗಿ ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ.",
      consentNote: "ಎಕೋ ಸೆನ್ಸ್ ಪ್ರಾಥಮಿಕ ಜಾಗೃತಿ ಸಾಧನವಾಗಿದ್ದು, ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ.",
      startButton: "ಶ್ರವಣ ತಪಾಸಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ",
      validationName: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
      validationAge: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ವಯಸ್ಸನ್ನು ನಮೂದಿಸಿ."
    },
    test1: {
      title: "ಪರೀಕ್ಷೆ 1: ಪುನರಾವರ್ತನೆ ಗುರುತಿಸುವಿಕೆ ಪರೀಕ್ಷೆ",
      subtitle: "6 ಆವರ್ತನ ಹಂತಗಳಲ್ಲಿ ವಾಕ್ಯ ಗುರುತಿಸುವಿಕೆಯ ನಿಖರತೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುವುದು.",
      instruction: "ಹೇಳಲಾದ ವಾಕ್ಯವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಆಲಿಸಿ. ಅಗತ್ಯವಿದ್ದರೆ 'ಮರುಪ್ಲೇ ಮಾಡಿ' ಬಟನ್ ಬಳಸಿ, ನಂತರ ಕೇಳಿದ್ದನ್ನು ಟೈಪ್ ಮಾಡಿ.",
      stageLabel: "ಆವರ್ತನ ಹಂತ",
      repeatButton: "ಮರುಪ್ಲೇ ಮಾಡಿ",
      repetitionsCount: "ಪುನರಾವರ್ತನೆಗಳು",
      inputPlaceholder: "ನೀವು ಕೇಳಿದ ನಿಖರವಾದ ವಾಕ್ಯವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
      submitAnswer: "ಉತ್ತರವನ್ನು ಸಲ್ಲಿಸಿ",
      nextStage: "ಮುಂದಿನ ಹಂತಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ",
      feedbackCorrect: "ಸರಿಯಾದ ಉತ್ತರ ಗುರುತಿಸಲಾಗಿದೆ!",
      feedbackIncorrect: "ಉತ್ತರದಲ್ಲಿ ವ್ಯತ್ಯಾಸ ಕಂಡುಬಂದಿದೆ.",
      summaryTitle: "ಪುನರಾವರ್ತನೆ ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶ",
      totalQuestions: "ಒಟ್ಟು ಹಂತಗಳು",
      correctAnswers: "ಸರಿಯಾದ ಉತ್ತರಗಳು",
      incorrectAnswers: "ತಪ್ಪಾದ ಉತ್ತರಗಳು",
      totalRepeats: "ಒಟ್ಟು ಪುನರಾವರ್ತನೆಗಳು",
      accuracy: "ನಿಖರತೆ ಶೇಕಡಾವಾರು",
      proceedToTest2: "ಪರೀಕ್ಷೆ 2 ಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ"
    },
    test2: {
      title: "ಪರೀಕ್ಷೆ 2: ತಪ್ಪಾಗಿ ಕೇಳಿಸುವ ಪದಗಳ ಪರೀಕ್ಷೆ",
      subtitle: "ಒಂದೇ ರೀತಿಯ ಧ್ವನಿ ಹೊಂದಿರುವ ಪದಗಳನ್ನು ಗುರುತಿಸುವ ಸಾಮರ್ಥ್ಯ.",
      instruction: "ಪದವನ್ನು ಆಲಿಸಿ ಮತ್ತು ನೀವು ಕೇಳಿದ ಪದವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
      playWord: "ಪದವನ್ನು ಪ್ಲೇ ಮಾಡಿ",
      replayWord: "ಮತ್ತೆ ಕೇಳಿ",
      recordPronunciation: "ಕೇಳಿದ ಪದವನ್ನು ಆರಿಸಿ",
      listeningMic: "ಆಡಿಯೋ ಪ್ಲೇ ಆಗುತ್ತಿದೆ...",
      processingSpeech: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
      spokenWord: "ಆರಿಸಿದ ಪದ",
      feedbackMatch: "ಧ್ವನಿ ವ್ಯತ್ಯಾಸವನ್ನು ಸರಿಯಾಗಿ ಗುರುತಿಸಲಾಗಿದೆ!",
      feedbackRetry: "ದ್ವಂದ್ವ ಕಂಡುಬಂದಿದೆ. ಮತ್ತೊಂದು ಪದವನ್ನು ಪರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ.",
      attemptsCount: "ಪ್ರಯತ್ನಗಳು",
      categoryLabel: "ವರ್ಗ",
      summaryTitle: "ತಪ್ಪಾಗಿ ಕೇಳಿಸುವ ಪದಗಳ ಸಾರಾಂಶ",
      pronunciationDisclaimer: "ಈ ಪರೀಕ್ಷೆಯು ಮೈಕ್ರೊಫೋನ್ ಅವಲಂಬನೆ ಇಲ್ಲದೆ ಧ್ವನಿ ವ್ಯತ್ಯಾಸಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ.",
      proceedToTest3: "ಪರೀಕ್ಷೆ 3 ಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ",
      micFallbackHint: "ನೀವು ಕೇಳಿದ ಆಯ್ಕೆ A ಅಥವಾ ಆಯ್ಕೆ B ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ."
    },
    test3: {
      title: "ಪರೀಕ್ಷೆ 3: ಆವರ್ತನ ಗುರುತಿಸುವಿಕೆ ಪರೀಕ್ಷೆ",
      subtitle: "ಕಡಿಮೆ, ಮಧ್ಯಮ ಮತ್ತು ಹೆಚ್ಚಿನ ಆವರ್ತನ ಶಬ್ದಗಳನ್ನು ಪತ್ತೆಹಚ್ಚುವುದು.",
      quietNotice: "ಶಾಂತ ಕೋಣೆಯಲ್ಲಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
      headphoneNotice: "ನಿಖರವಾದ ಫಲಿತಾಂಶಗಳಿಗಾಗಿ ಹೆಡ್‌ಫೋನ್‌ಗಳನ್ನು ಬಳಸಿ.",
      startToneTest: "ಆವರ್ತನ ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ",
      playingTone: "ಶಬ್ದ ನುಡಿಸಲಾಗುತ್ತಿದೆ...",
      questionText: "ನಿಮಗೆ ಶಬ್ದ ಕೇಳಿಸಿತೇ?",
      heardButton: "ಶಬ್ದ ಕೇಳಿಸಿತು",
      notHeardButton: "ಕೇಳಿಸಲಿಲ್ಲ",
      categoryLow: "ಕಡಿಮೆ ಆವರ್ತನ (250 Hz - 500 Hz)",
      categoryMid: "ಮಧ್ಯಮ ಆವರ್ತನ (1,000 Hz - 4,000 Hz)",
      categoryHigh: "ಹೆಚ್ಚಿನ ಆವರ್ತನ (6,000 Hz - 12,000 Hz)",
      progressLabel: "ಪ್ರಗತಿ",
      deviceDisclaimer: "ಪ್ರಮುಖ: ಸಾಧನದ ಸ್ಪೀಕರ್ ಗುಣಮಟ್ಟ ಫಲಿತಾಂಶದ ಮೇಲೆ ಪ್ರಭಾವ ಬೀರುತ್ತದೆ. ಇದು ವೈದ್ಯಕೀಯ ಆಡಿಯೋಗ್ರಾಮ್ ಅಲ್ಲ.",
      summaryTitle: "ಆವರ್ತನ ಪತ್ತೆ ಸಾರಾಂಶ",
      viewFinalReport: "ಅಂತಿಮ ವರದಿಯನ್ನು ವೀಕ್ಷಿಸಿ"
    },
    results: {
      title: "ಸಮಗ್ರ ಶ್ರವಣ ತಪಾಸಣೆ ವರದಿ",
      subtitle: "ಮಾತು ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಆವರ್ತನ ಸಂವೇದನೆಯ ಬಹುಮುಖಿ ವೀಕ್ಷಣೆಗಳು.",
      patientInfo: "ಬಳಕೆದಾರರ ಮಾಹಿತಿ",
      testDate: "ಪರೀಕ್ಷೆಯ ದಿನಾಂಕ ಮತ್ತು ಸಮಯ",
      testSummary: "ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶಗಳು",
      concernIndicator: "ಶ್ರವಣ ಕಾಳಜಿ ಸೂಚಕ",
      concernLow: "ಕಡಿಮೆ ಕಾಳಜಿ (ಸಾಮಾನ್ಯ)",
      concernModerate: "ಮಧ್ಯಮ ಕಾಳಜಿ",
      concernHigh: "ಹೆಚ್ಚಿನ ಕಾಳಜಿ (ತಜ್ಞರ ಸಲಹೆ ಅಗತ್ಯ)",
      concernLowNote: "ಯಾವುದೇ ಗಮನಾರ್ಹ ತೊಂದರೆ ಕಂಡುಬಂದಿಲ್ಲ. (ಕಡಿಮೆ ಕಾಳಜಿ ಫಲಿತಾಂಶವು ಶ್ರವಣ ದೋಷವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ತಳ್ಳಿಹಾಕುವುದಿಲ್ಲ).",
      concernModNote: "ಕೆಲವು ಆವರ್ತನಗಳಲ್ಲಿ ಅಸಮಂಜಸ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಕಂಡುಬಂದಿವೆ.",
      concernHighNote: "ಹಲವಾರು ಕಾಳಜಿಯುಕ್ತ ಅವಲೋಕನಗಳು ಕಂಡುಬಂದಿವೆ. ಆಡಿಯಾಲಜಿಸ್ಟ್ ಭೇಟಿ ಮಾಡಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.",
      test1Result: "ಪುನರಾವರ್ತನೆ ಪರೀಕ್ಷೆ",
      test2Result: "ತಪ್ಪಾಗಿ ಕೇಳಿಸುವ ಪದಗಳ ಪರೀಕ್ಷೆ",
      test3Result: "ಆವರ್ತನ ಗುರುತಿಸುವಿಕೆ ಪರೀಕ್ಷೆ",
      frequencyProfile: "ಆವರ್ತನ ಸಂವೇದನಾ ಪ್ರೊಫೈಲ್",
      detectedRanges: ["ಕಡಿಮೆ ಆವರ್ತನಗಳು", "ಮಧ್ಯಮ ಆವರ್ತನಗಳು", "ಹೆಚ್ಚಿನ ಆವರ್ತನಗಳು"],
      missedRanges: [],
      thankYouMessage: "Thank you for choosing EchoSense. Your hearing health matters. Continue monitoring your hearing and consult a qualified professional if you experience difficulties.",
      medicalDisclaimer: "These tests are experimental and are not medically validated diagnostic procedures. EchoSense only provides preliminary hearing-related screening observations. It cannot confirm or rule out hearing loss. For genuine hearing concerns, consult a qualified audiologist or healthcare professional.",
      restartButton: "ಅಧಿವೇಶನವನ್ನು ಮರುಪ್ರಾರಂಭಿಸಿ",
      confirmRestartTitle: "ಪರೀಕ್ಷೆಯನ್ನು ಮರುಪ್ರಾರಂಭಿಸಬೇಕೆ?",
      confirmRestartDesc: "ಇದು ಪ್ರಸ್ತುತ ಫಲಿತಾಂಶಗಳನ್ನು ತೆರವುಗೊಳಿಸುತ್ತದೆ ಮತ್ತು ನೋಂದಣಿ ಪುಟಕ್ಕೆ ಮರಳುತ್ತದೆ.",
      cancel: "ರದ್ದುಮಾಡಿ",
      confirm: "ಹೌದು, ಮರುಹೊಂದಿಸಿ",
      exploreAiFeatures: "AI ಪರಿಕರಗಳನ್ನು ಅನ್ವೇಷಿಸಿ"
    },
    behavioral: {
      title: "ದೈನಂದಿನ ಶ್ರವಣ ಮೇಲ್ವಿಚಾರಣೆ",
      subtitle: "ಫೋನ್ ಕರೆ ಮತ್ತು ದೈನಂದಿನ ಸಂಭಾಷಣೆಯ ಅನುಭವಗಳನ್ನು ದಾಖಲಿಸಿ.",
      q1: "ಫೋನ್ ಕರೆ ವಾಲ್ಯೂಮ್ ಅನ್ನು ಹೆಚ್ಚಿಸಬೇಕಾಯಿತೇ?",
      q2: "ಮಾತನಾಡಿದ್ದನ್ನು ಪುನರಾವರ್ತಿಸಲು ನೀವು ಕೇಳಿದ್ದೀರಾ?",
      q3: "ಸಂಭಾಷಣೆಯಲ್ಲಿ ಪದಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಗೊಂದಲವಾಯಿತೇ?",
      q4: "ಹಿನ್ನೆಲೆ ಶಬ್ದವು ಸಂಭಾಷಣೆಯನ್ನು ಕಷ್ಟಕರವಾಗಿಸಿತೇ?",
      notesLabel: "ಟಿಪ್ಪಣಿಗಳು (ಐಚ್ಛಿಕ)",
      notesPlaceholder: "ಉದಾ. ಗದ್ದಲದ ಸ್ಥಳದಲ್ಲಿ ಕರೆ...",
      submitButton: "ದಾಖಲೆಯನ್ನು ಉಳಿಸಿ",
      submittedSuccess: "ಅವಲೋಕನವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.",
      recentLogs: "ಇತ್ತೀಚಿನ ದಾಖಲೆಗಳು",
      disclaimer: "ಗೌಪ್ಯತೆ ಭರವಸೆ: ಎಕೋ ಸೆನ್ಸ್ ಕರೆಗಳನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡುವುದಿಲ್ಲ."
    },
    fingerprint: {
      title: "ವೈಯಕ್ತಿಕ AI ಹಿಯರಿಂಗ್ ಫಿಂಗರ್‌ಪ್ರಿಂಟ್",
      subtitle: "ನಿಮ್ಮ ಪರೀಕ್ಷೆಗಳಿಂದ ಸಂಶ್ಲೇಷಿಸಲಾದ ಬಹು ಆಯಾಮದ ಶ್ರವಣ ಪ್ರೊಫೈಲ್.",
      compositeScore: "ಶ್ರವಣ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ",
      compositeExplanation: "ಮಾತಿನ ಸ್ಪಷ್ಟತೆ ಮತ್ತು ಆವರ್ತನ ಶ್ರೇಣಿಯ ಸಂಯೋಜಿತ ಅಂಕ.",
      strengthsTitle: "ಬಲವಾದ ಶ್ರವಣ ಸಾಮರ್ಥ್ಯಗಳು",
      vulnerabilitiesTitle: "ಗಮನಹರಿಸಬೇಕಾದ ಕ್ಷೇತ್ರಗಳು",
      recommendationsTitle: "ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳು",
      runAiAnalysis: "AI ಐಸೋಲೇಶನ್ ಫಾರೆಸ್ಟ್ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ",
      aiReportTitle: "AI ಅಸಂಗತತೆ ವರದಿ",
      normalStatus: "ಸಾಮಾನ್ಯ ಮಾದರಿ",
      anomalyStatus: "ಅಸಾಮಾನ್ಯ ಬದಲಾವಣೆ ಪತ್ತೆಯಾಗಿದೆ"
    },
    tinnitus: {
      title: "ಟಿನ್ನಿಟಸ್ ಟ್ರ್ಯಾಕರ್",
      subtitle: "ಕಿವಿಯಲ್ಲಿ ಕೇಳಿಬರುವ ಶಬ್ದಗಳ ಮೇಲ್ವಿಚಾರಣೆ ಸಾಧನ.",
      soundTypes: "ಅನುಭವಿಸಿದ ಶಬ್ದಗಳು",
      ringing: "ಘಂಟಾನಾದ",
      buzzing: "ಝೇಂಕಾರ",
      humming: "ಗುಂಯ್ಗುಡುವಿಕೆ",
      whistling: "ಶಿಳ್ಳೆ ಶಬ್ದ",
      frequencyLabel: "ಆವರ್ತನ",
      durationLabel: "ಅವಧಿ",
      earLabel: "ಬಾಧಿತ ಕಿವಿ",
      severityLabel: "ತೀವ್ರತೆ (1 ರಿಂದ 10)",
      submitButton: "ಉಳಿಸಿ",
      educationalNotice: "ಶೈಕ್ಷಣಿಕ ಟಿಪ್ಪಣಿ: ಟಿನ್ನಿಟಸ್ ಶ್ರವಣ ನಷ್ಟವಿಲ್ಲದೆಯೂ ಸಂಭವಿಸಬಹುದು.",
      historyTitle: "ಟಿನ್ನಿಟಸ್ ಇತಿಹಾಸ"
    },
    trends: {
      title: "ಶ್ರವಣ ಪ್ರವೃತ್ತಿ ವಿಶ್ಲೇಷಣೆ",
      subtitle: "ಕಾಲಾನಂತರದಲ್ಲಿ ನಿಮ್ಮ ಶ್ರವಣ ನಿಖರತೆಯ ಪ್ರವೃತ್ತಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
      totalTests: "ಪೂರ್ಣಗೊಂಡ ತಪಾಸಣೆಗಳು",
      overallTrajectory: "ಒಟ್ಟಾರೆ ಪ್ರವೃತ್ತಿ",
      stable: "ಸ್ಥಿರ ಶ್ರವಣ ಸ್ಥಿತಿ",
      improving: "ಸುಧಾರಣೆ",
      declining: "ಇಳಿಕೆ",
      accuracyChartTitle: "ಸಮಯದೊಂದಿಗೆ ನಿಖರತೆ",
      frequencyChartTitle: "ಆವರ್ತನ ಪತ್ತೆ ಶೇಕಡಾವಾರು",
      noHistoryNotice: "ಪ್ರವೃತ್ತಿಗಳನ್ನು ನೋಡಲು ಕನಿಷ್ಠ ಎರಡು ಪರೀಕ್ಷೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ."
    }
  },
  gu: {
    appName: "ઇકો સેન્સ (EchoSense)",
    tagline: "શાંતિની પાર સાંભળો.",
    nav: {
      screening: "સ્ક્રીનીંગ પરીક્ષણો",
      behavioral: "દૈનિક દેખરેખ",
      fingerprint: "હિયરીંગ ફિંગરપ્રિન્ટ",
      tinnitus: "ટિનિટસ ટ્રેકર",
      trends: "પ્રવાહો",
      restart: "રીસેટ કરો"
    },
    registration: {
      title: "શ્રવણ સ્વાસ્થ્ય પ્રારંભિક સ્ક્રીનીંગ",
      subtitle: "વાણી ઓળખ અને શ્રવણ આવર્તન સંવેદનશીલતા માટે એઆઈ-સંચાલિત સ્ક્રીનીંગ.",
      fullNameLabel: "પૂરું નામ",
      fullNamePlaceholder: "તમારું પૂરું નામ લખો",
      ageLabel: "ઉંમર",
      agePlaceholder: "દા.ત. 34",
      languageLabel: "પસંદગીની ભાષા",
      consentText: "હું ઑડિઓ ટોન અને વાણી પરીક્ષણ માટે સંમતિ આપું છું.",
      consentNote: "ઇકો સેન્સ માત્ર જાગૃતિ સાધન છે, તે મેડિકલ ડાયગ્નોસિસ નથી.",
      startButton: "સ્ક્રીનીંગ શરૂ કરો",
      validationName: "કૃપા કરીને તમારું નામ લખો.",
      validationAge: "માન્ય ઉંમર દાખલ કરો."
    },
    test1: {
      title: "પરીક્ષણ 1: પુનરાવર્તન ઓળખ પરીક્ષણ",
      subtitle: "6 વિવિધ આવર્તન સ્તરોમાં વાણી ઓળખની ચોકસાઈનું મૂલ્યાંકન.",
      instruction: "બોલાયેલ વાક્ય ધ્યાનથી સાંભળો. જરૂર હોય તો 'ફરી સાંભળો' દબાવો અને જે સાંભળ્યું તે લખો.",
      stageLabel: "આવર્તન તબક્કો",
      repeatButton: "ફરી સાંભળો",
      repetitionsCount: "પુનરાવર્તન સંખ્યા",
      inputPlaceholder: "સાંભળેલું વાક્ય અહીં ટાઇપ કરો...",
      submitAnswer: "જવાબ સબમિટ કરો",
      nextStage: "આગળના તબક્કે જાઓ",
      feedbackCorrect: "સાચો જવાબ મળ્યો!",
      feedbackIncorrect: "જવાબમાં તફાવત નોંધાયો.",
      summaryTitle: "પુનરાવર્તન પરીક્ષણ પરિણામ",
      totalQuestions: "કુલ તબક્કાઓ",
      correctAnswers: "સાચા જવાબો",
      incorrectAnswers: "ખોટા જવાબો",
      totalRepeats: "કુલ પુનરાવર્તન",
      accuracy: "ચોકસાઈ ટકાવારી",
      proceedToTest2: "પરીક્ષણ 2 પર જાઓ"
    },
    test2: {
      title: "પરીક્ષણ 2: ગેરસમજ શબ્દ પરીક્ષણ",
      subtitle: "સરખા ઉચ્ચારણ વાળા શબ્દોમાં ભેદ પારખવાની ક્ષમતા.",
      instruction: "શબ્દ ધ્યાનથી સાંભળો અને જે શબ્દ સાંભળ્યો તે પસંદ કરો.",
      playWord: "શબ્દ સાંભળો",
      replayWord: "ફરી સાંભળો",
      recordPronunciation: "સાંભળેલો શબ્દ પસંદ કરો",
      listeningMic: "ઑડિઓ વાગી રહ્યો છે...",
      processingSpeech: "ચકાસણી ચાલુ...",
      spokenWord: "પસંદ કરેલ શબ્દ",
      feedbackMatch: "ધ્વનિ ભેદ સાચો ઓળખાયો!",
      feedbackRetry: "ધ્વનિ ગૂંચવણ. બીજો શબ્દ પ્રસ્તુત કરાય છે.",
      attemptsCount: "પ્રયાસો",
      categoryLabel: "શ્રેણી",
      summaryTitle: "ગેરસમજ શબ્દ સારાંશ",
      pronunciationDisclaimer: "આ પરીક્ષણ માઇક્રોફોન વગર શ્રવણ ધ્વનિ ભેદનું મૂલ્યાંકન કરે છે.",
      proceedToTest3: "પરીક્ષણ 3 પર જાઓ",
      micFallbackHint: "વિકલ્પ A અથવા B માંથી સાંભળેલો શબ્દ પસંદ કરો."
    },
    test3: {
      title: "પરીક્ષણ 3: આવર્તન ઓળખ પરીક્ષણ",
      subtitle: "નીચા, મધ્યમ અને ઊંચા આવર્તનની શુદ્ધ ધ્વનિની ઓળખ.",
      quietNotice: "ખાતરી કરો કે તમે શાંત ઓરડામાં છો.",
      headphoneNotice: "ચોક્કસ પરિણામો માટે હેડફોન વાપરો.",
      startToneTest: "પરીક્ષણ શરૂ કરો",
      playingTone: "અવાજ વાગી રહ્યો છે...",
      questionText: "શું તમને અવાજ સંભળાયો?",
      heardButton: "સંભળાયો",
      notHeardButton: "નથી સંભળાયો",
      categoryLow: "નીચું આવર્તન (250 Hz - 500 Hz)",
      categoryMid: "મધ્યમ આવર્તન (1,000 Hz - 4,000 Hz)",
      categoryHigh: "ઊંચું આવર્તન (6,000 Hz - 12,000 Hz)",
      progressLabel: "પ્રગતિ",
      deviceDisclaimer: "મહત્વપૂર્ણ: સ્પીકર ગુણવત્તા પરિણામ પર અસર કરે છે. આ કેલિબ્રેટેડ ઓડિયોગ્રામ નથી.",
      summaryTitle: "આવર્તન સારાંશ",
      viewFinalReport: "અંતિમ અહેવાલ જુઓ"
    },
    results: {
      title: "વિગતવાર શ્રવણ સ્ક્રીનીંગ અહેવાલ",
      subtitle: "વાણી ઓળખ અને આવર્તન સંવેદનશીલતાનું વિશ્લેષણ.",
      patientInfo: "વપરાશકર્તા વિગતો",
      testDate: "પરીક્ષણ તારીખ અને સમય",
      testSummary: "પરીક્ષણ પરિણામો",
      concernIndicator: "શ્રવણ ચિંતા સૂચક",
      concernLow: "ઓછી ચિંતા (સામાન્ય)",
      concernModerate: "મધ્યમ ચિંતા",
      concernHigh: "ઉચ્ચ ચિંતા (નિષ્ણાત સલાહ જરૂરી)",
      concernLowNote: "કોઈ નોંધપાત્ર ચિંતા જણાઈ નથી. (ઓછી ચિંતા સાંભળવાની ખોટને સંપૂર્ણ નકારતી નથી).",
      concernModNote: "અમુક આવર્તનોમાં અસંગત પ્રતિભાવો જણાયા છે.",
      concernHighNote: "ચિંતાજનક અવલોકનો નોંધાયા છે. ઓડિયોલોજિસ્ટની મુલાકાત લેવાની ભલામણ છે.",
      test1Result: "પુનરાવર્તન પરીક્ષણ",
      test2Result: "ગેરસમજ શબ્દ પરીક્ષણ",
      test3Result: "આવર્તન ઓળખ પરીક્ષણ",
      frequencyProfile: "આવર્તન સંવેદનશીલતા પ્રોફાઇલ",
      detectedRanges: ["નીચા આવર્તન", "મધ્યમ આવર્તન", "ઊંચા આવર્તન"],
      missedRanges: [],
      thankYouMessage: "Thank you for choosing EchoSense. Your hearing health matters. Continue monitoring your hearing and consult a qualified professional if you experience difficulties.",
      medicalDisclaimer: "These tests are experimental and are not medically validated diagnostic procedures. EchoSense only provides preliminary hearing-related screening observations. It cannot confirm or rule out hearing loss. For genuine hearing concerns, consult a qualified audiologist or healthcare professional.",
      restartButton: "સત્ર રીસેટ કરો",
      confirmRestartTitle: "પરીક્ષણ ફરીથી શરૂ કરવું છે?",
      confirmRestartDesc: "આ વર્તમાન પરિણામો સાફ કરશે અને તમને નોંધણી પૃષ્ઠ પર લઈ જશે.",
      cancel: "રદ કરો",
      confirm: "હા, રીસેટ કરો",
      exploreAiFeatures: "એઆઈ સુવિધાઓ જુઓ"
    },
    behavioral: {
      title: "વર્તણૂક શ્રવણ દેખરેખ",
      subtitle: "ફોન કૉલ અને વાતચીતના તમારા અનુભવો નોંધો.",
      q1: "શું તમારે ફોન કૉલનો અવાજ વધારવો પડ્યો હતો?",
      q2: "શું તમે વાતચીતમાં પુનરાવર્તન કરવા વિનંતી કરી હતી?",
      q3: "શું કૉલ દરમિયાન શબ્દો સમજવામાં ગેરસમજ થઈ હતી?",
      q4: "શું બેકગ્રાઉન્ડ અવાજે વાતચીત મુશ્કેલ બનાવી હતી?",
      notesLabel: "નોંધ (વૈકલ્પિક)",
      notesPlaceholder: "દા.ત. ઘોંઘાટ વાળા વિસ્તારમાં કૉલ...",
      submitButton: "અવલોકન સાચવો",
      submittedSuccess: "અવલોકન સફળતાપૂર્વક સાચવવામાં આવ્યું.",
      recentLogs: "તાજેતરની નોંધણીઓ",
      disclaimer: "ઇકો સેન્સ કૉલ રેકોર્ડ કરતું નથી."
    },
    fingerprint: {
      title: "વ્યક્તિગત એઆઈ હિયરીંગ ફિંગરપ્રિન્ટ",
      subtitle: "તમારા પરીક્ષણો અને અનુભવો પરથી તૈયાર થયેલ શ્રવણ પ્રોફાઇલ.",
      compositeScore: "શ્રવણ સ્વાસ્થ્ય સૂચકાંક",
      compositeExplanation: "વાણી સ્પષ્ટતા અને આવર્તન ક્ષમતાનો સંયુક્ત સ્કોર.",
      strengthsTitle: "મજબૂત શ્રવણ પાસાઓ",
      vulnerabilitiesTitle: "ધ્યાન માંગતા ક્ષેત્રો",
      recommendationsTitle: "વ્યક્તિગત ભલામણો",
      runAiAnalysis: "એઆઈ આઇસોલેશન ફોરેસ્ટ વિશ્લેષણ ચલાવો",
      aiReportTitle: "એઆઈ વિસંગતતા અહેવાલ",
      normalStatus: "સામાન્ય પેટર્ન",
      anomalyStatus: "અસામાન્ય ફેરફાર નોંધાયો"
    },
    tinnitus: {
      title: "ટિનિટસ અનુભવ ટ્રેકર",
      subtitle: "કાનમાં સીટી કે ગૂંજ સંભળાવાની દેખરેખ.",
      soundTypes: "અનુભવાયેલા અવાજો",
      ringing: "ઘંટડી જેવો અવાજ",
      buzzing: "ગણગણાટ",
      humming: "ગૂંજ",
      whistling: "સીટી જેવો અવાજ",
      frequencyLabel: "આવૃત્તિ",
      durationLabel: "સમયગાળો",
      earLabel: "અસરગ્રસ્ત કાન",
      severityLabel: "તીવ્રતા (1 થી 10)",
      submitButton: "સાચવો",
      educationalNotice: "શૈક્ષણિક નોંધ: ટિનિટસ શ્રવણ નુકશાન વગર પણ થઈ શકે છે.",
      historyTitle: "ટિનિટસ ઇતિહાસ"
    },
    trends: {
      title: "શ્રવણ પ્રવાહ વિશ્લેષણ",
      subtitle: "સમય જતાં તમારી ઓળખ ચોકસાઈ પર નજર રાખો.",
      totalTests: "પૂર્ણ થયેલ પરીક્ષણો",
      overallTrajectory: "સમગ્ર પ્રવાહ",
      stable: "સ્થિર શ્રવણ સ્થિતિ",
      improving: "સુધારો",
      declining: "ઘટાડો",
      accuracyChartTitle: "સમય સાથે ચોકસાઈ",
      frequencyChartTitle: "આવર્તન ઓળખ %",
      noHistoryNotice: "પ્રવાહ વિશ્લેષણ જોવા માટે ઓછામાં ઓછા બે પરીક્ષણો પૂર્ણ કરો."
    }
  },
  ta: { ...({} as any) }, // Will fall back to English with translations mapped below
  te: { ...({} as any) },
  bn: { ...({} as any) },
  mr: { ...({} as any) },
  es: { ...({} as any) },
  fr: { ...({} as any) },
};

// Populate the remaining languages gracefully with localized titles while defaulting to English core
const fallbackCodes: LanguageCode[] = ['ta', 'te', 'bn', 'mr', 'es', 'fr'];
fallbackCodes.forEach(code => {
  translations[code] = JSON.parse(JSON.stringify(translations.en));
});
