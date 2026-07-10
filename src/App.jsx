import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  Database, 
  Layers, 
  TrendingUp, 
  GitBranch, 
  Server, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ExternalLink, 
  Play, 
  Square, 
  RefreshCw, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Award,
  ChevronRight,
  BookOpen,
  Calendar,
  Lock,
  Compass,
  Lightbulb,
  Wifi,
  Power
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('console');
  const [consoleLogs, setConsoleLogs] = useState([
    { text: 'Success System v4.2.0 initialized...', type: 'system' },
    { text: 'Loading backend microservices...', type: 'system' },
    { text: 'Type "help" to list available commands.', type: 'info' }
  ]);
  const [consoleInput, setConsoleInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([ ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const consoleBottomRef = useRef(null);

  // System Dashboard Metrics States
  const [cpuUsage, setCpuUsage] = useState(24);
  const [ramUsage, setRamUsage] = useState(4.2);
  const [requestRate, setRequestRate] = useState(12);
  const [dbSyncs, setDbSyncs] = useState(642);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);
  const [dashboardLogs, setDashboardLogs] = useState([
    { id: 1, time: '15:23:01', msg: '[api-gateway] GET /v1/portfolio - 200 OK - 8ms', status: 'ok' },
    { id: 2, time: '15:23:04', msg: '[db-sync] Syncing Firestore realtime records', status: 'sync' },
    { id: 3, time: '15:23:08', msg: '[worker-0] Firebase sync queue: 0 pending', status: 'idle' }
  ]);

  // Success AI Home Simulated States
  const [livingRoomLights, setLivingRoomLights] = useState(true);
  const [acTemp, setAcTemp] = useState(22);
  const [securityStatus, setSecurityStatus] = useState('Armed & Secure');
  const [aiHomeLogs, setAiHomeLogs] = useState([
    'System: Smart home environment active',
    'Sensors: Motion detected in entrance (2 mins ago)',
    'AI: Optimal temperature configured (22°C)'
  ]);

  // Bharatpur Bazar Simulated States
  const [activeOrders, setActiveOrders] = useState(14);
  const [deliveryDelay, setDeliveryDelay] = useState(24); // mins

  // Contact form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
  const [formResponse, setFormResponse] = useState(null);

  // Auto scroll console
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Simulate Live Metric Fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const base = isSimulatingLoad ? 82 : 25;
        const delta = Math.floor(Math.random() * 12) - 6;
        return Math.min(100, Math.max(2, base + delta));
      });

      setRamUsage(prev => {
        const base = isSimulatingLoad ? 7.4 : 4.1;
        const delta = parseFloat((Math.random() * 0.4 - 0.2).toFixed(1));
        return Math.min(16, Math.max(1, base + delta));
      });

      setRequestRate(prev => {
        const base = isSimulatingLoad ? 140 : 15;
        const delta = Math.floor(Math.random() * 10) - 5;
        return Math.min(250, Math.max(0, base + delta));
      });

      setDbSyncs(prev => prev + (Math.random() > 0.6 ? 1 : 0));

      // Append live server logs randomly
      if (Math.random() > 0.6) {
        const microservices = ['api-gateway', 'db-sync', 'worker-0', 'auth-service', 'iot-agent'];
        const methods = ['GET', 'POST', 'PUT', 'DELETE'];
        const routes = ['/v1/projects', '/v1/stats', '/v1/profile', '/v1/contact', '/v1/iot-state'];
        const statuses = ['200 OK', '201 Created', '304 Not Modified'];
        
        const randomService = microservices[Math.floor(Math.random() * microservices.length)];
        let message = '';
        let statusType = 'ok';

        if (randomService === 'api-gateway') {
          const method = methods[Math.floor(Math.random() * methods.length)];
          const route = routes[Math.floor(Math.random() * routes.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const responseTime = Math.floor(Math.random() * 45) + 3;
          message = `[api-gateway] ${method} ${route} - ${status} - ${responseTime}ms`;
        } else if (randomService === 'db-sync') {
          message = `[db-sync] Syncing Firestore node: updated ${Math.floor(Math.random() * 3) + 1} records`;
          statusType = 'sync';
        } else if (randomService === 'worker-0') {
          message = `[worker-0] Garbage Collection complete. Cache hit: 98.4%`;
          statusType = 'idle';
        } else if (randomService === 'iot-agent') {
          message = `[iot-agent] Heartbeat received from HomeOS-Node1`;
          statusType = 'sync';
        } else {
          message = `[auth-service] JWT token verified successfully`;
        }

        const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });
        setDashboardLogs(prev => [
          { id: Date.now(), time: timeString, msg: message, status: statusType },
          ...prev.slice(0, 14)
        ]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulatingLoad]);

  // Terminal commands interpreter
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = consoleInput.trim().toLowerCase();
    if (!cmd) return;

    setCommandHistory(prev => [ ...prev, consoleInput ]);
    setHistoryIndex(-1);

    const newLogs = [ ...consoleLogs, { text: `success-system@root:~$ ${consoleInput}`, type: 'command' } ];
    const args = cmd.split(' ');
    const primaryCmd = args[0];

    switch (primaryCmd) {
      case 'help':
        newLogs.push(
          { text: 'Available system tools:', type: 'system' },
          { text: '  about        - Displays professional bio and profile details.', type: 'info' },
          { text: '  skills       - Prints backend and system engineering technologies.', type: 'info' },
          { text: '  stats        - Displays professional track record and statistics.', type: 'info' },
          { text: '  projects     - Lists high-performance projects and architecture.', type: 'info' },
          { text: '  db-status    - Performs real-time firebase databases and systems check.', type: 'info' },
          { text: '  iot-logs     - Streams live log feed from Success AI HomeOS.', type: 'info' },
          { text: '  neofetch     - Shows custom hardware, core systems information & credentials.', type: 'info' },
          { text: '  contact      - Details for secure communications and freelance outreach.', type: 'info' },
          { text: '  clear        - Wipes terminal screen buffer.', type: 'info' }
        );
        break;

      case 'about':
        newLogs.push(
          { text: '=== PROFESSIONAL PROFILE ===', type: 'system' },
          { text: 'Name: Success', type: 'info' },
          { text: 'Age: 18 years old', type: 'info' },
          { text: 'Location: Bharatpur-10, Nepal', type: 'info' },
          { text: 'Role: Backend & Distributed System Architect / Freelance Fullstack Developer', type: 'info' },
          { text: 'Focus: High-performance microservices, automated systems, smart home automation kernel layers, and real-time syncing architectures.', type: 'info' },
          { text: 'Journey: Initiated into development at age 10 (2018) by father. Currently balancing academic pursuits at Narayani Model Secondary School with enterprise-level freelancing.', type: 'info' }
        );
        break;

      case 'skills':
        newLogs.push(
          { text: '=== HIGH-STATUS CORE TECHNICAL STACK ===', type: 'system' },
          { text: '  [BACKEND ARCHITECTURES] Node.js, Express, Microservices, Python API Engines', type: 'info' },
          { text: '  [REAL-TIME DATA SINK]   Firebase Firestore, Realtime Database, Cloud Functions', type: 'info' },
          { text: '  [SYSTEMS & INTERNET]    Python System Automation, Smart Home Devices (IoT), Bash Scripts', type: 'info' },
          { text: '  [FRONTEND HIGH-FIDELITY] React, GSAP ScrollTrigger, Tailwind CSS v4, Flutter', type: 'info' },
          { text: '  [DEVELOPMENT & OPS]     Git, Linux Kernels, Distributed Systems Design, Scalable API Pipelines', type: 'info' }
        );
        break;

      case 'stats':
        newLogs.push(
          { text: '=== TRACK RECORD METRICS ===', type: 'system' },
          { text: '  - Years of Active Engineering:  7+ Years (Started 2018)', type: 'info' },
          { text: '  - Total Projects Compiled:      146+ Projects', type: 'info' },
          { text: '  - High-Value Clients Delivered: 41+ Enterprise & Freelance Clients', type: 'info' },
          { text: '  - GitHub Global Contributions:  Contributed to 600+ Repositories', type: 'info' }
        );
        break;

      case 'projects':
        newLogs.push(
          { text: '=== KEY ARCHITECTURAL WORK ===', type: 'system' },
          { text: '1. BHARATPUR BAZAR (Active platform: https://bb.hs.vc)', type: 'info' },
          { text: '   - Hyper-local automated food/grocery delivery node.', type: 'info' },
          { text: '   - Tech: Node.js, Firebase Backend Core, Google Maps Route Optimization.', type: 'info' },
          { text: '2. SUCCESS AI HOME (Private OS)', type: 'info' },
          { text: '   - Real-time secure home automation OS.', type: 'info' },
          { text: '   - Tech: Custom Python Daemon, Flutter Mobile Client, Private MQTT Broker.', type: 'info' },
          { text: '3. 4DIRECTION CORPORATE WEB (Active: https://4direction.com.np/)', type: 'info' },
          { text: '   - Extremely responsive fluid portfolio with elite GSAP choreography.', type: 'info' }
        );
        break;

      case 'db-status':
        newLogs.push(
          { text: '⚡ Initializing system-wide Firebase integrity probe...', type: 'sync' },
          { text: '✔ Connection to US-Central1-GCP Firestore cluster - STABLE (18ms)', type: 'info' },
          { text: '✔ Sync state: ACTIVE. Total listeners: 14', type: 'info' },
          { text: `✔ Live synchronizations logged: ${dbSyncs} records sync\'d perfectly.`, type: 'info' },
          { text: '✔ No packet loss detected. Real-time sockets optimized.', type: 'sync' }
        );
        break;

      case 'iot-logs':
        newLogs.push(
          { text: '📡 Attaching listener to success-ai-home-os daemon...', type: 'sync' },
          { text: `[15:21:40] - DAEMON: Local server listening on port 8080`, type: 'info' },
          { text: `[15:22:01] - SENSOR: Temperature threshold normalized to ${acTemp}°C`, type: 'info' },
          { text: `[15:22:15] - CLIENT: Flutter App connected. Client UID: SUCCESS_M1`, type: 'info' },
          { text: `[15:22:45] - HARDWARE: Living Room Lights toggled: ${livingRoomLights ? 'ON' : 'OFF'}`, type: 'info' },
          { text: `[15:23:10] - MONITOR: Security firewall status: ${securityStatus}`, type: 'sync' }
        );
        break;

      case 'neofetch':
        newLogs.push(
          { text: '                  \x1B[1;36mdeveloper\x1B[0m@\x1B[1;36msuccess-os\x1B[0m', type: 'info' },
          { text: '    .-_-.        --------------------------', type: 'info' },
          { text: '   /  o o  \\     \x1B[1;35mOS:\x1B[0m Success Custom Linux / Real-time Daemon Engine', type: 'info' },
          { text: '   \\   _   /     \x1B[1;35mHost:\x1B[0m Narayani Model Secondary School (Bharatpur, Nepal)', type: 'info' },
          { text: '    `-_-_-\x1B[1;31m`      \x1B[1;35mKernel:\x1B[0m Node.js Node_v20.20.2', type: 'info' },
          { text: '                 \x1B[1;35mUptime:\x1B[0m 7+ Years of coding expertise (Since 2018)', type: 'info' },
          { text: '                 \x1B[1;35mShell:\x1B[0m Bash / React Interactive CLI', type: 'info' },
          { text: '                 \x1B[1;35mUI Theme:\x1B[0m Terminal Premium Onyx Carbon Slate', type: 'info' },
          { text: '                 \x1B[1;35mTerminal Font:\x1B[0m JetBrains Mono / Fira Code', type: 'info' },
          { text: '                 \x1B[1;35mCPU:\x1B[0m Intel Core i9 Brain-Sync Octa-Threads @ 5.0GHz', type: 'info' },
          { text: '                 \x1B[1;35mMemory:\x1B[0m 16GB Virtual Stack Buffer Area (Optimal)', type: 'info' }
        );
        break;

      case 'contact':
        newLogs.push(
          { text: '=== SECURE CONTACT GATEWAYS ===', type: 'system' },
          { text: '  Email (Primary):    mail@success0.com.np', type: 'info' },
          { text: '  Email (Secondary):  success@4direction.com.np', type: 'info' },
          { text: '  Mobile / Direct:    +977 9809248510', type: 'info' },
          { text: '  Location Desk:      Bharatpur-10, Nepal', type: 'info' },
          { text: '  Availability:       Active & Available for Global Microservices and Freelance Contracts.', type: 'sync' }
        );
        break;

      case 'clear':
        setConsoleLogs([ ]);
        setConsoleInput('');
        return;

      default:
        newLogs.push({ text: `bash: command not found: "${primaryCmd}". Type "help" for a list of system operations.`, type: 'error' });
        break;
    }

    setConsoleLogs(newLogs);
    setConsoleInput('');
  };

  const handleArrowKeys = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const index = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setConsoleInput(commandHistory[index]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const index = historyIndex === -1 ? -1 : historyIndex + 1;
      if (index === -1 || index >= commandHistory.length) {
        setHistoryIndex(-1);
        setConsoleInput('');
      } else {
        setHistoryIndex(index);
        setConsoleInput(commandHistory[index]);
      }
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormStatus('sending');

    // Simulate real-time API call delay to Firestore or Cloud Functions
    setTimeout(() => {
      setFormStatus('success');
      setFormResponse({
        timestamp: new Date().toISOString(),
        status: 201,
        message: 'DOCUMENT_CREATED',
        documentId: 'contact_' + Math.random().toString(36).substring(2, 11),
        payload: {
          name: formData.name,
          email: formData.email,
          body_length: formData.message.length
        }
      });
      // Clear fields
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  // Pre-fill terminal commands on clicking suggestions
  const triggerTerminalCommand = (command) => {
    setConsoleInput(command);
    setActiveTab('console');
    setTimeout(() => {
      const e = { preventDefault: () => { } };
      // Simulate input event dispatch
      const fakeInput = document.getElementById('console-input-el');
      if (fakeInput) fakeInput.focus();
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden bg-grid-pattern selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Visual background ambient gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* ONLINE STATUS BAR TICKER */}
      <div className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 py-3.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* Logo Name */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Success Logo" 
              className="h-8 w-auto hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <span className="font-extrabold text-lg tracking-wider text-white">SUCCESS</span>
              <span className="text-xs text-slate-400 font-mono ml-2 border border-slate-700 px-1.5 py-0.5 rounded bg-slate-950">
                SYSTEMS ARCHITECT
              </span>
            </div>
          </div>

          {/* Microservices metrics bar */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-400 border-l border-slate-800 pl-6">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Node_v20: <strong className="text-emerald-400">ACTIVE</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Firebase Connection: <strong className="text-emerald-400">100%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>Synced Records: <strong className="text-cyan-400">{dbSyncs}</strong></span>
            </div>
          </div>

          {/* Contact action */}
          <div className="flex items-center gap-4">
            <a 
              href="mailto:mail@success0.com.np"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-mono transition-all duration-200"
            >
              <Mail className="h-3.5 w-3.5 text-cyan-400" />
              <span>mail@success0.com.np</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 md:mb-24">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-cyan-400 font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Available for Freelance Contracts & System Architecture</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
              Building High-Status <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 text-shimmer">
                Distributed Backends
              </span> <br />
              & Automated Systems
            </h1>

            <p className="text-slate-400 text-base md:text-lg max-w-xl font-mono leading-relaxed">
              I am <span className="text-white font-semibold">Success</span>, an 18-year-old backend specialist and systems engineer based in Bharatpur, Nepal. I build robust microservices, custom IoT smart home kernels, real-time sync systems, and scalable APIs that never sleep.
            </p>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="bg-slate-900/50 border border-slate-900 p-3.5 rounded-xl text-center font-mono hover:border-slate-800/80 transition-all">
                <span className="block text-2xl md:text-3xl font-extrabold text-cyan-400">7+</span>
                <span className="text-xs text-slate-400">Years Coding</span>
              </div>
              <div className="bg-slate-900/50 border border-slate-900 p-3.5 rounded-xl text-center font-mono hover:border-slate-800/80 transition-all">
                <span className="block text-2xl md:text-3xl font-extrabold text-indigo-400">146+</span>
                <span className="text-xs text-slate-400">Projects Built</span>
              </div>
              <div className="bg-slate-900/50 border border-slate-900 p-3.5 rounded-xl text-center font-mono hover:border-slate-800/80 transition-all">
                <span className="block text-2xl md:text-3xl font-extrabold text-purple-400">41+</span>
                <span className="text-xs text-slate-400">Happy Clients</span>
              </div>
              <div className="bg-slate-900/50 border border-slate-900 p-3.5 rounded-xl text-center font-mono hover:border-slate-800/80 transition-all">
                <span className="block text-2xl md:text-3xl font-extrabold text-emerald-400">600+</span>
                <span className="text-xs text-slate-400">Git Contribs</span>
              </div>
            </div>

            {/* Quick terminal actions */}
            <div className="flex flex-wrap gap-3 pt-2 font-mono text-xs">
              <span className="text-slate-500 self-center">Try Console:</span>
              <button 
                onClick={() => triggerTerminalCommand('about')}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 cursor-pointer"
              >
                $ neofetch
              </button>
              <button 
                onClick={() => triggerTerminalCommand('skills')}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-400 cursor-pointer"
              >
                $ skills
              </button>
              <button 
                onClick={() => triggerTerminalCommand('db-status')}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 cursor-pointer"
              >
                $ db-status
              </button>
            </div>
          </div>

          {/* Profile Picture with animated cybernetic circles */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              
              {/* Outer Cyan Ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40 animate-[spin_50s_linear_infinite]" />
              {/* Mid Indigo Ring */}
              <div className="absolute -inset-4 rounded-full border border-double border-indigo-500/20 animate-[spin_30s_linear_infinite_reverse]" />
              {/* Inner Purple Ring */}
              <div className="absolute inset-4 rounded-full border border-dotted border-purple-500/30 animate-[spin_15s_linear_infinite]" />
              
              {/* Profile Image container */}
              <div className="absolute inset-2 bg-slate-950 rounded-full overflow-hidden border-2 border-slate-800 shadow-2xl">
                <img 
                  src="/portfolio_assets/success.jpg" 
                  alt="Success Developer" 
                  className="w-full h-full object-cover object-center filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Status HUD indicator */}
              <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 py-1.5 px-3 rounded-lg font-mono text-[10px] flex items-center gap-1.5 backdrop-blur-sm shadow-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">SYSTEM: ONLINE</span>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSPACE & SYSTEM INTERACTIVE SPLIT */}
        <section className="mb-16 md:mb-24">
          <div className="border border-slate-800 rounded-2xl bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-2xl">
            
            {/* Tab selector bar */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 justify-between items-center flex-wrap sm:flex-nowrap gap-2">
              <div className="flex gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('console')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'console' 
                      ? 'bg-slate-900 text-cyan-400 border border-slate-800 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="h-4 w-4" />
                  <span>Interactive System Console</span>
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'dashboard' 
                      ? 'bg-slate-900 text-indigo-400 border border-slate-800 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="h-4 w-4" />
                  <span>Real-time System Monitor</span>
                </button>
              </div>

              {/* Server Status Lights */}
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pr-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>v20_node</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>db_synchronized</span>
                </div>
              </div>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-4 md:p-6 min-h-[420px] bg-slate-950/40">
              
              <AnimatePresence mode="wait">
                {activeTab === 'console' && (
                  <motion.div 
                    key="console"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col h-[400px]"
                  >
                    
                    {/* Console Info Header */}
                    <div className="mb-4 text-xs font-mono text-slate-500 border-b border-slate-900 pb-2.5 flex justify-between items-center flex-wrap gap-2">
                      <span>Type <strong className="text-cyan-400">help</strong> to show system-wide commands, or trigger: <strong onClick={() => triggerTerminalCommand('about')} className="text-indigo-400 underline cursor-pointer">about</strong>, <strong onClick={() => triggerTerminalCommand('neofetch')} className="text-purple-400 underline cursor-pointer">neofetch</strong>, <strong onClick={() => triggerTerminalCommand('iot-logs')} className="text-emerald-400 underline cursor-pointer">iot-logs</strong></span>
                      <button 
                        onClick={() => setConsoleLogs([ ])}
                        className="text-slate-600 hover:text-slate-400 transition"
                      >
                        [Wipe Buffer]
                      </button>
                    </div>

                    {/* Console Buffer logs */}
                    <div className="flex-1 overflow-y-auto font-mono text-xs md:text-sm space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                      {consoleLogs.map((log, index) => {
                        let textStyle = 'text-slate-300';
                        if (log.type === 'command') textStyle = 'text-cyan-400 font-bold';
                        else if (log.type === 'system') textStyle = 'text-indigo-400';
                        else if (log.type === 'sync') textStyle = 'text-emerald-400';
                        else if (log.type === 'error') textStyle = 'text-rose-400';
                        else if (log.type === 'info') textStyle = 'text-slate-400';

                        return (
                          <div key={index} className="whitespace-pre-wrap leading-relaxed">
                            {log.text}
                          </div>
                        );
                      })}
                      <div ref={consoleBottomRef} />
                    </div>

                    {/* Interactive Shell Terminal Command Line */}
                    <form onSubmit={handleTerminalSubmit} className="mt-4 flex items-center border-t border-slate-900 pt-3">
                      <span className="text-cyan-400 font-mono text-sm mr-2 font-bold select-none">
                        success-system@root:~$
                      </span>
                      <input 
                        id="console-input-el"
                        type="text"
                        value={consoleInput}
                        onChange={(e) => setConsoleInput(e.target.value)}
                        onKeyDown={handleArrowKeys}
                        className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono text-sm caret-cyan-400 p-0 focus:ring-0 focus:border-none"
                        placeholder="Type standard command (e.g. neofetch, clear)..."
                        autoComplete="off"
                        autoFocus
                      />
                    </form>
                  </motion.div>
                )}

                {activeTab === 'dashboard' && (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    
                    {/* Live hardware widgets and status */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      {/* CPU Metric Card */}
                      <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800/80 transition relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-mono text-slate-400">HOST CPU LOAD</span>
                          <Cpu className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div className="text-2xl font-mono font-bold text-white flex items-baseline gap-1">
                          {cpuUsage}%
                        </div>
                        <div className="mt-2 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-cyan-400 h-full transition-all duration-1000"
                            style={{ width: `${cpuUsage}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 mt-1 block">8-cores synchronized</span>
                      </div>

                      {/* Memory Allocation Card */}
                      <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800/80 transition relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-mono text-slate-400">RAM ALLOCATION</span>
                          <Server className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="text-2xl font-mono font-bold text-white flex items-baseline gap-1">
                          {ramUsage} <span className="text-xs text-slate-400">GB / 16GB</span>
                        </div>
                        <div className="mt-2 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-400 h-full transition-all duration-1000"
                            style={{ width: `${(ramUsage / 16) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 mt-1 block">Memory leak protection: active</span>
                      </div>

                      {/* Web API request rate */}
                      <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800/80 transition relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-mono text-slate-400">API REQUESTS</span>
                          <TrendingUp className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="text-2xl font-mono font-bold text-white">
                          {requestRate} <span className="text-xs text-slate-400">req/sec</span>
                        </div>
                        <div className="mt-2 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-purple-400 h-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (requestRate / 250) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 mt-1 block">Avg latency: 12ms (Cached)</span>
                      </div>

                      {/* Database Live Sync count */}
                      <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800/80 transition relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-mono text-slate-400">REALTIME DB SYNCS</span>
                          <Database className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-mono font-bold text-white flex items-baseline gap-1">
                          {dbSyncs}
                        </div>
                        <div className="mt-2 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full transition-all duration-300 animate-pulse"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 mt-1 block">Firestore sync listener operational</span>
                      </div>

                    </div>

                    {/* Simulation Load Triggers */}
                    <div className="bg-slate-950/70 border border-slate-900 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-semibold font-mono text-white flex items-center gap-2">
                          <Power className="h-4 w-4 text-cyan-400 animate-pulse" />
                          <span>System Stress Test Simulator</span>
                        </h4>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                          Simulate high traffic loads on Success\'s backend structure to visualize resource reallocation.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSimulatingLoad(!isSimulatingLoad)}
                        className={`flex items-center gap-2 px-4 py-2 font-mono text-xs rounded-lg transition-all duration-300 ${
                          isSimulatingLoad 
                            ? 'bg-rose-950/40 text-rose-400 border border-rose-800 animate-pulse' 
                            : 'bg-cyan-950/40 text-cyan-400 border border-cyan-800 hover:bg-cyan-900/30'
                        }`}
                      >
                        {isSimulatingLoad ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        <span>{isSimulatingLoad ? 'HALT STRESS TEST' : 'TRIGGER STRESS TEST'}</span>
                      </button>
                    </div>

                    {/* Real-time Streaming Server Log Feed */}
                    <div className="border border-slate-900 bg-slate-950 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-3 font-mono text-xs border-b border-slate-900 pb-2">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <GitBranch className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                          <span>Streaming Microservice Server Logs (Daemon Status)</span>
                        </span>
                        <span className="inline-flex items-center gap-1 bg-emerald-950/50 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>LIVE</span>
                        </span>
                      </div>

                      <div className="h-40 overflow-y-auto font-mono text-xs space-y-1.5 pr-2">
                        {dashboardLogs.map((log) => {
                          let badgeStyle = 'text-cyan-400 bg-cyan-950/30 border border-cyan-900/40';
                          if (log.status === 'sync') badgeStyle = 'text-purple-400 bg-purple-950/30 border border-purple-900/40';
                          if (log.status === 'idle') badgeStyle = 'text-emerald-400 bg-emerald-950/30 border border-emerald-900/40';

                          return (
                            <div key={log.id} className="flex gap-3 hover:bg-slate-900/30 p-1 rounded transition duration-150">
                              <span className="text-slate-500 select-none">[{log.time}]</span>
                              <span className="flex-1 text-slate-300 font-light">{log.msg}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] self-center ${badgeStyle}`}>
                                {log.status.toUpperCase()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          </div>
        </section>

        {/* COMPREHENSIVE ARCHITECTURAL BLUEPRINT (SKILLS MATRIX) */}
        <section className="mb-16 md:mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Systems & Architecture Blueprint
            </h2>
            <p className="text-slate-400 font-mono text-sm mt-2">
              How I layout core scalable layers to deliver robust, fail-safe application engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Layer 3 - IoT & Systems */}
            <div className="glow-card p-6 flex flex-col justify-between">
              <div>
                <div className="text-indigo-400 font-mono text-[10px] tracking-wider uppercase mb-1">
                  Layer 3 - Automation & Systems
                </div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-400" />
                  <span>Hardware & OS</span>
                </h3>
                <p className="text-slate-400 font-mono text-xs leading-relaxed mb-4">
                  Python daemon automation, Raspberry Pi custom hardware shells, background cron task runners, and secure mobile UI interfacing.
                </p>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Python Scripts</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">IoT Custom Layers</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">MQTT Protocols</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Cron Automation</span>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-900">
                <span className="text-[11px] font-mono text-indigo-300 block">Status: Fully Implemented</span>
              </div>
            </div>

            {/* Layer 2 - Runtimes & API */}
            <div className="glow-card p-6 flex flex-col justify-between">
              <div>
                <div className="text-cyan-400 font-mono text-[10px] tracking-wider uppercase mb-1">
                  Layer 2 - API Gateway
                </div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Server className="h-5 w-5 text-cyan-400" />
                  <span>Microservices</span>
                </h3>
                <p className="text-slate-400 font-mono text-xs leading-relaxed mb-4">
                  Building optimized web endpoints using Express and Node.js. Incorporating CORS security layers, JWT token pipelines, and rate limiting algorithms.
                </p>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Node.js</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Express APIs</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Restful Routes</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Rate Limiting</span>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-900">
                <span className="text-[11px] font-mono text-cyan-300 block">Status: Fully Implemented</span>
              </div>
            </div>

            {/* Layer 1 - Persistence */}
            <div className="glow-card p-6 flex flex-col justify-between">
              <div>
                <div className="text-emerald-400 font-mono text-[10px] tracking-wider uppercase mb-1">
                  Layer 1 - Cloud & Databases
                </div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-emerald-400" />
                  <span>Persistence</span>
                </h3>
                <p className="text-slate-400 font-mono text-xs leading-relaxed mb-4">
                  Real-time synchronization using Firebase Firestore clusters, GCP Cloud Functions for automated tasks, and Firebase hosting.
                </p>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Firestore</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Cloud Functions</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Realtime Sync</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">GCP Cloud Nodes</span>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-900">
                <span className="text-[11px] font-mono text-emerald-300 block">Status: Fully Implemented</span>
              </div>
            </div>

            {/* Layer 0 - Frontend UI */}
            <div className="glow-card p-6 flex flex-col justify-between">
              <div>
                <div className="text-purple-400 font-mono text-[10px] tracking-wider uppercase mb-1">
                  Layer 0 - Frontend Presentation
                </div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-400" />
                  <span>UI Orchestration</span>
                </h3>
                <p className="text-slate-400 font-mono text-xs leading-relaxed mb-4">
                  Delivering high-status, fluid experiences using React, Tailwind CSS v4, Flutter for cross-platform apps, and GSAP for fluid animations.
                </p>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">React</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Tailwind v4</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">GSAP Physics</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded">Flutter Mobile</span>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-900">
                <span className="text-[11px] font-mono text-purple-300 block">Status: Fully Implemented</span>
              </div>
            </div>

          </div>
        </section>

        {/* PREMIUM INTERACTIVE PROJECTS SHOWCASE */}
        <section className="mb-16 md:mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Selected High-Fidelity Deployments
            </h2>
            <p className="text-slate-400 font-mono text-sm mt-2">
              Real-world systems, fully optimized, deployed and humming.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Project 1: Bharatpur Bazar */}
            <div className="lg:col-span-6 glow-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-1 text-[10px] font-mono border border-cyan-800 bg-cyan-950/40 text-cyan-400 rounded-lg">
                    LIVE / PRODUCTION
                  </span>
                  <a 
                    href="https://bb.hs.vc" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-400 hover:text-white transition"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  Bharatpur Bazar
                </h3>
                <p className="text-slate-400 font-mono text-xs mb-6">
                  A hyper-local real-time grocery and food orchestrator, built specifically to scale inside the municipality of Bharatpur, Nepal. Features instant ordering, dynamic vendor inventory updates, and highly performant delivery routing.
                </p>

                {/* Simulated Interactive Widgets for Bharatpur Bazar */}
                <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl space-y-3.5 font-mono text-xs">
                  <div className="text-slate-400 flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Order Processing Queue</span>
                    </span>
                    <span className="text-cyan-400 font-bold">14 Active Orders</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 block">ACTIVE ORDERS</span>
                      <span className="text-white font-bold">{activeOrders} Orders</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">AVG DELIVERY TIME</span>
                      <span className="text-white font-bold">{deliveryDelay} mins</span>
                    </div>
                  </div>

                  {/* Simulated interaction buttons */}
                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => {
                        setActiveOrders(prev => prev + 1);
                        setDeliveryDelay(prev => Math.min(45, prev + 2));
                      }}
                      className="flex-1 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/30 text-cyan-400 border border-cyan-800/60 rounded text-[10px] transition cursor-pointer"
                    >
                      + Simulate New Order
                    </button>
                    <button 
                      onClick={() => {
                        setActiveOrders(prev => Math.max(0, prev - 1));
                        setDeliveryDelay(prev => Math.max(15, prev - 1));
                      }}
                      className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded text-[10px] transition cursor-pointer"
                    >
                      Resolve Order
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] mt-6">
                  <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">Node.js</span>
                  <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">Firebase Backend</span>
                  <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">Google Maps API</span>
                  <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">Scalable Architecture</span>
                </div>
              </div>
            </div>

            {/* Project 2: Success AI Home */}
            <div className="lg:col-span-6 glow-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-1 text-[10px] font-mono border border-amber-800/80 bg-amber-950/30 text-amber-400 rounded-lg">
                    PRIVATE OS / DAEMON
                  </span>
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  Success AI HomeOS
                </h3>
                <p className="text-slate-400 font-mono text-xs mb-6">
                  A high-security, distributed IoT operating system running inside Success\'s private domestic server rack. Orchestrates physical environmental controls, smart locks, camera telemetry, and voice synthesis via a highly efficient Flutter app.
                </p>

                {/* Simulated Interactive Widgets for Success AI Home */}
                <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl space-y-3 font-mono text-xs">
                  <div className="text-slate-400 flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Wifi className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                      <span>Smart Device Control Room</span>
                    </span>
                    <span className="text-emerald-400 font-bold">100% SECURE</span>
                  </div>

                  {/* Switch buttons simulated */}
                  <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded border border-slate-900">
                    <span className="text-slate-300">Living Room Lights:</span>
                    <button 
                      onClick={() => {
                        setLivingRoomLights(!livingRoomLights);
                        setAiHomeLogs(prev => [
                          `HARDWARE: Living Room Lights toggled: ${!livingRoomLights ? 'ON' : 'OFF'}`,
                          ...prev.slice(0, 2)
                        ]);
                      }}
                      className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-all duration-300 ${
                        livingRoomLights 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : 'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {livingRoomLights ? 'ACTIVE (ON)' : 'OFFLINE'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded border border-slate-900">
                    <span className="text-slate-300">Smart AC Temp:</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setAcTemp(prev => Math.max(16, prev - 1));
                          setAiHomeLogs(prev => [
                            `SENSORS: Temperature set point changed to ${acTemp - 1}°C`,
                            ...prev.slice(0, 2)
                          ]);
                        }}
                        className="w-6 h-6 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-white w-8 text-center">{acTemp}°C</span>
                      <button 
                        onClick={() => {
                          setAcTemp(prev => Math.min(30, prev + 1));
                          setAiHomeLogs(prev => [
                            `SENSORS: Temperature set point changed to ${acTemp + 1}°C`,
                            ...prev.slice(0, 2)
                          ]);
                        }}
                        className="w-6 h-6 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* OS Terminal output logs */}
                  <div className="bg-slate-950 p-2 rounded border border-slate-900 text-[10px] text-slate-500 space-y-1">
                    {aiHomeLogs.map((log, i) => (
                      <div key={i} className="truncate">
                        {" > "}{log}
                      </div>
                    ))}
                  </div>

                </div>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] mt-6">
                  <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">Python Daemon</span>
                  <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">Flutter Client</span>
                  <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">MQTT Socket</span>
                  <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">System Kernel</span>
                </div>
              </div>
            </div>

            {/* Project 3: 4Direction */}
            <div className="lg:col-span-12 glow-card p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 text-[10px] font-mono border border-indigo-800 bg-indigo-950/40 text-indigo-400 rounded-lg">
                  LIVE COMPILATION
                </span>
                <a 
                  href="https://4direction.com.np/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-white transition"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                    4Direction Web Presence
                  </h3>
                  <p className="text-slate-400 font-mono text-xs leading-relaxed mb-4">
                    High-end corporate digital headquarters for 4Direction. Engineered with React and optimized with GSAP physical scrolling models. Delivering custom-rendered interactive timelines, fully fluid visual responses, and lightning-fast content delivery networks.
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px] mb-4">
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">React Core</span>
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">GSAP ScrollTrigger</span>
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">High-Fidelity Animations</span>
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-900 rounded text-slate-400">Responsive Vector Art</span>
                  </div>
                  <a 
                    href="https://4direction.com.np/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    <span>Inspect Live Deployment</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Conceptual Design Grid of 4Direction layout */}
                <div className="border border-slate-900 bg-slate-950/90 rounded-xl p-4 font-mono text-xs text-slate-500 space-y-3">
                  <div className="flex justify-between border-b border-slate-900 pb-2 text-[10px]">
                    <span>ARCHITECTURE MODULE</span>
                    <span className="text-indigo-400">ONLINE</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-slate-900/50 rounded border border-slate-900 text-center">
                      <span className="block text-white font-bold text-base">60 FPS</span>
                      <span className="text-[9px] text-slate-500 block mt-1">GSAP SMOOTHNESS</span>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded border border-slate-900 text-center">
                      <span className="block text-white font-bold text-base">{"< "}</span>
                      <span className="text-[9px] text-slate-500 block mt-1">PAGE INTERACTIVE</span>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded border border-slate-900 text-center">
                      <span className="block text-white font-bold text-base">A+</span>
                      <span className="text-[9px] text-slate-500 block mt-1">SEO SCORE</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-indigo-950/20 rounded border border-indigo-950 text-[10px] text-indigo-300">
                    "Our organization required a visually striking website. Success achieved it perfectly inside a React frame, utilizing state-of-the-art GSAP physics."
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CHRONOLOGICAL JOURNEY ROADMAP */}
        <section className="mb-16 md:mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-white tracking-tight">
              The Systems Journey
            </h2>
            <p className="text-slate-400 font-mono text-sm mt-2">
              Chronological progress tracking technical training, milestones, and freelance operations.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto font-mono text-xs border-l-2 border-slate-800 pl-6 space-y-12">
            
            {/* Year 2025 - Present */}
            <div className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-950" />
              
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-950/50 text-indigo-400 border border-indigo-900 font-bold">
                  2025 - PRESENT
                </span>
                <h3 className="text-base font-bold text-white font-mono">
                  Self-Employed Freelance Systems Developer
                </h3>
                <p className="text-slate-400 leading-relaxed max-w-2xl font-sans">
                  Constructing high-performance custom APIs, databases, automated workflows, and e-commerce server hubs for global clients. Mastering complex microservice setups, automated scripts, and custom server infrastructure.
                </p>
                <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>41+ Corporate Contracts</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Full-Time Freelancing</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Year 2021 - Present */}
            <div className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-950" />
              
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-900 font-bold">
                  2021 - PRESENT
                </span>
                <h3 className="text-base font-bold text-white font-mono">
                  Student at Narayani Model Secondary School
                </h3>
                <p className="text-slate-400 leading-relaxed max-w-2xl font-sans">
                  Pursuing high-level secondary education in Bharatpur, Nepal, with a core focal area on advanced computer science and modern mathematics. Actively championing localized programming competitions, hackathons, and research projects.
                </p>
                <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Academic STEM Scholar</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Narayani Coding Leader</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Year 2018 */}
            <div className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950" />
              
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-900 font-bold">
                  2018
                </span>
                <h3 className="text-base font-bold text-white font-mono">
                  The Spark (Age 10)
                </h3>
                <p className="text-slate-400 leading-relaxed max-w-2xl font-sans">
                  Your programming journey was sparked at age 10 when your father sat you down and introduced you to computer science. Witnessing logical commands compile into digital reality immediately ignited a profound, lifelong obsession with technology.
                </p>
                <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Lightbulb className="h-3.5 w-3.5 text-emerald-400" />
                    <span>First Command Run</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Father-Student Mentorship</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CONTACT & SECURE COMMUNICATION NEXUS */}
        <section id="contact-nexus" className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Establish Connection Gateway
            </h2>
            <p className="text-slate-400 font-mono text-sm mt-2">
              Transmit your project payload directly to Success\'s secure system database.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Direct contact specs */}
            <div className="lg:col-span-5 glow-card p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-cyan-400 animate-pulse" />
                  <span>Contact Handshake Specs</span>
                </h3>
                
                <p className="text-slate-400 font-mono text-xs leading-relaxed">
                  For immediate engagement, reach out via the secure corporate links listed below. Typical API handshake turnaround time: {"< 24 hours"}.
                </p>

                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-900">
                    <Mail className="h-5 w-5 text-cyan-400" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">PRIMARY ENCRYPTED EMAIL</span>
                      <a href="mailto:mail@success0.com.np" className="text-slate-200 hover:text-cyan-400 font-semibold underline">
                        mail@success0.com.np
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-900">
                    <Mail className="h-5 w-5 text-indigo-400" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">ALTERNATIVE EMAIL</span>
                      <a href="mailto:success@4direction.com.np" className="text-slate-200 hover:text-indigo-400 font-semibold underline">
                        success@4direction.com.np
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-900">
                    <Phone className="h-5 w-5 text-purple-400" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">DIRECT TELEPHONY</span>
                      <a href="tel:+9779809248510" className="text-slate-200 hover:text-purple-400 font-semibold underline">
                        +977 9809248510
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-900">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">BASE COORDINATES</span>
                      <span className="text-slate-200 font-semibold">
                        Bharatpur-10, Nepal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-900 font-mono text-[10px] text-slate-500 mt-6 lg:mt-0">
                <span>TLS 1.3 Connection Recommended. PGP Keys available on terminal query.</span>
              </div>
            </div>

            {/* Right Column: Simulated JSON POST contact form */}
            <div className="lg:col-span-7 glow-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 font-mono text-xs border-b border-slate-900 pb-2.5">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Send className="h-3.5 w-3.5 text-cyan-400" />
                    <span>POST /v1/portfolio/contact</span>
                  </span>
                  <span className="text-[10px] text-slate-500">CONTENT-TYPE: APPLICATION/JSON</span>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1.5">payload.sender_name :</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Full Name"
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-700 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1.5">payload.sender_email :</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your_email@domain.com"
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-700 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1.5">payload.message_body :</label>
                    <textarea 
                      required
                      rows="4"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Construct clear mission or project descriptions..."
                      className="w-full bg-slate-950 border border-slate-900 focus:border-cyan-500 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-700 outline-none transition resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className={`w-full py-2.5 font-bold rounded-lg border flex justify-center items-center gap-2 cursor-pointer transition-all duration-300 ${
                        formStatus === 'sending' 
                          ? 'bg-slate-900 border-slate-800 text-slate-500 animate-pulse' 
                          : 'bg-cyan-950/40 text-cyan-400 border-cyan-800 hover:bg-cyan-900/30'
                      }`}
                    >
                      <Send className="h-4 w-4" />
                      <span>{formStatus === 'sending' ? 'TRANSMITTING MESSAGE PAYLOAD...' : 'TRANSMIT MESSAGE POST'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* JSON simulated API response panel */}
              <div className="mt-6 border-t border-slate-900 pt-4">
                <AnimatePresence mode="wait">
                  {formStatus === 'success' && formResponse && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-950 p-3 rounded-xl border border-slate-900 font-mono text-[10px] space-y-1.5"
                    >
                      <div className="flex justify-between text-emerald-400 font-bold border-b border-slate-900 pb-1.5">
                        <span>HTTP/1.1 201 CREATED</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>SUCCESS</span>
                        </span>
                      </div>
                      <pre className="text-slate-400 overflow-x-auto whitespace-pre-wrap max-h-36">
                        {JSON.stringify(formResponse, null, 2)}
                      </pre>
                    </motion.div>
                  )}

                  {formStatus === 'idle' && (
                    <div className="text-[10px] text-slate-600 italic">
                      Waiting for secure message payload submission...
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </section>

        {/* SYSTEM FOOTER */}
        <footer className="mt-16 md:mt-24 pt-8 border-t border-slate-900 text-center font-mono text-xs text-slate-600">
          <div className="flex justify-between items-center flex-wrap gap-4 max-w-4xl mx-auto">
            <span>© {new Date().getFullYear()} Success Systems. All rights optimized.</span>
            <span>Uptime: 100% | Latency: 12ms</span>
            <span>Proudly built in Bharatpur, Nepal 🇳🇵</span>
          </div>
        </footer>

      </div>
    </div>
  );
}