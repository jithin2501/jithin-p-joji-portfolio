'use client';
import { useEffect, useRef, useState } from 'react';
import {
    Calendar, Code, Smile,
    ShoppingCart, Rocket, MapPin, Briefcase, LucideIcon
} from 'lucide-react';
import '../style/Experience.css';

interface ExperienceEntry {
    id: string;
    title: string;
    company: string;
    date_from: string;
    date_to: string;
    desc: string;
    tags: string[];
    location: string;
    dot_color: string;
}

interface SettingsData {
    hero: {
        projects: string;
        experience: string;
        commits: string;
        satisfaction: string;
    };
}

/* ── DEFAULT BACKUP DATA ──────────────────────── */
const defaultEntries: ExperienceEntry[] = [
    {
        id: 'default-1',
        dot_color: '#818cf8',
        date_from: 'Mar 2026',
        date_to: 'May 2026',
        title: 'Full Stack Developer Intern',
        company: 'RP Studios',
        desc: 'Developed a MERN e-commerce platform with Razorpay, Shiprocket, and Firebase integration. Managed containerized deployments using AWS and Docker.',
        tags: ['MERN Stack', 'Razorpay', 'AWS Docker', 'Shiprocket', 'Firebase Auth'],
        location: 'Hebbal, Bangalore',
    },
    {
        id: 'default-2',
        dot_color: '#f59e0b',
        date_from: 'Sep 2025',
        date_to: 'Present',
        title: 'Freelance Full Stack Developer',
        company: 'Self-Employed',
        desc: 'Specializing in MERN stack development for startups and small businesses. Delivering end-to-end solutions from conceptualization to deployment.',
        tags: ['MongoDB', 'Express', 'React', 'Node', 'HTML', 'CSS', 'JS', 'TailwindCSS', 'EJS'],
        location: 'Bangalore, Kerala',
    },
];

/* ── HELPER UTILITIES ─────────────────────────── */
const parseNumber = (str: string | undefined, fallback: number): number => {
    if (!str) return fallback;
    const num = parseInt(str.replace(/\D/g, ''));
    return isNaN(num) ? fallback : num;
};

const getEntryIcon = (title: string, index: number): LucideIcon => {
    const t = title.toLowerCase();
    if (t.includes('shop') || t.includes('e-commerce') || t.includes('intern')) return ShoppingCart;
    if (t.includes('freelance') || t.includes('self') || t.includes('lead')) return Rocket;
    if (t.includes('code') || t.includes('developer') || t.includes('engineer')) return Code;
    
    const icons = [Briefcase, Code, Rocket, ShoppingCart];
    return icons[index % icons.length];
};

const getDotShadow = (hex: string): string => {
    if (hex && hex.startsWith('#')) {
        try {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, 0.7)`;
        } catch (e) {
            // fallback
        }
    }
    return 'rgba(129, 140, 248, 0.7)';
};

const rowColors = ['#818cf8', '#f59e0b', '#14b8a6', '#f43f5e', '#a78bfa'];

const getRowColor = (index: number): string => {
    return rowColors[index % rowColors.length];
};

/* ── ANIMATED COUNTER ─────────────────────────── */
function useCounter(target: number, active: boolean) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!active) return;
        let current = 0;
        const step = target / (2000 / 16);
        const tick = () => {
            current += step;
            if (current < target) { setVal(Math.floor(current)); requestAnimationFrame(tick); }
            else setVal(target);
        };
        tick();
    }, [active, target]);
    return val;
}

/* ── STAT ROW ─────────────────────────────────── */
function StatRow({ icon: Icon, color, target, label, active, delay }: { icon: LucideIcon; color: string; target: number; label: string; active: boolean; delay: number }) {
    const count = useCounter(target, active);
    return (
        <div
            className="stat-row-item"
            style={{
                opacity: active ? 1 : 0,
                transform: active ? 'translateX(0)' : 'translateX(-20px)',
                transitionDelay: `${delay}ms`,
            }}
        >
            <div className="stat-icon-box">
                <Icon size={22} color={color} />
            </div>
            <div className="stat-text-column">
                <div className="stat-value-group">
                    <span className="stat-number" style={{ color: color }}>
                        {count}
                    </span>
                    <span className="stat-plus" style={{ color: color }}>+</span>
                </div>
                <div className="stat-label">
                    {label}
                </div>
            </div>
        </div>
    );
}

/* ── ENTRY CARD ───────────────────────────────── */
function EntryCard({ e, index }: { e: ExperienceEntry; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const Icon = getEntryIcon(e.title, index);
    const themeColor = getRowColor(index);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.1 });
        if (cardRef.current) obs.observe(cardRef.current);
        return () => obs.disconnect();
    }, []);

    const onMouseMove = (ev: React.MouseEvent<HTMLDivElement>) => {
        const rect = ev.currentTarget.getBoundingClientRect();
        const x = ev.clientX - rect.left, y = ev.clientY - rect.top;
        ev.currentTarget.style.transform = `perspective(1000px) rotateX(${(y - rect.height / 2) / -20}deg) rotateY(${(x - rect.width / 2) / 20}deg) translateY(-2px)`;
    };
    const onMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };

    const isSelfEmployed = e.company.toLowerCase().includes('self') || e.company.toLowerCase().includes('freelance');

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="entry-card"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
            }}
        >
            <div className="card-inner">
                <div className="card-icon-box" style={{ borderColor: `${themeColor}22`, background: `rgba(255,255,255,0.01)` }}>
                    <Icon size={28} color={themeColor} />
                </div>

                <div className="card-content-main">
                    <div className="card-header-top">
                        <div className="card-title-group">
                            <h3 className="card-title">{e.title}</h3>
                            <span className="card-separator">|</span>
                            <span className="card-company" style={{ color: themeColor }}>{e.company}</span>
                        </div>
                        
                        {isSelfEmployed ? (
                            <div className="card-badge" style={{
                                color: themeColor,
                                borderColor: `${themeColor}33`,
                                background: `${themeColor}0d`
                            }}>
                                SELF EMPLOYED
                            </div>
                        ) : e.location ? (
                            <div className="card-location">
                                <MapPin size={12} />
                                {e.location}
                            </div>
                        ) : null}
                    </div>

                    <p className="card-description">
                        {e.desc}
                    </p>

                    {e.tags && e.tags.length > 0 && (
                        <div className="card-tags">
                            {e.tags.map(tag => (
                                <span key={tag} className="card-tag">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── MAIN COMPONENT ───────────────────────────── */
export default function Experience() {
    const sectionRef = useRef<HTMLDivElement>(SectionRefType);
    const [active, setActive] = useState(false);

    const colRef = useRef<HTMLDivElement>(null);
    const entriesRef = useRef<HTMLDivElement>(null);
    const [dots, setDots] = useState<{ top: number; color: string; shadow: string }[]>([]);

    // API state
    const [entries, setEntries] = useState<ExperienceEntry[]>([]);
    const [settings, setSettings] = useState<SettingsData | null>(null);

    const sectionRefTyped = sectionRef as React.RefObject<HTMLDivElement>;

    useEffect(() => {
        // Fetch experience and settings data
        const fetchData = async () => {
            try {
                const expResponse = await fetch('http://localhost:8080/api/experiences/');
                if (expResponse.ok) {
                    const expData = await expResponse.json();
                    setEntries(expData);
                }

                const settingsResponse = await fetch('http://localhost:8080/api/settings/');
                if (settingsResponse.ok) {
                    const settingsData = await settingsResponse.json();
                    setSettings(settingsData);
                }
            } catch (err) {
                console.error('Failed to fetch dynamic experience timeline data:', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setActive(true); obs.disconnect(); }
        }, { threshold: 0.2 });
        if (sectionRefTyped.current) obs.observe(sectionRefTyped.current);
        return () => obs.disconnect();
    }, [sectionRefTyped]);

    // Track dynamic dot layout positioning
    const activeEntries = entries.length > 0 ? entries : defaultEntries;

    useEffect(() => {
        if (!active) return;
        const position = () => {
            if (!colRef.current || !entriesRef.current) return;
            const colRect = colRef.current.getBoundingClientRect();
            const entryRows = entriesRef.current.querySelectorAll<HTMLElement>('.exp-entry-row');
            setDots(Array.from(entryRows).map(row => ({
                top: row.getBoundingClientRect().top - colRect.top + 20,
                color: row.dataset.dotColor ?? '#818cf8',
                shadow: row.dataset.dotShadow ?? 'rgba(129,140,248,0.7)',
            })));
        };
        setTimeout(position, 200);
        window.addEventListener('resize', position);
        return () => window.removeEventListener('resize', position);
    }, [active, activeEntries]);

    // Extract dynamic counter statistics from active settings collection
    const yearsExpTarget = parseNumber(settings?.hero?.experience, 1);
    const projectsTarget = parseNumber(settings?.hero?.projects, 15);
    const clientsTarget = parseNumber(settings?.hero?.satisfaction, 10);

    return (
        <section
            id="experience"
            ref={sectionRefTyped}
            className="experience-section"
        >
            <div className="experience-container">

                {/* ── HEADER ── */}
                <div className="exp-header">
                    <div className="exp-tag">
                        <span className="exp-tag-line" />
                        Experience
                        <span className="exp-tag-line" />
                    </div>
                    <h2 className="exp-title">
                        My Web Development{' '}
                        <span className="exp-gradient-text">
                            Experience
                        </span>
                    </h2>
                </div>

                {/* ── 3-COLUMN GRID ── */}
                <div className="exp-grid">

                    {/* Col 1 — Sidebar stats */}
                    <aside className="exp-sidebar">
                        <div className="sidebar-content">
                            <StatRow 
                                icon={Calendar} 
                                color="#818cf8" 
                                target={yearsExpTarget} 
                                label="Years Experience" 
                                active={active} 
                                delay={0} 
                            />
                            <StatRow 
                                icon={Code} 
                                color="#f59e0b" 
                                target={projectsTarget} 
                                label="Projects Completed" 
                                active={active} 
                                delay={150} 
                            />
                            <StatRow 
                                icon={Smile} 
                                color="#14b8a6" 
                                target={clientsTarget} 
                                label="Happy Clients" 
                                active={active} 
                                delay={300} 
                            />
                        </div>
                    </aside>

                    {/* Col 2 — Timeline Line */}
                    <div ref={colRef} className="timeline-col">
                        <div className="timeline-track">
                            <div
                                className="timeline-fill"
                                style={{ height: active ? '100%' : '0%' }}
                            />
                        </div>

                        {dots.map((d, i) => {
                            const color = getRowColor(i);
                            return (
                                <div key={i} className="timeline-dot" style={{
                                    top: d.top,
                                    background: color,
                                    boxShadow: `0 0 0 4px ${color}22, 0 0 15px ${getDotShadow(color)}`,
                                }} />
                            );
                        })}
                    </div>

                    {/* Col 3 — Date + Cards */}
                    <div className="exp-content-col">
                        <div ref={entriesRef} className="entries-list">
                            {activeEntries.map((e, index) => {
                                const color = getRowColor(index);
                                return (
                                    <div
                                        key={e.id || index}
                                        className="exp-entry-row"
                                        data-dot-color={color}
                                        data-dot-shadow={getDotShadow(color)}
                                    >
                                        <div className="entry-date-box">
                                            <p className="entry-date-from" style={{ color: color }}>{e.date_from}</p>
                                            <p className="entry-date-to">
                                                {e.date_to}
                                            </p>
                                        </div>

                                        <EntryCard e={e} index={index} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
const SectionRefType = null as any;