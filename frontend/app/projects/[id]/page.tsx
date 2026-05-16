'use client';
import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ExternalLink,
  Calendar, Clock, User, 
  Tag, Settings, Layout,
  CheckCircle2, Rocket, Users,
  BarChart3, Zap, Smartphone,
  Info, Sparkles, BookOpen,
  Code2
} from 'lucide-react';
import '../../style/ProjectDetail.css';

const ProjectSlider = ({ images, title }: { images: string[], title: string }) => {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, isDragging]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setOffsetX(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setOffsetX(clientX - startX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    if (Math.abs(offsetX) > 100) {
      if (offsetX < 0) {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
    
    setIsDragging(false);
    setOffsetX(0);
  };

  return (
    <div 
      className={`project-slider-wrapper ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="slider-main">
        {images.map((img, i) => {
          let transform = 'none';
          let opacity = 0;
          let zIndex = 0;

          if (i === current) {
            transform = `translateX(${offsetX}px)`;
            opacity = 1;
            zIndex = 2;
          } else if (i === (current + 1) % images.length && offsetX < 0) {
            // Next slide peeking
            transform = `translateX(${window.innerWidth > 0 ? 100 : 0}% + ${offsetX}px)`;
            opacity = Math.abs(offsetX) / 500;
            zIndex = 1;
          }

          return (
            <div 
              key={i} 
              className={`slide ${i === current ? 'active' : ''}`}
              style={{ 
                transform: i === current ? `translateX(${offsetX}px)` : 'none',
                opacity: i === current ? 1 : 0,
                transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <img src={img} alt={`${title} slide ${i + 1}`} className="preview-img" draggable="false" />
            </div>
          );
        })}
      </div>
      
      <div className="slider-dots">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(i);
            }}
          />
        ))}
      </div>
    </div>
  );
};

// This would normally come from a CMS or API
const projectsData: Record<string, any> = {
  "1": {
    title: "Analytics Dashboard",
    subtitle: "PROJECT DETAILS",
    description: "A responsive analytics dashboard with real-time data visualization and reporting.",
    longDesc: "This Analytics Dashboard provides businesses with a powerful way to visualize their data. It features real-time charts, user activity tracking, and customizable reporting tools, all wrapped in a sleek, dark-themed interface. By leveraging modern visualization libraries and real-time data streaming, it empowers stakeholders to make data-driven decisions with confidence and speed.",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e90526354a?q=80&w=2000&auto=format&fit=crop"
    ],
    category: "Web Application",
    role: "Full Stack Developer",
    duration: "4 Weeks",
    completed: "March 2024",
    tools: "VS Code, Figma, Postman",
    methodology: "Scrum",
    features: [
      { title: "Real-time Data", desc: "Live updates using WebSocket technology.", icon: Zap },
      { title: "Custom Charts", desc: "Interactive visualizations with Recharts.", icon: BarChart3 },
      { title: "User Management", desc: "Complete RBAC (Role-Based Access Control).", icon: Users },
      { title: "Performance Monitoring", desc: "Track server-side performance metrics.", icon: Rocket },
      { title: "Responsive Layout", desc: "Optimized for desktop and tablet views.", icon: Layout },
      { title: "Export Reports", desc: "Download data in CSV and PDF formats.", icon: ExternalLink },
    ],
    techStack: [
      { name: "React.js", icon: "fab fa-react" },
      { name: "Node.js", icon: "fab fa-node-js" },
      { name: "MongoDB", icon: "fas fa-database" },
      { name: "Express.js", icon: "fas fa-server" },
      { name: "TypeScript", icon: "fas fa-code" },
      { name: "Tailwind CSS", icon: "fab fa-css3-alt" }
    ],
    learned: "Working on this dashboard taught me a lot about data handling and state management in complex React applications. I learned how to optimize rendering for large datasets and implement real-time features efficiently."
  },
  "2": {
    title: "Travel Website",
    subtitle: "PROJECT DETAILS",
    description: "A modern travel website UI with beautiful destinations and booking functionality.",
    longDesc: "This Travel Website was designed to provide users with an immersive booking experience. It features stunning destination galleries, a seamless booking flow, and integrated maps for trip planning. The platform prioritizes high-performance visuals and lightning-fast search capabilities to ensure travelers can find and book their dream vacations with ease and transparency.",
    images: [
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000&auto=format&fit=crop"
    ],
    category: "Web Application",
    role: "Frontend Developer",
    duration: "3 Weeks",
    completed: "April 2024",
    tools: "Figma, VS Code, Git",
    methodology: "Agile",
    features: [
      { title: "Destination Search", desc: "Advanced filtering for finding the perfect trip.", icon: Tag },
      { title: "Interactive Maps", desc: "Integrated Google Maps for location tracking.", icon: Smartphone },
      { title: "Booking System", desc: "Smooth multi-step booking and payment process.", icon: Settings },
      { title: "User Reviews", desc: "Community-driven feedback and ratings.", icon: Users },
      { title: "Mobile Optimized", desc: "First-class experience on mobile devices.", icon: Layout },
      { title: "Secure Checkout", desc: "Stripe integration for safe transactions.", icon: CheckCircle2 },
    ],
    techStack: [
      { name: "Next.js", icon: "fab fa-react" },
      { name: "Tailwind CSS", icon: "fab fa-css3-alt" },
      { name: "Framer Motion", icon: "fas fa-magic" },
      { name: "Clerk Auth", icon: "fas fa-user-shield" },
      { name: "Prisma", icon: "fas fa-database" },
      { name: "PostgreSQL", icon: "fas fa-server" }
    ],
    learned: "I focused heavily on user experience and animations in this project. Using Framer Motion helped me create smooth transitions that make the app feel premium. I also improved my skills in handling complex forms and state in Next.js."
  },
  "3": {
    title: "Task Manager App",
    subtitle: "PROJECT DETAILS",
    description: "A mobile task management app to boost productivity and organize daily tasks.",
    longDesc: "Task Manager is a productivity-focused app designed for individuals and small teams. It simplifies task tracking with a clean UI, priority levels, and smart notifications to ensure nothing falls through the cracks. Built with a focus on minimalism and efficiency, it provides a distraction-free environment for managing complex workflows and daily agendas.",
    images: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2000&auto=format&fit=crop"
    ],
    category: "Mobile Application",
    role: "UI/UX Designer & Dev",
    duration: "2 Weeks",
    completed: "February 2024",
    tools: "Figma, Flutter, Firebase",
    methodology: "Personal Project",
    features: [
      { title: "Smart Notifications", desc: "Timely reminders for upcoming deadlines.", icon: Zap },
      { title: "Priority Levels", desc: "Color-coded tasks based on importance.", icon: Tag },
      { title: "Cloud Sync", desc: "Instant sync across all your devices.", icon: Rocket },
      { title: "Dark Mode", desc: "Eye-friendly interface for late-night work.", icon: Sparkles },
      { title: "Offline Access", desc: "Work on your tasks even without internet.", icon: CheckCircle2 },
      { title: "Team Sharing", desc: "Share lists and tasks with friends.", icon: Users },
    ],
    techStack: [
      { name: "Flutter", icon: "fas fa-mobile-screen-button" },
      { name: "Dart", icon: "fas fa-code" },
      { name: "Firebase", icon: "fas fa-fire" },
      { name: "Provider", icon: "fas fa-box" },
      { name: "Hive", icon: "fas fa-database" },
      { name: "Git", icon: "fab fa-git-alt" }
    ],
    learned: "This project allowed me to explore Flutter and cross-platform development. I learned how to manage local storage for offline support and integrate Firebase for real-time data synchronization. Designing the UI was also a great exercise in mobile ergonomics."
  },
  "4": {
    title: "Eco-Friendly E-commerce",
    subtitle: "PROJECT DETAILS",
    description: "Sustainable shopping platform with focus on clean UI and smooth user experience.",
    longDesc: "This Eco-Friendly E-commerce platform was built to promote sustainable products. It features a minimalist design, carbon footprint tracking for shipments, and a highly optimized product discovery experience. By integrating ethical shopping practices with modern technology, it creates a unique marketplace where conscious consumers can shop with peace of mind.",
    images: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000&auto=format&fit=crop"
    ],
    category: "E-Commerce",
    role: "Full Stack Developer",
    duration: "5 Weeks",
    completed: "May 2024",
    tools: "Figma, VS Code, Strapi",
    methodology: "Agile",
    features: [
      { title: "Carbon Tracking", desc: "Estimate the footprint of your purchases.", icon: BarChart3 },
      { title: "Sustainable Filters", desc: "Filter products by eco-friendly criteria.", icon: Tag },
      { title: "One-Click Checkout", desc: "Optimized sales funnel for high conversion.", icon: Rocket },
      { title: "Product Story", desc: "Detailed info about the origin of items.", icon: BookOpen },
      { title: "Loyalty Program", desc: "Rewards for sustainable shopping habits.", icon: Users },
      { title: "Advanced Search", desc: "Fast and relevant product discovery.", icon: Zap },
    ],
    techStack: [
      { name: "React.js", icon: "fab fa-react" },
      { name: "Strapi", icon: "fas fa-leaf" },
      { name: "Tailwind CSS", icon: "fab fa-css3-alt" },
      { name: "Stripe", icon: "fab fa-stripe" },
      { name: "Redux Toolkit", icon: "fas fa-layer-group" },
      { name: "Cloudinary", icon: "fas fa-image" }
    ],
    learned: "Building this platform taught me the importance of performance in e-commerce. I learned how to implement server-side rendering for better SEO and use Redux for managing complex shopping cart states. I also gained experience in integrating headless CMS like Strapi."
  }
};

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const project = projectsData[resolvedParams.id] || projectsData["1"]; // Fallback for demo

  return (
    <div className="project-detail-page">
      <div className="detail-container">
        <div className="detail-grid">
          {/* Left Sidebar */}
          <aside className="detail-sidebar">
            <div className="detail-header">
              <span className="detail-tag">{project.subtitle}</span>
              <h1 className="detail-title">{project.title}</h1>
              
              <div className="detail-btns">
                <a href="#" className="visit-btn">
                  <Rocket size={18} />
                  Visit Live Site
                </a>
                <a href="#" className="github-outline-btn">
                  <i className="fab fa-github" style={{ fontSize: '18px' }} />
                  View on GitHub
                </a>
              </div>
            </div>

            <div className="detail-info-list">
              <div className="info-item">
                <Tag size={16} className="info-icon" />
                <span className="info-label">Category</span>
                <span className="info-value">{project.category}</span>
              </div>
              <div className="info-item">
                <Clock size={16} className="info-icon" />
                <span className="info-label">Duration</span>
                <span className="info-value">{project.duration}</span>
              </div>
              <div className="info-item">
                <CheckCircle2 size={16} className="info-icon" />
                <span className="info-label">Completed</span>
                <span className="info-value">{project.completed}</span>
              </div>
              <div className="info-item">
                <Zap size={16} className="info-icon" />
                <span className="info-label">Methodology</span>
                <span className="info-value">{project.methodology}</span>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="detail-main-content">
            <div className="preview-mockup">
              <ProjectSlider images={project.images} title={project.title} />
            </div>
          </main>
        </div>

        {/* Alignment Row: About + Features */}
        <div className="middle-section-header-row">
          <h3 className="section-header">
            <Info size={20} />
            About {project.title}
          </h3>
          <h3 className="section-header">
            <Sparkles size={20} />
            Key Features
          </h3>
        </div>

        <div className="detail-middle-row">
          <section className="about-project-col">
            <p className="about-text">{project.longDesc}</p>
          </section>

          <section className="features-section-col">
            <div className="features-grid">
              {project.features.map((feature: any, i: number) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="feature-card">
                    <div className="feature-icon-box">
                      <Icon size={24} />
                    </div>
                    <div className="feature-content">
                      <h4>{feature.title}</h4>
                      <p>{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Bottom Row */}
        <div className="detail-bottom-row">
          <div className="bottom-box">
            <h3 className="section-header">
              <Code2 size={22} />
              Tech Stack
            </h3>
            <div className="tech-stack-grid">
              {project.techStack.map((tech: any, i: number) => (
                <div key={i} className="tech-badge-detail">
                  <i className={tech.icon} />
                  {tech.name}
                </div>
              ))}
            </div>
          </div>

          <div className="bottom-box">
            <h3 className="section-header">
              <BookOpen size={22} />
              What I Learned
            </h3>
            <p className="learned-text">{project.learned}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
