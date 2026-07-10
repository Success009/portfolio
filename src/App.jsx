import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, 
  Database, 
  Terminal, 
  Code2, 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Briefcase, 
  ChevronRight, 
  ArrowRight, 
  Home, 
  User, 
  Layers, 
  CheckCircle2, 
  Calendar,
  X,
  Menu
} from 'lucide-react';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeBlogPost, setActiveBlogPost] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Asset paths (Strictly relative for subdirectory GitHub Pages compatibility)
  const logoPath = "logo.png";
  const profilePicPath = "portfolio_assets/success.jpg";

  // Mock Blog Posts data directly reflecting Success's real technical breakthroughs
  const blogPosts = [
    {
      id: 1,
      title: "Architecting Real-Time Sockets & Sync for Bharatpur Bazar",
      excerpt: "How we leveraged Node.js microservices and Firebase real-time clusters to achieve millisecond order sync and route dispatch.",
      date: "May 14, 2026",
      readTime: "6 min read",
      content: `In building Bharatpur Bazar (bb.hs.vc), the primary challenge was keeping real-time synchronicity between hungry customers, vendor kitchens, and on-field delivery riders. 

We bypassed heavy polling overhead by implementing a listener-centric NoSQL document structure in Firestore. When a customer executes a checkout payload, a Cloud Function validates the inventory, locks the order, and streams a notification instantly to the respective vendor via realtime listeners. This model reduced order sync latency to under 120ms while handling hundreds of active concurrent connections.

Key takeaways:
1. Avoid polling; use direct event-driven streams.
2. Structure Firestore schemas with sub-collections to optimize database read sizes.
3. Keep serverless functions hot during high-demand local lunch hours.`
    },
    {
      id: 2,
      title: "Building a Lightweight Smart Home Daemon from Scratch",
      excerpt: "Deep dive into building Success AI HomeOS, utilizing a custom Python daemon, secure MQTT protocols, and an optimized Flutter client.",
      date: "April 20, 2026",
      readTime: "8 min read",
      content: `The motivation for Success AI HomeOS was simple: complete privacy. Commercial home hubs stream your telemetry data back to global cloud nodes. 

To solve this, I designed a central operating server using a custom Python background daemon running on a local server. The daemon constantly polls smart switches and room sensors via local MQTT brokers. Telemetry state transitions are kept in a local SQLite ring-buffer. 

A cross-platform Flutter application connects over SSL-encrypted local sockets to offer a dashboard experience. By keeping all services on the local sub-network, the system operates completely offline, with a total command execution delay of less than 15ms.

Architecture highlights:
- Python background services handling multi-threaded sensor loops.
- Local SQLite buffers preventing continuous disk write wear on flash storage.
- Private MQTT broker keeping IoT signals secure.`
    }
  ];

  // Tracks window scroll progress for the top indicator
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

  // Recreates smooth scrolling to section hashes
  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 75,
        behavior: 'smooth'
      });
    }
  };

  // Entrance animations mirroring his original GSAP timeline physics
  const heroEntrance = {
    hidden: { opacity: 0, y: 35 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: custom * 0.15,
        ease: [0.215, 0.61, 0.355, 1] // Custom cubic-bezier mimicking elite GSAP power easing
      }
    })
  };

  const imageEntrance = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, delay: 0.6, ease: "easeOut" }
    }
  };

  // Viewport scroll-reveal animations mirroring his original GSAP scroll triggers
  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans relative overflow-x-hidden selection:bg-sky-500/20 selection:text-sky-300">
      
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-sky-400 z-[9999] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Ambient Glow Background Elements */}
      <div className="absolute top-[15%] left-[5%] w-[35vw] h-[35vw] bg-blue-600/[0.06] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[45%] right-[5%] w-[40vw] h-[40vw] bg-sky-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[35vw] h-[35vw] bg-indigo-600/[0.05] rounded-full blur-[100px] pointer-events-none" />

      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 w-full bg-[#0f172a]/95 border-b border-white/10 backdrop-blur-md z-50 py-3.5 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={logoPath} 
              alt="Success Logo" 
              className="h-9 w-auto object-contain cursor-pointer"
              onClick={(e) => scrollToSection(e, 'home')}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-[14px]">
            <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="hover:text-sky-400 transition-colors duration-200">Home</a>
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-sky-400 transition-colors duration-200">About</a>
            <a href="#skills" onClick={(e) => scrollToSection(e, 'skills')} className="hover:text-sky-400 transition-colors duration-200">Skills</a>
            <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="hover:text-sky-400 transition-colors duration-200">Projects</a>
            <a href="#experience" onClick={(e) => scrollToSection(e, 'experience')} className="hover:text-sky-400 transition-colors duration-200">Experience</a>
            <a href="#blog" onClick={(e) => scrollToSection(e, 'blog')} className="hover:text-sky-400 transition-colors duration-200">Blog</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-sky-400 transition-colors duration-200">Contact</a>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-[#f8fafc] hover:text-sky-400 transition"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* MOBILE FULLSCREEN OVERLAY MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#0f172a] z-40 pt-20 px-6 flex flex-col gap-6 font-mono text-base"
          >
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="hover:text-sky-400 transition py-2 border-b border-white/5">Home</a>
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-sky-400 transition py-2 border-b border-white/5">About</a>
            <a href="#skills" onClick={(e) => scrollToSection(e, 'skills')} className="hover:text-sky-400 transition py-2 border-b border-white/5">Skills</a>
            <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="hover:text-sky-400 transition py-2 border-b border-white/5">Projects</a>
            <a href="#experience" onClick={(e) => scrollToSection(e, 'experience')} className="hover:text-sky-400 transition py-2 border-b border-white/5">Experience</a>
            <a href="#blog" onClick={(e) => scrollToSection(e, 'blog')} className="hover:text-sky-400 transition py-2 border-b border-white/5">Blog</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-sky-400 transition py-2">Contact</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center pt-28 pb-16 px-4 md:px-8 relative" id="home">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          
          {/* Hero Content Left */}
          <div className="md:col-span-7 space-y-6">
            <motion.h1 
              variants={heroEntrance} 
              initial="hidden" 
              animate="visible" 
              custom={1}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500"
            >
              Hello, I'm Success
            </motion.h1>

            <motion.div 
              variants={heroEntrance} 
              initial="hidden" 
              animate="visible" 
              custom={2}
              className="text-xl md:text-2xl font-semibold text-sky-400"
            >
              Backend & System Developer
            </motion.div>

            <motion.p 
              variants={heroEntrance} 
              initial="hidden" 
              animate="visible" 
              custom={3}
              className="text-[#94a3b8] text-sm md:text-base leading-relaxed max-w-xl"
            >
              A passionate 18-year-old developer from Nepal, specializing in Node.js, Python, and scalable backend architectures. I love building distributed systems, home automation OS, and complex web solutions.
            </motion.p>

            {/* Static Stats Row */}
            <motion.div 
              variants={heroEntrance} 
              initial="hidden" 
              animate="visible" 
              custom={4}
              className="flex gap-8 flex-wrap pt-2"
            >
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-extrabold text-white">7+</div>
                <div className="text-xs text-[#94a3b8] font-medium">Years Coding</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-extrabold text-white">146+</div>
                <div className="text-xs text-[#94a3b8] font-medium">Projects Built</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-extrabold text-white">+41</div>
                <div className="text-xs text-[#94a3b8] font-medium font-sans">Happy Clients</div>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div 
              variants={heroEntrance} 
              initial="hidden" 
              animate="visible" 
              custom={5}
              className="flex gap-4 pt-4"
            >
              <a 
                href="#projects" 
                onClick={(e) => scrollToSection(e, 'projects')}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-xs rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 cursor-pointer"
              >
                <span>View My Work</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-[#1e293b]/70 hover:bg-[#1e293b] text-[#f8fafc] border border-white/10 hover:border-white/20 font-semibold text-xs rounded-lg transition-all duration-300 cursor-pointer"
              >
                Get In Touch
              </a>
            </motion.div>
          </div>

          {/* Hero Profile Photo Right */}
          <div className="md:col-span-5 flex justify-center items-center">
            <motion.div 
              variants={imageEntrance} 
              initial="hidden" 
              animate="visible" 
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-white/10 bg-[#1e293b]/40 p-2 shadow-2xl"
            >
              <img 
                src={profilePicPath} 
                alt="Success - Web Developer" 
                className="w-full h-full object-cover rounded-xl filter grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section className="py-24 px-4 md:px-8 border-t border-white/5 bg-[#0f172a]/50" id="about">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
            className="text-2xl md:text-3xl font-extrabold text-white text-center"
          >
            About Me
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* Biography text */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="md:col-span-7 space-y-4 text-[#94a3b8] text-sm md:text-base leading-relaxed"
            >
              <p>
                I'm a dedicated developer currently studying at <strong className="text-white">Narayani Model Secondary School</strong> in Nepal. My journey into programming started when I was 10, and since then, I've been passionate about creating digital solutions that make a difference.
              </p>
              <p>
                I do both frontend and backend development, with a main focus on <strong className="text-white">Node.js, Firebase, and scalable systems</strong>.
              </p>
              <p>
                When I don't have any good ideas for new projects, I like to contribute to open-source. I have contributed to over <strong className="text-white">600 repositories</strong> on GitHub, helping improve libraries used by thousands worldwide.
              </p>
            </motion.div>

            {/* Highlights bullet points */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="md:col-span-5 space-y-4"
            >
              <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-[#1e293b]/20 hover:bg-[#1e293b]/30 hover:border-white/10 transition-all duration-300">
                <span className="text-2xl mt-0.5">🎓</span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Student</h4>
                  <p className="text-xs text-[#94a3b8] leading-normal">Narayani Model Secondary School, balancing academics with advanced research</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-[#1e293b]/20 hover:bg-[#1e293b]/30 hover:border-white/10 transition-all duration-300">
                <span className="text-2xl mt-0.5">💼</span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Freelance Developer</h4>
                  <p className="text-xs text-[#94a3b8] leading-normal">Building custom architectures, e-commerce, and services for various clients</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-[#1e293b]/20 hover:bg-[#1e293b]/30 hover:border-white/10 transition-all duration-300">
                <span className="text-2xl mt-0.5">🌟</span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Problem Solver</h4>
                  <p className="text-xs text-[#94a3b8] leading-normal">Tackling complex systems, hardware pipelines, and integrations creatively</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* TECHNICAL SKILLS */}
      <section className="py-24 px-4 md:px-8 border-t border-white/5" id="skills">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
            className="text-2xl md:text-3xl font-extrabold text-white text-center"
          >
            Technical Skills
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Skill 1 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="p-6 rounded-2xl border border-white/5 bg-[#1e293b]/20 hover:bg-[#1e293b]/40 hover:border-sky-500/30 transition-all duration-300 group"
            >
              <div className="p-3 bg-sky-500/5 rounded-xl border border-sky-500/10 w-fit text-sky-400 group-hover:bg-sky-500/10 transition duration-300">
                <Server className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white mt-4 mb-2">Node.js & Backend</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Expert in building scalable APIs and microservices using Node.js and Express. Focused on performance and reliability.
              </p>
            </motion.div>

            {/* Skill 2 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="p-6 rounded-2xl border border-white/5 bg-[#1e293b]/20 hover:bg-[#1e293b]/40 hover:border-sky-500/30 transition-all duration-300 group"
            >
              <div className="p-3 bg-sky-500/5 rounded-xl border border-sky-500/10 w-fit text-sky-400 group-hover:bg-sky-500/10 transition duration-300">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white mt-4 mb-2">Firebase & Realtime</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Deep experience with Firestore, Realtime Database, and Cloud Functions for synchronized, real-time applications.
              </p>
            </motion.div>

            {/* Skill 3 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="p-6 rounded-2xl border border-white/5 bg-[#1e293b]/20 hover:bg-[#1e293b]/40 hover:border-sky-500/30 transition-all duration-300 group"
            >
              <div className="p-3 bg-sky-500/5 rounded-xl border border-sky-500/10 w-fit text-sky-400 group-hover:bg-sky-500/10 transition duration-300">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white mt-4 mb-2">Python & Automation</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Scripting and system automation. Dedicated training in building custom OS layers and smart hardware integrations.
              </p>
            </motion.div>

            {/* Skill 4 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="p-6 rounded-2xl border border-white/5 bg-[#1e293b]/20 hover:bg-[#1e293b]/40 hover:border-sky-500/30 transition-all duration-300 group"
            >
              <div className="p-3 bg-sky-500/5 rounded-xl border border-sky-500/10 w-fit text-sky-400 group-hover:bg-sky-500/10 transition duration-300">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white mt-4 mb-2">JavaScript & Web</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Solid foundation in modern JavaScript (ES6+) for both frontend interfaces and server-side runtime environments.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-24 px-4 md:px-8 border-t border-white/5 bg-[#0f172a]/50" id="projects">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
            className="text-2xl md:text-3xl font-extrabold text-white text-center"
          >
            Featured Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Project 1 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="flex flex-col bg-[#1e293b]/20 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="h-44 bg-gradient-to-br from-blue-900/30 to-sky-900/10 flex items-center justify-center border-b border-white/5 text-sky-400">
                <div className="p-4 bg-sky-500/5 rounded-2xl border border-sky-500/10">
                  <Layers className="h-8 w-8" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] font-semibold text-zinc-400 font-mono">Node.js</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] font-semibold text-zinc-400 font-mono">Firebase</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] font-semibold text-zinc-400 font-mono">Google Maps</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Bharatpur Bazar</h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    A comprehensive grocery and food delivery platform serving Bharatpur. Features real-time ordering, inventory management, and cooked food delivery.
                  </p>
                </div>
                <a 
                  href="https://bb.hs.vc" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 font-mono"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>

            {/* Project 2 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="flex flex-col bg-[#1e293b]/20 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="h-44 bg-gradient-to-br from-indigo-900/30 to-blue-900/10 flex items-center justify-center border-b border-white/5 text-indigo-400">
                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                  <Home className="h-8 w-8" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] font-semibold text-zinc-400 font-mono">Flutter</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] font-semibold text-zinc-400 font-mono">Python</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] font-semibold text-zinc-400 font-mono">IoT</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Success AI Home</h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    A distributed home automation operating system. Integrates IoT devices, voice control, and mobile apps into a unified smart home experience.
                  </p>
                </div>
                <span className="text-xs font-semibold text-zinc-500 font-mono">Private Project</span>
              </div>
            </motion.div>

            {/* Project 3 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="flex flex-col bg-[#1e293b]/20 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="h-44 bg-gradient-to-br from-indigo-900/20 to-sky-900/10 flex items-center justify-center border-b border-white/5 text-indigo-400">
                <div className="p-4 bg-sky-500/5 rounded-2xl border border-sky-500/10">
                  <Globe className="h-8 w-8" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] font-semibold text-zinc-400 font-mono">React</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] font-semibold text-zinc-400 font-mono">GSAP</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] font-semibold text-zinc-400 font-mono">Responsive</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">4Direction</h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    Professional corporate web presence for 4Direction. Showcases services and portfolio with a clean, modern design.
                  </p>
                </div>
                <a 
                  href="https://4direction.com.np/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 font-mono"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* EXPERIENCE & JOURNEY TIMELINE */}
      <section className="py-24 px-4 md:px-8 border-t border-white/5" id="experience">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
            className="text-2xl md:text-3xl font-extrabold text-white text-center"
          >
            Experience & Journey
          </motion.h2>

          <div className="relative pl-6 md:pl-8 border-l border-white/10 space-y-12">
            
            {/* Timeline Line */}
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-white/10" />

            {/* Timeline Item 1 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="relative"
            >
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-2.5 h-2.5 rounded-full bg-sky-400 border-2 border-[#0f172a] transition-transform duration-300 hover:scale-125" />
              <div className="space-y-2 p-5 rounded-xl bg-[#1e293b]/20 border border-white/5 hover:bg-[#1e293b]/30 hover:border-white/10 transition-all duration-300">
                <div className="text-[10px] font-mono text-sky-400 font-semibold uppercase">2025 - Present</div>
                <h3 className="text-base font-bold text-white">Freelance Web Developer</h3>
                <div className="text-xs text-zinc-500 font-medium">Self-Employed</div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Building custom web applications and e-commerce solutions for various clients. Specializing in full-stack development with modern JavaScript frameworks and reliable backend systems.
                </p>
              </div>
            </motion.div>

            {/* Timeline Item 2 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="relative"
            >
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-2.5 h-2.5 rounded-full bg-sky-400 border-2 border-[#0f172a] transition-transform duration-300 hover:scale-125" />
              <div className="space-y-2 p-5 rounded-xl bg-[#1e293b]/20 border border-white/5 hover:bg-[#1e293b]/30 hover:border-white/10 transition-all duration-300">
                <div className="text-[10px] font-mono text-zinc-500 font-semibold uppercase">2021</div>
                <h3 className="text-base font-bold text-white">Computer Science Student</h3>
                <div className="text-xs text-zinc-500 font-medium">Narayani Model Secondary School</div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Pursuing secondary education with a focus on computer science and mathematics. Actively participating in coding competitions and tech-related activities while balancing academics with professional system designs.
                </p>
              </div>
            </motion.div>

            {/* Timeline Item 3 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="relative"
            >
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-2.5 h-2.5 rounded-full bg-sky-400 border-2 border-[#0f172a] transition-transform duration-300 hover:scale-125" />
              <div className="space-y-2 p-5 rounded-xl bg-[#1e293b]/20 border border-white/5 hover:bg-[#1e293b]/30 hover:border-white/10 transition-all duration-300">
                <div className="text-[10px] font-mono text-zinc-500 font-semibold uppercase">2018</div>
                <h3 className="text-base font-bold text-white">Started Programming Journey</h3>
                <div className="text-xs text-zinc-500 font-medium">Self-Learning</div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  My first teacher was my Dad, who introduced me to the world of computers. I was instantly fascinated by programming; he was the one who ignited this spark into something wonderful.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* DEVLOG / BLOG SECTION */}
      <section className="py-24 px-4 md:px-8 border-t border-white/5 bg-[#0f172a]/50" id="blog">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="text-2xl md:text-3xl font-extrabold text-white"
            >
              Explore My DevLog
            </motion.h2>
            <motion.p 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="text-xs text-zinc-400 font-mono"
            >
              DOCUMENTING TECHNICAL CHALLENGES AND REAL BACKEND BREAKTHROUGHS
            </motion.p>
          </div>

          {/* DevLog Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <motion.div 
                key={post.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={revealVariants}
                className="p-6 rounded-2xl border border-white/5 bg-[#1e293b]/20 hover:bg-[#1e293b]/40 hover:border-sky-500/20 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{post.title}</h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-3">{post.excerpt}</p>
                </div>
                
                <button 
                  onClick={() => setActiveBlogPost(post)}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1 cursor-pointer self-start"
                >
                  <span>Read Article</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECURE CONTACT GATEWAY */}
      <section className="py-24 px-4 md:px-8 border-t border-white/5" id="contact">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
            className="text-2xl md:text-3xl font-extrabold text-white text-center"
          >
            Get In Touch
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Direct details Left */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="md:col-span-5 flex flex-col justify-between space-y-6 text-[#94a3b8] text-sm leading-relaxed"
            >
              <div className="space-y-4">
                <p>
                  I'm always open to connect with fellow developers, clients and tech enthusiasts. Whether you have a project in mind, want to collaborate or just want to chat, I'd love to hear from you. :)
                </p>
                <p>
                  I'm currently available for freelance projects and open to discussing. My goal is to create something new and exciting, doesn't matter if there is meaningful purpose or not.
                </p>
                <p className="text-xs font-mono text-zinc-500">
                  I don't have much to say! If you want to contact me, I typically respond to messages within 24 hours.
                </p>
              </div>

              {/* Direct Link Grid */}
              <div className="space-y-3.5 font-mono text-xs pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-base">📞</span>
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase font-sans">Phone</span>
                    <a href="tel:+9779809248510" className="text-zinc-200 hover:text-sky-400 font-semibold underline">
                      +977 9809248510
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base">📧</span>
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase font-sans">Email</span>
                    <a href="mailto:mail@success0.com.np" className="text-zinc-200 hover:text-sky-400 font-semibold underline">
                      mail@success0.com.np
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base">📍</span>
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase font-sans">Location</span>
                    <span className="text-zinc-200 font-semibold">
                      Bharatpur-10, Nepal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base">💼</span>
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase font-sans">Availability</span>
                    <span className="text-zinc-200 font-semibold">
                      Open for freelance projects
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Direct Formspree form Right */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="md:col-span-7 bg-[#1e293b]/10 border border-white/5 rounded-2xl p-6 md:p-8"
            >
              <form 
                action="https://formspree.io/f/xvonzgnz" 
                method="POST" 
                className="space-y-4 font-mono text-xs"
              >
                <div className="space-y-1.5">
                  <label className="text-zinc-400 block">Name :</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="John Doe"
                    className="w-full bg-[#0f172a] border border-white/5 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/25 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 block">Email :</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="john@example.com"
                    className="w-full bg-[#0f172a] border border-white/5 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/25 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition font-sans text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 block">Message :</label>
                  <textarea 
                    name="message" 
                    required 
                    rows="4" 
                    placeholder="Describe your backend system or API requirements..."
                    className="w-full bg-[#0f172a] border border-white/5 focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/25 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition font-sans resize-none text-xs"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold rounded-lg font-sans transition duration-200 flex justify-center items-center cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center font-mono text-[11px] text-zinc-600 bg-[#0f172a]/80">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} Success. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="mailto:success@4direction.com.np" className="hover:text-sky-400 transition">Email</a>
            <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="hover:text-sky-400 transition">Portfolio</a>
            <a href="#blog" onClick={(e) => scrollToSection(e, 'blog')} className="hover:text-sky-400 transition">Blog</a>
          </div>
        </div>
      </footer>

      {/* FULL BLOG OVERLAY MODAL */}
      <AnimatePresence>
        {activeBlogPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0f172a]/95 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1e293b]/90 border border-white/10 rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <button 
                onClick={() => setActiveBlogPost(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition p-1 rounded bg-[#0f172a]/50 border border-white/5"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-4 font-sans">
                <div className="flex justify-between text-xs font-mono text-zinc-500">
                  <span>{activeBlogPost.date}</span>
                  <span>{activeBlogPost.readTime}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white leading-snug">{activeBlogPost.title}</h2>
                <div className="text-sm text-[#94a3b8] leading-relaxed whitespace-pre-wrap pt-4 border-t border-white/5">
                  {activeBlogPost.content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}