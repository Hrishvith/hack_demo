import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Bot, CheckSquare, GitBranch, Activity,
  Settings, ChevronRight, Play, Square, Circle, Zap,
  AlertCircle, GitCommit, GitPullRequest, Terminal,
  TrendingUp, Clock, Code2, TestTube, Eye, MessageSquare,
  Brain, RefreshCw, Plus, Search, Bell, User, X,
  ChevronDown, Cpu, Database, Layers, ArrowUpRight,
  BarChart2, Filter, MoreHorizontal, ExternalLink,
  Shield, Wifi, HardDrive, Server
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const taskCompletionData = [
  { time: "00:00", completed: 4, failed: 1, running: 2 },
  { time: "02:00", completed: 7, failed: 0, running: 3 },
  { time: "04:00", completed: 5, failed: 2, running: 1 },
  { time: "06:00", completed: 11, failed: 1, running: 4 },
  { time: "08:00", completed: 16, failed: 0, running: 5 },
  { time: "10:00", completed: 14, failed: 1, running: 6 },
  { time: "12:00", completed: 19, failed: 2, running: 3 },
  { time: "14:00", completed: 22, failed: 0, running: 7 },
  { time: "16:00", completed: 18, failed: 1, running: 4 },
  { time: "18:00", completed: 25, failed: 0, running: 5 },
];

const agentPerformanceData = [
  { name: "Planner", efficiency: 92, tasks: 47 },
  { name: "Coder", efficiency: 88, tasks: 63 },
  { name: "Tester", efficiency: 95, tasks: 58 },
  { name: "Reviewer", efficiency: 91, tasks: 44 },
  { name: "Comms", efficiency: 97, tasks: 31 },
  { name: "Memory", efficiency: 99, tasks: 120 },
];

const AGENTS = [
  {
    id: "planner",
    name: "Planner Agent",
    icon: Brain,
    color: "#a78bfa",
    glowColor: "rgba(167,139,250,0.3)",
    status: "running",
    lastTask: "Decomposed auth refactor into 8 subtasks",
    progress: 67,
    tasksCompleted: 47,
    uptime: "14h 22m",
    model: "GPT-4o",
  },
  {
    id: "coder",
    name: "Coder Agent",
    icon: Code2,
    color: "#34d399",
    glowColor: "rgba(52,211,153,0.3)",
    status: "running",
    lastTask: "Editing src/auth/login.ts — fixing JWT validation",
    progress: 43,
    tasksCompleted: 63,
    uptime: "14h 22m",
    model: "Claude Sonnet",
  },
  {
    id: "tester",
    name: "Tester Agent",
    icon: TestTube,
    color: "#60a5fa",
    glowColor: "rgba(96,165,250,0.3)",
    status: "running",
    lastTask: "Running 142 unit tests — auth module",
    progress: 78,
    tasksCompleted: 58,
    uptime: "14h 22m",
    model: "GPT-4o-mini",
  },
  {
    id: "reviewer",
    name: "Reviewer Agent",
    icon: Eye,
    color: "#fb923c",
    glowColor: "rgba(251,146,60,0.3)",
    status: "idle",
    lastTask: "Approved PR #847 — config parser update",
    progress: 100,
    tasksCompleted: 44,
    uptime: "14h 22m",
    model: "Claude Opus",
  },
  {
    id: "communicator",
    name: "Communicator Agent",
    icon: MessageSquare,
    color: "#f472b6",
    glowColor: "rgba(244,114,182,0.3)",
    status: "idle",
    lastTask: "Created PR #851 with auto-generated description",
    progress: 100,
    tasksCompleted: 31,
    uptime: "14h 22m",
    model: "GPT-4o",
  },
  {
    id: "memory",
    name: "Memory Agent",
    icon: Database,
    color: "#facc15",
    glowColor: "rgba(250,204,21,0.3)",
    status: "running",
    lastTask: "Indexing codebase changes — 2,847 vectors updated",
    progress: 91,
    tasksCompleted: 120,
    uptime: "14h 22m",
    model: "text-embedding-3",
  },
];

const REPOSITORIES = [
  {
    name: "core-api",
    org: "acme-corp",
    branch: "feat/auth-refactor",
    lastCommit: "fix: JWT token expiry validation",
    commitHash: "a3f9b21",
    timeAgo: "3 min ago",
    openIssues: 14,
    pullRequests: 3,
    status: "active",
    language: "TypeScript",
  },
  {
    name: "frontend-app",
    org: "acme-corp",
    branch: "main",
    lastCommit: "feat: add dark mode toggle",
    commitHash: "c7d2e84",
    timeAgo: "1 hr ago",
    openIssues: 7,
    pullRequests: 1,
    status: "idle",
    language: "React",
  },
  {
    name: "ml-pipeline",
    org: "acme-corp",
    branch: "dev/model-v2",
    lastCommit: "chore: update dependencies",
    commitHash: "f1a0c39",
    timeAgo: "5 hr ago",
    openIssues: 22,
    pullRequests: 0,
    status: "idle",
    language: "Python",
  },
];

const TASKS = [
  { id: "T-142", title: "Fix login bug — JWT token expiry", priority: "high", status: "running", agent: "Coder Agent", progress: 43, created: "2 hr ago" },
  { id: "T-141", title: "Write unit tests for auth module", priority: "high", status: "running", agent: "Tester Agent", progress: 78, created: "3 hr ago" },
  { id: "T-140", title: "Refactor database connection pool", priority: "medium", status: "completed", agent: "Coder Agent", progress: 100, created: "5 hr ago" },
  { id: "T-139", title: "Create PR for config parser update", priority: "low", status: "completed", agent: "Communicator Agent", progress: 100, created: "7 hr ago" },
  { id: "T-138", title: "Review API rate limiting logic", priority: "medium", status: "completed", agent: "Reviewer Agent", progress: 100, created: "9 hr ago" },
  { id: "T-137", title: "Update ML model inference pipeline", priority: "high", status: "queued", agent: "Planner Agent", progress: 0, created: "10 min ago" },
];

const INITIAL_LOGS = [
  { id: 1, time: "14:22:01", agent: "Planner Agent", color: "#a78bfa", message: "Task #142 received — analyzing issue context and dependencies" },
  { id: 2, time: "14:22:03", agent: "Planner Agent", color: "#a78bfa", message: "Task broken into 4 subtasks: [analyze] [fix] [test] [review]" },
  { id: 3, time: "14:22:05", agent: "Memory Agent", color: "#facc15", message: "Loaded 847 relevant code vectors from codebase index" },
  { id: 4, time: "14:22:08", agent: "Coder Agent", color: "#34d399", message: "Opening file: src/auth/login.ts" },
  { id: 5, time: "14:22:11", agent: "Coder Agent", color: "#34d399", message: "Identified bug: JWT_EXPIRY env var not parsed as integer" },
  { id: 6, time: "14:22:15", agent: "Coder Agent", color: "#34d399", message: "Applying fix: parseInt(process.env.JWT_EXPIRY ?? '3600', 10)" },
  { id: 7, time: "14:22:18", agent: "Coder Agent", color: "#34d399", message: "Fix applied — running lint checks..." },
  { id: 8, time: "14:22:22", agent: "Tester Agent", color: "#60a5fa", message: "Generating unit tests for auth/login.ts" },
  { id: 9, time: "14:22:25", agent: "Tester Agent", color: "#60a5fa", message: "Running test suite: 142 tests — 138 passed, 4 pending" },
  { id: 10, time: "14:22:30", agent: "Reviewer Agent", color: "#fb923c", message: "Code review initiated — checking quality and security" },
];

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status, size = "sm" }) => {
  const config = {
    running: { label: "Running", color: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400", pulse: true },
    idle: { label: "Idle", color: "text-slate-400", bg: "bg-slate-400/10", dot: "bg-slate-400", pulse: false },
    completed: { label: "Completed", color: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400", pulse: false },
    queued: { label: "Queued", color: "text-amber-400", bg: "bg-amber-400/10", dot: "bg-amber-400", pulse: false },
    active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400", pulse: true },
    error: { label: "Error", color: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400", pulse: false },
  };
  const c = config[status] || config.idle;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${c.color} ${c.bg}`}>
      <span className="relative flex h-1.5 w-1.5">
        {c.pulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-75`} />}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${c.dot}`} />
      </span>
      {c.label}
    </span>
  );
};

// ─── AGENT CARD ───────────────────────────────────────────────────────────────

const AgentCard = ({ agent, index }) => {
  const Icon = agent.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="relative group rounded-xl border border-white/5 bg-[#0d1117] p-5 hover:border-white/10 transition-all duration-300 overflow-hidden"
      style={{ boxShadow: `0 0 0 0 ${agent.glowColor}` }}
      whileHover={{ boxShadow: `0 0 30px 0 ${agent.glowColor}` }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${agent.glowColor} 0%, transparent 70%)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: `${agent.color}18`, border: `1px solid ${agent.color}30` }}>
            <Icon size={18} style={{ color: agent.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
            <p className="text-xs text-slate-500">{agent.model}</p>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      <p className="text-xs text-slate-400 mb-4 font-mono leading-relaxed line-clamp-2">
        {agent.lastTask}
      </p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Progress</span>
          <span style={{ color: agent.color }}>{agent.progress}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${agent.color}80, ${agent.color})` }}
            initial={{ width: 0 }}
            animate={{ width: `${agent.progress}%` }}
            transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-slate-500">
        <span>{agent.tasksCompleted} tasks done</span>
        <span>↑ {agent.uptime}</span>
      </div>
    </motion.div>
  );
};

// ─── TASK CARD ────────────────────────────────────────────────────────────────

const TaskCard = ({ task, index }) => {
  const priorityColor = { high: "text-red-400 bg-red-400/10", medium: "text-amber-400 bg-amber-400/10", low: "text-slate-400 bg-slate-400/10" };
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all group"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-xs font-mono text-slate-500 shrink-0">{task.id}</span>
        <span className="text-sm text-slate-200 truncate">{task.title}</span>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${priorityColor[task.priority]}`}>{task.priority}</span>
      <span className="text-xs text-slate-500 shrink-0 hidden sm:block">{task.agent}</span>
      <StatusBadge status={task.status} />
      <div className="w-16 hidden md:block">
        <div className="h-1 bg-white/5 rounded-full">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${task.progress}%` }} />
        </div>
      </div>
    </motion.div>
  );
};

// ─── LOG VIEWER ───────────────────────────────────────────────────────────────

const LogViewer = ({ logs }) => {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="font-mono text-xs h-72 overflow-y-auto space-y-1 p-4 bg-[#070b0f] rounded-lg border border-white/5">
      <AnimatePresence initial={false}>
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-2 leading-relaxed"
          >
            <span className="text-slate-600 shrink-0">{log.time}</span>
            <span className="shrink-0 font-semibold" style={{ color: log.color }}>[{log.agent}]</span>
            <span className="text-slate-300">{log.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "repositories", label: "Repositories", icon: GitBranch },
  { id: "logs", label: "Activity Logs", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ activePage, onNavigate, collapsed }) => {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full flex flex-col border-r border-white/5 bg-[#0a0e14] shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/5 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shrink-0">
          <Zap size={14} className="text-white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 overflow-hidden">
            <span className="text-sm font-bold text-white tracking-tight">AgentOps</span>
            <p className="text-[10px] text-slate-500 -mt-0.5">Multi-Agent System</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 group relative ${
                active ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              {active && <motion.div layoutId="activeNav" className="absolute inset-0 rounded-lg bg-white/[0.06]" />}
              <Icon size={16} className={`shrink-0 relative z-10 ${active ? "text-violet-400" : ""}`} />
              {!collapsed && <span className="relative z-10 font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* System status */}
      {!collapsed && (
        <div className="px-3 py-4 border-t border-white/5">
          <div className="bg-emerald-400/5 border border-emerald-400/10 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-xs text-emerald-400 font-medium">All systems operational</span>
            </div>
            <p className="text-[10px] text-slate-600">6/6 agents active</p>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

// ─── HEADER ───────────────────────────────────────────────────────────────────

const Header = ({ activePage, onToggleSidebar }) => {
  const titles = { dashboard: "Dashboard", agents: "Agent Monitor", tasks: "Task Execution", repositories: "Repositories", logs: "Activity Logs", settings: "Settings" };
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0e14]/80 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="text-slate-500 hover:text-slate-200 transition-colors">
          <Layers size={16} />
        </button>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="text-slate-600">AgentOps</span>
          <ChevronRight size={12} />
          <span className="text-slate-200 font-medium">{titles[activePage]}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/5 rounded-lg px-3 py-1.5 text-sm text-slate-500 w-52 hidden md:flex">
          <Search size={13} />
          <span className="text-xs">Search agents, tasks...</span>
        </div>
        <button className="relative w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-violet-500 rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
          <User size={12} className="text-white" />
        </div>
      </div>
    </header>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, icon: Icon, color, delta, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07 }}
    className="bg-[#0d1117] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon size={16} style={{ color }} />
      </div>
      {delta && (
        <span className={`text-xs flex items-center gap-0.5 ${delta > 0 ? "text-emerald-400" : "text-red-400"}`}>
          <ArrowUpRight size={11} />
          {Math.abs(delta)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
    <div className="text-xs text-slate-500">{label}</div>
    {sub && <div className="text-xs text-slate-600 mt-1">{sub}</div>}
  </motion.div>
);

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.dataKey}: {p.value}</p>
      ))}
    </div>
  );
};

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────

const DashboardPage = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard index={0} label="Active Tasks" value="8" sub="3 high priority" icon={CheckSquare} color="#a78bfa" delta={12} />
      <StatCard index={1} label="Running Agents" value="4" sub="2 idle, 0 errors" icon={Bot} color="#34d399" delta={0} />
      <StatCard index={2} label="Completed Today" value="47" sub="↑ 18% from yesterday" icon={TrendingUp} color="#60a5fa" delta={18} />
      <StatCard index={3} label="System Health" value="99.2%" sub="All services normal" icon={Shield} color="#fb923c" delta={0.2} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Task Completion Rate</h3>
          <span className="text-xs text-slate-500">Last 18h</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={taskCompletionData}>
            <defs>
              <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="completed" stroke="#a78bfa" fill="url(#cGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="running" stroke="#34d399" fill="url(#rGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
        className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Agent Performance</h3>
          <span className="text-xs text-slate-500">Efficiency %</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={agentPerformanceData} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[80, 100]} tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="efficiency" fill="#a78bfa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>

    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Recent Tasks</h3>
        <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all</button>
      </div>
      <div className="space-y-2">
        {TASKS.slice(0, 4).map((task, i) => <TaskCard key={task.id} task={task} index={i} />)}
      </div>
    </motion.div>
  </div>
);

// ─── AGENTS PAGE ──────────────────────────────────────────────────────────────

const AgentsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-white">Agent Monitor</h2>
        <p className="text-sm text-slate-500 mt-0.5">Real-time status of all autonomous agents</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status="running" />
        <span className="text-xs text-slate-500">4 active</span>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {AGENTS.map((agent, i) => <AgentCard key={agent.id} agent={agent} index={i} />)}
    </div>
  </div>
);

// ─── TASKS PAGE ───────────────────────────────────────────────────────────────

const TasksPage = () => {
  const [command, setCommand] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [activeAgent, setActiveAgent] = useState(null);
  const logIdRef = useRef(100);

  const LOG_SEQUENCE = [
    { agent: "Planner Agent", color: "#a78bfa", message: (cmd) => `Analyzing task: "${cmd}"` },
    { agent: "Planner Agent", color: "#a78bfa", message: () => "Task decomposed into subtasks successfully" },
    { agent: "Memory Agent", color: "#facc15", message: () => "Loading relevant codebase context..." },
    { agent: "Coder Agent", color: "#34d399", message: () => "Starting implementation..." },
    { agent: "Coder Agent", color: "#34d399", message: () => "Code changes applied — running validation" },
    { agent: "Tester Agent", color: "#60a5fa", message: () => "Generating and running unit tests..." },
    { agent: "Tester Agent", color: "#60a5fa", message: () => "Tests passed: 14/14 ✓" },
    { agent: "Reviewer Agent", color: "#fb923c", message: () => "Reviewing code quality and style..." },
    { agent: "Reviewer Agent", color: "#fb923c", message: () => "Code approved — no issues found" },
    { agent: "Communicator Agent", color: "#f472b6", message: () => "Creating GitHub Pull Request..." },
    { agent: "Communicator Agent", color: "#f472b6", message: () => "PR #852 created successfully ✓ Task complete." },
  ];

  const startTask = useCallback(() => {
    if (!command.trim() || isRunning) return;
    setIsRunning(true);
    const taskCommand = command;
    setCommand("");
    let step = 0;
    const addLog = () => {
      if (step >= LOG_SEQUENCE.length) { setIsRunning(false); setActiveAgent(null); return; }
      const entry = LOG_SEQUENCE[step];
      setActiveAgent(entry.agent);
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setLogs((prev) => [...prev, { id: logIdRef.current++, time, agent: entry.agent, color: entry.color, message: entry.message(taskCommand) }]);
      step++;
      setTimeout(addLog, 900 + Math.random() * 600);
    };
    setTimeout(addLog, 300);
  }, [command, isRunning]);

  return (
    <div className="space-y-6">
      {/* Task input panel */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">New Task</h3>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 bg-[#070b0f] border border-white/5 rounded-lg px-4 py-3 focus-within:border-violet-500/50 transition-colors">
            <Terminal size={14} className="text-slate-500 shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none font-mono"
              placeholder='e.g. "Fix login bug in issue #142, write unit tests and create a pull request"'
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startTask()}
            />
          </div>
          <motion.button
            onClick={startTask}
            disabled={isRunning || !command.trim()}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all ${
              isRunning || !command.trim()
                ? "bg-white/5 text-slate-600 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-500 text-white"
            }`}
          >
            {isRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
            {isRunning ? "Running" : "Execute"}
          </motion.button>
        </div>

        {activeAgent && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/[0.02] rounded-lg px-3 py-2">
              <RefreshCw size={11} className="animate-spin text-violet-400" />
              <span className="text-violet-400 font-medium">{activeAgent}</span>
              <span>is currently working...</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Active agents status */}
      {isRunning && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            const isActive = agent.name === activeAgent;
            return (
              <div key={agent.id} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                isActive ? "border-white/20 bg-white/[0.05]" : "border-white/5 bg-white/[0.02]"
              }`}>
                <motion.div animate={isActive ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 1 }}>
                  <Icon size={16} style={{ color: isActive ? agent.color : "#334155" }} />
                </motion.div>
                <span className="text-[10px] text-slate-500 text-center leading-tight">{agent.name.replace(" Agent", "")}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: agent.color }} />}
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Log viewer */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-white">Execution Logs</h3>
          </div>
          <button onClick={() => setLogs([])} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Clear</button>
        </div>
        <LogViewer logs={logs} />
      </motion.div>

      {/* Tasks list */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">All Tasks</h3>
        <div className="space-y-2">
          {TASKS.map((task, i) => <TaskCard key={task.id} task={task} index={i} />)}
        </div>
      </motion.div>
    </div>
  );
};

// ─── REPOSITORIES PAGE ────────────────────────────────────────────────────────

const ReposPage = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold text-white">Repositories</h2>
      <button className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs rounded-lg transition-colors">
        <Plus size={12} /> Connect Repo
      </button>
    </div>
    {REPOSITORIES.map((repo, i) => (
      <motion.div key={repo.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
        className="bg-[#0d1117] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center">
              <GitBranch size={15} className="text-slate-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{repo.org} /</span>
                <span className="text-sm font-semibold text-white">{repo.name}</span>
                <ExternalLink size={11} className="text-slate-600" />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono text-violet-400">{repo.branch}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={repo.status} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-slate-600 mb-1">Last Commit</p>
            <p className="text-slate-300 font-mono">{repo.commitHash}</p>
            <p className="text-slate-500 mt-0.5">{repo.timeAgo}</p>
          </div>
          <div className="col-span-2 hidden sm:block">
            <p className="text-slate-600 mb-1">Message</p>
            <p className="text-slate-300">{repo.lastCommit}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-4">
              <div>
                <p className="text-slate-600">Issues</p>
                <p className="text-amber-400 font-semibold">{repo.openIssues}</p>
              </div>
              <div>
                <p className="text-slate-600">PRs</p>
                <p className="text-blue-400 font-semibold">{repo.pullRequests}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// ─── LOGS PAGE ────────────────────────────────────────────────────────────────

const LogsPage = () => {
  const extendedLogs = [
    ...INITIAL_LOGS,
    { id: 11, time: "14:22:35", agent: "Reviewer Agent", color: "#fb923c", message: "Security scan complete — no vulnerabilities detected" },
    { id: 12, time: "14:22:40", agent: "Communicator Agent", color: "#f472b6", message: "PR #851 opened: 'fix: JWT token expiry validation'" },
    { id: 13, time: "14:22:44", agent: "Memory Agent", color: "#facc15", message: "Storing task context and code diff in vector store" },
    { id: 14, time: "14:22:47", agent: "Planner Agent", color: "#a78bfa", message: "Task T-142 completed successfully in 46s" },
    { id: 15, time: "14:23:01", agent: "Planner Agent", color: "#a78bfa", message: "Picking up next task: T-141 — unit tests for auth module" },
    { id: 16, time: "14:23:05", agent: "Tester Agent", color: "#60a5fa", message: "Generating test cases for 12 functions in auth module" },
    { id: 17, time: "14:23:12", agent: "Tester Agent", color: "#60a5fa", message: "Test file created: src/auth/__tests__/login.test.ts" },
    { id: 18, time: "14:23:18", agent: "Tester Agent", color: "#60a5fa", message: "Running test suite... 0/142 complete" },
    { id: 19, time: "14:23:30", agent: "Tester Agent", color: "#60a5fa", message: "Running test suite... 78/142 complete" },
  ];

  const agentFilters = ["All", ...AGENTS.map((a) => a.name)];
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? extendedLogs : extendedLogs.filter((l) => l.agent === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Activity Logs</h2>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-slate-500" />
          <div className="flex gap-1">
            {agentFilters.slice(0, 4).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${filter === f ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-200 bg-white/[0.03]"}`}>
                {f === "All" ? "All" : f.replace(" Agent", "")}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
        <LogViewer logs={filtered} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {AGENTS.map((agent, i) => {
          const Icon = agent.icon;
          const count = extendedLogs.filter((l) => l.agent === agent.name).length;
          return (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#0d1117] border border-white/5 rounded-xl p-3 flex flex-col items-center gap-2 text-center">
              <Icon size={16} style={{ color: agent.color }} />
              <span className="text-xs text-slate-400 leading-tight">{agent.name.replace(" Agent", "")}</span>
              <span className="text-lg font-bold" style={{ color: agent.color }}>{count}</span>
              <span className="text-[10px] text-slate-600">events</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────

const SettingsPage = () => (
  <div className="space-y-4 max-w-2xl">
    <h2 className="text-lg font-bold text-white">Settings</h2>
    {[
      { section: "System", items: [
        { label: "Auto-assign agents", desc: "Let the planner automatically assign optimal agents", enabled: true },
        { label: "Parallel execution", desc: "Run multiple agents concurrently when possible", enabled: true },
        { label: "Auto-commit", desc: "Automatically commit changes after agent approval", enabled: false },
      ]},
      { section: "Notifications", items: [
        { label: "Task completion alerts", desc: "Notify when a task finishes", enabled: true },
        { label: "Agent errors", desc: "Alert on agent failures or timeouts", enabled: true },
        { label: "PR creation", desc: "Notify when a PR is auto-created", enabled: false },
      ]},
    ].map((group) => (
      <motion.div key={group.section} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#0d1117] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">{group.section}</h3>
        <div className="space-y-4">
          {group.items.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${item.enabled ? "bg-violet-600" : "bg-white/10"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.enabled ? "left-5.5 left-[22px]" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
);

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function AgentOpsDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pages = {
    dashboard: <DashboardPage />,
    agents: <AgentsPage />,
    tasks: <TasksPage />,
    repositories: <ReposPage />,
    logs: <LogsPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className="flex h-screen bg-[#070b0f] text-white overflow-hidden font-sans">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <Sidebar activePage={activePage} onNavigate={setActivePage} collapsed={sidebarCollapsed} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header activePage={activePage} onToggleSidebar={() => setSidebarCollapsed((v) => !v)} />

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {pages[activePage]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
