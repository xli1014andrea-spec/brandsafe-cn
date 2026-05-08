import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,

  BadgeCheck,

  BarChart3,
  BookOpen,
  CheckCircle2,
  CircleDollarSign,

  Layers,
  Lightbulb,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
} from 'lucide-react';
import './styles.css';

const PLATFORMS = [
  'Xiaohongshu',
  'Douyin',
  'WeChat Official Account',
  'Weibo',
  'Bilibili',
];

const RISK_CATEGORIES = [
  'Exaggerated claims',
  'Missing ad disclosure or unclear sponsorship',
  'Greenwashing or sustainability overclaim',
  'Body anxiety, beauty anxiety, or shame-based messaging',
  'Gender stereotype or identity-based sensitivity',
  'Urgency pressure or manipulative sales language',
  'Public opinion backlash risk',
  'Platform tone mismatch',
  'User-defined platform keyword risk',
];

const SEVERITY_POINTS = {
  Low: 8,
  Medium: 15,
  High: 25,
};

const categoryGuidance = {
  'Exaggerated claims': 'Add evidence, qualifiers, and scope limits. Avoid absolute guarantees or universal outcomes.',
  'Missing ad disclosure or unclear sponsorship': 'Clarify whether the content is sponsored, gifted, affiliate-driven, or brand-owned.',
  'Greenwashing or sustainability overclaim': 'Use specific, verifiable sustainability facts instead of broad environmental promises.',
  'Body anxiety, beauty anxiety, or shame-based messaging': 'Avoid shaming appearance, skin tone, body shape, age, or social status. Focus on neutral product information.',
  'Gender stereotype or identity-based sensitivity': 'Remove assumptions about gender, identity, or who “must” behave a certain way.',
  'Urgency pressure or manipulative sales language': 'Reduce pressure tactics and make promotion terms clear, time-bound, and factual.',
  'Public opinion backlash risk': 'Consider how audiences may interpret the phrase during sensitive social discussions or crises.',
  'Platform tone mismatch': 'Adapt the level of formality, disclosure, and community tone to the selected platform.',
  'User-defined platform keyword risk': 'Review internal brand, platform, or campaign-specific restrictions before publishing.',
};

const defaultRules = [
  { phrase: '100%有效', category: 'Exaggerated claims', severity: 'High', explanation: 'Absolute efficacy claims can be hard to substantiate and may trigger platform review.' },
  { phrase: '绝对安全', category: 'Exaggerated claims', severity: 'High', explanation: 'Safety guarantees leave no room for individual differences, side effects, or usage context.' },
  { phrase: '适合所有人', category: 'Exaggerated claims', severity: 'Medium', explanation: 'Universal suitability claims may be inaccurate for sensitive groups or special situations.' },
  { phrase: '7天见效', category: 'Exaggerated claims', severity: 'Medium', explanation: 'Short time-to-result claims should be backed by evidence and clear conditions.' },
  { phrase: '最有效', category: 'Exaggerated claims', severity: 'High', explanation: 'Superlative claims imply market comparison and require strong substantiation.' },
  { phrase: '永久改善', category: 'Exaggerated claims', severity: 'High', explanation: 'Permanent outcome claims are risky unless supported by robust evidence.' },
  { phrase: '纯天然无害', category: 'Exaggerated claims', severity: 'High', explanation: 'Natural-origin claims do not automatically mean harmless; avoid implying zero risk.' },
  { phrase: '不买就亏', category: 'Urgency pressure or manipulative sales language', severity: 'Medium', explanation: 'Loss-framed pressure can feel manipulative and may reduce trust.' },
  { phrase: '错过再等一年', category: 'Urgency pressure or manipulative sales language', severity: 'Medium', explanation: 'Scarcity messaging should be factual and not create excessive pressure.' },
  { phrase: '女生一定要', category: 'Gender stereotype or identity-based sensitivity', severity: 'Medium', explanation: 'This assumes all women need the same thing and can reinforce stereotypes.' },
  { phrase: '男生都喜欢', category: 'Gender stereotype or identity-based sensitivity', severity: 'Medium', explanation: 'This generalizes preferences by gender and may be seen as stereotyping.' },
  { phrase: '敏感肌必入', category: 'Body anxiety, beauty anxiety, or shame-based messaging', severity: 'Medium', explanation: 'Beauty/skin claims should avoid broad promises and should note individual skin differences.' },
  { phrase: '环保零负担', category: 'Greenwashing or sustainability overclaim', severity: 'High', explanation: 'Zero-impact environmental claims are difficult to prove without lifecycle evidence.' },
  { phrase: '可持续但没有具体说明', category: 'Greenwashing or sustainability overclaim', severity: 'Medium', explanation: 'Sustainability language needs concrete facts such as materials, standards, or measurable practices.' },
  { phrase: '博主亲测', category: 'Missing ad disclosure or unclear sponsorship', severity: 'Medium', explanation: 'Influencer testing language can blur commercial relationships if sponsorship is not clear.' },
  { phrase: '良心推荐', category: 'Missing ad disclosure or unclear sponsorship', severity: 'Low', explanation: 'Recommendation language may need disclosure if connected to brand compensation or gifting.' },
  { phrase: '无广', category: 'Missing ad disclosure or unclear sponsorship', severity: 'High', explanation: 'Saying there is no ad relationship is risky if there is any brand, affiliate, or gifting connection.' },
  { phrase: '不是广告', category: 'Missing ad disclosure or unclear sponsorship', severity: 'High', explanation: 'This can be misleading if the post has commercial intent or material connection.' },
  { phrase: '学生党闭眼入', category: 'Urgency pressure or manipulative sales language', severity: 'Medium', explanation: '“Buy without thinking” language can pressure price-sensitive audiences.' },
  { phrase: '全网最低', category: 'Exaggerated claims', severity: 'High', explanation: 'Lowest-price claims require current market-wide proof and clear comparison scope.' },
  { phrase: '逆天改命', category: 'Public opinion backlash risk', severity: 'Medium', explanation: 'Overdramatic transformation language may invite criticism or unrealistic expectations.' },
  { phrase: '黄黑皮必看', category: 'Body anxiety, beauty anxiety, or shame-based messaging', severity: 'Medium', explanation: 'Skin-tone targeting can become shame-based if it implies certain tones need correction.' },
  { phrase: '女生必须精致', category: 'Gender stereotype or identity-based sensitivity', severity: 'High', explanation: 'This frames appearance expectations as mandatory for women and may trigger backlash.' },

];

const platformRules = {
  Xiaohongshu: [

    { phrase: '种草', category: 'Missing ad disclosure or unclear sponsorship', severity: 'Low', explanation: 'Seeding language should be paired with clear disclosure when commercial intent exists.' },
    { phrase: '闭眼入', category: 'Urgency pressure or manipulative sales language', severity: 'Medium', explanation: 'Xiaohongshu users often value authentic, experience-led notes; pressure language may feel inauthentic.' },
  ],
  Douyin: [
    { phrase: '限时秒杀', category: 'Urgency pressure or manipulative sales language', severity: 'Medium', explanation: 'Livestream urgency should clearly state real timing, inventory, and terms.' },
    { phrase: '马上下单', category: 'Urgency pressure or manipulative sales language', severity: 'Medium', explanation: 'Repeated purchase commands can feel coercive in short-video commerce.' },
  ],
  'WeChat Official Account': [
    { phrase: '震惊', category: 'Platform tone mismatch', severity: 'Low', explanation: 'Clickbait wording can clash with the more editorial tone of WeChat articles.' },
  ],
  Weibo: [
    { phrase: '翻车', category: 'Public opinion backlash risk', severity: 'Medium', explanation: 'Weibo discussions can amplify controversy language and public sentiment quickly.' },
  ],
  Bilibili: [
    { phrase: '恰饭', category: 'Missing ad disclosure or unclear sponsorship', severity: 'Low', explanation: 'Bilibili audiences often expect transparent sponsorship labels and creator context.' },

  ],
};

const demoCases = [
  {

    title: 'Skincare Xiaohongshu example',

    platforms: ['Xiaohongshu'],
    text: '博主亲测这款精华7天见效，敏感肌必入，女生一定要。不是广告，100%有效。',
  },
  {

    title: 'Sustainable fashion example',

    platforms: ['Xiaohongshu', 'Weibo'],
    text: '我们的新系列纯天然无害，环保零负担，可持续但没有具体说明，适合所有人。',
  },
  {

    title: 'Nonprofit campaign example',

    platforms: ['WeChat Official Account', 'Weibo'],
    text: '这次公益传播希望避免卖惨和身份标签，鼓励公众理性参与，不使用夸张承诺。',
  },
  {

    title: 'Douyin sales livestream example',

    platforms: ['Douyin'],
    text: '今晚限时秒杀，全网最低，不买就亏，错过再等一年，马上下单，学生党闭眼入。',
  },
];

function loadCustomRules() {
  try {
    return JSON.parse(localStorage.getItem('brandsafe-cn-custom-rules')) || [];
  } catch {
    return [];
  }
}


function App() {

  const [copy, setCopy] = useState(demoCases[0].text);
  const [selectedPlatforms, setSelectedPlatforms] = useState(demoCases[0].platforms);
  const [customRules, setCustomRules] = useState(loadCustomRules);
  const [customForm, setCustomForm] = useState({ platform: PLATFORMS[0], phrase: '', category: RISK_CATEGORIES[0], severity: 'Medium' });
  const [report, setReport] = useState(null);



  const allRules = useMemo(() => {
    const userRules = customRules.map((rule) => ({
      ...rule,
      custom: true,

      explanation: `Custom ${rule.platform} keyword added by the user for ${rule.category}.`,

    }));
    return [...defaultRules.map((rule) => ({ ...rule, platform: 'All platforms' })), ...selectedPlatforms.flatMap((platform) => (platformRules[platform] || []).map((rule) => ({ ...rule, platform }))), ...userRules.filter((rule) => selectedPlatforms.includes(rule.platform))];
  }, [customRules, selectedPlatforms]);

  const saveCustomRules = (nextRules) => {
    setCustomRules(nextRules);
    localStorage.setItem('brandsafe-cn-custom-rules', JSON.stringify(nextRules));
  };



  const togglePlatform = (platform) => {
    setSelectedPlatforms((current) => current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]);
  };

  const addCustomRule = (event) => {
    event.preventDefault();
    if (!customForm.phrase.trim()) return;
    saveCustomRules([
      ...customRules,
      { id: crypto.randomUUID(), ...customForm, phrase: customForm.phrase.trim() },
    ]);
    setCustomForm({ ...customForm, phrase: '' });
  };

  const analyzeRisk = () => {
    const matches = allRules
      .filter((rule) => copy.includes(rule.phrase))
      .map((rule) => ({ ...rule, points: SEVERITY_POINTS[rule.severity] }));
    const categories = [...new Set(matches.map((match) => match.category))];
    const score = Math.min(100, matches.reduce((sum, match) => sum + match.points, 0) + Math.max(0, categories.length - 1) * 4);
    const level = score >= 60 ? 'High' : score >= 25 ? 'Medium' : 'Low';
    setReport({ score, level, matches, categories, platforms: selectedPlatforms });
  };

  const loadDemo = (demo) => {
    setCopy(demo.text);
    setSelectedPlatforms(demo.platforms);
    setReport(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(244,63,94,0.18),_transparent_30%)]" />
      <main className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

        <Hero />
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <AnalyzerCard copy={copy} setCopy={setCopy} selectedPlatforms={selectedPlatforms} togglePlatform={togglePlatform} analyzeRisk={analyzeRisk} loadDemo={loadDemo} />
            <CustomDictionary customRules={customRules} customForm={customForm} setCustomForm={setCustomForm} addCustomRule={addCustomRule} deleteRule={(id) => saveCustomRules(customRules.filter((rule) => rule.id !== id))} />
          </div>
          <RiskReport report={report} selectedPlatforms={selectedPlatforms} />
        </section>
        <Roadmap />
        <Pricing />
        <p className="mt-8 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
          Disclaimer: This tool provides marketing risk analysis and communication guidance. It is not legal advice.

        </p>
      </main>
    </div>
  );
}


function Hero() {
  return (
    <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-sm text-teal-100">
            <ShieldAlert size={16} /> Rule-based MVP for China social platforms
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">BrandSafe CN</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            A lightweight Chinese social media marketing risk checker for brand safety, platform-sensitive communication, and ethical marketing review.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {['Transparent scoring', 'Custom keywords', 'No content generation'].map((item) => (

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200" key={item}>{item}</div>
          ))}
        </div>
      </div>
    </section>
  );
}


function AnalyzerCard({ copy, setCopy, selectedPlatforms, togglePlatform, analyzeRisk, loadDemo }) {
  return (
    <section className="card">
      <div className="section-title"><BookOpen /> Analyze marketing copy</div>
      <textarea value={copy} onChange={(event) => setCopy(event.target.value)} className="min-h-64 w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-base text-slate-100 outline-none ring-teal-400/40 transition focus:ring-4" placeholder="Paste Chinese marketing copy or a campaign brief here..." />
      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold text-slate-300">Select platforms</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <button key={platform} onClick={() => togglePlatform(platform)} className={`platform-tag ${selectedPlatforms.includes(platform) ? 'active' : ''}`}>{platform}</button>

          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {demoCases.map((demo) => (

          <button key={demo.title} onClick={() => loadDemo(demo)} className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-left text-sm text-slate-300 transition hover:border-teal-300/60 hover:text-white">
            {demo.title}

          </button>
        ))}
      </div>
      <button onClick={analyzeRisk} disabled={!copy.trim() || selectedPlatforms.length === 0} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-400 px-5 py-4 font-bold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50">

        <BarChart3 /> Analyze Risk

      </button>
    </section>
  );
}


function CustomDictionary({ customRules, customForm, setCustomForm, addCustomRule, deleteRule }) {
  return (
    <section className="card">
      <div className="section-title"><Layers /> Custom risk dictionary</div>
      <form onSubmit={addCustomRule} className="grid gap-3 md:grid-cols-2">
        <input value={customForm.phrase} onChange={(event) => setCustomForm({ ...customForm, phrase: event.target.value })} className="input md:col-span-2" placeholder="Add sensitive keyword, e.g. 内部禁用词" />
        <select value={customForm.platform} onChange={(event) => setCustomForm({ ...customForm, platform: event.target.value })} className="input">{PLATFORMS.map((platform) => <option key={platform}>{platform}</option>)}</select>
        <select value={customForm.severity} onChange={(event) => setCustomForm({ ...customForm, severity: event.target.value })} className="input">{Object.keys(SEVERITY_POINTS).map((severity) => <option key={severity}>{severity}</option>)}</select>
        <select value={customForm.category} onChange={(event) => setCustomForm({ ...customForm, category: event.target.value })} className="input md:col-span-2">{RISK_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 md:col-span-2"><Plus size={18} /> Add keyword</button>
      </form>
      <div className="mt-5 space-y-2">
        {customRules.length === 0 && <p className="text-sm text-slate-400">No custom keywords yet. They will be saved in localStorage.</p>}
        {customRules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-3">
            <div>
              <p className="font-semibold text-white">{rule.phrase} <span className="text-xs text-slate-400">({rule.severity})</span></p>
              <p className="text-xs text-slate-400">{rule.platform} · {rule.category}</p>
            </div>
            <button onClick={() => deleteRule(rule.id)} className="rounded-xl p-2 text-rose-200 transition hover:bg-rose-400/10"><Trash2 size={18} /></button>

          </div>
        ))}
      </div>
    </section>
  );
}


function RiskReport({ report, selectedPlatforms }) {
  if (!report) {
    return (
      <section className="card sticky top-6 h-fit">
        <div className="section-title"><Sparkles /> Risk report preview</div>
        <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
          Enter copy, select platforms, and run the analyzer to see a transparent risk report.
        </div>
        <PlatformNotes platforms={selectedPlatforms} />

      </section>
    );
  }

  const badgeClass = report.level === 'High' ? 'bg-rose-400 text-rose-950' : report.level === 'Medium' ? 'bg-amber-300 text-amber-950' : 'bg-emerald-300 text-emerald-950';

  return (
    <section className="card sticky top-6 h-fit">
      <div className="flex items-start justify-between gap-4">
        <div>

          <div className="section-title"><AlertTriangle /> Structured risk report</div>
          <p className="text-sm text-slate-400">Transparent score based on matched default, platform, and custom rules.</p>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-bold ${badgeClass}`}>{report.level}</span>
      </div>
      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
        <div className="flex items-end justify-between">
          <span className="text-slate-400">Risk score</span>

          <span className="text-5xl font-black text-white">{report.score}</span>
        </div>
        <div className="mt-4 h-3 rounded-full bg-slate-800"><div className="h-3 rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-rose-400" style={{ width: `${report.score}%` }} /></div>
      </div>
      <div className="mt-5">

        <h3 className="font-semibold text-white">Main risk categories detected</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {report.categories.length ? report.categories.map((category) => <span key={category} className="risk-chip">{category}</span>) : <span className="risk-chip good">No major category detected</span>}
        </div>
      </div>
      <PlatformNotes platforms={report.platforms} />
      <div className="mt-5 space-y-3">
        <h3 className="font-semibold text-white">Specific flagged phrases</h3>
        {report.matches.length === 0 && <p className="rounded-2xl bg-emerald-300/10 p-4 text-sm text-emerald-100">No listed phrases were found. Still review context, claims, substantiation, and disclosure manually.</p>}
        {report.matches.map((match, index) => (
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4" key={`${match.phrase}-${index}`}>
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-950">{match.phrase}</span><span className="risk-chip">{match.severity}</span><span className="risk-chip">{match.platform}</span></div>
            <p className="mt-3 text-sm text-slate-300"><strong>Why risky:</strong> {match.explanation}</p>
            <p className="mt-2 text-sm text-teal-100"><strong>Revision guidance:</strong> {categoryGuidance[match.category]}</p>
          </div>
        ))}

      </div>
    </section>
  );
}


function PlatformNotes({ platforms }) {
  const notes = {
    Xiaohongshu: 'Favor authentic experience notes, visible disclosure, and avoid over-seeding language.',
    Douyin: 'Keep livestream urgency factual; clarify price, stock, timing, and promotion terms.',
    'WeChat Official Account': 'Use editorial clarity, evidence, and source context rather than clickbait.',
    Weibo: 'Watch sentiment volatility, public issues, and wording that could intensify backlash.',
    Bilibili: 'Respect community tone and make sponsorship or “恰饭” context explicit.',
  };
  return (
    <div className="mt-5">
      <h3 className="font-semibold text-white">Platform-specific notes</h3>
      <div className="mt-2 space-y-2">
        {platforms.map((platform) => <p key={platform} className="rounded-2xl bg-white/5 p-3 text-sm text-slate-300"><strong>{platform}:</strong> {notes[platform]}</p>)}

      </div>
    </div>
  );
}


function Roadmap() {
  const items = ['AI semantic risk analysis', 'Trend-aware keyword updates from public sources', 'Platform policy monitoring', 'Team workspace', 'Exportable risk report', 'Subscription plan placeholder'];
  return (
    <section className="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2 lg:col-span-3"><div className="section-title"><Lightbulb /> Future Features / Product Roadmap</div></div>
      {items.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-950/50 p-4 text-slate-200"><CheckCircle2 className="text-teal-300" /> {item}</div>)}
    </section>
  );
}


function Pricing() {
  const plans = [
    { name: 'Free', detail: 'Rule-based risk detection and custom dictionary' },
    { name: 'Pro', detail: 'AI semantic analysis and trend keyword updates' },
    { name: 'Enterprise', detail: 'Team dashboard and brand risk monitoring' },
  ];
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      {plans.map((plan) => <div className="card" key={plan.name}><CircleDollarSign className="mb-3 text-teal-300" /><h3 className="text-2xl font-bold text-white">{plan.name}</h3><p className="mt-2 text-slate-300">{plan.detail}</p><p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">Payment placeholder only</p></div>)}

    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
