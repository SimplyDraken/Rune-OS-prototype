import { useEffect, useRef, useState } from "react";
import {
  Wifi, BatteryFull, Bluetooth, Search, Command, Sparkles, ChevronRight,
  Brain, Shield, Workflow, Cpu, Activity, Database, Network, Cloud,
  Music2, Bell, Terminal as TerminalIcon, MessagesSquare, Folder, Settings,
  Compass, Calendar, Mail, Image as ImageIcon, Code2, Mic, Send, X, Plus,
  Lightbulb, Thermometer, Lamp, Play, SkipForward, SkipBack, Sun,
} from "lucide-react";
import { RuneOrb } from "@/components/rune/RuneOrb";
import wallpaper from "@/assets/rune-wallpaper.jpg";

type OrbState = "idle" | "listening" | "thinking" | "executing" | "warning" | "secure";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return now;
}

export function RuneDesktop() {
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [chatOpen, setChatOpen] = useState(false);
  const [termOpen, setTermOpen] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden text-foreground">
      {/* Wallpaper */}
      <img
        src={wallpaper}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Cinematic vignette + ambient wash for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 0%, oklch(0.08 0.02 270 / 0.55) 80%), linear-gradient(180deg, oklch(0.08 0.02 270 / 0.35) 0%, transparent 25%, transparent 70%, oklch(0.06 0.02 270 / 0.55) 100%)",
        }}
      />
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />

      <TopBar />

      {/* Floating left sidebar */}
      <Sidebar
        onToggleChat={() => setChatOpen((v) => !v)}
        onToggleTerm={() => setTermOpen((v) => !v)}
        chatOpen={chatOpen}
        termOpen={termOpen}
      />

      {/* Right widgets stack */}
      <WidgetsColumn />

      {/* Center orb */}
      <CenterOrb orbState={orbState} setOrbState={setOrbState} />

      {/* Conversation panel — slides up from bottom */}
      <ConversationPanel open={chatOpen} onClose={() => setChatOpen(false)} setOrbState={setOrbState} />

      {/* Terminal — hidden tray */}
      <TerminalTray open={termOpen} onClose={() => setTermOpen(false)} />

      <Dock />
    </div>
  );
}

/* ---------------- Top Bar ---------------- */
function TopBar() {
  const now = useClock();
  const time = now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  const date = now ? now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : "";
  return (
    <div className="absolute top-0 inset-x-0 h-8 z-40 flex items-center px-5 text-[11px] backdrop-blur-md bg-[oklch(0.1_0.02_270/0.35)] border-b border-white/5">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: "var(--gradient-orb)", boxShadow: "0 0 10px var(--cyan)" }}
        />
        <span className="font-semibold tracking-[0.18em] text-foreground/90">RUNE</span>
      </div>
      <div className="flex items-center gap-5 ml-7 text-foreground/65">
        {["File", "Edit", "Workspace", "View", "Help"].map((m) => (
          <button key={m} className="hover:text-foreground transition-colors">{m}</button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-4 text-foreground/70">
        <span className="hidden md:flex items-center gap-1.5"><Brain className="w-3 h-3 text-[color:var(--violet)]" /> rune-core</span>
        <span className="hidden md:flex items-center gap-1.5"><Shield className="w-3 h-3 text-[color:var(--emerald)]" /> Protected</span>
        <Bluetooth className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <BatteryFull className="w-3.5 h-3.5" />
        <span suppressHydrationWarning className="text-foreground/90">{date}</span>
        <span suppressHydrationWarning className="text-foreground tabular-nums">{time}</span>
      </div>
    </div>
  );
}

/* ---------------- Sidebar ---------------- */
function Sidebar({
  onToggleChat, onToggleTerm, chatOpen, termOpen,
}: { onToggleChat: () => void; onToggleTerm: () => void; chatOpen: boolean; termOpen: boolean }) {
  const items = [
    { icon: Sparkles, label: "Rune", color: "cyan" as const, onClick: onToggleChat, active: chatOpen },
    { icon: Folder, label: "Files", color: "violet" as const },
    { icon: Workflow, label: "Agents", color: "violet" as const },
    { icon: Brain, label: "Memory", color: "violet" as const },
    { icon: MessagesSquare, label: "Chats", color: "cyan" as const },
    { icon: TerminalIcon, label: "Terminal", color: "emerald" as const, onClick: onToggleTerm, active: termOpen },
    { icon: Lamp, label: "Devices", color: "amber" as const },
    { icon: Settings, label: "Settings", color: "cyan" as const },
  ];
  return (
    <aside className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
      <div className="glass rounded-2xl p-2 flex flex-col gap-1.5">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={it.onClick}
            className={`group relative w-11 h-11 rounded-xl grid place-items-center transition-all ${
              it.active
                ? "bg-[oklch(0.78_0.16_200/0.15)] ring-1 ring-[color:var(--cyan)]/40"
                : "hover:bg-white/5"
            }`}
            title={it.label}
          >
            <it.icon
              className="w-[18px] h-[18px] transition-colors"
              style={{ color: it.active ? `var(--${it.color})` : "oklch(0.85 0.02 250)" }}
            />
            <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md glass-strong text-[10px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {it.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

/* ---------------- Right widgets ---------------- */
function WidgetsColumn() {
  return (
    <div className="absolute right-4 top-12 bottom-28 z-30 w-[280px] flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-none">
      <WeatherWidget />
      <SystemWidget />
      <MusicWidget />
      <NotificationsWidget />
    </div>
  );
}

function WidgetCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl p-3.5 ${className}`}>{children}</div>;
}

function WeatherWidget() {
  return (
    <WidgetCard>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/60">Tokyo</div>
          <div className="text-3xl font-light mt-1 tabular-nums">18°</div>
          <div className="text-xs text-foreground/70 mt-0.5">Clear · feels 17°</div>
        </div>
        <Cloud className="w-9 h-9 text-[color:var(--cyan)]" strokeWidth={1.2} />
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        {["21:00", "22:00", "23:00", "00:00"].map((h, i) => (
          <div key={h} className="flex flex-col items-center gap-1 text-[10px] text-foreground/60">
            <span>{h}</span>
            <Sun className="w-3.5 h-3.5 text-[color:var(--amber)]" strokeWidth={1.5} />
            <span className="text-foreground/80 tabular-nums">{18 - i}°</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function SystemWidget() {
  const metrics = [
    { label: "CPU", value: 42, color: "cyan" as const, icon: Cpu },
    { label: "GPU", value: 63, color: "violet" as const, icon: Activity },
    { label: "MEM", value: 57, color: "emerald" as const, icon: Database },
    { label: "NET", value: 28, color: "amber" as const, icon: Network },
  ];
  return (
    <WidgetCard>
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-3.5 h-3.5 text-[color:var(--cyan)]" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/60">System</span>
      </div>
      <div className="space-y-2.5">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-foreground/80"><m.icon className="w-3 h-3" /> {m.label}</span>
              <span className="font-mono tabular-nums text-foreground/90">{m.value}%</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${m.value}%`, background: `var(--${m.color})`, boxShadow: `0 0 6px var(--${m.color})` }}
              />
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function MusicWidget() {
  return (
    <WidgetCard>
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.4 0.18 290), oklch(0.55 0.18 200))",
            boxShadow: "0 4px 18px oklch(0.4 0.18 290 / 0.4)",
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/60">Now Playing</div>
          <div className="text-sm font-medium truncate">Neon Tides</div>
          <div className="text-[11px] text-foreground/60 truncate">Hiroshi Ambient</div>
        </div>
      </div>
      <div className="mt-3 h-0.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-2/5 bg-[color:var(--cyan)]" style={{ boxShadow: "0 0 6px var(--cyan)" }} />
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 text-foreground/80">
        <button className="hover:text-foreground"><SkipBack className="w-4 h-4" /></button>
        <button className="w-8 h-8 rounded-full grid place-items-center bg-white/10 hover:bg-white/15">
          <Play className="w-3.5 h-3.5 ml-0.5" />
        </button>
        <button className="hover:text-foreground"><SkipForward className="w-4 h-4" /></button>
      </div>
    </WidgetCard>
  );
}

function NotificationsWidget() {
  const notes = [
    { app: "Rune", text: "Summarized 12 commits in rune-core", time: "2m", color: "cyan" as const },
    { app: "Calendar", text: "Design review · 21:30", time: "12m", color: "violet" as const },
    { app: "A.D.A.M", text: "Sandbox 7e2 verified", time: "1h", color: "emerald" as const },
  ];
  return (
    <WidgetCard>
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-3.5 h-3.5 text-[color:var(--cyan)]" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/60">Notifications</span>
      </div>
      <div className="space-y-2">
        {notes.map((n) => (
          <div key={n.text} className="flex items-start gap-2 text-[11px]">
            <span
              className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: `var(--${n.color})`, boxShadow: `0 0 6px var(--${n.color})` }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground/90">{n.app}</span>
                <span className="text-foreground/50 tabular-nums">{n.time}</span>
              </div>
              <div className="text-foreground/70 truncate">{n.text}</div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

/* ---------------- Center Orb ---------------- */
function CenterOrb({ orbState, setOrbState }: { orbState: OrbState; setOrbState: (s: OrbState) => void }) {
  const states: OrbState[] = ["idle", "listening", "thinking", "executing"];
  return (
    <div className="absolute inset-0 grid place-items-center pointer-events-none z-10">
      <div className="relative pointer-events-auto flex flex-col items-center">
        <RuneOrb state={orbState} />
        <div className="mt-4 flex items-center gap-1.5">
          {states.map((s) => (
            <button
              key={s}
              onClick={() => setOrbState(s)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] transition-all ${
                orbState === s
                  ? "bg-[oklch(0.78_0.16_200/0.15)] text-[color:var(--cyan)] ring-1 ring-[color:var(--cyan)]/40"
                  : "text-foreground/55 hover:text-foreground/90"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-foreground/55 tracking-wide">Tap or say <span className="text-foreground/80">"Hey Rune"</span> to begin</p>
      </div>
    </div>
  );
}

/* ---------------- Conversation Panel ---------------- */
function ConversationPanel({
  open, onClose, setOrbState,
}: { open: boolean; onClose: () => void; setOrbState: (s: OrbState) => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "rune"; text: string }[]>([
    { from: "rune", text: "Good evening. I've prepared a summary of today's commits and quieted three low-priority notifications. What would you like to work on?" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: "user", text: input }]);
    setOrbState("thinking");
    const q = input;
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { from: "rune", text: `Working on it — "${q}". I'll surface the result here when ready.` }]);
      setOrbState("idle");
    }, 1200);
  };

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 bottom-24 z-30 w-[min(720px,calc(100vw-360px))] transition-all duration-500 ${
        open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[color:var(--cyan)]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/70">Conversation</span>
          </div>
          <button onClick={onClose} className="text-foreground/60 hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        <div className="max-h-[260px] overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed ${
                  m.from === "user"
                    ? "bg-[oklch(0.78_0.16_200/0.18)] text-foreground rounded-br-sm"
                    : "bg-white/5 text-foreground/90 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 pb-3">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {["Summarize today's work", "Open scheduler.ts", "Dim the lab lights", "What's on tomorrow?"].map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-foreground/75 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus-within:border-[color:var(--cyan)]/50 transition-colors">
            <Search className="w-4 h-4 text-foreground/50" />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask Rune anything…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-foreground/40"
            />
            <button className="text-foreground/60 hover:text-foreground"><Mic className="w-4 h-4" /></button>
            <button onClick={send} className="text-[color:var(--cyan)] hover:brightness-125"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Terminal Tray ---------------- */
function TerminalTray({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lines = [
    { p: "rune@core", path: "~", cmd: "rune status" },
    { o: "→ rune-core · healthy · 5 agents online", k: "ok" },
    { o: "→ A.D.A.M sentinel active · trust 98.4", k: "ok" },
    { o: "→ sandbox-7e2 idle · awaiting tasks", k: "muted" },
  ];
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 bottom-24 z-30 w-[min(720px,calc(100vw-360px))] transition-all duration-500 ${
        open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-3.5 h-3.5 text-[color:var(--emerald)]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/70">Terminal · sandbox-7e2</span>
          </div>
          <button onClick={onClose} className="text-foreground/60 hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 font-mono text-[12px] leading-relaxed">
          {lines.map((l, i) => (
            <div key={i} className="flex gap-2">
              {l.p ? (
                <>
                  <span className="text-[color:var(--emerald)]">{l.p}</span>
                  <span className="text-foreground/50">:{l.path}</span>
                  <span className="text-foreground/50">$</span>
                  <span className="text-foreground/90">{l.cmd}</span>
                </>
              ) : (
                <span className={l.k === "ok" ? "text-[color:var(--emerald)]" : "text-foreground/60"}>{l.o}</span>
              )}
            </div>
          ))}
          <div className="flex gap-2 mt-1">
            <span className="text-[color:var(--emerald)]">rune@core</span>
            <span className="text-foreground/50">:~$</span>
            <span className="w-2 h-3.5 bg-[color:var(--emerald)] animate-blink" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dock ---------------- */
function Dock() {
  const apps = [
    { icon: Compass, color: "cyan" as const, label: "Browser" },
    { icon: Mail, color: "violet" as const, label: "Mail" },
    { icon: Calendar, color: "amber" as const, label: "Calendar" },
    { icon: Code2, color: "emerald" as const, label: "Code" },
    { icon: ImageIcon, color: "violet" as const, label: "Gallery" },
    { icon: Music2, color: "cyan" as const, label: "Music" },
    { icon: Folder, color: "amber" as const, label: "Files" },
    { icon: Settings, color: "cyan" as const, label: "Settings" },
  ];
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-strong rounded-2xl px-3 py-2 flex items-end gap-2">
        {apps.map((a) => (
          <button
            key={a.label}
            className="group relative w-12 h-12 rounded-xl grid place-items-center bg-white/[0.04] hover:bg-white/10 transition-all hover:-translate-y-1"
            title={a.label}
          >
            <a.icon className="w-5 h-5" style={{ color: `var(--${a.color})` }} strokeWidth={1.5} />
            <span className="absolute -top-7 px-2 py-0.5 rounded-md glass-strong text-[10px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
