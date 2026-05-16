'use client';
import { useEffect, useRef, useState } from 'react';
import {
    Calendar, Code, Smile,
    ShoppingCart, Rocket, MapPin,
} from 'lucide-react';
import '../style/Experience.css';

/* ── DATA ─────────────────────────────────────── */
const stats = [
    { icon: Calendar, color: '#818cf8', target: 1, label: 'Years Experience' },
    { icon: Code, color: '#f59e0b', target: 15, label: 'Projects Completed' },
    { icon: Smile, color: '#14b8a6', target: 10, label: 'Happy Clients' },
];

const entries = [
    {
        dotColor: '#818cf8',
        dotShadow: 'rgba(129,140,248,0.7)',
        dateFrom: 'Mar 2026',
        dateTo: 'May 2026',
        dateColor: '#818cf8',
        icon: ShoppingCart,
        iconColor: '#818cf8',
        title: 'Full Stack Developer Intern',
        company: 'RP Studios',
        companyColor: 'var(--accent)',
        desc: 'Developed a MERN e-commerce platform with Razorpay, Shiprocket, and Firebase integration. Managed containerized deployments using AWS and Docker.',
        tags: ['MERN Stack', 'Razorpay', 'AWS Docker', 'Shiprocket', 'Firebase Auth'],
        meta: { type: 'location', value: 'Hebbal, Bangalore' },
    },
    {
        dotColor: '#f59e0b',
        dotShadow: 'rgba(245,158,11,0.7)',
        dateFrom: 'Sep 2025',
        dateTo: 'Present',
        dateColor: '#f59e0b',
        icon: Rocket,
        iconColor: '#f59e0b',
        title: 'Freelance Full Stack Developer',
        company: 'Self-Employed',
        companyColor: '#f59e0b',
        desc: 'Specializing in MERN stack development for startups and small businesses. Delivering end-to-end solutions from conceptualization to deployment.',
        tags: ['MongoDB', 'Express', 'React', 'Node', 'HTML', 'CSS', 'JS', 'TailwindCSS', 'EJS'],
        meta: { type: 'location', value: 'Bangalore, Kerala' },
    },
];

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
function StatRow({ s, active, delay }: { s: typeof stats[0]; active: boolean; delay: number }) {
    const count = useCounter(s.target, active);
    const Icon = s.icon;
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
                <Icon size={22} color={s.color} />
            </div>
            <div className="stat-text-column">
                <div className="stat-value-group">
                    <span className="stat-number" style={{ color: s.color }}>
                        {count}
                    </span>
                    <span className="stat-plus" style={{ color: s.color }}>+</span>
                </div>
                <div className="stat-label">
                    {s.label}
                </div>
            </div>
        </div>
    );
}

/* ── ENTRY CARD ───────────────────────────────── */
function EntryCard({ e }: { e: typeof entries[0] }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const Icon = e.icon;

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
                <div className="card-icon-box">
                    <Icon size={28} color={e.iconColor} />
                </div>

                <div className="card-content-main">
                    <div className="card-header-top">
                        <div className="card-title-group">
                            <h3 className="card-title">{e.title}</h3>
                            <span className="card-separator">|</span>
                            <span className="card-company" style={{ color: e.companyColor }}>{e.company}</span>
                        </div>
                        
                        {e.meta.type === 'location' ? (
                            <div className="card-location">
                                <MapPin size={12} />
                                {e.meta.value}
                            </div>
                        ) : (
                            <div className="card-badge">
                                {e.meta.value.replace('\n', ' ')}
                            </div>
                        )}
                    </div>

                    <p className="card-description">
                        {e.desc}
                    </p>

                    <div className="card-tags">
                        {e.tags.map(tag => (
                            <span key={tag} className="card-tag">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── MAIN COMPONENT ───────────────────────────── */
export default function Experience() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);

    const colRef = useRef<HTMLDivElement>(null);
    const entriesRef = useRef<HTMLDivElement>(null);
    const [dots, setDots] = useState<{ top: number; color: string; shadow: string }[]>([]);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setActive(true); obs.disconnect(); }
        }, { threshold: 0.2 });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

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
        setTimeout(position, 120);
        window.addEventListener('resize', position);
        return () => window.removeEventListener('resize', position);
    }, [active]);

    return (
        <section
            id="experience"
            ref={sectionRef}
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
                            {stats.map((s, i) => (
                                <StatRow key={s.label} s={s} active={active} delay={i * 150} />
                            ))}
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

                        {dots.map((d, i) => (
                            <div key={i} className="timeline-dot" style={{
                                top: d.top,
                                background: d.color,
                                boxShadow: `0 0 0 4px ${d.color}22, 0 0 15px ${d.color}aa`,
                            }} />
                        ))}
                    </div>

                    {/* Col 3 — Date + Cards */}
                    <div className="exp-content-col">
                        <div ref={entriesRef} className="entries-list">
                            {entries.map((e) => (
                                <div
                                    key={e.title}
                                    className="exp-entry-row"
                                    data-dot-color={e.dotColor}
                                    data-dot-shadow={e.dotShadow}
                                >
                                    <div className="entry-date-box">
                                        <p className="entry-date-from" style={{ color: e.dateColor }}>{e.dateFrom}</p>
                                        <p className="entry-date-to">
                                            {e.dateTo}
                                        </p>
                                    </div>

                                    <EntryCard e={e} />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}