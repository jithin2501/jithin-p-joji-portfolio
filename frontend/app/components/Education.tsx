'use client';
import { useEffect, useState } from 'react';
import {
    Sparkles, Code2, BookOpen, Award, Layers,
    GraduationCap, Book, Pencil, Building2, MapPin,
    CheckCircle, Edit3
} from 'lucide-react';

import '../style/Education.css';

interface AcademicEntry {
    id: string;
    title: string;
    school: string;
    location: string;
    date_range: string;
    score: string;
    color_theme: string;
    icon_type: string;
}

interface AcademicSettings {
    description: string;
    highlights: string[];
    stat1_label: string;
    stat1_value: string;
    stat2_label: string;
    stat2_value: string;
    stat3_label: string;
    stat3_value: string;
}

const Education = () => {
    const [academics, setAcademics] = useState<AcademicEntry[]>([]);
    const [settings, setSettings] = useState<AcademicSettings>({
        description: "A strong academic foundation that shaped\nmy problem-solving mindset and passion\nfor technology.",
        highlights: [
            "Consistent Academic Excellence",
            "Major Focus in Software Engineering",
            "10+ Technical Semester Projects",
            "Consistent Dean's List Awardee",
            "Specialized in Full-Stack Dev"
        ],
        stat1_label: "B.Tech",
        stat1_value: "8.5",
        stat2_label: "12th (PCMB)",
        stat2_value: "91%",
        stat3_label: "10th",
        stat3_value: "80%"
    });
    const [loading, setLoading] = useState(true);

    // Fetch dynamic details
    useEffect(() => {
        const fetchAcademicData = async () => {
            try {
                const [acadRes, settingsRes] = await Promise.all([
                    fetch('http://localhost:8080/api/academics/'),
                    fetch('http://localhost:8080/api/academics/settings')
                ]);

                if (acadRes.ok) {
                    const acadData = await acadRes.json();
                    if (Array.isArray(acadData) && acadData.length > 0) {
                        setAcademics(acadData);
                    }
                }
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json();
                    if (settingsData && settingsData.description) {
                        setSettings(settingsData);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch academic details', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAcademicData();
    }, []);

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
    }, [academics]); // Rerun observer when academics data renders

    const getHighlightIcon = (idx: number) => {
        switch (idx) {
            case 0: return <Sparkles size={14} />;
            case 1: return <Code2 size={14} />;
            case 2: return <BookOpen size={14} />;
            case 3: return <Award size={14} />;
            default: return <Layers size={14} />;
        }
    };

    const getHighlightColorClass = (idx: number) => {
        switch (idx) {
            case 0: return "";
            case 1: return "bg-cyan-soft";
            case 2: return "bg-green-soft";
            case 3: return "bg-pink-soft";
            default: return "bg-purple-soft";
        }
    };

    const getStatIcon = (idx: number) => {
        switch (idx) {
            case 0: return <GraduationCap size={20} />;
            case 1: return <Book size={20} />;
            default: return <Pencil size={20} />;
        }
    };

    const getStatColorClass = (idx: number) => {
        switch (idx) {
            case 0: return "bg-purple-soft";
            case 1: return "bg-cyan-soft";
            default: return "bg-green-soft";
        }
    };

    // Fallback static milestones if database is empty
    const staticMilestones: AcademicEntry[] = [
        {
            id: 'static-1',
            title: 'B.Tech in Computer Science & Engineering',
            school: 'Visvesvaraya Technological University',
            location: 'Belagavi, Karnataka',
            date_range: '2022 - 2026',
            score: '8.5 CGPA',
            color_theme: 'purple',
            icon_type: 'graduation'
        },
        {
            id: 'static-2',
            title: 'Higher Secondary (12th)',
            school: 'St. Thomas HSS Thomapuram',
            location: 'Science (PCMB)',
            date_range: '2020 - 2022',
            score: '91%',
            color_theme: 'blue',
            icon_type: 'book'
        },
        {
            id: 'static-3',
            title: 'Secondary (10th)',
            school: 'ICSE Board',
            location: 'Auxilium School ICSE Varakkad',
            date_range: '2019 - 2020',
            score: '80%',
            color_theme: 'green',
            icon_type: 'pencil'
        }
    ];

    const formatDescription = (desc: string) => {
        if (!desc) return '';
        // Highly robust normalization (lowercase, alphanumeric only) to match the default text reliably
        const normalized = desc.toLowerCase().replace(/[^a-z0-9]/g, '');
        const target = "astrongacademicfoundationthatshapedmyproblemsolvingmindsetandpassionfortechnology";
        if (normalized === target) {
            return (
                <>
                    A strong academic foundation that shaped <br />
                    my problem-solving mindset and passion <br />
                    for technology.
                </>
            );
        }
        return desc;
    };

    const activeMilestones = academics.length > 0 ? academics : staticMilestones;

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
                    <p className="edu-description" style={{ whiteSpace: 'pre-line' }}>
                        {formatDescription(settings.description)}
                    </p>

                    <div className="edu-highlights-container">
                        {settings.highlights.slice(0, 5).map((hl, idx) => (
                            <div key={idx} className="edu-highlight-row text-white">
                                <div className={`edu-highlight-dot ${getHighlightColorClass(idx)}`}>
                                    {getHighlightIcon(idx)}
                                </div>
                                <span>{hl}</span>
                            </div>
                        ))}
                    </div>

                    <div className="edu-stats-grid">
                        <div className="edu-stat-item">
                            <div className={`edu-stat-icon ${getStatColorClass(0)}`}>
                                {getStatIcon(0)}
                            </div>
                            <div className="edu-stat-text-box">
                                <span className="edu-stat-label">{settings.stat1_label}</span>
                                <span className="edu-stat-value">{settings.stat1_value}</span>
                            </div>
                        </div>
                        <div className="edu-stat-item">
                            <div className={`edu-stat-icon ${getStatColorClass(1)}`}>
                                {getStatIcon(1)}
                            </div>
                            <div className="edu-stat-text-box">
                                <span className="edu-stat-label">{settings.stat2_label}</span>
                                <span className="edu-stat-value">{settings.stat2_value}</span>
                            </div>
                        </div>
                        <div className="edu-stat-item">
                            <div className={`edu-stat-icon ${getStatColorClass(2)}`}>
                                {getStatIcon(2)}
                            </div>
                            <div className="edu-stat-text-box">
                                <span className="edu-stat-label">{settings.stat3_label}</span>
                                <span className="edu-stat-value">{settings.stat3_value}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Dynamic Timeline */}
                <div className="edu-timeline-column">
                    {activeMilestones.map((acad, idx) => {
                        const isBlue = acad.color_theme === 'blue' || acad.color_theme === 'cyan';
                        const isGreen = acad.color_theme === 'green';
                        const themePrefix = isBlue ? 'blue' : isGreen ? 'green' : 'purple';
                        
                        return (
                            <div key={acad.id} className="edu-timeline-item">
                                <div className={`edu-timeline-marker marker-${themePrefix}`}>
                                    <div className="edu-marker-date">{acad.date_range}</div>
                                    <div className="edu-marker-circle">
                                        <div className="edu-marker-icon-box">
                                            {acad.icon_type === 'book' ? <Book size={24} /> :
                                             acad.icon_type === 'pencil' ? <Pencil size={24} /> :
                                             acad.icon_type === 'award' ? <Award size={24} /> :
                                             <GraduationCap size={24} />}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="edu-card edu-reveal"
                                    style={{ transitionDelay: `${idx * 0.1}s` }}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="edu-card-header">
                                        <div className="edu-card-title-group">
                                            <div className="edu-school-icon-box">
                                                {themePrefix === 'purple' ? <Building2 size={24} color="#7c5cff" /> :
                                                 themePrefix === 'blue' ? <BookOpen size={24} color="#00e5ff" /> :
                                                 <Edit3 size={24} color="#00ff88" />}
                                            </div>
                                            <div>
                                                <h3>{acad.title}</h3>
                                                <div className={`edu-school-name ${themePrefix === 'blue' ? 'color-cyan' : themePrefix === 'green' ? 'color-green' : ''}`}>
                                                    {acad.school}
                                                </div>
                                                <div className="edu-location-info">
                                                    {themePrefix === 'purple' ? <MapPin size={12} /> : <CheckCircle size={12} />}
                                                    {acad.location}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`edu-score-badge color-${themePrefix === 'blue' ? 'cyan' : themePrefix === 'green' ? 'green' : 'purple'}`}>
                                            {acad.score}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Education;
