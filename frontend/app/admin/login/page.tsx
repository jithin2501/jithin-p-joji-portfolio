'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trash2, RefreshCw, Sun, Moon, Volume2
} from 'lucide-react';
import './Login.css';

interface DiagnosticLog {
  time: string;
  text: string;
  type: 'sys' | 'sensor' | 'success' | 'error' | 'music';
}

export default function AdminLogin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dialer' | 'settings'>('dialer');
  const [enteredPin, setEnteredPin] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  
  // Synthesizer controls
  const [soundTheme, setSoundTheme] = useState<'mechanical' | 'retro' | 'silent'>('mechanical');
  const [feedbackVolume, setFeedbackVolume] = useState(70); // %
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [clockTime, setClockTime] = useState('--:--:--');
  
  // Custom Toast layer
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Wheel Drag Physics States
  const wheelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const activeDigit = useRef<string | null>(null);
  const startAngle = useRef(0);
  const currentWheelRotation = useRef(0);
  const reachedStopper = useRef(false);
  const clickTriggered = useRef(false);
  const lastPlayedAngle = useRef(0);

  // STOPPER & DIGIT ANGLE CONSTANTS
  const STOPPER_ANGLE = 354;
  const DIGIT_ANGLES: Record<string, number> = {
    '1': 18,
    '2': 54,
    '3': 90,
    '4': 126,
    '5': 162,
    '6': 198,
    '7': 234,
    '8': 270,
    '9': 306,
    '0': 342
  };

  // Mock logs for keeping dependencies running smoothly in wheel dragging callbacks
  const addLog = (text: string, type: 'sys' | 'sensor' | 'success' | 'error' | 'music' = 'sys') => {
    console.log(`[Diagnostic Log] ${type.toUpperCase()}: ${text}`);
  };

  // Toast trigger helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  // 1. Clock timer loop
  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString([], { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus manual keyboard input when dialer mounts or is active
  useEffect(() => {
    if (activeTab === 'dialer') {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // 2. Initialize web audio context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // 3. Audio synthesizers
  const playTickSound = () => {
    if (soundTheme === 'silent') return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const gainVolume = (feedbackVolume / 100) * 0.08;
      
      if (soundTheme === 'mechanical') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.03);
        
        gainNode.gain.setValueAtTime(gainVolume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      } else if (soundTheme === 'retro') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.setValueAtTime(300, ctx.currentTime + 0.015);
        
        gainNode.gain.setValueAtTime(gainVolume * 0.7, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      }
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  };

  const playGearHumSound = () => {
    if (soundTheme === 'silent') return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const gainVolume = (feedbackVolume / 100) * 0.04;
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(gainVolume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  const playLockRegisterSound = () => {
    if (soundTheme === 'silent') return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const gainVolume = (feedbackVolume / 100) * 0.12;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);
      
      gainNode.gain.setValueAtTime(gainVolume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  };

  const playSuccessChime = () => {
    if (soundTheme === 'silent') return;
    try {
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const gainVolume = (feedbackVolume / 100) * 0.08;
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
        gainNode.gain.linearRampToValueAtTime(gainVolume, ctx.currentTime + i * 0.08 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.6);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.6);
      });
    } catch (e) {}
  };

  const playErrorBuzzer = () => {
    if (soundTheme === 'silent') return;
    try {
      const ctx = getAudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const gainVolume = (feedbackVolume / 100) * 0.15;
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(110, ctx.currentTime);
      
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(112.5, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(gainVolume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  // 4. Verification logic linked with JWT Backend Login
  const verifyPasscode = async (pinArray: string[]) => {
    const combinedPin = pinArray.join('');
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pincode: combinedPin })
      });
      
      if (res.ok) {
        const data = await res.json();
        setToastType('success');
        playSuccessChime();
        showToast("Access Granted!");
        
        // Store JWT token and authentication status in sessionStorage
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        sessionStorage.setItem('adminToken', data.access_token);
        sessionStorage.setItem('adminPageAccess', data.page_access || '');
        
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        setToastType('error');
        playErrorBuzzer();
        showToast("Incorrect PIN!");
        setEnteredPin([]);
      }
    } catch (err) {
      setToastType('error');
      playErrorBuzzer();
      showToast("Connection Failed!");
      setEnteredPin([]);
    }
  };

  // Auto-submit hook when exact 6-digit length is reached
  useEffect(() => {
    if (enteredPin.length === 6) {
      // Delay slightly for visual feedback before verification
      const timer = setTimeout(() => {
        verifyPasscode(enteredPin);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [enteredPin]);

  const registerDigit = (digit: string) => {
    setEnteredPin(prev => {
      if (prev.length >= 6) return prev;
      return [...prev, digit];
    });
  };

  const handleDelete = () => {
    setEnteredPin(prev => {
      if (prev.length === 0) return prev;
      const nextArr = prev.slice(0, -1);
      playTickSound();
      return nextArr;
    });
  };

  const handleClear = () => {
    setEnteredPin([]);
    playTickSound();
  };

  // 5. Dial Rotation Gestures Handler
  const startDialDrag = (e: React.MouseEvent | React.TouchEvent, digit: string, baseAngle: number) => {
    getAudioContext();
    isDragging.current = true;
    activeDigit.current = digit;
    reachedStopper.current = false;
    clickTriggered.current = false;
    lastPlayedAngle.current = 0;

    if (wheelRef.current) {
      wheelRef.current.classList.remove('returning');
    }

    const rect = wheelRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const startX = clientX - cx;
    const startY = clientY - cy;
    
    startAngle.current = Math.atan2(startY, startX) * (180 / Math.PI);
    
    const moveHandler = (evt: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      evt.preventDefault();
      
      const cX = 'touches' in evt ? evt.touches[0].clientX : evt.clientX;
      const cY = 'touches' in evt ? evt.touches[0].clientY : evt.clientY;
      
      const dx = cX - cx;
      const dy = cY - cy;
      
      let currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      let delta = currentAngle - startAngle.current;
      
      if (delta < 0) delta += 360;
      
      const targetRotation = (STOPPER_ANGLE - baseAngle + 360) % 360;
      const rotation = Math.min(delta, targetRotation);
      currentWheelRotation.current = rotation;
      
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${rotation}deg)`;
      }
      
      if (Math.abs(rotation - lastPlayedAngle.current) > 12) {
        playTickSound();
        lastPlayedAngle.current = rotation;
      }

      if (rotation >= targetRotation - 4) {
        if (!reachedStopper.current) {
          reachedStopper.current = true;
          if (!clickTriggered.current) {
            playLockRegisterSound();
            clickTriggered.current = true;
          }
        }
      } else {
        if (reachedStopper.current) {
          reachedStopper.current = false;
        }
      }
    };
    
    const endHandler = () => {
      isDragging.current = false;
      
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', endHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('touchend', endHandler);
      
      if (reachedStopper.current && activeDigit.current !== null) {
        registerDigit(activeDigit.current);
      }
      
      springBackWheel(currentWheelRotation.current);
    };
    
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', endHandler);
    window.addEventListener('touchmove', moveHandler, { passive: false });
    window.addEventListener('touchend', endHandler);
  };

  const autoDial = (digit: string) => {
    if (isDragging.current) return;
    getAudioContext();
    
    const baseAngle = DIGIT_ANGLES[digit];
    const targetRotation = (STOPPER_ANGLE - baseAngle + 360) % 360;
    
    let start: number | null = null;
    const duration = 280 + (targetRotation * 1.2);
    isDragging.current = true;
    
    function animateStep(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeValue = 1 - Math.pow(1 - progress, 3);
      const currentRot = easeValue * targetRotation;
      
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentRot}deg)`;
      }
      
      if (Math.abs(currentRot - lastPlayedAngle.current) > 14) {
        playTickSound();
        lastPlayedAngle.current = currentRot;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        playLockRegisterSound();
        registerDigit(digit);
        
        setTimeout(() => {
          springBackWheel(targetRotation);
        }, 120);
      }
    }
    lastPlayedAngle.current = 0;
    requestAnimationFrame(animateStep);
  };

  const springBackWheel = (startRotation: number) => {
    let currentRot = startRotation;
    let lastTick = startRotation;
    
    function returnAnimation() {
      if (currentRot > 0) {
        currentRot -= 8.5;
        if (currentRot < 0) currentRot = 0;
        
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${currentRot}deg)`;
        }
        
        if (lastTick - currentRot >= 16) {
          playGearHumSound();
          lastTick = currentRot;
        }
        
        requestAnimationFrame(returnAnimation);
      } else {
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(0deg)`;
        }
        isDragging.current = false;
        activeDigit.current = null;
        reachedStopper.current = false;
      }
    }
    requestAnimationFrame(returnAnimation);
  };

  const handleSoundThemeSelect = (theme: 'mechanical' | 'retro' | 'silent') => {
    setSoundTheme(theme);
  };

  // Generate Digit positions around the dial circular housing
  const getDigitPositions = (digit: string) => {
    const angle = DIGIT_ANGLES[digit];
    const angleRad = (angle - 90) * (Math.PI / 180);
    const left = 50 + 34.5 * Math.cos(angleRad);
    const top = 50 + 34.5 * Math.sin(angleRad);
    return { left: `${left.toFixed(4)}%`, top: `${top.toFixed(4)}%` };
  };

  // Get Stopper coordinates based on angle
  const getStopperStyles = () => {
    const stopperRad = (STOPPER_ANGLE - 90) * (Math.PI / 180);
    const stopLeft = 50 + 41.5 * Math.cos(stopperRad);
    const stopTop = 50 + 41.5 * Math.sin(stopperRad);
    return {
      left: `calc(${stopLeft.toFixed(4)}% - 10px)`,
      top: `calc(${stopTop.toFixed(4)}% - 10px)`
    };
  };

  if (!mounted) {
    return (
      <div className="login-page-container dark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050510' }}>
        <div style={{ color: '#6366f1', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', letterSpacing: '0.05em' }}>
          INITIALIZING SECURITY SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <div className={`login-page-container ${themeMode === 'light' ? 'light' : ''}`}>
      {/* Decorative ambient blurred nodes */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Floating Theme Control Button */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
          className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-all"
        >
          {themeMode === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-400" />}
        </button>
      </div>



      {/* System Toast layer */}
      <div className={`custom-system-toast ${toastVisible ? 'visible' : ''} ${toastType}`}>
        {toastMsg}
      </div>

      {/* Main Glassmorphic Card Housing */}
      <div className="security-main-card">
        
        {/* Card header metadata */}
        <div className="security-card-header">
          <div className="security-header-top">
            <div className="security-badge-pulse">
              <span className="pulse-dot-indicator"></span>
              <span className="security-badge-text">Security Terminal</span>
            </div>
            <div className="security-clock-feed">{clockTime}</div>
          </div>

          {/* Navigation views selectors */}
          <div className="tab-selection-row">
            <button 
              onClick={() => setActiveTab('dialer')} 
              className={`tab-select-btn ${activeTab === 'dialer' ? 'active' : ''}`}
            >
              🔒 Security Dial
            </button>
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`tab-select-btn ${activeTab === 'settings' ? 'active' : ''}`}
            >
              ⚙️ System Config
            </button>
          </div>
        </div>

        {/* View Switchers */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          {activeTab === 'dialer' ? (
            /* VIEW 1: MECHANICAL ROTARY DIAL PLATE */
            <>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Enter Access Key</h2>
                <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Dial passcode clockwise to open admin dashboard</p>
                
                {/* Hidden input field for mobile/desktop manual keyboard entry */}
                <input
                  ref={inputRef}
                  type="tel"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={enteredPin.join('')}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setEnteredPin(val.split(''));
                    playTickSound();
                  }}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: '1px',
                    height: '1px',
                    pointerEvents: 'none',
                    zIndex: -1
                  }}
                />

                {/* Dot PIN tracks indicators */}
                <div 
                  className={`pin-display-track ${isInputFocused ? 'focused-glowing' : ''}`}
                  onClick={() => inputRef.current?.focus()}
                  style={{ 
                    gap: '8px', 
                    cursor: 'text', 
                    padding: '8px 12px', 
                    borderRadius: '12px',
                    border: isInputFocused ? '1.5px solid rgba(99, 102, 241, 0.45)' : '1.5px solid rgba(255, 255, 255, 0.04)',
                    boxShadow: isInputFocused ? '0 0 25px rgba(99, 102, 241, 0.15), inset 0 0 10px rgba(99, 102, 241, 0.05)' : 'none',
                    background: 'rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'inline-flex',
                    margin: '0 auto',
                    alignItems: 'center'
                  }}
                >
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    const hasValue = idx < enteredPin.length;
                    return (
                      <div 
                        key={idx} 
                        className={`dot-pin ${hasValue ? 'filled' : ''}`}
                        style={{
                          width: '32px',
                          height: '40px',
                          borderRadius: '8px',
                          border: '1.5px solid rgba(255, 255, 255, 0.08)',
                          background: hasValue ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '16px',
                          fontWeight: '800',
                          color: hasValue ? '#818cf8' : '#4b5563',
                          boxShadow: hasValue ? '0 0 15px rgba(99, 102, 241, 0.25)' : 'none',
                          borderColor: hasValue ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: hasValue ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        {hasValue ? enteredPin[idx] : '•'}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rotary wheel base assembly */}
              <div className="rotary-wheel-housing">
                <div className="accent-ring-dash"></div>

                {/* The spinning wheel body */}
                <div 
                  ref={wheelRef}
                  className="rotary-wheel-body rotary-wheel-elem"
                >
                  {/* Dynamic digital nodes */}
                  {Object.keys(DIGIT_ANGLES).map((digit) => {
                    const pos = getDigitPositions(digit);
                    return (
                      <div 
                        key={digit}
                        className={`digit-circle-node ${themeMode === 'light' ? 'dial-button-light' : 'dial-button-dark'}`}
                        style={{ left: pos.left, top: pos.top }}
                        onMouseDown={(e) => startDialDrag(e, digit, DIGIT_ANGLES[digit])}
                        onTouchStart={(e) => startDialDrag(e, digit, DIGIT_ANGLES[digit])}
                        onClick={() => autoDial(digit)}
                      >
                        {digit}
                      </div>
                    );
                  })}

                  {/* Metal cap visual ring core */}
                  <div className="metallic-center-core">
                    <div className="metallic-inner-pulse">
                      <div className="inner-glow-dot"></div>
                    </div>
                  </div>
                </div>

                {/* Mechanical Stopper element */}
                <div 
                  className={`metal-stopper-anchor ${reachedStopper.current ? 'highlighted' : ''}`}
                  style={getStopperStyles()}
                >
                  <div className="stopper-fork-pointer"></div>
                </div>
              </div>

              {/* Delete / Clear Actions row */}
              <div className="action-panel-footer" style={{ padding: '0px', gap: '16px' }}>
                <button 
                  onClick={handleClear}
                  className="action-footer-btn"
                  style={{ flex: 1 }}
                >
                  <RefreshCw size={13} className="text-indigo-400" />
                  Clear
                </button>
                <button 
                  onClick={handleDelete}
                  className="action-footer-btn"
                  style={{ flex: 1 }}
                >
                  <Trash2 size={13} className="text-indigo-400" />
                  Delete
                </button>
              </div>
            </>
          ) : (
            /* VIEW 2: SYNTHESIZER SYSTEM CONFIGURATION */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
              
              {/* Sound engines switches */}
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#8888aa', letterSpacing: '0.05em' }}>Sound Engine Theme</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {(['mechanical', 'retro', 'silent'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleSoundThemeSelect(theme)}
                      className={`tab-select-btn ${soundTheme === theme ? 'active' : ''}`}
                      style={{ fontSize: '11px', textTransform: 'capitalize' }}
                    >
                      {theme === 'retro' ? 'Retro 8-Bit' : theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gain Volume Slider */}
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#8888aa', marginBottom: '12px', letterSpacing: '0.05em' }}>
                  <span>Synthesizer Gain</span>
                  <span style={{ color: '#818cf8', fontFamily: 'monospace' }}>{feedbackVolume}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Volume2 size={16} className="text-slate-500" />
                  <input 
                    type="range" 
                    min={0}
                    max={100}
                    value={feedbackVolume}
                    onChange={(e) => setFeedbackVolume(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#6366f1', height: '4px', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
