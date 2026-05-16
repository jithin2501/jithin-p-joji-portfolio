'use client';
import React, { useState, useEffect } from 'react';
import '../style/DownloadButton.css';

export default function DownloadButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const circumference = 2 * Math.PI * 18; // ~113.1

  const handleDownload = () => {
    if (status !== 'idle') return;

    setStatus('loading');
    setProgress(0);

    const duration = 3000; // 3 seconds
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setStatus('done');
          
          // Reset to idle after 10 seconds
          setTimeout(() => {
            setStatus('idle');
            setProgress(0);
          }, 10000);
          
          return 100;
        }
        return prev + increment;
      });
    }, interval);
  };

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="download-btn-container">
      <label 
        className={`download-label ${status === 'loading' ? 'loading' : ''} ${status === 'done' ? 'done' : ''}`}
        onClick={handleDownload}
      >
        <span className="download-circle">
          <svg className="progress-ring" width="44" height="44">
            <circle
              className="progress-ring__circle"
              stroke="white"
              strokeWidth="4"
              fill="transparent"
              r="18"
              cx="22"
              cy="22"
              style={{ strokeDashoffset: offset, strokeDasharray: circumference }}
            />
          </svg>
          
          <svg
            className="download-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19V5m0 14-4-4m4 4 4-4"
            ></path>
          </svg>
        </span>

        <p className="download-title">Download Resume</p>
        
        <div className="download-right-content">
          <div className="download-counter-wrapper">
            <span>{Math.floor(progress)}%</span>
            <span>Done</span>
          </div>
        </div>
        
        <p className="download-status-text">Done</p>
      </label>
    </div>
  );
}
