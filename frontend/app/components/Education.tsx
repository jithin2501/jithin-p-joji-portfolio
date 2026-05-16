'use client';
import { useEffect } from 'react';
import {
    Sparkles, Code2, BookOpen, Award, Layers,
    GraduationCap, Book, Pencil, Building2, MapPin,
    CheckCircle, Edit3
} from 'lucide-react';

import '../style/Education.css';

const Education = () => {
    // 3D Tilt Logic for Cards
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.transform = `perspective(1000px) rotateX(${(y - rect.height / 2) / -15}deg) rotateY(${(x - rect.width / 2) / 15}deg) translateY(-5px)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };

    // Scroll Reveal Logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).style.opacity = '1';
                    (entry.target as HTMLElement).style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll('.edu-reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="education-section" id="education">
            <div className="edu-header">
                <div className="edu-top-tag">Academic Path</div>
                <h1 className="edu-h1">
                    Educational <span className="gradient-text">Journey</span>
                </h1>
            </div>

            <div className="edu-container">
                {/* Left Section */}
                <div className="edu-intro-column">
                    <p className="edu-description">
                        A strong academic foundation that shaped <br />
                        my problem-solving mindset and passion <br />
                        for technology.
                    </p>

                    <div className="edu-highlights-container">
                        <div className="edu-highlight-row">
                            <div className="edu-highlight-dot">
                                <Sparkles size={14} />
                            </div>
                            <span>Consistent Academic Excellence</span>
                        </div>
                        <div className="edu-highlight-row text-white">
                            <div className="edu-highlight-dot bg-cyan-soft">
                                <Code2 size={14} />
                            </div>
                            <span>Major Focus in Software Engineering</span>
                        </div>
                        <div className="edu-highlight-row text-white">
                            <div className="edu-highlight-dot bg-green-soft">
                                <BookOpen size={14} />
                            </div>
                            <span>10+ Technical Semester Projects</span>
                        </div>
                        <div className="edu-highlight-row text-white">
                            <div className="edu-highlight-dot bg-pink-soft">
                                <Award size={14} />
                            </div>
                            <span>Consistent Dean&apos;s List Awardee</span>
                        </div>
                        <div className="edu-highlight-row text-white">
                            <div className="edu-highlight-dot bg-purple-soft">
                                <Layers size={14} />
                            </div>
                            <span>Specialized in Full-Stack Dev</span>
                        </div>
                    </div>

                    <div className="edu-stats-grid">
                        <div className="edu-stat-item">
                            <div className="edu-stat-icon bg-purple-soft">
                                <GraduationCap size={20} />
                            </div>
                            <div className="edu-stat-text-box">
                                <span className="edu-stat-label">B.Tech</span>
                                <span className="edu-stat-value">8.5</span>
                            </div>
                        </div>
                        <div className="edu-stat-item">
                            <div className="edu-stat-icon bg-cyan-soft">
                                <Book size={20} />
                            </div>
                            <div className="edu-stat-text-box">
                                <span className="edu-stat-label">12th (PCMB)</span>
                                <span className="edu-stat-value">91%</span>
                            </div>
                        </div>
                        <div className="edu-stat-item">
                            <div className="edu-stat-icon bg-green-soft">
                                <Pencil size={20} />
                            </div>
                            <div className="edu-stat-text-box">
                                <span className="edu-stat-label">10th</span>
                                <span className="edu-stat-value">80%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Timeline */}
                <div className="edu-timeline-column">
                    {/* Timeline Item 1 */}
                    <div className="edu-timeline-item">
                        <div className="edu-timeline-marker marker-purple">
                            <div className="edu-marker-date">2022 - 2026</div>
                            <div className="edu-marker-circle">
                                <div className="edu-marker-icon-box">
                                    <GraduationCap size={24} />
                                </div>
                            </div>
                        </div>
                        <div
                            className="edu-card edu-reveal"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="edu-card-header">
                                <div className="edu-card-title-group">
                                    <div className="edu-school-icon-box">
                                        <Building2 size={24} color="#7c5cff" />
                                    </div>
                                    <div>
                                        <h3>B.Tech in Computer Science & Engineering</h3>
                                        <div className="edu-school-name">Visvesvaraya Technological University</div>
                                        <div className="edu-location-info">
                                            <MapPin size={12} />
                                            Belagavi, Karnataka
                                        </div>
                                    </div>
                                </div>
                                <div className="edu-score-badge color-purple">8.5 CGPA</div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Item 2 */}
                    <div className="edu-timeline-item">
                        <div className="edu-timeline-marker marker-blue">
                            <div className="edu-marker-date">2020 - 2022</div>
                            <div className="edu-marker-circle">
                                <div className="edu-marker-icon-box">
                                    <Book size={24} />
                                </div>
                            </div>
                        </div>
                        <div
                            className="edu-card edu-reveal"
                            style={{ transitionDelay: '0.1s' }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="edu-card-header">
                                <div className="edu-card-title-group">
                                    <div className="edu-school-icon-box">
                                        <BookOpen size={24} color="#00e5ff" />
                                    </div>
                                    <div>
                                        <h3>Higher Secondary (12th)</h3>
                                        <div className="edu-school-name color-cyan">St. Thomas HSS Thomapuram</div>
                                        <div className="edu-location-info">
                                            <CheckCircle size={12} />
                                            Science (PCMB)
                                        </div>
                                    </div>
                                </div>
                                <div className="edu-score-badge color-cyan">91%</div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Item 3 */}
                    <div className="edu-timeline-item">
                        <div className="edu-timeline-marker marker-green">
                            <div className="edu-marker-date">2019 - 2020</div>
                            <div className="edu-marker-circle">
                                <div className="edu-marker-icon-box">
                                    <Pencil size={24} />
                                </div>
                            </div>
                        </div>
                        <div
                            className="edu-card edu-reveal"
                            style={{ transitionDelay: '0.2s' }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="edu-card-header">
                                <div className="edu-card-title-group">
                                    <div className="edu-school-icon-box">
                                        <Edit3 size={24} color="#00ff88" />
                                    </div>
                                    <div>
                                        <h3>Secondary (10th)</h3>
                                        <div className="edu-school-name color-green">ICSE Board</div>
                                        <div className="edu-location-info">
                                            <CheckCircle size={12} />
                                            Auxilium School ICSE Varakkad
                                        </div>
                                    </div>
                                </div>
                                <div className="edu-score-badge color-green">80%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Education;
