import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  ShieldCheck, 
  ShieldAlert, 
  Crosshair, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  KeyRound, 
  Flame, 
  Cpu, 
  AlertTriangle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { HACKER_INTEL_CATALOG } from '../data/hackerIntelCatalog';

interface EthicalHackerAcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackerHudEnabled: boolean;
  onToggleHackerHud: () => void;
}

export const EthicalHackerAcademyModal: React.FC<EthicalHackerAcademyModalProps> = ({
  isOpen,
  onClose,
  hackerHudEnabled,
  onToggleHackerHud,
}) => {
  const [activeTab, setActiveTab] = useState<'principles' | 'tools' | 'killchain' | 'cheatsheet'>('principles');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const ethicalPrinciples = [
    {
      title: '1. Skriftlig Autorisasjon (Scope & Tillatelse)',
      desc: 'En etisk hacker (White Hat) angriper ALDRI et system uten en skriftlig, signert avtale (Rules of Engagement). Uten tillatelse er all probing straffbar.',
      badge: 'JUS & ETIKK',
      color: 'border-cyan-700 bg-cyan-950/40 text-cyan-300'
    },
    {
      title: '2. "Do No Harm" (Ingen Destruktivitet)',
      desc: 'Målet er aldri å slette data eller kræsje produksjonssystemer. Du beviser sårbarheten ("Proof of Concept"), men stopper før skade skjer.',
      badge: 'KJERNEPRINSIPP',
      color: 'border-emerald-700 bg-emerald-950/40 text-emerald-300'
    },
    {
      title: '3. Ansvarlig Rapportering (Coordinated Disclosure)',
      desc: 'Når du finner en sårbarhet, rapporteres den sikkert til systemeier eller via anerkjente Bug Bounty-programmer (f.eks. HackerOne/Bugcrowd) med råd om hvordan den fikses.',
      badge: 'LEVERANSE',
      color: 'border-purple-700 bg-purple-950/40 text-purple-300'
    },
    {
      title: '4. Konfidensialitet & Databeskyttelse',
      desc: 'Data du kommer over under et pentestoppdrag (passord, kundeopplysninger, helsedata) forblir strengt konfidensielle og må aldri spres.',
      badge: 'SIKKERHET',
      color: 'border-amber-700 bg-amber-950/40 text-amber-300'
    }
  ];

  const toolsArsenal = [
    {
      name: 'Nmap (Network Mapper)',
      role: 'Rekognosering & Portskanning',
      cmd: 'nmap -sV -sC -T4 -p 1-65535 192.168.1.50',
      explanation: 'Kartlegger åpne porter, tjenesteversjoner og kjører innebygde sårbarhetsskript (NSE).'
    },
    {
      name: 'Wireshark / TShark',
      role: 'Dyp Pakkeanalyse & Trafikkovervåking',
      cmd: 'tshark -i eth0 -Y "http.request or dns" -T fields -e ip.src -e http.host',
      explanation: 'Avlytter og dekoder nettverkspakker for å finne ukryptert data, DNS-lekkasjer eller uvanlig trafikk.'
    },
    {
      name: 'Burp Suite',
      role: 'Web- & API-sikkerhetstesting',
      cmd: 'curl -x http://127.0.0.1:8080 -k -i https://target.internal/api',
      explanation: 'Sender all nettlesertrafikk gjennom en proxy for å fange opp og manipulere forespørsler og JSON-data.'
    },
    {
      name: 'SQLmap',
      role: 'Automatisert SQLi-revisjon',
      cmd: 'sqlmap -u "https://target.com/user?id=10" --risk=3 --level=3 --dbs',
      explanation: 'Tester inndatafelt for alle typer SQL-injisering og beviser sårbarheten ved å hente ut databasenavn.'
    },
    {
      name: 'Metasploit Framework',
      role: 'Exploitation & Validering',
      cmd: 'msfconsole -q -x "use exploit/multi/handler; set PAYLOAD generic/shell_reverse_tcp; run"',
      explanation: 'Stort bibliotek med verifiserte exploits for å validere at rapporterte sårbarheter faktisk kan utnyttes.'
    },
    {
      name: 'Hashcat / John the Ripper',
      role: 'Passordsikkerhet & Hash-knekking',
      cmd: 'hashcat -m 1000 -a 0 ntlm_hashes.txt rockyou.txt -r rules/best64.rule',
      explanation: 'Tester om passordpolicyen i organisasjonen holder mål ved å simulere ordbok- og regelbaserte angrep på hashede passord.'
    }
  ];

  const killChainPhases = [
    { step: '1. Reconnaissance', icon: '🔭', focus: 'Passive & aktive søk (OSINT, Nmap, DNS, Shodan, WHOIS)' },
    { step: '2. Weaponization', icon: '🛠️', focus: 'Kombinere et exploit med en payload tilpasset målets versjon' },
    { step: '3. Delivery', icon: '📨', focus: 'Sende payload via e-post, webformular, API-kall eller USB' },
    { step: '4. Exploitation', icon: '💥', focus: 'Kjøring av koden via buffer overflow, SQLi, RCE eller logikkfeil' },
    { step: '5. Installation', icon: '📦', focus: 'Etablere fotfeste (Webshell, bakdør, reverse shell)' },
    { step: '6. Command & Control', icon: '📡', focus: 'Koble til angriperens C2-server for instruksjoner (kryptert HTTPS/DNS)' },
    { step: '7. Actions on Objectives', icon: '🎯', focus: 'Dataeksfiltrering, ransomware, eller bevis på tilgang for pentestrapport' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 tracking-wide">
                  Etisk Superhacker Akademi & War-Room Intel
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  WHITE HAT HUD
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Kunnskap, metoder og verktøy som forvandler deg til en autorisert sikkerhetsekspert.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Toggle for HUD Tooltip Hints */}
            <button
              onClick={onToggleHackerHud}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                hackerHudEnabled 
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-950' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Slå på/av små glødende indikatorer på knapper som har etisk hacker-kunnskap"
            >
              <Lightbulb className={`w-3.5 h-3.5 ${hackerHudEnabled ? 'text-cyan-400' : ''}`} />
              <span>Intel HUD: {hackerHudEnabled ? 'PÅ' : 'AV'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 gap-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('principles')}
            className={`py-3 px-3 border-b-2 font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'principles'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> 1. Etiske Grunnregler
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`py-3 px-3 border-b-2 font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tools'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" /> 2. Arsenalet (Topp Verktøy)
          </button>
          <button
            onClick={() => setActiveTab('killchain')}
            className={`py-3 px-3 border-b-2 font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'killchain'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crosshair className="w-4 h-4" /> 3. Cyber Kill Chain
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`py-3 px-3 border-b-2 font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'cheatsheet'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 4. Hurtigkommandoer
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: ETISKE GRUNNREGLER */}
          {activeTab === 'principles' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-900/50 text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-cyan-400 font-mono block mb-1">
                  Hva skiller en "Superhacker" fra en cyberkriminell?
                </strong>
                Ferdighetene og teknologiene er 100% de samme — det eneste som skiller en White Hat fra en Black Hat er 
                <strong> tillatelse, etikk og intensjon</strong>. En superhacker finner sårbarheter for å beskytte samfunnet, 
                styrke forsvaret og lukke bakdørene før kriminelle rekker å utnytte dem.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {ethicalPrinciples.map((p) => (
                  <div key={p.title} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.color}`}>
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-100">{p.title}</h3>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs font-sans text-amber-200/90 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-mono text-amber-400 block mb-0.5">Hvordan lære i praksis uten risiko:</strong>
                  Bruk lovlige øvingsplattformer som <em>Hack The Box</em>, <em>TryHackMe</em>, <em>PortSwigger Web Security Academy</em> og 
                  vårt innebygde simulator-miljø i dette War-Room-dashbordet. Alt du tester her inne skjer i en trygg, isolert sandboks!
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARSENALET (VERKTØY) */}
          {activeTab === 'tools' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-sans">
                De seks verktøyene enhver profesjonell penetrasjonstester og etisk hacker har i verktøybeltet sitt (f.eks. på Kali Linux):
              </p>

              <div className="space-y-3 pt-1">
                {toolsArsenal.map((t) => (
                  <div key={t.name} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-cyan-300 font-mono">{t.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                        {t.role}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {t.explanation}
                    </p>

                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-800 flex items-center justify-between gap-2">
                      <code className="text-[11px] text-emerald-400 font-mono overflow-x-auto">
                        {t.cmd}
                      </code>
                      <button
                        onClick={() => handleCopy(t.cmd)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                        title="Kopier kommando"
                      >
                        {copiedCmd === t.cmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCmd === t.cmd ? 'Kopiert' : 'Kopier'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CYBER KILL CHAIN */}
          {activeTab === 'killchain' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-sans">
                Lockheed Martin Cyber Kill Chain & MITRE ATT&CK: Slik planlegges og utføres et moderne cyberangrep, 
                og hvordan forsvaret kan stanse det i hvert ledd.
              </p>

              <div className="space-y-2 pt-1">
                {killChainPhases.map((phase) => (
                  <div key={phase.step} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <span className="text-xl shrink-0">{phase.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-200 font-mono">{phase.step}</div>
                      <div className="text-[11px] text-slate-400 font-sans mt-0.5">{phase.focus}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-xs text-slate-300 font-sans">
                <strong className="text-emerald-400 font-mono">Gullregel for Blue Team:</strong>{' '}
                Hvis du bryter <em>ett eneste ledd</em> i angrepskjeden (f.eks. stanser utgående C2 i trinn 6), 
                mislykkes hele angrepet!
              </div>
            </div>
          )}

          {/* TAB 4: HURTIGKOMMANDOER CHEATSHEET */}
          {activeTab === 'cheatsheet' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-sans">
                Praktiske terminal-kommandoer du kan kopiere og teste i ditt eget øvingsmiljø:
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    title: '1. Rask portskann etter web- og databaseporter',
                    cmd: 'nmap -p 80,443,3000,3306,5432,8080 -T4 -sV 127.0.0.1',
                    desc: 'Finner raskt hvilke webservere og databaser som lytter.'
                  },
                  {
                    title: '2. Vis alle åpne nettverksprosesser lokalt (Linux/macOS)',
                    cmd: 'netstat -tuln -p   # eller ss -tulpn',
                    desc: 'Viser hvilke prosesser som lytter på hvilke porter.'
                  },
                  {
                    title: '3. Test HTTP-headers og WAF-respons med curl',
                    cmd: 'curl -I -X GET "http://localhost:8080" -H "User-Agent: Mozilla/5.0"',
                    desc: 'Sjekker sikkerhets-headers (CSP, HSTS, X-Frame-Options).'
                  },
                  {
                    title: '4. Beregn SHA-256 hash for filintegritet (WORM-test)',
                    cmd: 'sha256sum sensitive_log.sqlite',
                    desc: 'Garanterer at ingen byte har blitt manipulert.'
                  },
                  {
                    title: '5. Søk etter mistenkelige SQL-kommandoer i logger',
                    cmd: 'grep -E -i "union.*select|waitfor delay|sleep\\(" /var/log/nginx/access.log',
                    desc: 'Avslører pågående SQL-injiseringsforsøk i sanntid.'
                  }
                ].map((item) => (
                  <div key={item.title} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-slate-400 font-sans">{item.desc}</div>
                    <div className="bg-slate-900 rounded p-1.5 border border-slate-800 flex items-center justify-between gap-2">
                      <code className="text-[11px] text-cyan-300 font-mono truncate">{item.cmd}</code>
                      <button
                        onClick={() => handleCopy(item.cmd)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        {copiedCmd === item.cmd ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                        <span>{copiedCmd === item.cmd ? 'Kopiert' : 'Kopier'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Tips: Hold markøren over knapper og statistikk i War-Room for å få sanntids HUD-forklaringer!</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Lukk Akademi
          </button>
        </div>

      </div>
    </div>
  );
};
