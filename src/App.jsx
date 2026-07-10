import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, 
  Database, 
  Cpu, 
  Layers, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Award, 
  BookOpen, 
  Calendar,
  CheckCircle2,
  Code,
  Globe,
  Settings,
  User,
  Briefcase
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Verification that all asset paths are relative to support subdirectory deployments like GitHub Pages
  const logoPath = "logo.png";
  const profilePicPath = "portfolio_assets/success.jpg";

  // Tab content switching animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } }
  };

  // Tech stack organized logically by real capabilities
  const technicalStack = {
    backend: [
      { name: "Node.js & Express", desc: "For building fast, asynchronous, and scalable RESTful APIs." },
      { name: "Python", desc: "For server-side automation, advanced scripts, and system utilities." },
      { name: "API Architectures", desc: "Designing clean microservices, middleware pipelines, and secure endpoints." }
    ],
    databases: [
      { name: "Firebase Firestore", desc: "Structured, real-time NoSQL databases with dynamic syncing capabilities." },
      { name: "Realtime Database", desc: "Optimized, low-latency JSON datastores for instantaneous updates." },
      { name: "Cloud Functions", desc: "Serverless backend computing triggered by databases, authentication, or HTTP requests." }
    ],
    automation: [
      { name: "System Automation", desc: "Writing reliable Python and shell scripts to automate background operations." },
      { name: "Custom OS Layers", desc: "Assembling bespoke operating system nodes and hardware controllers for dedicated servers." },
      { name: "IoT Integrations", desc: "Orchestrating hardware telemetry, communication bridges, and local clients." }
    ],
    frontend: [
      { name: "React", desc: "Building responsive, highly organized, and modular web interfaces." },
      { name: "Flutter", desc: "Designing unified, high-performance mobile applications." },
      { name: "GSAP & Tailwind", desc: "Creating sleek, responsive layouts with professional, performant animations." }
    ]
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans relative overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Absolute Ambient Background Glows - subtle and elegant, not distracting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-zinc-500/[0.01] rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#09090b]/85 backdrop-blur-md border-b border-zinc-800/80 py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Logo Name & Designation */}
          <div className="flex items-center gap-3">
            <img 
              src={logoPath} 
              alt="Success Logo" 
              className="h-7 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-wider text-white">SUCCESS</span>
              <span className="text-[10px] text-zinc-400 font-mono">BACKEND & SYSTEMS ENGINEER</span>
            </div>
          </div>

          {/* Desktop Navigation Link Tabs */}
          <nav className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-200 ${
                activeTab === 'home' 
                  ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-200 ${
                activeTab === 'journey' 
                  ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Biography
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-200 ${
                activeTab === 'projects' 
                  ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Case Studies
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-200 ${
                activeTab === 'contact' 
                  ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Inquire
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16 min-h-[calc(100vh-140px)]">
        
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="space-y-16"
            >
              
              {/* LANDING / HERO CORE VALUE */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Hero value statement */}
                <div className="md:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Open for Freelance Contracts & Custom Implementations</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
                    Reliable Backend Systems. <br />
                    <span className="text-zinc-400 font-normal">Scalable Solutions Built to Solve Business Goals.</span>
                  </h1>

                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
                    I design and implement robust, high-availability backend engines, database integrations, and process automations. I focus on code maintainability, strict security parameters, and business outcomes that help clients grow.
                  </p>

                  {/* Trust Metrics Grid */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-900">
                    <div>
                      <span className="block text-xl font-bold text-white font-mono">7+ Years</span>
                      <span className="text-[11px] text-zinc-500 font-mono">Technical Training</span>
                    </div>
                    <div>
                      <span className="block text-xl font-bold text-white font-mono">146+</span>
                      <span className="text-[11px] text-zinc-500 font-mono">Projects Developed</span>
                    </div>
                    <div>
                      <span className="block text-xl font-bold text-white font-mono">41+</span>
                      <span className="text-[11px] text-zinc-500 font-mono font-sans">Delighted Clients</span>
                    </div>
                  </div>

                  {/* Primary Call to Action */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setActiveTab('contact')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-zinc-950 font-medium text-xs rounded-lg hover:bg-emerald-400 transition cursor-pointer"
                    >
                      <span>Inquire About Your Project</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('projects')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-zinc-300 font-medium text-xs rounded-lg hover:bg-zinc-800 border border-zinc-800 transition cursor-pointer"
                    >
                      <span>Examine Case Studies</span>
                    </button>
                  </div>
                </div>

                {/* Profile Photo frame */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 p-2 shadow-xl">
                    <img 
                      src={profilePicPath} 
                      alt="Success - Systems Developer" 
                      className="w-full h-full object-cover rounded-xl filter grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                      onError={(e) => {
                        // Safe fallback inside the exact portfolio boundary if user profile image is inaccessible
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

              </section>

              {/* SERVICES & CORE OFFERING */}
              <section className="space-y-8 pt-8 border-t border-zinc-900">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-semibold text-white">How I Help Businesses Succeed</h2>
                  <p className="text-zinc-500 text-xs font-mono">CORE SERVICES TARGETED AT SYSTEM SECURITY AND OPERATIONAL EFFICIENCY</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Service Card 1 */}
                  <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/20 space-y-3 hover:border-zinc-700 transition">
                    <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg w-fit">
                      <Server className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">Distributed Server Engines</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Building highly organized API pipelines and backend layers in Node.js and Python. Engineered with standard security integrations, structured middleware, and clear error protocols.
                    </p>
                  </div>

                  {/* Service Card 2 */}
                  <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/20 space-y-3 hover:border-zinc-700 transition">
                    <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg w-fit">
                      <Database className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">Cloud Databases & Real-time Sync</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Configuring structured Firebase Firestore and Realtime Databases to sync live data securely. Orchestrating Cloud Functions to handle database events and system tasks automatically.
                    </p>
                  </div>

                  {/* Service Card 3 */}
                  <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/20 space-y-3 hover:border-zinc-700 transition">
                    <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg w-fit">
                      <Cpu className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">Automation & Hardware OS</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Developing automated background services, telemetry engines, and Raspberry Pi system automation scripts. Creating seamless communication channels between smart devices and cloud architectures.
                    </p>
                  </div>

                </div>
              </section>

              {/* CORE SKILL MATRIX TABLE */}
              <section className="space-y-8 pt-8 border-t border-zinc-900">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-semibold text-white">Technical Core Matrix</h2>
                  <p className="text-zinc-500 text-xs font-mono">SPECIFIC SKILLS APPLIED IN PRODUCTION ENVIRONMENTS</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-mono text-zinc-400 mb-3 border-b border-zinc-800 pb-2">BACKEND & API DESIGN</h3>
                    <div className="space-y-4">
                      {technicalStack.backend.map((tech, idx) => (
                        <div key={idx} className="space-y-1">
                          <h4 className="text-xs font-bold text-white">{tech.name}</h4>
                          <p className="text-zinc-400 text-xs">{tech.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono text-zinc-400 mb-3 border-b border-zinc-800 pb-2">PERSISTENCE & INFRASTRUCTURE</h3>
                    <div className="space-y-4">
                      {technicalStack.databases.map((tech, idx) => (
                        <div key={idx} className="space-y-1">
                          <h4 className="text-xs font-bold text-white">{tech.name}</h4>
                          <p className="text-zinc-400 text-xs">{tech.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {activeTab === 'journey' && (
            <motion.div
              key="journey"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="space-y-12"
            >
              
              {/* BIOGRAPHY INTRO */}
              <section className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[10px]">
                  <User className="h-3.5 w-3.5" />
                  <span>BIOGRAPHY</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                  About Success
                </h1>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  I began coding in 2018 at the age of 10 under the guidance of my father, who introduced me to computing fundamentals. Over the last seven years, programming evolved from a fascinating exploration into a dedicated technical trade.
                </p>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  Based in Bharatpur, Nepal, I balance my secondary school computer science studies at the historic Narayani Model Secondary School with independent freelance client work. I construct custom full-stack solutions and reliable backends for clients globally.
                </p>
              </section>

              {/* TIMELINE */}
              <section className="space-y-8 pt-8 border-t border-zinc-900">
                <div className="space-y-1.5">
                  <h2 className="text-lg font-semibold text-white">Chronological Milestones</h2>
                  <p className="text-zinc-500 text-xs font-mono">TRACKING REAL EXPERIENCE AND ACHIEVEMENTS</p>
                </div>

                <div className="border-l border-zinc-800 pl-6 space-y-10 relative">
                  
                  {/* Timeline Node 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-zinc-950" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">2025 – Present</span>
                      <h3 className="text-sm font-semibold text-white">Independent Freelance Developer</h3>
                      <p className="text-zinc-400 text-xs max-w-2xl leading-relaxed">
                        Providing specialized, contract-based fullstack web development. Authoring clean, secure APIs in Node.js, establishing real-time Firebase sync networks, and deploying tailored web experiences for clients globally.
                      </p>
                    </div>
                  </div>

                  {/* Timeline Node 2 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-500 border border-zinc-950" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">2021 – Present</span>
                      <h3 className="text-sm font-semibold text-white">Computer Science Student — Narayani Model Secondary School</h3>
                      <p className="text-zinc-400 text-xs max-w-2xl leading-relaxed">
                        Pursuing secondary education with a rigorous focus on Mathematics, Logic, and Computer Science in Bharatpur, Nepal. Participating actively in regional programming competitions and organizing community coding groups.
                      </p>
                    </div>
                  </div>

                  {/* Timeline Node 3 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-500 border border-zinc-950" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">2018</span>
                      <h3 className="text-sm font-semibold text-white">The Spark (First Introduction)</h3>
                      <p className="text-zinc-400 text-xs max-w-2xl leading-relaxed">
                        First introduced to computers and logical scripting by my father. Discovered an immediate curiosity for building logical systems and automations, sparking a continuous 7+ year journey of self-guided technical study.
                      </p>
                    </div>
                  </div>

                </div>
              </section>

            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="space-y-12"
            >
              
              {/* Header */}
              <section className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[10px]">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>CASE STUDIES</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                  Selected Production Implementations
                </h1>
                <p className="text-zinc-400 text-sm">
                  A review of primary technical systems I have built, highlighting core architectures and business values delivered.
                </p>
              </section>

              {/* PROJECT LIST */}
              <section className="grid grid-cols-1 gap-8 pt-8 border-t border-zinc-900">
                
                {/* Case Study 1: Bharatpur Bazar */}
                <div className="p-6 md:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase border border-emerald-900/50 bg-emerald-950/20 px-2.5 py-0.5 rounded-lg">
                        Live Production Deployment
                      </span>
                      <h3 className="text-xl font-bold text-white">Bharatpur Bazar</h3>
                      <p className="text-zinc-400 text-xs">Dynamic grocery & food delivery platform serving Bharatpur, Nepal.</p>
                    </div>
                    <a 
                      href="https://bb.hs.vc" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-mono text-white transition self-start"
                    >
                      <span>Explore Live Site</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Architecture Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-900">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-mono block">BUSINESS VALUE DELIVERED</span>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        Delivers a localized, efficient platform connecting farmers and stores directly to consumers in the municipality, featuring real-time inventory and delivery dispatch.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-mono block">CORE ARCHITECTURE</span>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        A Node.js backend acting as a central processing engine, integrated with Firebase's real-time persistent cluster to sync live order statuses immediately.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-mono block">KEY SYSTEM CHOICES</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-[10px] text-zinc-400">Node.js API</span>
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-[10px] text-zinc-400">Firebase Firestore</span>
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-[10px] text-zinc-400">Google Maps API</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Case Study 2: Success AI Home */}
                <div className="p-6 md:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-400 font-semibold tracking-wider uppercase border border-zinc-800 bg-zinc-900/50 px-2.5 py-0.5 rounded-lg">
                        Private Automation System
                      </span>
                      <h3 className="text-xl font-bold text-white">Success AI HomeOS</h3>
                      <p className="text-zinc-400 text-xs">Secure, distributed IoT operating system layer.</p>
                    </div>
                  </div>

                  {/* Architecture Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-900">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-mono block">BUSINESS VALUE DELIVERED</span>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        Consolidates smart home devices, telemetry sensors, and media controls into a highly private system running entirely locally without external data sharing.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-mono block">CORE ARCHITECTURE</span>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        A persistent Python background daemon orchestrating sensor polls and system commands, communicating through MQTT socket channels to a fast unified Flutter client.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-mono block">KEY SYSTEM CHOICES</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-[10px] text-zinc-400">Python Daemon</span>
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-[10px] text-zinc-400">MQTT Protocols</span>
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-[10px] text-zinc-400">Flutter Client</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Case Study 3: 4Direction */}
                <div className="p-6 md:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase border border-emerald-900/50 bg-emerald-950/20 px-2.5 py-0.5 rounded-lg">
                        Corporate Production Web
                      </span>
                      <h3 className="text-xl font-bold text-white">4Direction Corporate Presence</h3>
                      <p className="text-zinc-400 text-xs">Professional digital storefront presenting corporate operations.</p>
                    </div>
                    <a 
                      href="https://4direction.com.np/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-mono text-white transition self-start"
                    >
                      <span>Explore Live Site</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Architecture Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-900">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-mono block">BUSINESS VALUE DELIVERED</span>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        Establishes an elegant corporate face, optimizing presentation smoothness and user transitions to communicate reliable services to enterprise leads.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-mono block">CORE ARCHITECTURE</span>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        Built upon a structured React component model. Uses advanced GSAP animation structures mapped to viewport bounds for optimized visual transitions.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-mono block">KEY SYSTEM CHOICES</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-[10px] text-zinc-400">React Core</span>
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-[10px] text-zinc-400">GSAP Animations</span>
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded text-[10px] text-zinc-400">Tailwind CSS</span>
                      </div>
                    </div>
                  </div>
                </div>

              </section>

            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="space-y-12"
            >
              
              {/* Header */}
              <section className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[10px]">
                  <Mail className="h-3.5 w-3.5" />
                  <span>INQUIRE</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                  Inquire About Your Project
                </h1>
                <p className="text-zinc-400 text-sm">
                  Let\'s discuss your backend, automation, or database requirements.
                </p>
              </section>

              {/* Direct channels & form */}
              <section className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-zinc-900">
                
                {/* Left direct details */}
                <div className="md:col-span-5 space-y-6 font-mono text-xs text-zinc-400">
                  <p className="font-sans text-sm text-zinc-400">
                    Feel free to reach out via these direct communication channels to discuss project scope, timelines, and contract specifics.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
                      <Mail className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-zinc-500 block">PRIMARY EMAIL</span>
                        <a href="mailto:mail@success0.com.np" className="text-zinc-200 hover:text-emerald-400 underline font-semibold">
                          mail@success0.com.np
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
                      <Mail className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-zinc-500 block">SECONDARY EMAIL</span>
                        <a href="mailto:success@4direction.com.np" className="text-zinc-200 hover:text-emerald-400 underline font-semibold">
                          success@4direction.com.np
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
                      <Phone className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-zinc-500 block">DIRECT PHONE</span>
                        <a href="tel:+9779809248510" className="text-zinc-200 hover:text-emerald-400 underline font-semibold">
                          +977 9809248510
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
                      <MapPin className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-zinc-500 block">LOCATION</span>
                        <span className="text-zinc-200 font-semibold">
                          Bharatpur-10, Nepal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Form */}
                <div className="md:col-span-7 bg-zinc-900/20 p-6 rounded-2xl border border-zinc-800">
                  <h3 className="text-sm font-semibold text-white mb-4">Direct Message</h3>
                  
                  <form 
                    action="https://formspree.io/f/xvonzgnz" 
                    method="POST"
                    className="space-y-4 text-xs font-mono"
                  >
                    <div>
                      <label className="text-zinc-400 block mb-1">Your Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        className="w-full bg-[#09090b] border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition font-sans"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">Your Email</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        className="w-full bg-[#09090b] border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition font-sans"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">Message Detail</label>
                      <textarea 
                        name="message"
                        required
                        rows="4"
                        className="w-full bg-[#09090b] border border-zinc-800 focus:border-emerald-500 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-700 outline-none transition font-sans resize-none"
                        placeholder="Describe your backend system or API project goals..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg font-sans transition-all duration-200 flex justify-center items-center gap-1.5 cursor-pointer"
                    >
                      <span>Send Message</span>
                    </button>
                  </form>
                </div>

              </section>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-8 text-center font-mono text-[11px] text-zinc-600 bg-[#09090b]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>© {new Date().getFullYear()} Success. All rights reserved.</span>
          <span>Designed cleanly for real production.</span>
          <span>Bharatpur-10, Nepal 🇳🇵</span>
        </div>
      </footer>

    </div>
  );
}