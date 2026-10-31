import React, { useState } from 'react';
import { 
  Activity, 
  Languages, 
  RotateCcw, 
  Sparkles, 
  BarChart2, 
  BellRing, 
  PhoneCall, 
  Compass,
  Menu,
  X,
  ChevronDown,
  Clock
} from 'lucide-react';
import { LanguageCode } from '../types';
import { languages, translations } from '../i18n/translations';

interface NavbarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRestartClick: () => void;
  hasActiveSession: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
  onRestartClick,
  hasActiveSession
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navItems = [
    {
      id: 'landing',
      label: 'OVERVIEW',
      icon: Compass,
    },
    {
      id: 'screening',
      label: t.nav.screening.toUpperCase(),
      icon: Activity,
    },
    {
      id: 'history',
      label: 'HISTORY',
      icon: Clock,
    },
    {
      id: 'behavioral',
      label: t.nav.behavioral.toUpperCase(),
      icon: PhoneCall,
    },
    {
      id: 'fingerprint',
      label: t.nav.fingerprint.toUpperCase(),
      icon: Sparkles,
    },
    {
      id: 'tinnitus',
      label: t.nav.tinnitus.toUpperCase(),
      icon: BellRing,
    },
    {
      id: 'trends',
      label: t.nav.trends.toUpperCase(),
      icon: BarChart2,
    },
  ];

  const currentLangObj = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6] border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Title with Neo-Brutalist Box */}
          <div 
            onClick={() => onTabChange('landing')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFC700] border-2 border-black shadow-brutal-sm flex items-center justify-center text-black group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-black">
                  EchoSense
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#FFC700] text-black border border-black shadow-brutal-xs">
                  AI SCREENING
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links (Neo-Brutal Tabs) */}
          <nav className="hidden xl:flex items-center space-x-2 bg-white p-1.5 rounded-xl border-2 border-black shadow-brutal-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFC700] text-black border-2 border-black shadow-brutal-xs'
                      : 'text-black hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Language & Session */}
          <div className="flex items-center space-x-2.5">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white hover:bg-[#FFC700] border-2 border-black text-xs font-black text-black shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
                title="Select Language"
              >
                <Languages className="w-4 h-4 stroke-[2.5]" />
                <span>{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-brutal border-2 border-black py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <div className="px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b-2 border-black mb-1">
                    Select Language ({languages.length})
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#FFC700] transition-colors cursor-pointer font-bold ${
                          currentLanguage === lang.code ? 'bg-[#FFC700] text-black font-black border-y border-black' : 'text-black'
                        }`}
                      >
                        <span>{lang.nativeName}</span>
                        <span className="text-[11px] font-medium text-slate-600">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Restart Session Button */}
            {hasActiveSession && (
              <button
                onClick={onRestartClick}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-100 text-black border-2 border-black shadow-brutal-sm text-xs font-black uppercase transition-all cursor-pointer"
                title="Restart Session"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">RESET</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-white border-2 border-black shadow-brutal-sm text-black hover:bg-[#FFC700] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b-2 border-black px-4 pt-3 pb-6 space-y-2 shadow-brutal">
          <div className="text-xs font-black text-black uppercase tracking-wider px-2 mb-2">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFC700] text-black border-2 border-black shadow-brutal-sm'
                    : 'text-black hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
