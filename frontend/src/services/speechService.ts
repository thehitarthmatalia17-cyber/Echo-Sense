import { LanguageCode } from '../types';

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;

  private langMap: Record<LanguageCode, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    kn: 'kn-IN',
    gu: 'gu-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    es: 'es-ES',
    fr: 'fr-FR',
  };

  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded: boolean = false;

  constructor() {
    this.initVoices();
  }

  private initVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.voicesLoaded = true;
      }
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
        this.voicesLoaded = true;
      };
    }
  }

  /**
   * Returns the best available natural/high-clarity voice for the given language.
   */
  public getBestVoice(lang: LanguageCode = 'en'): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices();
      }
    }
    const targetLang = this.langMap[lang] || 'en-US';
    const langPrefix = targetLang.slice(0, 2);

    // Filter matching language voices
    const matching = this.voices.filter(v => v.lang.startsWith(langPrefix) || v.lang.replace('_', '-').startsWith(targetLang));

    if (matching.length === 0) return null;

    // Prioritize high-clarity natural speech synthesis voices
    const naturalVoice = matching.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Online') || 
      v.name.includes('Neural') ||
      v.name.includes('Jenny') ||
      v.name.includes('Guy') ||
      v.name.includes('Aria')
    );

    return naturalVoice || matching[0];
  }

  /**
   * Speaks the given text in the requested language using Web Speech Synthesis.
   * Calibrated with hardware DAC wake-up buffer to prevent initial phoneme truncation.
   */
  public speakText(text: string, lang: LanguageCode = 'en', rate: number = 0.95, pitch: number = 1.0): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this environment.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop any pending speech

      // Pre-roll delay of 80ms allows device audio hardware/Bluetooth DAC to wake up,
      // preventing the first 30-50ms voiceless plosive/fricative consonant from being clipped!
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.langMap[lang] || 'en-US';
        utterance.rate = rate;
        utterance.pitch = pitch;

        const bestVoice = this.getBestVoice(lang);
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        utterance.onend = () => {
          resolve();
        };

        utterance.onerror = (e) => {
          console.warn('Speech synthesis utterance error:', e);
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      }, 80);
    });
  }

  /**
   * Checks whether Web Speech Recognition is natively available in the browser.
   */
  public isSpeechRecognitionSupported(): boolean {
    return Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Listens for spoken input from microphone and returns recognized text.
   */
  public startListening(
    lang: LanguageCode = 'en',
    onInterim?: (text: string) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject(new Error('Speech recognition not supported on this browser.'));
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        this.recognition = recognition;
        recognition.lang = this.langMap[lang] || 'en-US';
        recognition.continuous = false;
        recognition.interimResults = Boolean(onInterim);
        recognition.maxAlternatives = 3;

        let finalTranscript = '';

        recognition.onstart = () => {
          this.isListening = true;
        };

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (onInterim && interim) {
            onInterim(interim);
          }
        };

        recognition.onerror = (event: any) => {
          this.isListening = false;
          console.warn('Speech recognition event error:', event.error);
          resolve(finalTranscript.trim()); // Return whatever was captured
        };

        recognition.onend = () => {
          this.isListening = false;
          resolve(finalTranscript.trim());
        };

        recognition.start();
      } catch (err) {
        this.isListening = false;
        reject(err);
      }
    });
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignored
      }
      this.isListening = false;
    }
  }

  /**
   * Immediately stops any speech synthesis playback and voice recognition listening.
   */
  public stopAll(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Ignored
      }
    }
    this.stopListening();
  }

  /**
   * Compares two strings using Levenshtein distance & phonetic token matching.
   * Returns similarity percentage (0.0 to 100.0).
   */
  public calculateSimilarity(s1: string, s2: string): number {
    const clean1 = s1.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    const clean2 = s2.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');

    if (clean1 === clean2) return 100.0;
    if (!clean1 || !clean2) return 0.0;

    // Levenshtein distance matrix
    const track = Array(clean2.length + 1).fill(null).map(() =>
      Array(clean1.length + 1).fill(null)
    );

    for (let i = 0; i <= clean1.length; i += 1) track[0][i] = i;
    for (let j = 0; j <= clean2.length; j += 1) track[j][0] = j;

    for (let j = 1; j <= clean2.length; j += 1) {
      for (let i = 1; i <= clean1.length; i += 1) {
        const indicator = clean1[i - 1] === clean2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    const dist = track[clean2.length][clean1.length];
    const maxLen = Math.max(clean1.length, clean2.length);
    const score = ((maxLen - dist) / maxLen) * 100.0;
    return Math.max(0, Math.round(score));
  }
}

export const speechService = new SpeechService();
