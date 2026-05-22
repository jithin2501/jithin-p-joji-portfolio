'use client';
import React, { useState, useEffect } from 'react';
import '../style/DownloadButton.css';

export default function DownloadButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const circumference = 2 * Math.PI * 18; // ~113.1

  const handleDownload = async () => {
    if (status !== 'idle') return;

    setStatus('loading');
    setProgress(0);

    let activeResumeData: { name: string; base64_data: string } | null = null;
    let apiCompleted = false;
    let animationCompleted = false;

    // Fetch active resume from FastAPI/MongoDB
    const fetchActiveResume = async () => {
      try {
        const response = await fetch('/api/resumes/active');
        if (response.ok) {
          const data = await response.json();
          activeResumeData = data;
        } else {
          console.warn('No active resume found in backend.');
        }
      } catch (err) {
        console.error('Failed to fetch active resume:', err);
      } finally {
        apiCompleted = true;
        checkCompletion();
      }
    };

    fetchActiveResume();

    // Start visual loader animation
    const duration = 2000; // 2 seconds snappy animation
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          animationCompleted = true;
          checkCompletion();
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    const checkCompletion = () => {
      if (apiCompleted && animationCompleted) {
        if (activeResumeData) {
          setStatus('done');
          
          // Trigger browser PDF download
          const link = document.createElement('a');
          link.href = activeResumeData.base64_data;
          link.download = `${activeResumeData.name}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Reset to idle after 6 seconds
          setTimeout(() => {
            setStatus('idle');
            setProgress(0);
          }, 6000);
        } else {
          alert('No active resume is configured in the Admin Panel yet. Please upload and activate one in the Resume Manager!');
          setStatus('idle');
          setProgress(0);
        }
      }
    };
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
