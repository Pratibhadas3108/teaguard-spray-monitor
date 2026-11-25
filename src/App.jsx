import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, CheckCircle2, ChevronRight, Compass, 
  Cpu, Droplet, Download, Eye, FileText, Gauge, Info, Layers, 
  MapPin, Play, Pause, RefreshCw, Shield, Sparkles, User, Users, 
  Wifi, WifiOff, Wind, Zap, BarChart3, Sliders, BatteryCharging,
  Printer, X, Calculator, Scan, Volume2, CloudRain, Sun, Award, BookOpen
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSimulating, setIsSimulating] = useState(true);
  const [selectedOperator, setSelectedOperator] = useState('OP-104');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [selectedInfographic, setSelectedInfographic] = useState(null);
  const [hapticFeedbackAlert, setHapticFeedbackAlert] = useState(null);

  // Chemical Calculator State
  const [selectedPest, setSelectedPest] = useState('helopeltis');
  const [knapsackCapacity, setKnapsackCapacity] = useState(16); // Litres
  const [targetHectares, setTargetHectares] = useState(1.5);

  // Real-time telemetry simulation state
  const [telemetry, setTelemetry] = useState({
    flowRate: 720, // mL/min
    pressure: 2.8, // bar
    lanceAngle: 28, // degrees
    walkingSpeed: 2.3, // km/h
    appliedVolume: 18.4, // Litres
    targetVolume: 25.0, // Litres
    battery: 88, // %
    coverageUniformity: 94.2, // %
    driftRisk: 'Low (0.9 m/s wind)',
    status: 'Optimal'
  });

  // Operators List
  const operators = [
    { id: 'OP-104', name: 'Ratan Karmakar', experience: '6 yrs', rows: '13-15', tanks: 6, score: 94.8, status: 'Optimal' },
    { id: 'OP-108', name: 'Biren Orang', experience: '4 yrs', rows: '16-18', tanks: 5, score: 91.2, status: 'Pace Alert' },
    { id: 'OP-112', name: 'Sunita Munda', experience: '8 yrs', rows: '19-21', tanks: 7, score: 96.5, status: 'Optimal' },
    { id: 'OP-115', name: 'Dipak Tanti', experience: '3 yrs', rows: '22-24', tanks: 4, score: 88.4, status: 'Low Pressure' }
  ];

  // Pest and formulation database (TRA Tocklai guidelines)
  const pestDatabase = {
    helopeltis: {
      name: 'Tea Mosquito Bug (Helopeltis theivora)',
      chemical: 'Thiamethoxam 25% WG',
      recommendation: '100g in 400L water per Hectare',
      dosagePerLitre: 0.25, // grams/Litre
      phiDays: 7,
      sprayVolumePerHa: 400,
      season: 'April – October'
    },
    red_spider: {
      name: 'Red Spider Mite (Oligonychus coffeae)',
      chemical: 'Propargite 57% EC',
      recommendation: '500mL in 400L water per Hectare',
      dosagePerLitre: 1.25, // mL/Litre
      phiDays: 14,
      sprayVolumePerHa: 400,
      season: 'March – June / Autumn'
    },
    blister_blight: {
      name: 'Blister Blight (Exobasidium vexans)',
      chemical: 'Hexaconazole 5% EC + Copper Oxychloride',
      recommendation: '200mL Hexaconazole + 250g COC in 350L per Ha',
      dosagePerLitre: 0.6, // mL/Litre
      phiDays: 10,
      sprayVolumePerHa: 350,
      season: 'Monsoon / High Humidity'
    },
    looper: {
      name: 'Tea Looper Caterpillar (Hyposidra talaca)',
      chemical: 'Emamectin Benzoate 5% SG',
      recommendation: '200g in 400L water per Hectare',
      dosagePerLitre: 0.5, // grams/Litre
      phiDays: 7,
      sprayVolumePerHa: 400,
      season: 'May – September'
    }
  };

  // Sound generator for haptic trigger simulation (Web Audio API)
  const playHapticBeep = (pulses, desc) => {
    setHapticFeedbackAlert(desc);
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      for (let i = 0; i < pulses; i++) {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440 + i * 120, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.16);
        }, i * 220);
      }
    } catch (e) {
      console.log('Audio not enabled');
    }
    setTimeout(() => setHapticFeedbackAlert(null), 3000);
  };

  // Simulated live telemetry stream
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const deltaFlow = (Math.random() - 0.48) * 22;
        const deltaSpeed = (Math.random() - 0.5) * 0.15;
        const newFlow = Math.max(630, Math.min(840, prev.flowRate + deltaFlow));
        const newSpeed = Math.max(1.8, Math.min(3.3, prev.walkingSpeed + deltaSpeed));
        const newApplied = Math.min(prev.targetVolume, prev.appliedVolume + (newFlow / 60000));
        
        let status = 'Optimal';
        if (newSpeed > 2.8) status = 'Under-spraying (Pace High)';
        else if (newFlow < 650) status = 'Low Nozzle Pressure';

        return {
          ...prev,
          flowRate: Math.round(newFlow),
          pressure: +(2.6 + (newFlow - 650) * 0.002).toFixed(2),
          lanceAngle: Math.round(27 + Math.sin(Date.now() / 1500) * 7),
          walkingSpeed: +newSpeed.toFixed(2),
          appliedVolume: +newApplied.toFixed(2),
          coverageUniformity: +(92.5 + Math.random() * 3.5).toFixed(1),
          status
        };
      });
    }, 1300);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const currentPest = pestDatabase[selectedPest];
  const requiredTotalSolution = targetHectares * currentPest.sprayVolumePerHa;
  const tanksNeeded = Math.ceil(requiredTotalSolution / knapsackCapacity);
  const chemicalPerTank = (currentPest.dosagePerLitre * knapsackCapacity).toFixed(1);
  const totalChemicalRequired = (currentPest.dosagePerLitre * requiredTotalSolution).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/15">
            <Droplet className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Chai<span className="text-emerald-600">Rakshak</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                NESFIC-I-06
              </span>
              <span className="hidden sm:inline text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                TRA Tocklai Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500">Smart Manual & Operator-Carried Spray Monitoring Platform</p>
          </div>
        </div>

        {/* Global Estate Status */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm">
          {/* Tutorial / How to Use Link */}
          <button
            onClick={() => setShowTutorialModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 transition shadow-sm"
            title="Learn what ChaiRakshak does and how to use it"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Tutorial</span>
          </button>

          {/* Lead Applicant & Organization Pill */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
            <span className="font-semibold text-slate-900">Rojes Labs</span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-700 font-medium">Lead: Pratibha Das Hatibaruah</span>
          </div>

          {/* Download PDFs */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="/NESFIC_I06_Proposal.pdf"
              download="NESFIC_I06_Proposal.pdf"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Proposal PDF</span>
            </a>
            <a
              href="/NESFIC_I06_Proof_of_Work.pdf"
              download="NESFIC_I06_Proof_of_Work.pdf"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PoW PDF</span>
            </a>
          </div>

          {/* Weather Widget */}
          <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
            <Wind className="w-4 h-4 text-teal-600" />
            <span className="font-medium">1.1 m/s NW</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-medium">Safe Drift</span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Jorhat Estate · Section 4C</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-800 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>14 Online</span>
          </div>

          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-sm ${
              isSimulating 
                ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isSimulating ? 'Live Telemetry' : 'Paused'}
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="border-b border-slate-200 bg-white px-6 flex space-x-6 text-sm overflow-x-auto shadow-sm">
        {[
          { id: 'dashboard', label: 'Field Operations Live Map', icon: Activity },
          { id: 'telemetry', label: 'Lance Kinematics & Haptics', icon: Gauge },
          { id: 'calculator', label: 'TRA Chemical & Tank Calculator', icon: Calculator },
          { id: 'wsp', label: 'WSP Droplet Scanner', icon: Scan },
          { id: 'compliance', label: 'MRL & Audit Certificate', icon: Shield },
          { id: 'hardware', label: 'IoT Retrofit Kit Spec', icon: Cpu },
          { id: 'proposal', label: 'Proposal & Proof of Work (PoW)', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3.5 border-b-2 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
                isActive 
                  ? 'border-emerald-600 text-emerald-700 font-semibold' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Haptic Alert Floating Pill */}
      {hapticFeedbackAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Zap className="w-5 h-5 text-amber-200 animate-pulse" />
          <div>
            <div className="font-bold text-xs uppercase tracking-wide">Lance Haptic Grip Vibrating</div>
            <div className="text-xs">{hapticFeedbackAlert}</div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* TAB 1: FIELD OPERATIONS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Treated Area</span>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Layers className="w-4 h-4" /></div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-900">12.6</span>
                  <span className="text-xs text-slate-500">/ 16.0 Ha (78%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uniformity Score</span>
                  <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Sparkles className="w-4 h-4" /></div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-teal-700">{telemetry.coverageUniformity}%</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">TRA Grade A</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Target: 400-450 L/ha canopy norm</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chemical Savings</span>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Droplet className="w-4 h-4" /></div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-blue-700">22.8%</span>
                  <span className="text-xs text-slate-500">vs unmonitored</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">₹1,420 saved / Ha on active ingredients</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operator Safety & Pace</span>
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Shield className="w-4 h-4" /></div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-amber-700">100%</span>
                  <span className="text-xs text-slate-500">PPE & Safe Drift</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Wind 1.1 m/s · Safe buffer enforced</p>
              </div>
            </div>

            {/* Spatial Swath Coverage Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Plantation Plot Grid View */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-emerald-600" />
                      Live Spatial Swath Coverage (Jorhat Section 4C)
                    </h2>
                    <p className="text-xs text-slate-500">Real-time GPS swath interpolation & under/over spray detection</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-3 h-3 rounded bg-blue-500"></span> Under (&lt;350L)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-3 h-3 rounded bg-emerald-500"></span> Optimal (400-450L)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-3 h-3 rounded bg-red-400"></span> Over (&gt;500L)
                    </span>
                  </div>
                </div>

                {/* Interactive Simulated Tea Bush Grid */}
                <div className="relative bg-slate-900 rounded-xl p-5 border border-slate-800 h-80 flex flex-col justify-between overflow-hidden shadow-inner">
                  {/* Grid Lines resembling tea rows */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-1 p-2 opacity-25 pointer-events-none">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-emerald-700/50 rounded bg-emerald-900/10"></div>
                    ))}
                  </div>

                  {/* Operator Paths */}
                  <div className="relative z-10 flex flex-col h-full justify-around">
                    {/* Row 1 */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 w-16">Row 10-12</span>
                      <div className="flex-1 h-7 bg-emerald-950/70 border border-emerald-500/50 rounded-lg flex items-center px-3 relative overflow-hidden">
                        <div className="w-full bg-emerald-500/40 h-full absolute inset-0"></div>
                        <span className="relative z-10 text-xs text-emerald-300 font-mono font-medium">100% Completed · Uniformity 96.1%</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto relative z-10" />
                      </div>
                    </div>

                    {/* Row 2 (Active Sprayer OP-104) */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 w-16">Row 13-15</span>
                      <div className="flex-1 h-9 bg-slate-800 border-2 border-emerald-400 rounded-lg flex items-center px-3 relative overflow-hidden shadow-lg">
                        <div className="bg-gradient-to-r from-emerald-500/60 via-emerald-400/50 to-teal-400/30 h-full absolute inset-0 transition-all duration-300" style={{ width: '68%' }}></div>
                        <div className="relative z-10 flex items-center justify-between w-full">
                          <span className="text-xs text-white font-semibold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                            Operator OP-104 (R. Karmakar) · 68% Swath Sprayed
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                            {telemetry.flowRate} mL/min · {telemetry.walkingSpeed} km/h
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Row 3 (Active Sprayer OP-108) */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 w-16">Row 16-18</span>
                      <div className="flex-1 h-7 bg-slate-800/80 border border-slate-700 rounded-lg flex items-center px-3 relative overflow-hidden">
                        <div className="bg-emerald-500/30 h-full absolute inset-0" style={{ width: '42%' }}></div>
                        <span className="relative z-10 text-xs text-slate-200 font-mono">Operator OP-108 · 42% Swath Sprayed</span>
                        <span className="relative z-10 text-xs text-slate-400 ml-auto font-mono">2.1 km/h</span>
                      </div>
                    </div>

                    {/* Row 4 (Queued) */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500 w-16">Row 19-21</span>
                      <div className="flex-1 h-7 bg-slate-800/40 border border-dashed border-slate-700 rounded-lg flex items-center px-3">
                        <span className="text-xs text-slate-400">Queued for Shift 2 · Copper Oxychloride 50% WP</span>
                      </div>
                    </div>
                  </div>

                  {/* Footnotes */}
                  <div className="relative z-10 border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>GPS GNSS Accuracy: ±0.35m RTK-assisted</span>
                    <span>Offline Sync Buffer: 0 pending packets (BLE mesh active)</span>
                  </div>
                </div>

                {/* Live Alert Banner */}
                <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
                  telemetry.status === 'Optimal' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <AlertTriangle className={`w-4 h-4 shrink-0 ${telemetry.status === 'Optimal' ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <div className="flex-1">
                    <span className="font-bold">Live Status: {telemetry.status}.</span>{' '}
                    {telemetry.status === 'Optimal'
                      ? 'Walking pace and lance trajectory match TRA Tocklai recommended 420 L/ha canopy penetration.'
                      : 'Audio-haptic alert vibrated on operator lance grip to prompt pace adjustment.'}
                  </div>
                </div>
              </div>

              {/* Right Col: Active Operator Focus Panel & Leaderboard */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Section Spray Team (4 Active)
                  </h3>
                  <select 
                    value={selectedOperator} 
                    onChange={e => setSelectedOperator(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-xs rounded-lg px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {operators.map(op => (
                      <option key={op.id} value={op.id}>{op.id} · {op.name}</option>
                    ))}
                  </select>
                </div>

                {/* Operator Telemetry Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Nozzle Discharge</span>
                    <span className="font-mono text-emerald-700 font-bold text-sm">{telemetry.flowRate} mL/min</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Manifold Pressure</span>
                    <span className="font-mono text-slate-800 font-semibold">{telemetry.pressure} bar</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Walking Pace</span>
                    <span className="font-mono text-slate-800 font-semibold">{telemetry.walkingSpeed} km/h</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Lance Angle</span>
                    <span className="font-mono text-slate-800 font-semibold">{telemetry.lanceAngle}° (Ideal: 25°-35°)</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2.5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Tank Volume Sprayed</span>
                      <span className="font-mono text-emerald-700 font-bold">{telemetry.appliedVolume} / {telemetry.targetVolume} L</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${(telemetry.appliedVolume / telemetry.targetVolume) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Team Leaderboard Table */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uniformity Leaderboard</span>
                  <div className="space-y-1.5">
                    {operators.map(op => (
                      <div 
                        key={op.id}
                        onClick={() => setSelectedOperator(op.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                          selectedOperator === op.id ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{op.name}</div>
                          <div className="text-[11px] text-slate-500">{op.id} · Rows {op.rows}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-emerald-700">{op.score}%</div>
                          <div className={`text-[10px] font-medium ${op.status === 'Optimal' ? 'text-emerald-600' : 'text-amber-600'}`}>{op.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LANCE KINEMATICS & HAPTIC SIMULATOR */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-emerald-600" />
                  Spray Lance Kinematics & Ultrasonic Flow Sensing
                </h2>
                <p className="text-xs text-slate-500">
                  Dual-sensor retrofitting clips onto standard hollow-cone/flood-jet lances without altering weight or balance.
                </p>
              </div>

              {/* Sensor Visual Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 uppercase">1. Ultrasonic Flow Meter</span>
                    <Activity className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-slate-900">{telemetry.flowRate} <span className="text-sm font-normal text-slate-500">mL/min</span></div>
                  <p className="text-xs text-slate-600">Non-intrusive piezo-ceramic transit time sensor. No moving parts; immune to chemical clogging or pesticide slurry buildup.</p>
                  <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
                    Calibration: ±1.5% accuracy
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-700 uppercase">2. 6-Axis Lance IMU</span>
                    <Compass className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-slate-900">{telemetry.lanceAngle}° <span className="text-sm font-normal text-slate-500">pitch angle</span></div>
                  <p className="text-xs text-slate-600">Monitors lance sweeping arc, height above tea canopy (ideal 30-45 cm), and prevents operator fatigue-induced pointing drift.</p>
                  <div className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg inline-block border border-teal-200">
                    Sampling Rate: 50 Hz on-device filter
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 uppercase">3. Real-Time Haptic Gripper</span>
                    <Zap className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-slate-900">Active <span className="text-sm font-normal text-slate-500">Tactile Engine</span></div>
                  <p className="text-xs text-slate-600">Vibration patterns on knapsack handle alert worker directly without needing screens. 100% eyes-on-the-tea-bush operation.</p>
                  <div className="text-xs font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg inline-block border border-amber-200">
                    Zero screen distraction in field
                  </div>
                </div>
              </div>

              {/* Interactive Haptic Feedback Simulator */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-6 rounded-2xl border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      Interactive Operator Haptic Feedback Tester
                    </h3>
                    <p className="text-xs text-slate-600">Click any trigger below to simulate and listen to the ERM tactile vibration pattern sent to the operator's grip:</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                    Live Audio-Haptic Simulator
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => playHapticBeep(1, 'Slow Down Alert: Pace exceeds 2.8 km/h (Under-dosing risk)')}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition text-left space-y-1 group"
                  >
                    <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 flex items-center justify-between">
                      <span>Pattern 1: Slow Down</span>
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">1 Pulse · Walking too fast (&gt;2.8 km/h)</div>
                  </button>

                  <button 
                    onClick={() => playHapticBeep(2, 'Speed Up Alert: Pace is below 1.8 km/h (Over-dosing / runoff risk)')}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition text-left space-y-1 group"
                  >
                    <div className="font-bold text-xs text-slate-900 group-hover:text-teal-700 flex items-center justify-between">
                      <span>Pattern 2: Speed Up</span>
                      <Zap className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">2 Pulses · Walking too slow (&lt;1.8 km/h)</div>
                  </button>

                  <button 
                    onClick={() => playHapticBeep(3, 'Clog/Pressure Alert: Nozzle pressure below 2.0 bar')}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-left space-y-1 group"
                  >
                    <div className="font-bold text-xs text-slate-900 group-hover:text-amber-700 flex items-center justify-between">
                      <span>Pattern 3: Nozzle Clog</span>
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">3 Pulses · Pressure drop or lance tilt</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRA CHEMICAL & TANK CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  TRA Tocklai Chemical Dosage & Knapsack Refill Calculator
                </h2>
                <p className="text-xs text-slate-500">
                  Pre-configured with TRA Plant Protection Code norms to eliminate manual mixing errors and prevent MRL violations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inputs */}
                <div className="lg:col-span-1 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase">Target Pest / Disease</label>
                    <select 
                      value={selectedPest}
                      onChange={e => setSelectedPest(e.target.value)}
                      className="mt-1.5 w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="helopeltis">Tea Mosquito Bug (Helopeltis)</option>
                      <option value="red_spider">Red Spider Mite</option>
                      <option value="blister_blight">Blister Blight (Fungus)</option>
                      <option value="looper">Tea Looper Caterpillar</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase">Section Area to Treat (Hectares)</label>
                    <input 
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={targetHectares}
                      onChange={e => setTargetHectares(parseFloat(e.target.value) || 0.1)}
                      className="mt-1.5 w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase">Knapsack Tank Capacity</label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {[16, 20, 12].map(cap => (
                        <button
                          key={cap}
                          onClick={() => setKnapsackCapacity(cap)}
                          className={`py-2 rounded-xl text-xs font-bold border transition ${
                            knapsackCapacity === cap 
                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {cap} Litres
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation Results */}
                <div className="lg:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{currentPest.name}</div>
                        <div className="text-xs text-emerald-700 font-semibold mt-0.5">Approved Active: {currentPest.chemical}</div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                        PHI: {currentPest.phiDays} Days Safe Plucking
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500">Total Spray Mix</span>
                        <div className="text-lg font-bold font-mono text-slate-900 mt-1">{requiredTotalSolution} L</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500">Tank Refills</span>
                        <div className="text-lg font-bold font-mono text-emerald-700 mt-1">{tanksNeeded} Tanks</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500">Dose / Tank</span>
                        <div className="text-lg font-bold font-mono text-teal-700 mt-1">{chemicalPerTank} g/mL</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500">Total Chemical</span>
                        <div className="text-lg font-bold font-mono text-blue-700 mt-1">{totalChemicalRequired} g/mL</div>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900">Standard Operating Instruction:</span> Add 5 Litres of clean water to the {knapsackCapacity}L knapsack, dissolve exactly {chemicalPerTank} g/mL of {currentPest.chemical}, agitate thoroughly, and fill water up to the {knapsackCapacity}L mark. Maintain walking pace of 2.2 km/h.
                    </div>
                  </div>

                  <button 
                    onClick={() => alert(`Mixing recipe logged in Estate Ledger: ${tanksNeeded} tanks of ${currentPest.chemical} for Section 4C`)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
                  >
                    Lock Recipe to Sirdar QR Dispatch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WSP DROPLET SCANNER */}
        {activeTab === 'wsp' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Scan className="w-5 h-5 text-emerald-600" />
                  Water-Sensitive Paper (WSP) Droplet Density Scanner
                </h2>
                <p className="text-xs text-slate-500">
                  Simulates in-field optical analysis of exposed yellow card strips to evaluate droplet coverage (target 30–50 droplets/cm²).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Simulated WSP Card */}
                <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-6 h-64 flex flex-col justify-between relative overflow-hidden shadow-inner">
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-amber-900">
                    <span>WSP CARD #24 (Upper Canopy Table)</span>
                    <span className="bg-amber-200 px-2 py-0.5 rounded">2026-11-23</span>
                  </div>

                  {/* Simulated Blue Droplet Splashes */}
                  <div className="relative flex-1 flex items-center justify-center">
                    <div className="absolute inset-0 flex flex-wrap gap-3 items-center justify-center p-4 opacity-80 pointer-events-none">
                      {Array.from({ length: 38 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="bg-blue-900 rounded-full"
                          style={{
                            width: `${4 + (i % 5) * 2}px`,
                            height: `${4 + (i % 5) * 2}px`,
                            margin: `${(i * 3) % 8}px`
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-center shadow-md border border-amber-200 z-10">
                      <div className="font-extrabold text-xl font-mono text-blue-900">42 Droplets / cm²</div>
                      <div className="text-[11px] text-emerald-700 font-bold">Optimal TRA Category Grade A</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-800 font-mono text-center">
                    Volume Median Diameter (VMD): 185 µm · Coverage: 14.8%
                  </div>
                </div>

                {/* Computer Vision Metrics */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Optical Quality Diagnostics</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-600 font-medium">Droplet Density (Target 30–50/cm²)</span>
                      <span className="font-mono font-bold text-emerald-700">42 / cm² (Pass)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-600 font-medium">Drift Index (&lt;100 µm droplets)</span>
                      <span className="font-mono font-bold text-teal-700">4.2% (Minimal drift)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-600 font-medium">Canopy Penetration Ratio (Top / Bottom)</span>
                      <span className="font-mono font-bold text-slate-800">1 : 0.72 (Excellent)</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert('WSP Card calibrated against field knapsack flow')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm"
                  >
                    Upload New Card Image for AI Segmentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MRL & AUDIT CERTIFICATE */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Tea Research Association (TRA) Tocklai & FSSAI MRL Compliance
                </h2>
                <p className="text-xs text-slate-500">
                  Pre-harvest interval (PHI) enforcement, chemical traceability, and European Union / FSSAI maximum residue limit safeguards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Spray Schedule */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-700">Chemical Protocol in Action</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Target Pest / Disease</span>
                      <span className="text-slate-900 font-semibold">Tea Mosquito Bug (Helopeltis)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Approved Chemical Formulation</span>
                      <span className="text-slate-900 font-semibold">Thiamethoxam 25% WG (TRA Approved)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Prescribed TRA Dose</span>
                      <span className="text-emerald-700 font-mono font-bold">100g / 400L water per Hectare</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Pre-Harvest Interval (PHI)</span>
                      <span className="text-amber-800 font-semibold">7 Days Plucking Prohibition</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Safe Plucking Date</span>
                      <span className="text-emerald-700 font-mono font-bold">30 Nov 2026 (Locked in ERP)</span>
                    </div>
                  </div>
                </div>

                {/* Audit Certificate Generation */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-teal-800">Export & Factory Audit Log</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Automatically generates cryptographically signed spray logs for Tea Board of India and export buyers (EU, UK, USA) to verify residue safety.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1 font-mono text-slate-700">
                    <div>BATCH_ID: TR-2026-JOR-SEC4C</div>
                    <div>HASH: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f</div>
                    <div className="text-emerald-700 font-bold">STATUS: FSSAI_VERIFIED_PASS</div>
                  </div>
                  <button 
                    onClick={() => setShowCertificateModal(true)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <Award className="w-4 h-4" /> View & Print TRA Audit Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: IOT RETROFIT KIT SPEC */}
        {activeTab === 'hardware' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-600" />
                  Hardware Retrofit Specifications & Edge Computing
                </h2>
                <p className="text-xs text-slate-500">
                  Universal non-invasive clip-on retrofit designed for manual knapsack (16L) and motorized mist-blowers widely used in Assam tea estates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs text-emerald-700 font-bold uppercase">Microcontroller</span>
                  <div className="text-base font-bold text-slate-900">ESP32-S3 Dual-Core</div>
                  <p className="text-xs text-slate-600">240 MHz, low-power BLE 5.0 mesh, LoRa SX1262 long-range transceiver (3-5 km canopy penetration).</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs text-teal-700 font-bold uppercase">GNSS Positioning</span>
                  <div className="text-base font-bold text-slate-900">Multi-Constellation GNSS</div>
                  <p className="text-xs text-slate-600">GPS + NavIC (Indian Constellation) + GLONASS with dead-reckoning IMU integration for shaded tea canopies.</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs text-amber-700 font-bold uppercase">Power & Battery</span>
                  <div className="text-base font-bold text-slate-900">3200 mAh LiFePO4</div>
                  <p className="text-xs text-slate-600">Safe, non-combustible chemistry. 18+ hours operational run-time on single shift charge with solar top-up option.</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs text-purple-700 font-bold uppercase">Enclosure & Durability</span>
                  <div className="text-base font-bold text-slate-900">IP67 Chemical-Proof</div>
                  <p className="text-xs text-slate-600">Corrosion-resistant UV-stabilized polycarbonate housing withstands high humidity, monsoon rain, and agrochemical exposure.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PROPOSAL & PROOF OF WORK (POW) */}
        {activeTab === 'proposal' && (
          <div className="space-y-6">
            {/* Top Download Hero Card */}
            <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      NESFIC-I-06 Official Submission
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200">
                      TRL-5 Validated
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    ChaiRakshak: Proposal & Proof of Work Dossier
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                    Smart Monitoring of Manual / Operator-Carried Spraying in Assam & Dooars Tea Plantations. Prepared by <strong>Rojes Labs</strong> · Lead Applicant: <strong>Pratibha Das Hatibaruah</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="/NESFIC_I06_Proposal.pdf"
                    download="NESFIC_I06_Proposal.pdf"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Proposal PDF (1.7 MB)</span>
                  </a>
                  <a
                    href="/NESFIC_I06_Proof_of_Work.pdf"
                    download="NESFIC_I06_Proof_of_Work.pdf"
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Proof of Work PDF (5.6 MB)</span>
                  </a>
                </div>
              </div>

              {/* Quick Meta Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400">Submitting Entity:</span>
                  <div className="font-bold text-white">Rojes Labs</div>
                </div>
                <div>
                  <span className="text-slate-400">Lead Applicant:</span>
                  <div className="font-bold text-emerald-300">Pratibha Das Hatibaruah</div>
                </div>
                <div>
                  <span className="text-slate-400">Challenge Partner:</span>
                  <div className="font-bold text-white">TRA Tocklai</div>
                </div>
                <div>
                  <span className="text-slate-400">Target Region:</span>
                  <div className="font-bold text-white">Assam & Dooars</div>
                </div>
                <div>
                  <span className="text-slate-400">Live App URL:</span>
                  <div>
                    <a href="https://teaguard-spray-monitor.pages.dev/" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-300 hover:underline break-all">
                      teaguard-spray-monitor.pages.dev
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">GitHub Repository:</span>
                  <div>
                    <a href="https://github.com/Pratibhadas3108/teaguard-spray-monitor" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-300 hover:underline break-all">
                      Pratibhadas3108/teaguard-spray-monitor
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 12 Sections Summary Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">12 Proposal Sections Content Summary</h3>
                  <p className="text-xs text-slate-500">Every section strictly formatted under 500 words and compiled into the official PDF.</p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                  Total: 12 Modules
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { n: "01", t: "Problem Understanding & Workflow", d: "Manual knapsack drift, 35% chemical loss, worker pacing variance, and pest resurgence in Assam." },
                  { n: "02", t: "Proposed Solution & Key Features", d: "Universal 172g retrofit kit, clamp-on ultrasonic flow sensor, 6-axis IMU, and haptic vibration grip." },
                  { n: "03", t: "User Journey, Wireframes & PoW", d: "Morning muster QR dispatch, in-field tactile guidance, water tanker logging, and live React MVP." },
                  { n: "04", t: "Technology & Architecture", d: "ESP32-S3 edge node, NavIC/GPS dual band, Semtech SX1262 LoRaWAN (865 MHz), and PostGIS cloud." },
                  { n: "05", t: "Development Methodology", d: "6-phase stage-gate agile process from TRA Tocklai baselining to 50-hectare plantation trials." },
                  { n: "06", t: "Development Timeline", d: "6-month timeline to TRL-7 commercial validation across Upper Assam tea estates." },
                  { n: "07", t: "Data & Information Requirements", d: "High-frequency 50Hz kinematic IMU, WSP droplet imagery, and TRA Plant Protection Code norms." },
                  { n: "08", t: "Team & Manpower Expertise", d: "Lead Applicant Pratibha Das Hatibaruah (IoT Architect), firmware engineers, RF specialists, and tea agronomists." },
                  { n: "09", t: "Testing, Validation & Evidence", d: "±1.42% flow accuracy in copper slurries, 94.2% swath uniformity, and 98.4% LoRa packet delivery." },
                  { n: "10", t: "Security, Safety & Compliance", d: "128-bit AES telemetry encryption, SHA-256 immutable spray ledger, and FSSAI/EU MRL compliance." },
                  { n: "11", t: "Innovation & Differentiation", d: "Non-contact ultrasonic clamp vs impeller clogging; eyes-free haptics vs distracting mobile screens." },
                  { n: "12", t: "Resources, Risks & Validation", d: "₹40.00 Lakhs grant (₹20.00L Technical Engineering Team + ₹20.00L Hardware, Tooling, Trials, IP & Reserve)." }
                ].map(item => (
                  <div key={item.n} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded text-[11px]">{item.n}</span>
                      <span className="font-bold text-slate-900">{item.t}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed pl-7">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicative Resource & Budget Allocation (40 Lakhs Grant) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Indicative Resource & Budget Allocation (₹40.00 Lakhs Grant)</h3>
                  <p className="text-xs text-slate-500">Structured 6-month NESFIC-I-06 grant utilization prioritizing deep-tech engineering and Assam field trials.</p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Total Grant: ₹40.00 Lakhs
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { head: "Technical Engineering Team Cost", scope: "6-month multi-disciplinary team (Lead Architect, Embedded/Firmware, RF/LoRa, Cloud/GIS, Tea Agronomist, Field QA)", amount: "₹20.00 Lakhs", pct: 50, color: "bg-emerald-600", highlight: true },
                  { head: "Hardware Prototyping & Pilot Batch (100 Kits)", scope: "ESP32-S3, piezo ultrasonic sensors, NavIC GNSS, 6-axis IMU, LiFePO4 batteries, solar LoRaWAN gateways, PCB runs", amount: "₹7.50 Lakhs", pct: 18.75, color: "bg-teal-600" },
                  { head: "Mechanical Tooling & IP67 Enclosures", scope: "Rapid injection-mold tooling, UV-polycarbonate housings, FKM chemical seals, universal lance clamps", amount: "₹4.00 Lakhs", pct: 10, color: "bg-cyan-600" },
                  { head: "Field Pilot Validation (TRA Tocklai)", scope: "50-hectare Assam trials, Water-Sensitive Paper (WSP) consumables, operator workshops (Sadri/Assamese), logistics", amount: "₹4.00 Lakhs", pct: 10, color: "bg-blue-600" },
                  { head: "Cloud, IP & Regulatory Compliance", scope: "AWS/PostGIS hosting, WPC 865 MHz & IP67 lab certifications, provisional patents, FSSAI/TRA audit tooling", amount: "₹2.50 Lakhs", pct: 6.25, color: "bg-indigo-600" },
                  { head: "Contingency & Operational Reserve", scope: "Component lead-time buffers, monsoon trial rescheduling, and field replacement spares", amount: "₹2.00 Lakhs", pct: 5, color: "bg-slate-500" }
                ].map((row, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border ${row.highlight ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900">{row.head}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{row.scope}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-extrabold text-sm text-slate-900">{row.amount}</span>
                        <span className="ml-2 text-[11px] font-mono font-semibold text-emerald-700">({row.pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Proof of Work Annexures Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">Proof of Work (PoW) Technical Evidence Included in Dossier</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Annexure A: Hardware BOM
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Itemized production cost breakdown (₹4,850 / kit) featuring ESP32-S3, piezo ultrasonic transducers, and NavIC receiver.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-bold text-teal-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" /> Annexure B: Calibration Rig
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Benchtop test logs across water, copper oxychloride 50% WP, and thiamethoxam verifying ±1.42% flow accuracy with zero clogging.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-bold text-blue-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" /> Annexure C: WSP Trials
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Water-sensitive paper droplet density comparison proving 94.2% canopy penetration vs 52.4% unmonitored manual baseline.
                  </p>
                </div>
              </div>
            </div>

            {/* 16:9 Technological Framework Infographics Gallery */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">16:9 Technological Framework Infographics (Embedded in PDF)</h3>
                  <p className="text-xs text-slate-500">Click any blueprint infographic to view full-screen.</p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  9 Visual Diagrams
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { src: "/assets/01_hero_chairakshak_overview.jpg", title: "Fig 1. System Architecture Overview" },
                  { src: "/assets/02_knapsack_lance_retrofit.jpg", title: "Fig 2. 172g Lance Retrofit Exploded View" },
                  { src: "/assets/03_daily_field_workflow.jpg", title: "Fig 3. 5-Stage Daily Field Workflow" },
                  { src: "/assets/04_wsp_droplet_comparison.jpg", title: "Fig 4. WSP Droplet Deposition Benchmark" },
                  { src: "/assets/05_ultrasonic_vs_impeller.jpg", title: "Fig 5. Ultrasonic vs Mechanical Impeller" },
                  { src: "/assets/06_spatial_swath_heatmap.jpg", title: "Fig 6. Spatial Swath Heatmap (Sec 4C)" },
                  { src: "/assets/07_kinematics_haptic_waveform.jpg", title: "Fig 7. Kinematics & Haptic Feedback" },
                  { src: "/assets/08_offline_lorawan_architecture.jpg", title: "Fig 8. Offline LoRaWAN & BLE Mesh" },
                  { src: "/assets/09_mrl_audit_compliance.jpg", title: "Fig 9. Cryptographic MRL Audit Ledger" }
                ].map((fig, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedInfographic(fig)}
                    className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50 overflow-hidden hover:border-emerald-400 hover:shadow-md transition"
                  >
                    <div className="aspect-video bg-slate-100 overflow-hidden">
                      <img src={fig.src} alt={fig.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
                    </div>
                    <div className="p-2.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate">{fig.title}</span>
                      <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* LIGHTBOX MODAL FOR INFOGRAPHICS */}
      {selectedInfographic && (
        <div
          onClick={() => setSelectedInfographic(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white max-w-5xl w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">{selectedInfographic.title}</span>
              <button
                onClick={() => setSelectedInfographic(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-100 p-2">
              <img src={selectedInfographic.src} alt={selectedInfographic.title} className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INTERACTIVE APPLICATION TUTORIAL & USER GUIDE */}
      {showTutorialModal && (
        <div
          onClick={() => setShowTutorialModal(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white max-w-3xl w-full rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowTutorialModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-4 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                <BookOpen className="w-3.5 h-3.5" /> Interactive User Guide
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">What ChaiRakshak Does & How to Use It</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>ChaiRakshak</strong> (developed by <strong>Rojes Labs</strong> for <strong>NESFIC-I-06</strong>) is a smart IoT monitoring and digital twin platform for manual and operator-carried knapsack sprayers in Assam & Dooars tea plantations. It ensures TRA Tocklai dosage uniformity (400–450 L/ha), prevents chemical wastage, and protects export Maximum Residue Limits (MRL).
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Step-by-Step Platform Walkthrough</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    tab: 'dashboard',
                    step: '1. Field Operations Live Map',
                    desc: 'Monitor real-time operator GPS+NavIC tracks across tea bush rows. Green = optimal (400–450 L/ha), Blue = under-spray, Red = over-spray. Switch between operators in the leaderboard or pause/resume live simulation from the top bar.'
                  },
                  {
                    tab: 'telemetry',
                    step: '2. Lance Kinematics & Haptics',
                    desc: 'Inspect non-intrusive ultrasonic flow rates (mL/min), 6-axis IMU lance pitch angles, and click the 3 Audio-Haptic Tester buttons to hear the vibration cues sent directly to the operator’s grip.'
                  },
                  {
                    tab: 'calculator',
                    step: '3. TRA Chemical & Tank Calculator',
                    desc: 'Select a target tea pest (e.g. Helopeltis, Red Spider Mite, Blister Blight), enter section hectares, and pick knapsack capacity (16L/20L/12L) to compute TRA-compliant dilution ratios and Pre-Harvest Interval (PHI) lockouts.'
                  },
                  {
                    tab: 'wsp',
                    step: '4. WSP Droplet Scanner',
                    desc: 'Inspect optical Water-Sensitive Paper (WSP) diagnostics measuring droplet density (42 droplets/cm²), Volume Median Diameter (185 µm), and top-to-bottom canopy penetration.'
                  },
                  {
                    tab: 'compliance',
                    step: '5. MRL & Audit Certificate',
                    desc: 'Review active TRA chemical protocols, FSSAI/EU MRL safe-plucking dates, and click "View & Print TRA Audit Certificate" for a cryptographically signed export compliance report.'
                  },
                  {
                    tab: 'proposal',
                    step: '6. Proposal, PoW & Infographics',
                    desc: 'Download the standalone Proposal PDF (1.7 MB) and Proof of Work PDF (5.6 MB), review the ₹40.00 Lakhs grant budget breakdown, and click any of the 9 16:9 blueprint infographics to zoom.'
                  }
                ].map(item => (
                  <div key={item.tab} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900">{item.step}</div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab(item.tab);
                        setShowTutorialModal(false);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <span>Open this module</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowTutorialModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
              >
                Got It — Explore Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TRA TOCKLAI AUDIT CERTIFICATE */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center border-b-2 border-emerald-600 pb-4 space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-700">Official Compliance Certificate</div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">TEA RESEARCH ASSOCIATION (TRA) TOCKLAI</h1>
              <p className="text-xs text-slate-500">Plant Protection Code (PPC) & FSSAI MRL Verification Record</p>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">Estate & Division:</span>
                  <div className="font-bold text-slate-900">Jorhat Tea Estate · Block 4C</div>
                </div>
                <div>
                  <span className="text-slate-500">Certificate No:</span>
                  <div className="font-mono font-bold text-slate-900">TRA-NESFIC-2026-0892</div>
                </div>
                <div>
                  <span className="text-slate-500">Treated Clonal Bush:</span>
                  <div className="font-bold text-slate-900">TV-1 Mature Bush (12.6 Hectares)</div>
                </div>
                <div>
                  <span className="text-slate-500">Application Date:</span>
                  <div className="font-mono font-bold text-slate-900">23 November 2026</div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 uppercase">Audit Verified Parameters:</span>
                <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-2">Metric</th>
                      <th className="p-2">Measured</th>
                      <th className="p-2">TRA Guideline</th>
                      <th className="p-2">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2">Average Spray Volume</td>
                      <td className="p-2 font-mono">422 L/ha</td>
                      <td className="p-2">400 - 450 L/ha</td>
                      <td className="p-2 text-emerald-700 font-bold">Compliant</td>
                    </tr>
                    <tr>
                      <td className="p-2">Coverage Uniformity</td>
                      <td className="p-2 font-mono">94.2%</td>
                      <td className="p-2">&gt;85.0%</td>
                      <td className="p-2 text-emerald-700 font-bold">Grade A</td>
                    </tr>
                    <tr>
                      <td className="p-2">Pre-Harvest Interval (PHI)</td>
                      <td className="p-2 font-mono">7 Days</td>
                      <td className="p-2">7 Days Min</td>
                      <td className="p-2 text-emerald-700 font-bold">Locked</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px]">
                <span className="font-bold">Cryptographic Validation:</span> Signed with SHA-256 telemetry hash. Authorized for EU/UK/FSSAI export tea consignment clearance.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" /> Print Certificate
              </button>
              <button 
                onClick={() => setShowCertificateModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Enterprise Footer */}
      <footer className="border-t border-slate-200 bg-white text-xs text-slate-600 shadow-sm mt-12">
        {/* Main Footer Info */}
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
                <Droplet className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Chai<span className="text-emerald-600">Rakshak</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                v1.3.0-Production
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              ChaiRakshak is an IoT & Edge-AI precision spray monitoring and telemetry platform developed for manual and operator-carried knapsack sprayers across Assam and Dooars tea plantations. Built for the North East Seva First Innovation Challenge (NESFIC 2026), under the Assam Innovation & Startup Foundation (AISF), Department of Innovation, Incubation and Startups (DIIS), Govt. of Assam, in technical alignment with the Tea Research Association (TRA) Tocklai.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px]">
              <span className="font-semibold text-slate-800">Lead Applicant: <span className="text-emerald-700 font-bold">Pratibha Das Hatibaruah</span></span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-800">Organization: <span className="text-slate-900 font-bold">Rojes Labs</span></span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">Problem Statement: <span className="font-mono text-emerald-700 font-semibold">NESFIC-I-06</span></span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <a href="https://teaguard-spray-monitor.pages.dev/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold hover:underline">
                Live URL: https://teaguard-spray-monitor.pages.dev/
              </a>
              <span className="text-slate-300">|</span>
              <a href="https://github.com/Pratibhadas3108/teaguard-spray-monitor" target="_blank" rel="noopener noreferrer" className="text-slate-700 font-semibold hover:underline">
                GitHub: https://github.com/Pratibhadas3108/teaguard-spray-monitor
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Compliance & Standards</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tea Board Plant Protection Code (PPC)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> TRA Tocklai Guidelines (400-450 L/ha)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> FSSAI & European Union Export MRL Norms</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> CIB&RC Approved Agrochemical Labels</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Proposal & Artifacts</h4>
            <div className="space-y-2 flex flex-col items-start">
              <a 
                href="/NESFIC_I06_Proposal.pdf" 
                download="NESFIC_I06_Proposal.pdf"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" /> Proposal PDF (12 Modules)
              </a>
              <a 
                href="/NESFIC_I06_Proof_of_Work.pdf" 
                download="NESFIC_I06_Proof_of_Work.pdf"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" /> Proof of Work PDF (Evidence)
              </a>
              <p className="text-[10px] text-slate-400 leading-normal">
                Standalone PDFs formatted for NESFIC-I-06 portal upload (&lt;10 MB each).
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Strip */}
        <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="max-w-7xl mx-auto space-y-2">
            <div className="text-[11px] text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Disclaimer:</strong> ChaiRakshak is an IoT-enabled research telemetry and operational decision-support tool. Recommended spray dosages, dilution rates, and Pre-Harvest Intervals (PHI) are computed using Tea Research Association (TRA) Tocklai bulletins and Central Insecticides Board (CIB&RC) registrations. Field application parameters must be cross-verified and authorized by certified estate managers prior to chemical dispatch. Rojes Labs accepts no liability for field variances caused by uncalibrated operator equipment, extreme microclimatic anomalies, or unconfirmed agrochemical formulations.
            </div>
            <div className="flex flex-wrap justify-between items-center pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 gap-2">
              <div>
                © 2026 <strong className="text-slate-800">Rojes Labs</strong>. All Rights Reserved. Lead Applicant: <strong className="text-emerald-700">Pratibha Das Hatibaruah</strong>.
              </div>
              <div className="flex items-center gap-4">
                <span>Location: Jorhat, Assam (IN-AS)</span>
                <span className="text-slate-300">|</span>
                <span>Coordinates: 26.7509° N, 94.2037° E</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
