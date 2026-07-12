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
  X,
  User,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeBlogPost, setActiveBlogPost] = useState(null);

  const logoPath = "logo.png";
  const profilePicPath = "portfolio_assets/success.jpg";

  // Authentic, simplified projects list showcasing real achievements
  const projects = [
    {
      id: 1,
      title: "Bharatpur Bazar",
      subtitle: "Food & Grocery Delivery Platform",
      description: "A fast, local online food and grocery delivery system built for Bharatpur. It coordinates checkouts, order tracking, and delivery updates in real-time.",
      tech: ["Node.js", "Firebase", "Google Maps API"],
      link: "https://bb.hs.vc",
      isPrivate: false,
      iconType: "delivery",
      logo: ""
    },
    {
      id: 2,
      title: "Udayashree School App",
      subtitle: "School Management System",
      description: "A complete mobile and web system built to track parent attendance, publish student results, and handle teacher communication and marks entry.",
      tech: ["HTML/CSS", "JavaScript", "Firebase"],
      link: null,
      isPrivate: true,
      iconType: "school",
      logo: "portfolio_assets/school_logo.png"
    },
    {
      id: 3,
      title: "Pariwarik Fast Food",
      subtitle: "Digital Restaurant Menu",
      description: "A clean and fast digital menu system built for Pariwarik Fast Food. It lets restaurant customers scan a QR code and browse dishes easily on their phones.",
      tech: ["HTML", "CSS", "JavaScript"],
      link: "http://pariwarik.shop/menu/",
      isPrivate: false,
      iconType: "food",
      logo: "portfolio_assets/pariwarik_logo.png"
    },
    {
      id: 4,
      title: "CFH (Children's Future Hope)",
      subtitle: "NGO Web Application",
      description: "A professional and modern website built for CFH to present their social impact programs, organization details, and updates in a clean design.",
      tech: ["React", "Tailwind CSS"],
      link: "http://cfh.com.np",
      isPrivate: false,
      iconType: "ngo",
      logo: "portfolio_assets/cfh_logo.png"
    },
    {
      id: 5,
      title: "Success AI Home",
      subtitle: "Private Home Automation OS",
      description: "A fully private home automation system running on a local hub. It controls smart hardware, security, and sensors completely offline for user privacy.",
      tech: ["Python", "Flutter", "MQTT", "IoT"],
      link: null,
      isPrivate: true,
      iconType: "home",
      logo: ""
    },
    {
      id: 6,
      title: "4Direction",
      subtitle: "Corporate Business Web Presence",
      description: "A clean, modern corporate website designed for 4Direction to display company services, updates, and portfolio pages beautifully.",
      tech: ["React", "GSAP", "Tailwind CSS"],
      link: "https://4direction.com.np/",
      isPrivate: false,
      iconType: "corporate",
      logo: ""
    }
  ];

  // Authentic developer logs with straightforward, down-to-earth tone
  const blogPosts = [
    {
      id: 1,
      title: "How I Built Bharatpur Bazar's Real-time Updates System",
      excerpt: "A simple, practical look at using database listeners to sync ordering states and restaurant coordination under a second.",
      date: "May 14, 2026",
      readTime: "4 min read",
      content: `When building Bharatpur Bazar, our main engineering challenge was making sure that when someone places an order, the kitchen and the delivery riders get notified instantly.

Instead of writing complex and heavy REST polling loops that constantly tax the server, I used Firebase Firestore's real-time listeners. When a customer confirms a checkout, the event updates a collection that the merchant's screen listens to. The kitchen gets the order ticket immediately, and the driver gets a notification in real-time.

It is simple, low-bandwidth, and ensures that local customers get their hot meals and groceries delivered without delay.`
    },
    {
      id: 2,
      title: "Making Smart Homes Private: Building an Offline-first OS",
      excerpt: "Why standard cloud smart devices pose a privacy issue, and how to command hardware locally via Python.",
      date: "April 20, 2026",
      readTime: "5 min read",
      content: `Many commercial home smart plugs and switches route your telemetry data to servers abroad. I wanted a smart home setup that is secure and works even if the internet goes down.

I built Success AI HomeOS using a local server running a multi-threaded Python daemon. The daemon continuously monitors and commands smart hardware using MQTT protocol over our local home network.

All event logs are saved locally in an encrypted circular SQLite database, avoiding cloud dependency completely. A Flutter-based mobile client connects directly over local sockets. It is fast (under 15ms command execution), works completely offline, and keeps home data where it belongs.`
    }
  ];

  // Scroll Progress Observer
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

  // Scroll-Reveal Intersection Observer
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
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));

    const heroElements = document.querySelectorAll('.hero-reveal');
    heroElements.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 150 + idx * 150);
    });

    return () => observer.disconnect();
  }, [ ]);

  // Smooth Scroll Helper
  const handleScrollToSection = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - (window.innerWidth <= 768 ? 10 : 70),
        behavior: 'smooth'
      });
    }
  };

  const renderProjectIcon = (project) => {
    if (project.logo) {
      return (
        <img 
          src={project.logo} 
          alt={`${project.title} logo`} 
          className="w-16 h-16 object-contain rounded-xl bg-white/5 p-2 border border-white/10"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }
    switch (project.iconType) {
      case 'delivery': return <ShoppingCart className="w-12 h-12 text-sky-400" />;
      case 'home': return <HomeIcon className="w-12 h-12 text-sky-400" />;
      case 'corporate': return <Globe className="w-12 h-12 text-sky-400" />;
      default: return <Code2 className="w-12 h-12 text-sky-400" />;
    }
  };

  return (
    <div className="portfolio-wrapper">
      
      {/* Scroll Progress Bar */}
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
              className="cursor-pointer"
            />
          </div>
          <div className="nav-links">
            <a href="#home" onClick={(e) => handleScrollToSection(e, 'home')}>Home</a>
            <a href="#about" onClick={(e) => handleScrollToSection(e, 'about')}>About</a>
            <a href="#skills" onClick={(e) => handleScrollToSection(e, 'skills')}>Skills</a>
            <a href="#projects" onClick={(e) => handleScrollToSection(e, 'projects')}>Projects</a>
            <a href="#experience" onClick={(e) => handleScrollToSection(e, 'experience')}>Experience</a>
            <a href="#blog" onClick={(e) => handleScrollToSection(e, 'blog')}>DevLog</a>
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
        <a href="#projects" onClick={(e) => handleScrollToSection(e, 'projects')} className="mobile-nav-item">
          <Briefcase className="w-5 h-5" />
          <span>Work</span>
        </a>
        <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} className="mobile-nav-item">
          <Mail className="w-5 h-5" />
          <span>Contact</span>
        </a>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-container">
          
          <div className="hero-text">
            <h1 className="hero-reveal reveal">Hello, I'm Success</h1>
            <div className="subtitle hero-reveal reveal">Backend & System Developer</div>
            <p className="hero-reveal reveal">
              An 18-year-old system and web developer from Bharatpur, Nepal. I specialize in backend code, clean databases, and custom system solutions. I write code in Python, JavaScript, TypeScript, React, and Flutter to build software that works reliably for real businesses.
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
                <div className="stat-number">41+</div>
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

          <div className="hero-image">
            <img 
              src={profilePicPath} 
              alt="Success - Backend & System Developer" 
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
              I am a student currently studying at <strong className="text-white">Narayani Model Secondary School</strong> in Bharatpur, Nepal. I started self-learning computer programming when I was 10, taught first by my Dad who showed me how software worked.
            </p>
            <p>
              While I enjoy working with frontend technologies to display interfaces, my main focus is on <strong className="text-white">backend systems, robust databases, and automation</strong>. I build fast REST and WebSocket APIs, design relational and real-time database schemas, and handle hardware/software integrations.
            </p>
            <p>
              When I'm not working on client projects, I enjoy learning new low-level concepts and contributing to open-source software. I've made contributions to over <strong className="text-white">600 open-source repositories</strong> on GitHub.
            </p>
          </div>

          <div className="about-highlights reveal-right">
            <div className="highlight-item">
              <div className="highlight-icon">🎓</div>
              <div>
                <strong>Narayani Model Secondary School</strong>
                <br />Pursuing secondary education while working as a developer
              </div>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">💼</div>
              <div>
                <strong>Full-Stack Freelancer</strong>
                <br />Building fast web and mobile systems directly for local and international clients
              </div>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">🌟</div>
              <div>
                <strong>Straightforward Solutions</strong>
                <br />I focus on building clean, practical applications without unnecessary layers or complications
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TECHNICAL SKILLS SECTION */}
      <section className="section" id="skills">
        <h2 className="section-title reveal">Technical Skills</h2>
        <div className="skills-grid">
          
          <div className="skill-card reveal">
            <div className="skill-icon">
              <Server className="w-8 h-8" />
            </div>
            <h3>Backend & APIs</h3>
            <p>Developing reliable server code, RESTful APIs, and synchronized web sockets. Proficient in Node.js, Express, and microservice structures.</p>
          </div>

          <div className="skill-card reveal">
            <div className="skill-icon">
              <Zap className="w-8 h-8" />
            </div>
            <h3>Databases & Sync</h3>
            <p>Designing structures with Google Firebase, Firestore, and SQLite ring buffers. Focused on low latencies and offline durability.</p>
          </div>

          <div className="skill-card reveal">
            <div className="skill-icon">
              <Terminal className="w-8 h-8" />
            </div>
            <h3>Systems & Automation</h3>
            <p>Writing reliable scripts in Python for system administration, smart IoT home setups, and background services.</p>
          </div>

          <div className="skill-card reveal">
            <div className="skill-icon">
              <Code2 className="w-8 h-8" />
            </div>
            <h3>Frontend & Mobile</h3>
            <p>Building responsive and simple client interfaces using modern JavaScript (ES6+), React, TypeScript, and Flutter.</p>
          </div>

        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="section" id="projects">
        <h2 className="section-title reveal font-bold">Featured Projects</h2>
        <div className="projects-grid">
          
          {projects.map((project) => (
            <div key={project.id} className="project-card reveal">
              <div className="project-image">
                {renderProjectIcon(project)}
              </div>
              <div className="project-content">
                <div className="project-tech">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="tech-tag">{t}</span>
                  ))}
                </div>
                <h3 className="project-title">{project.title}</h3>
                <p className="text-zinc-400 text-sm mb-4">{project.description}</p>
                {project.link ? (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link inline-flex items-center gap-1 hover:text-sky-400"
                  >
                    Visit Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="project-link text-zinc-500 font-semibold text-xs font-mono">
                    Local/Private Project
                  </span>
                )}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="section" id="experience">
        <h2 className="section-title reveal">Experience & Journey</h2>
        <div className="experience-timeline">
          <div className="timeline-line" />

          <div className="timeline-item reveal">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-date">2025 - Present</div>
              <h3 className="timeline-title font-sans">Independent Web & App Developer</h3>
              <div className="timeline-company">Freelance (Self-Employed)</div>
              <p>Designing, coding, and launching full-stack digital solutions for small businesses, restaurants, NGOs, and local platforms in Nepal and internationally.</p>
            </div>
          </div>

          <div className="timeline-item reveal">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-date">2021</div>
              <h3 className="timeline-title font-sans">Computer Science Student</h3>
              <div className="timeline-company">Narayani Model Secondary School</div>
              <p>Studying technical computer science, mathematics, and algorithms, while simultaneously building software for active clients.</p>
            </div>
          </div>

          <div className="timeline-item reveal">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-date">2018</div>
              <h3 className="timeline-title font-sans">Started Programming Journey</h3>
              <div className="timeline-company">Self-Directed Learning</div>
              <p>My Dad introduced me to software development. I was fascinated by how programs execute instructions, sparking my years of learning backend systems and scripting.</p>
            </div>
          </div>

        </div>
      </section>

      {/* DEVLOG / BLOG CTA */}
      <section className="section" id="blog">
        <div className="reveal" style={{ background: 'rgba(30, 41, 59, 0.3)', border: '1px solid var(--border)', borderRadius: '2rem', padding: '3rem 1.5rem', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text)', fontWeight: '700' }}>Developer DevLog</h3>
          <p style={{ color: '#94a3b8', marginBottom: '2rem', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.95rem' }}>
            I write occasional, straightforward articles detailing my development process, system designs, and solutions to real coding challenges.
          </p>
          
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
          
          <div className="contact-text reveal-left">
            <p>I am always open to connecting with businesses, restaurant owners, schools, and local organizations who need software built. If you have an idea for a website or application, feel free to reach out.</p>
            <p>I specialize in building systems that fit your specific requirements. I focus on clear communication and building robust, practical applications that are easy for both you and your clients to use.</p>
            <p>Send me an email, call, or drop a message in the form. I typically respond to messages within 24 hours.</p>
          </div>

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
                <br /><span className="contact-link">Available for web and mobile projects</span>
              </div>
            </div>

          </div>

        </div>

        {/* Simplified Message Form */}
        <div className="reveal max-w-xl mx-auto mt-12 bg-[#1e293b]/20 p-6 md:p-8 rounded-2xl border border-white/5 text-sm">
          <h3 className="text-sm font-semibold text-white mb-4 text-center font-sans">Send a Message</h3>
          <form 
            action="https://formspree.io/f/xvonzgnz" 
            method="POST" 
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-zinc-400 block text-xs">Name :</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="Your Name"
                className="w-full bg-[#0f172a] border border-white/5 focus:border-sky-400 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400 block text-xs">Email :</label>
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="your.email@example.com"
                className="w-full bg-[#0f172a] border border-white/5 focus:border-sky-400 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400 block text-xs">Message :</label>
              <textarea 
                name="message" 
                required 
                rows="4" 
                placeholder="Describe what kind of website or application you would like to build..."
                className="w-full bg-[#0f172a] border border-white/5 focus:border-sky-400 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition resize-none text-sm"
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary w-full py-2.5 justify-center font-bold"
            >
              Send Message
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
            <a href="#blog" onClick={(e) => handleScrollToSection(e, 'blog')}>DevLog</a>
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