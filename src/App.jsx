import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Zap, 
  Terminal, 
  Code2, 
  ShoppingCart, 
  Home as HomeIcon, 
  Globe, 
  BookOpen, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  ArrowRight,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeBlogPost, setActiveBlogPost] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Asset paths (Relative for seamless subdir deployment)
  const logoPath = "logo.png";
  const profilePicPath = "portfolio_assets/success.jpg";

  // Mock Blog Posts data directly from Success's developer log
  const blogPosts = [
    {
      id: 1,
      title: "Architecting Real-Time Sockets & Sync for Bharatpur Bazar",
      excerpt: "How we leveraged Node.js microservices and Firebase Firestore database clusters to achieve sub-120ms order synchronization and dynamic courier routing.",
      date: "May 14, 2026",
      readTime: "6 min read",
      content: `In building Bharatpur Bazar (bb.hs.vc), the primary engineering challenge was maintaining instant, real-time coordination between hungry customers, active kitchens, and on-field delivery riders across Nepal.

Instead of deploying heavy, database-taxing REST polling loops, we architected an event-driven sync pipeline utilizing Firebase Firestore listeners. When a customer initiates a checkout, a Cloud Function instantly validates stock, locks the ledger, and pipes the payload to the vendor's local receiver.

Key architectural patterns:
1. Bidirectional real-time sync with database listeners.
2. Structured sub-collections to isolate active cart operations.
3. Edge caching for static catalog nodes, dropping average API query latency to 14ms.`
    },
    {
      id: 2,
      title: "Designing a Secure Home Automation OS Kernel",
      excerpt: "Technical review of building Success AI HomeOS, integrating smart hardware, Python daemon routines, and offline MQTT bridges.",
      date: "April 20, 2026",
      readTime: "8 min read",
      content: `Success AI HomeOS was built to solve a critical issue: telemetry privacy. Standard commercial home hubs route physical house logs to external servers. 

To solve this, I designed a central local server hub executing a custom multi-threaded Python daemon. The daemon continuously monitors and commands smart switches, security locks, and temperature sensors via a local MQTT broker.

Data stays locally in an encrypted circular SQLite ring buffer, avoiding unnecessary flash wear. A cross-platform mobile client connects to the hub via secure local sockets, resulting in a system that is fully offline, secure, and yields less than a 15ms command execution delay.

Key parameters:
- Multithreaded Python loops for sensor polling.
- Local SQLite ring-buffers for optimal disk durability.
- Offline-first encrypted socket bridges.`
    }
  ];

  // Native, ultra-compatible scroll progress observer
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ ]);

  // Native, high-performance IntersectionObserver for scroll-reveal animations
  // Works flawlessly on Qute browser and older Chromium engines with 0% JS bundle bloat!
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px" // Triggers slightly before the element fully rolls into view
    });

    revealElements.forEach(el => observer.observe(el));

    // Recreate Hero entry timeline sequence natively via pure CSS transition classes
    const heroElements = document.querySelectorAll('.hero-reveal');
    heroElements.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 150 + idx * 150);
    });

    return () => observer.disconnect();
  }, [ ]);

  // Helper for smooth anchor scrolling
  const handleScrollToSection = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - (window.innerWidth <= 768 ? 10 : 70),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="portfolio-wrapper">
      
      {/* Native Scroll Progress Indicator */}
      <div 
        className="scroll-progress-indicator" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* DESKTOP STICKY NAVIGATION */}
      <nav className="nav desktop-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img 
              src={logoPath} 
              alt="Success Logo" 
              onClick={(e) => handleScrollToSection(e, 'home')}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div className="nav-links">
            <a href="#home" onClick={(e) => handleScrollToSection(e, 'home')}>Home</a>
            <a href="#about" onClick={(e) => handleScrollToSection(e, 'about')}>About</a>
            <a href="#skills" onClick={(e) => handleScrollToSection(e, 'skills')}>Skills</a>
            <a href="#projects" onClick={(e) => handleScrollToSection(e, 'projects')}>Projects</a>
            <a href="#experience" onClick={(e) => handleScrollToSection(e, 'experience')}>Experience</a>
            <a href="#blog" onClick={(e) => handleScrollToSection(e, 'blog')}>Blog</a>
            <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')}>Contact</a>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="mobile-nav">
        <a href="#home" onClick={(e) => handleScrollToSection(e, 'home')} className="mobile-nav-item">
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </a>
        <a href="#about" onClick={(e) => handleScrollToSection(e, 'about')} className="mobile-nav-item">
          <User className="w-5 h-5" />
          <span>About</span>
        </a>
        <a href="#blog" onClick={(e) => handleScrollToSection(e, 'blog')} className="mobile-nav-item">
          <BookOpen className="w-5 h-5" />
          <span>Blog</span>
        </a>
        <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} className="mobile-nav-item">
          <Mail className="w-5 h-5" />
          <span>Contact</span>
        </a>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-container">
          
          {/* Hero text (Entrance reveals) */}
          <div className="hero-text">
            <h1 className="hero-reveal reveal">Hello, I'm Success</h1>
            <div className="subtitle hero-reveal reveal">Backend & System Developer</div>
            <p className="hero-reveal reveal">
              A passionate 18-year-old developer from Nepal, specializing in Node.js, Python, and scalable backend architectures. I love building distributed systems, home automation OS, and complex web solutions.
            </p>

            <div className="hero-stats hero-reveal reveal">
              <div className="stat">
                <div className="stat-number">7+</div>
                <div className="stat-label">Years Coding</div>
              </div>
              <div className="stat">
                <div className="stat-number">146+</div>
                <div className="stat-label">Projects Built</div>
              </div>
              <div className="stat">
                <div className="stat-number">+41</div>
                <div className="stat-label font-sans">Happy Clients</div>
              </div>
            </div>

            <div className="hero-buttons hero-reveal reveal">
              <a 
                href="#projects" 
                onClick={(e) => handleScrollToSection(e, 'projects')} 
                className="btn-primary"
              >
                View My Work
                <span>→</span>
              </a>
              <a 
                href="#contact" 
                onClick={(e) => handleScrollToSection(e, 'contact')} 
                className="btn-secondary"
              >
                Get In Touch
              </a>
            </div>
          </div>

          {/* Hero morphing image */}
          <div className="hero-image">
            <img 
              src={profilePicPath} 
              alt="Success - Web Developer" 
              className="profile-img hero-reveal reveal-scale"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section className="section" id="about">
        <h2 className="section-title reveal">About Me</h2>
        <div className="about-content">
          
          <div className="about-text reveal-left">
            <p>
              I'm a dedicated developer currently studying at <strong className="text-white">Narayani Model Secondary School</strong> in Nepal. My journey into programming started when I was 10, and since then, I've been passionate about creating digital solutions that make a difference.
            </p>
            <p>
              I do both frontend and backend development, with a main focus on <strong className="text-white">Node.js, Firebase, and scalable systems</strong>.
            </p>
            <p>
              When I don't have any good ideas for new projects, I like to contribute to open-source. I have contributed to over <strong className="text-white">600 repositories</strong> on GitHub.
            </p>
          </div>

          <div className="about-highlights reveal-right">
            <div className="highlight-item">
              <div className="highlight-icon">🎓</div>
              <div>
                <strong>Student at Narayani Model Secondary School</strong>
                <br />Balancing academics with professional development
              </div>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">💼</div>
              <div>
                <strong>Freelance Developer</strong>
                <br />Building custom solutions for various clients
              </div>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">🌟</div>
              <div>
                <strong>Problem Solver</strong>
                <br />Love tackling complex challenges with creative solutions
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TECHNICAL SKILLS SECTION */}
      <section className="section" id="skills">
        <h2 className="section-title reveal">Technical Skills</h2>
        <div className="skills-grid">
          
          {/* Skill Card 1 */}
          <div className="skill-card reveal">
            <div className="skill-icon">
              <Server className="w-8 h-8" />
            </div>
            <h3>Node.js & Backend</h3>
            <p>Expert in building scalable APIs and microservices using Node.js and Express. Focused on performance and reliability.</p>
          </div>

          {/* Skill Card 2 */}
          <div className="skill-card reveal">
            <div className="skill-icon">
              <Zap className="w-8 h-8" />
            </div>
            <h3>Firebase & Realtime</h3>
            <p>Deep experience with Firestore, Realtime Database, and Cloud Functions for synchronized applications.</p>
          </div>

          {/* Skill Card 3 */}
          <div className="skill-card reveal">
            <div className="skill-icon">
              <Terminal className="w-8 h-8" />
            </div>
            <h3>Python & Automation</h3>
            <p>Scripting and system automation. Experience building custom OS layers and AI integrations.</p>
          </div>

          {/* Skill Card 4 */}
          <div className="skill-card reveal">
            <div className="skill-icon">
              <Code2 className="w-8 h-8" />
            </div>
            <h3>JavaScript & Web</h3>
            <p>Solid foundation in modern JavaScript (ES6+) for both frontend and backend environments.</p>
          </div>

        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="section" id="projects">
        <h2 className="section-title reveal font-bold">Featured Projects</h2>
        <div className="projects-grid">
          
          {/* Project Card 1 */}
          <div className="project-card reveal">
            <div className="project-image">
              <ShoppingCart className="w-16 h-16" />
            </div>
            <div className="project-content">
              <div className="project-tech">
                <span className="tech-tag">Node.js</span>
                <span className="tech-tag">Firebase</span>
                <span className="tech-tag">Google Maps</span>
              </div>
              <h3 className="project-title">Bharatpur Bazar</h3>
              <p>A comprehensive grocery and food delivery platform serving Bharatpur. Features real-time ordering, inventory management, and cooked food delivery.</p>
              <a href="https://bb.hs.vc" target="_blank" rel="noopener noreferrer" className="project-link">Visit Site →</a>
            </div>
          </div>

          {/* Project Card 2 */}
          <div className="project-card reveal">
            <div className="project-image">
              <HomeIcon className="w-16 h-16" />
            </div>
            <div className="project-content">
              <div className="project-tech">
                <span className="tech-tag">Flutter</span>
                <span className="tech-tag">Python</span>
                <span className="tech-tag">IoT</span>
              </div>
              <h3 className="project-title">Success AI Home</h3>
              <p>A distributed home automation operating system. Integrates IoT devices, voice control, and mobile apps into a unified smart home experience.</p>
              <span className="project-link text-zinc-500 font-semibold font-mono">Private Project</span>
            </div>
          </div>

          {/* Project Card 3 */}
          <div className="project-card reveal">
            <div className="project-image">
              <Globe className="w-16 h-16" />
            </div>
            <div className="project-content">
              <div className="project-tech">
                <span className="tech-tag">React</span>
                <span className="tech-tag">GSAP</span>
                <span className="tech-tag">Responsive Design</span>
              </div>
              <h3 className="project-title">4Direction</h3>
              <p>Professional corporate web presence for 4Direction. Showcases services and portfolio with a clean, modern design.</p>
              <a href="https://4direction.com.np/" target="_blank" rel="noopener noreferrer" className="project-link">Visit Site →</a>
            </div>
          </div>

        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="section" id="experience">
        <h2 className="section-title reveal">Experience & Journey</h2>
        <div className="experience-timeline">
          <div className="timeline-line" />

          {/* Timeline Node 1 */}
          <div className="timeline-item reveal">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-date">2025 - Present</div>
              <h3 className="timeline-title font-sans">Freelance Web Developer</h3>
              <div className="timeline-company">Self-Employed</div>
              <p>Building custom web applications and e-commerce solutions for various clients. Specializing in full-stack development with modern JavaScript frameworks and backend development.</p>
            </div>
          </div>

          {/* Timeline Node 2 */}
          <div className="timeline-item reveal">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-date">2021</div>
              <h3 className="timeline-title font-sans">Computer Science Student</h3>
              <div className="timeline-company">Narayani Model Secondary School</div>
              <p>Pursuing secondary education with a focus on computer science and mathematics. Actively participating in coding competitions and tech-related activities.</p>
            </div>
          </div>

          {/* Timeline Node 3 */}
          <div className="timeline-item reveal">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-date">2018</div>
              <h3 className="timeline-title font-sans">Started Programming Journey</h3>
              <div className="timeline-company">Self-Learning</div>
              <p>My first teacher was my Dad. Who introduced me to the world of computer. Then I was fascinated by programming. He was the one who ignited this spike to something wonderful.</p>
            </div>
          </div>

        </div>
      </section>

      {/* DEVLOG / BLOG CTA */}
      <section className="section" id="blog">
        <div className="reveal" style={{ background: 'rgba(30, 41, 59, 0.3)', border: '1px solid var(--border)', borderRadius: '2rem', padding: '3rem 1.5rem', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text)', fontWeight: '700' }}>Explore My DevLog</h3>
          <p style={{ color: '#94a3b8', marginBottom: '2rem', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.95rem' }}>
            I document my technical challenges and breakthroughs as I build Success AI Home and other complex systems. Follow my journey.
          </p>
          
          {/* List of custom posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8 font-sans text-left">
            {blogPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => setActiveBlogPost(post)}
                className="p-4 rounded-xl border border-white/5 bg-[#0f172a]/80 hover:border-sky-500/30 transition-all duration-300 cursor-pointer flex justify-between items-center"
              >
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{post.title}</h4>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">{post.date}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section" id="contact">
        <h2 className="section-title reveal">Get In Touch</h2>
        <div className="contact-content">
          
          {/* Contact introduction text */}
          <div className="contact-text reveal-left">
            <p>I'm always open to connect with fellow developers, clients and tech enthusiasts. Whether you have a project in mind, want to collaborate or just want to chat, I'd love to hear from you. :)</p>
            <p>I'm currently available for freelance projects and open to discussing. My goal is to create something new and exciting, doesn't matter if there is meaningful purpose or not.</p>
            <p>I don't have much to say! If you want to contact me, I typically respond to messages within 24 hours.</p>
          </div>

          {/* Contact Details List */}
          <div className="contact-details reveal-right">
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <strong>Phone</strong>
                <br /><a href="tel:+9779809248510" className="contact-link">+977 9809248510</a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <strong>Email</strong>
                <br /><a href="mailto:mail@success0.com.np" className="contact-link">mail@success0.com.np</a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <strong>Location</strong>
                <br /><span className="contact-link">Bharatpur-10, Nepal</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">💼</div>
              <div>
                <strong>Availability</strong>
                <br /><span className="contact-link">Open for freelance projects</span>
              </div>
            </div>

          </div>

        </div>

        {/* Message form under contact */}
        <div className="reveal max-w-xl mx-auto mt-12 bg-[#1e293b]/20 p-6 md:p-8 rounded-2xl border border-white/5 font-mono text-xs">
          <h3 className="text-sm font-semibold text-white mb-4 font-sans">Secure Message Pipeline</h3>
          <form 
            action="https://formspree.io/f/xvonzgnz" 
            method="POST" 
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-zinc-400 block">Name :</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="John Doe"
                className="w-full bg-[#0f172a] border border-white/5 focus:border-sky-400 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition font-sans text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400 block">Email :</label>
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="john@example.com"
                className="w-full bg-[#0f172a] border border-white/5 focus:border-sky-400 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition font-sans text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400 block">Message :</label>
              <textarea 
                name="message" 
                required 
                rows="4" 
                placeholder="Describe your backend system or API goals..."
                className="w-full bg-[#0f172a] border border-white/5 focus:border-sky-400 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition font-sans resize-none text-xs"
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary w-full py-2.5 justify-center font-bold"
            >
              Transmit message
            </button>
          </form>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-info">
            <p>© {new Date().getFullYear()} Success. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <a href="mailto:success@4direction.com.np">Email</a>
            <a href="#home" onClick={(e) => handleScrollToSection(e, 'home')}>Portfolio</a>
            <a href="#blog" onClick={(e) => handleScrollToSection(e, 'blog')}>Blog</a>
          </div>
        </div>
      </footer>

      {/* DEVLOG DETAIL MODAL (Overlay) */}
      <div className={`devlog-modal-overlay ${activeBlogPost ? 'open' : ''}`} onClick={() => setActiveBlogPost(null)}>
        {activeBlogPost && (
          <div className="devlog-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActiveBlogPost(null)}
              className="devlog-modal-close"
            >
              <X className="w-5 h-5" />
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.75rem', marginBottom: '1rem', fontFamily: 'monospace' }}>
              <span>{activeBlogPost.date}</span>
              <span>{activeBlogPost.readTime}</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text)', marginBottom: '1.5rem', lineHeight: '1.3' }}>
              {activeBlogPost.title}
            </h2>
            <div style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              {activeBlogPost.content}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}