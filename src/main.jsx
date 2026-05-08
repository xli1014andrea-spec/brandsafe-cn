import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  CircleDollarSign,
  Languages,
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

const translations = {
  zh: {
    languageName: '中文',
    languageToggleLabel: '界面语言',
    platformLabels: {
      Xiaohongshu: '小红书',
      Douyin: '抖音',
      'WeChat Official Account': '微信公众号',
      Weibo: '微博',
      Bilibili: '哔哩哔哩',
      'All platforms': '全部平台',
    },
    severityLabels: {
      Low: '低',
      Medium: '中',
      High: '高',
    },
    levelLabels: {
      Low: '低风险',
      Medium: '中风险',
      High: '高风险',
    },
    categories: {
      'Exaggerated claims': '夸大或绝对化宣称',
      'Missing ad disclosure or unclear sponsorship': '广告披露不足或商业关系不清',
      'Greenwashing or sustainability overclaim': '绿色营销过度承诺',
      'Body anxiety, beauty anxiety, or shame-based messaging': '身材/容貌焦虑或羞辱式表达',
      'Gender stereotype or identity-based sensitivity': '性别刻板印象或身份敏感风险',
      'Urgency pressure or manipulative sales language': '紧迫感施压或诱导式销售话术',
      'Public opinion backlash risk': '舆情反噬风险',
      'Platform tone mismatch': '平台语气不匹配',
      'User-defined platform keyword risk': '自定义平台敏感词风险',
    },
    categoryGuidance: {
      'Exaggerated claims': '补充证据、适用条件和限制，避免绝对保证或覆盖所有人群的表述。',
      'Missing ad disclosure or unclear sponsorship': '明确说明是否为赞助、赠品、联盟推广或品牌自有内容。',
      'Greenwashing or sustainability overclaim': '用可验证的材料、标准或数据替代笼统环保承诺。',
      'Body anxiety, beauty anxiety, or shame-based messaging': '避免贬低外貌、肤色、身材、年龄或身份，转向中性产品信息。',
      'Gender stereotype or identity-based sensitivity': '去除对性别、身份或“必须如此”的预设，使用更包容的表达。',
      'Urgency pressure or manipulative sales language': '降低施压感，并清楚说明活动时间、库存、价格和适用条件。',
      'Public opinion backlash risk': '结合当下社会议题和受众情绪，评估是否可能被误读或放大争议。',
      'Platform tone mismatch': '根据平台社区氛围调整正式度、披露方式和表达语气。',
      'User-defined platform keyword risk': '发布前复核品牌内部、平台或项目级限制要求。',
    },
    hero: {
      eyebrow: '面向中国社媒平台的规则型 MVP',
      subtitle: '面向品牌安全、平台敏感沟通与伦理营销审阅的中文社交媒体营销风险检查工具。',
      valueProps: ['透明评分', '自定义敏感词', '不生成推广文案'],
    },
    analyzer: {
      title: '分析营销文案',
      placeholder: '粘贴中文营销文案或活动简报…',
      platformLabel: '选择发布平台',
      analyzeButton: '分析风险',
    },
    demoTitles: {
      skincare: '小红书护肤案例',
      sustainableFashion: '可持续时尚案例',
      nonprofit: '公益传播案例',
      douyinLivestream: '抖音直播带货案例',
    },
    customDictionary: {
      title: '自定义风险词库',
      keywordPlaceholder: '添加敏感词，例如：内部禁用词',
      addButton: '添加关键词',
      empty: '暂无自定义关键词。添加后会自动保存到 localStorage。',
      deleteLabel: '删除关键词',
      customExplanation: (platform, category) => `用户为${platform}添加的自定义关键词，归类为「${category}」。`,
    },
    report: {
      previewTitle: '风险报告预览',
      previewEmpty: '输入文案、选择平台并运行分析后，将在这里看到透明的风险报告。',
      title: '结构化风险报告',
      summary: '评分基于默认规则、平台规则和自定义规则的匹配结果。',
      scoreLabel: '风险分数',
      categoriesTitle: '检测到的主要风险类别',
      noCategory: '未检测到主要风险类别',
      platformNotesTitle: '平台提示',
      flaggedTitle: '命中的具体词句',
      noMatches: '未命中当前词库中的词句。仍建议人工复核语境、宣称依据、披露和受众敏感度。',
      whyRisky: '风险原因',
      guidance: '修改建议',
    },
    platformNotes: {
      Xiaohongshu: '强调真实体验和清晰披露，避免过度“种草”和强推语气。',
      Douyin: '直播紧迫感需真实可核验，明确价格、库存、时间和活动规则。',
      'WeChat Official Account': '适合更清晰、编辑化和证据充分的表达，避免标题党。',
      Weibo: '关注舆情传播速度、公共议题和可能被放大解读的措辞。',
      Bilibili: '尊重社区语境，赞助或“恰饭”内容应清楚说明。',
    },
    roadmap: {
      title: '未来功能 / 产品路线图',
      items: ['AI 语义风险分析', '基于公开来源的趋势敏感词更新', '平台政策监测', '团队工作区', '可导出的风险报告', '订阅方案占位'],
    },
    pricing: {
      plans: [
        { name: '免费版', detail: '规则型风险检测与自定义词库' },
        { name: '专业版', detail: 'AI 语义分析与趋势词更新' },
        { name: '企业版', detail: '团队看板与品牌风险监测' },
      ],
      placeholder: '仅为产品方案占位',
    },
    disclaimer: '免责声明：本工具提供营销风险分析与传播建议，不构成法律意见。',
    ruleExplanations: {
      '100%有效': '绝对化功效承诺通常难以充分证明，也可能触发平台审核。',
      绝对安全: '安全性承诺不应忽略个体差异、使用场景或潜在不适。',
      适合所有人: '“所有人适用”可能无法覆盖敏感人群或特殊情况。',
      '7天见效': '短期见效宣称需要证据、样本和适用条件支撑。',
      最有效: '最高级比较通常需要清晰范围和充分市场依据。',
      永久改善: '永久性效果承诺风险较高，需非常强的证据支撑。',
      纯天然无害: '天然来源不等于完全无害，避免暗示零风险。',
      不买就亏: '损失导向的促销话术容易让用户感到被施压。',
      错过再等一年: '稀缺性表达应真实、清楚，避免制造过度焦虑。',
      女生一定要: '该表达假设所有女性都有同样需求，容易强化刻板印象。',
      男生都喜欢: '按性别概括偏好，可能被视为刻板化表达。',
      敏感肌必入: '护肤适用性需要考虑个体差异，避免过度承诺。',
      环保零负担: '“零负担”类环保承诺很难在全生命周期中证明。',
      可持续但没有具体说明: '可持续表达需要材料、标准、流程或数据等具体依据。',
      博主亲测: '达人体验表达若存在商业合作，需要更清晰的关系披露。',
      良心推荐: '推荐语若涉及赞助、赠品或佣金，需要避免误导。',
      无广: '如果存在品牌合作、赠品或导购利益，“无广”容易构成误导。',
      不是广告: '有商业目的或利益关系时，否认广告属性风险较高。',
      学生党闭眼入: '“闭眼入”可能对价格敏感人群形成不理性购买暗示。',
      全网最低: '最低价宣称需要实时、全网范围和比较标准的证明。',
      逆天改命: '夸张转变叙事容易引发不切实际期待或舆论质疑。',
      黄黑皮必看: '肤色定向表达若暗示需要修正，可能制造容貌焦虑。',
      女生必须精致: '将精致外貌设为女性义务，容易引发性别刻板争议。',
      种草: '商业种草内容如存在合作，应配合清楚披露。',
      闭眼入: '小红书用户重视真实体验，强推语气可能降低可信度。',
      限时秒杀: '直播紧迫感需明确真实时间、库存和活动规则。',
      马上下单: '短视频电商中反复下单指令可能带来强迫感。',
      震惊: '标题党式措辞可能不符合微信公众号偏编辑化的语气。',
      翻车: '微博语境下争议词可能快速放大公众情绪。',
      恰饭: 'B 站受众通常期待赞助关系和创作背景被清楚说明。',
    },
  },
  en: {
    languageName: 'English',
    languageToggleLabel: 'Interface language',
    platformLabels: {
      Xiaohongshu: 'Xiaohongshu',
      Douyin: 'Douyin',
      'WeChat Official Account': 'WeChat Official Account',
      Weibo: 'Weibo',
      Bilibili: 'Bilibili',
      'All platforms': 'All platforms',
    },
    severityLabels: {
      Low: 'Low',
      Medium: 'Medium',
      High: 'High',
    },
    levelLabels: {
      Low: 'Low',
      Medium: 'Medium',
      High: 'High',
    },
    categories: {
      'Exaggerated claims': 'Exaggerated claims',
      'Missing ad disclosure or unclear sponsorship': 'Missing ad disclosure or unclear sponsorship',
      'Greenwashing or sustainability overclaim': 'Greenwashing or sustainability overclaim',
      'Body anxiety, beauty anxiety, or shame-based messaging': 'Body anxiety, beauty anxiety, or shame-based messaging',
      'Gender stereotype or identity-based sensitivity': 'Gender stereotype or identity-based sensitivity',
      'Urgency pressure or manipulative sales language': 'Urgency pressure or manipulative sales language',
      'Public opinion backlash risk': 'Public opinion backlash risk',
      'Platform tone mismatch': 'Platform tone mismatch',
      'User-defined platform keyword risk': 'User-defined platform keyword risk',
    },
    categoryGuidance: {
      'Exaggerated claims': 'Add evidence, qualifiers, and scope limits. Avoid absolute guarantees or universal outcomes.',
      'Missing ad disclosure or unclear sponsorship': 'Clarify whether the content is sponsored, gifted, affiliate-driven, or brand-owned.',
      'Greenwashing or sustainability overclaim': 'Use specific, verifiable sustainability facts instead of broad environmental promises.',
      'Body anxiety, beauty anxiety, or shame-based messaging': 'Avoid shaming appearance, skin tone, body shape, age, or social status. Focus on neutral product information.',
      'Gender stereotype or identity-based sensitivity': 'Remove assumptions about gender, identity, or who “must” behave a certain way.',
      'Urgency pressure or manipulative sales language': 'Reduce pressure tactics and make promotion terms clear, time-bound, and factual.',
      'Public opinion backlash risk': 'Consider how audiences may interpret the phrase during sensitive social discussions or crises.',
      'Platform tone mismatch': 'Adapt the level of formality, disclosure, and community tone to the selected platform.',
      'User-defined platform keyword risk': 'Review internal brand, platform, or campaign-specific restrictions before publishing.',
    },
    hero: {
      eyebrow: 'Rule-based MVP for China social platforms',
      subtitle: 'A Chinese social media marketing risk checker for brand safety, platform-sensitive communication, and ethical marketing review.',
      valueProps: ['Transparent scoring', 'Custom keywords', 'No content generation'],
    },
    analyzer: {
      title: 'Analyze marketing copy',
      placeholder: 'Paste Chinese marketing copy or a campaign brief here...',
      platformLabel: 'Select platforms',
      analyzeButton: 'Analyze Risk',
    },
    demoTitles: {
      skincare: 'Skincare Xiaohongshu example',
      sustainableFashion: 'Sustainable fashion example',
      nonprofit: 'Nonprofit campaign example',
      douyinLivestream: 'Douyin sales livestream example',
    },
    customDictionary: {
      title: 'Custom risk dictionary',
      keywordPlaceholder: 'Add sensitive keyword, e.g. internal blocked term',
      addButton: 'Add keyword',
      empty: 'No custom keywords yet. They will be saved in localStorage.',
      deleteLabel: 'Delete keyword',
      customExplanation: (platform, category) => `Custom ${platform} keyword added by the user for ${category}.`,
    },
    report: {
      previewTitle: 'Risk report preview',
      previewEmpty: 'Enter copy, select platforms, and run the analyzer to see a transparent risk report.',
      title: 'Structured risk report',
      summary: 'Transparent score based on matched default, platform, and custom rules.',
      scoreLabel: 'Risk score',
      categoriesTitle: 'Main risk categories detected',
      noCategory: 'No major category detected',
      platformNotesTitle: 'Platform-specific notes',
      flaggedTitle: 'Specific flagged phrases',
      noMatches: 'No listed phrases were found. Still review context, claims, substantiation, and disclosure manually.',
      whyRisky: 'Why risky',
      guidance: 'Revision guidance',
    },
    platformNotes: {
      Xiaohongshu: 'Favor authentic experience notes, visible disclosure, and avoid over-seeding language.',
      Douyin: 'Keep livestream urgency factual; clarify price, stock, timing, and promotion terms.',
      'WeChat Official Account': 'Use editorial clarity, evidence, and source context rather than clickbait.',
      Weibo: 'Watch sentiment volatility, public issues, and wording that could intensify backlash.',
      Bilibili: 'Respect community tone and make sponsorship or “恰饭” context explicit.',
    },
    roadmap: {
      title: 'Future Features / Product Roadmap',
      items: ['AI semantic risk analysis', 'Trend-aware keyword updates from public sources', 'Platform policy monitoring', 'Team workspace', 'Exportable risk report', 'Subscription plan placeholder'],
    },
    pricing: {
      plans: [
        { name: 'Free', detail: 'Rule-based risk detection and custom dictionary' },
        { name: 'Pro', detail: 'AI semantic analysis and trend keyword updates' },
        { name: 'Enterprise', detail: 'Team dashboard and brand risk monitoring' },
      ],
      placeholder: 'Payment placeholder only',
    },
    disclaimer: 'Disclaimer: This tool provides marketing risk analysis and communication guidance. It is not legal advice.',
    ruleExplanations: {
      '100%有效': 'Absolute efficacy claims can be hard to substantiate and may trigger platform review.',
      绝对安全: 'Safety guarantees leave no room for individual differences, side effects, or usage context.',
      适合所有人: 'Universal suitability claims may be inaccurate for sensitive groups or special situations.',
      '7天见效': 'Short time-to-result claims should be backed by evidence and clear conditions.',
      最有效: 'Superlative claims imply market comparison and require strong substantiation.',
      永久改善: 'Permanent outcome claims are risky unless supported by robust evidence.',
      纯天然无害: 'Natural-origin claims do not automatically mean harmless; avoid implying zero risk.',
      不买就亏: 'Loss-framed pressure can feel manipulative and may reduce trust.',
      错过再等一年: 'Scarcity messaging should be factual and not create excessive pressure.',
      女生一定要: 'This assumes all women need the same thing and can reinforce stereotypes.',
      男生都喜欢: 'This generalizes preferences by gender and may be seen as stereotyping.',
      敏感肌必入: 'Beauty/skin claims should avoid broad promises and should note individual skin differences.',
      环保零负担: 'Zero-impact environmental claims are difficult to prove without lifecycle evidence.',
      可持续但没有具体说明: 'Sustainability language needs concrete facts such as materials, standards, or measurable practices.',
      博主亲测: 'Influencer testing language can blur commercial relationships if sponsorship is not clear.',
      良心推荐: 'Recommendation language may need disclosure if connected to brand compensation or gifting.',
      无广: 'Saying there is no ad relationship is risky if there is any brand, affiliate, or gifting connection.',
      不是广告: 'This can be misleading if the post has commercial intent or material connection.',
      学生党闭眼入: '“Buy without thinking” language can pressure price-sensitive audiences.',
      全网最低: 'Lowest-price claims require current market-wide proof and clear comparison scope.',
      逆天改命: 'Overdramatic transformation language may invite criticism or unrealistic expectations.',
      黄黑皮必看: 'Skin-tone targeting can become shame-based if it implies certain tones need correction.',
      女生必须精致: 'This frames appearance expectations as mandatory for women and may trigger backlash.',
      种草: 'Seeding language should be paired with clear disclosure when commercial intent exists.',
      闭眼入: 'Xiaohongshu users often value authentic, experience-led notes; pressure language may feel inauthentic.',
      限时秒杀: 'Livestream urgency should clearly state real timing, inventory, and terms.',
      马上下单: 'Repeated purchase commands can feel coercive in short-video commerce.',
      震惊: 'Clickbait wording can clash with the more editorial tone of WeChat articles.',
      翻车: 'Weibo discussions can amplify controversy language and public sentiment quickly.',
      恰饭: 'Bilibili audiences often expect transparent sponsorship labels and creator context.',
    },
  },
};

const defaultRules = [
  { phrase: '100%有效', category: 'Exaggerated claims', severity: 'High' },
  { phrase: '绝对安全', category: 'Exaggerated claims', severity: 'High' },
  { phrase: '适合所有人', category: 'Exaggerated claims', severity: 'Medium' },
  { phrase: '7天见效', category: 'Exaggerated claims', severity: 'Medium' },
  { phrase: '最有效', category: 'Exaggerated claims', severity: 'High' },
  { phrase: '永久改善', category: 'Exaggerated claims', severity: 'High' },
  { phrase: '纯天然无害', category: 'Exaggerated claims', severity: 'High' },
  { phrase: '不买就亏', category: 'Urgency pressure or manipulative sales language', severity: 'Medium' },
  { phrase: '错过再等一年', category: 'Urgency pressure or manipulative sales language', severity: 'Medium' },
  { phrase: '女生一定要', category: 'Gender stereotype or identity-based sensitivity', severity: 'Medium' },
  { phrase: '男生都喜欢', category: 'Gender stereotype or identity-based sensitivity', severity: 'Medium' },
  { phrase: '敏感肌必入', category: 'Body anxiety, beauty anxiety, or shame-based messaging', severity: 'Medium' },
  { phrase: '环保零负担', category: 'Greenwashing or sustainability overclaim', severity: 'High' },
  { phrase: '可持续但没有具体说明', category: 'Greenwashing or sustainability overclaim', severity: 'Medium' },
  { phrase: '博主亲测', category: 'Missing ad disclosure or unclear sponsorship', severity: 'Medium' },
  { phrase: '良心推荐', category: 'Missing ad disclosure or unclear sponsorship', severity: 'Low' },
  { phrase: '无广', category: 'Missing ad disclosure or unclear sponsorship', severity: 'High' },
  { phrase: '不是广告', category: 'Missing ad disclosure or unclear sponsorship', severity: 'High' },
  { phrase: '学生党闭眼入', category: 'Urgency pressure or manipulative sales language', severity: 'Medium' },
  { phrase: '全网最低', category: 'Exaggerated claims', severity: 'High' },
  { phrase: '逆天改命', category: 'Public opinion backlash risk', severity: 'Medium' },
  { phrase: '黄黑皮必看', category: 'Body anxiety, beauty anxiety, or shame-based messaging', severity: 'Medium' },
  { phrase: '女生必须精致', category: 'Gender stereotype or identity-based sensitivity', severity: 'High' },
];

const platformRules = {
  Xiaohongshu: [
    { phrase: '种草', category: 'Missing ad disclosure or unclear sponsorship', severity: 'Low' },
    { phrase: '闭眼入', category: 'Urgency pressure or manipulative sales language', severity: 'Medium' },
  ],
  Douyin: [
    { phrase: '限时秒杀', category: 'Urgency pressure or manipulative sales language', severity: 'Medium' },
    { phrase: '马上下单', category: 'Urgency pressure or manipulative sales language', severity: 'Medium' },
  ],
  'WeChat Official Account': [
    { phrase: '震惊', category: 'Platform tone mismatch', severity: 'Low' },
  ],
  Weibo: [
    { phrase: '翻车', category: 'Public opinion backlash risk', severity: 'Medium' },
  ],
  Bilibili: [
    { phrase: '恰饭', category: 'Missing ad disclosure or unclear sponsorship', severity: 'Low' },
  ],
};

const demoCases = [
  {
    id: 'skincare',
    platforms: ['Xiaohongshu'],
    text: '博主亲测这款精华7天见效，敏感肌必入，女生一定要。不是广告，100%有效。',
  },
  {
    id: 'sustainableFashion',
    platforms: ['Xiaohongshu', 'Weibo'],
    text: '我们的新系列纯天然无害，环保零负担，可持续但没有具体说明，适合所有人。',
  },
  {
    id: 'nonprofit',
    platforms: ['WeChat Official Account', 'Weibo'],
    text: '这次公益传播希望避免卖惨和身份标签，鼓励公众理性参与，不使用夸张承诺。',
  },
  {
    id: 'douyinLivestream',
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

function loadLanguage() {
  try {
    const savedLanguage = localStorage.getItem('brandsafe-cn-language');
    return savedLanguage === 'en' || savedLanguage === 'zh' ? savedLanguage : 'zh';
  } catch {
    return 'zh';
  }
}

function App() {
  const [language, setLanguage] = useState(loadLanguage);
  const [copy, setCopy] = useState(demoCases[0].text);
  const [selectedPlatforms, setSelectedPlatforms] = useState(demoCases[0].platforms);
  const [customRules, setCustomRules] = useState(loadCustomRules);
  const [customForm, setCustomForm] = useState({ platform: PLATFORMS[0], phrase: '', category: RISK_CATEGORIES[0], severity: 'Medium' });
  const [report, setReport] = useState(null);
  const t = translations[language] || translations.zh;

  const allRules = useMemo(() => {
    const userRules = customRules.map((rule) => ({
      ...rule,
      custom: true,
    }));
    return [...defaultRules.map((rule) => ({ ...rule, platform: 'All platforms' })), ...selectedPlatforms.flatMap((platform) => (platformRules[platform] || []).map((rule) => ({ ...rule, platform }))), ...userRules.filter((rule) => selectedPlatforms.includes(rule.platform))];
  }, [customRules, selectedPlatforms]);

  const saveCustomRules = (nextRules) => {
    setCustomRules(nextRules);
    localStorage.setItem('brandsafe-cn-custom-rules', JSON.stringify(nextRules));
  };

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem('brandsafe-cn-language', nextLanguage);
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
        <Hero language={language} setLanguage={changeLanguage} t={t} />
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <AnalyzerCard copy={copy} setCopy={setCopy} selectedPlatforms={selectedPlatforms} togglePlatform={togglePlatform} analyzeRisk={analyzeRisk} loadDemo={loadDemo} t={t} />
            <CustomDictionary customRules={customRules} customForm={customForm} setCustomForm={setCustomForm} addCustomRule={addCustomRule} deleteRule={(id) => saveCustomRules(customRules.filter((rule) => rule.id !== id))} t={t} />
          </div>
          <RiskReport report={report} selectedPlatforms={selectedPlatforms} t={t} />
        </section>
        <Roadmap t={t} />
        <Pricing t={t} />
        <p className="mt-8 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
          {t.disclaimer}
        </p>
      </main>
    </div>
  );
}

function Hero({ language, setLanguage, t }) {
  return (
    <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
      <div className="mb-6 flex justify-end">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 p-1" aria-label={t.languageToggleLabel}>
          <Languages size={16} className="ml-2 text-teal-200" />
          {['zh', 'en'].map((option) => (
            <button key={option} onClick={() => setLanguage(option)} className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${language === option ? 'bg-teal-300 text-slate-950' : 'text-slate-300 hover:text-white'}`}>
              {option === 'zh' ? '中文' : 'English'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-sm text-teal-100">
            <ShieldAlert size={16} /> {t.hero.eyebrow}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">BrandSafe CN</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">{t.hero.subtitle}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {t.hero.valueProps.map((item) => (
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200" key={item}>{item}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnalyzerCard({ copy, setCopy, selectedPlatforms, togglePlatform, analyzeRisk, loadDemo, t }) {
  return (
    <section className="card">
      <div className="section-title"><BookOpen /> {t.analyzer.title}</div>
      <textarea value={copy} onChange={(event) => setCopy(event.target.value)} className="min-h-64 w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-base text-slate-100 outline-none ring-teal-400/40 transition focus:ring-4" placeholder={t.analyzer.placeholder} />
      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold text-slate-300">{t.analyzer.platformLabel}</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <button key={platform} onClick={() => togglePlatform(platform)} className={`platform-tag ${selectedPlatforms.includes(platform) ? 'active' : ''}`}>{t.platformLabels[platform]}</button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {demoCases.map((demo) => (
          <button key={demo.id} onClick={() => loadDemo(demo)} className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-left text-sm text-slate-300 transition hover:border-teal-300/60 hover:text-white">
            {t.demoTitles[demo.id]}
          </button>
        ))}
      </div>
      <button onClick={analyzeRisk} disabled={!copy.trim() || selectedPlatforms.length === 0} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-400 px-5 py-4 font-bold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50">
        <BarChart3 /> {t.analyzer.analyzeButton}
      </button>
    </section>
  );
}

function CustomDictionary({ customRules, customForm, setCustomForm, addCustomRule, deleteRule, t }) {
  return (
    <section className="card">
      <div className="section-title"><Layers /> {t.customDictionary.title}</div>
      <form onSubmit={addCustomRule} className="grid gap-3 md:grid-cols-2">
        <input value={customForm.phrase} onChange={(event) => setCustomForm({ ...customForm, phrase: event.target.value })} className="input md:col-span-2" placeholder={t.customDictionary.keywordPlaceholder} />
        <select value={customForm.platform} onChange={(event) => setCustomForm({ ...customForm, platform: event.target.value })} className="input">{PLATFORMS.map((platform) => <option key={platform} value={platform}>{t.platformLabels[platform]}</option>)}</select>
        <select value={customForm.severity} onChange={(event) => setCustomForm({ ...customForm, severity: event.target.value })} className="input">{Object.keys(SEVERITY_POINTS).map((severity) => <option key={severity} value={severity}>{t.severityLabels[severity]}</option>)}</select>
        <select value={customForm.category} onChange={(event) => setCustomForm({ ...customForm, category: event.target.value })} className="input md:col-span-2">{RISK_CATEGORIES.map((category) => <option key={category} value={category}>{t.categories[category]}</option>)}</select>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 md:col-span-2"><Plus size={18} /> {t.customDictionary.addButton}</button>
      </form>
      <div className="mt-5 space-y-2">
        {customRules.length === 0 && <p className="text-sm text-slate-400">{t.customDictionary.empty}</p>}
        {customRules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-3">
            <div>
              <p className="font-semibold text-white">{rule.phrase} <span className="text-xs text-slate-400">({t.severityLabels[rule.severity]})</span></p>
              <p className="text-xs text-slate-400">{t.platformLabels[rule.platform]} · {t.categories[rule.category]}</p>
            </div>
            <button onClick={() => deleteRule(rule.id)} aria-label={t.customDictionary.deleteLabel} title={t.customDictionary.deleteLabel} className="rounded-xl p-2 text-rose-200 transition hover:bg-rose-400/10"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </section>
  );
}

function RiskReport({ report, selectedPlatforms, t }) {
  if (!report) {
    return (
      <section className="card sticky top-6 h-fit">
        <div className="section-title"><Sparkles /> {t.report.previewTitle}</div>
        <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
          {t.report.previewEmpty}
        </div>
        <PlatformNotes platforms={selectedPlatforms} t={t} />
      </section>
    );
  }

  const badgeClass = report.level === 'High' ? 'bg-rose-400 text-rose-950' : report.level === 'Medium' ? 'bg-amber-300 text-amber-950' : 'bg-emerald-300 text-emerald-950';

  return (
    <section className="card sticky top-6 h-fit">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="section-title"><AlertTriangle /> {t.report.title}</div>
          <p className="text-sm text-slate-400">{t.report.summary}</p>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-bold ${badgeClass}`}>{t.levelLabels[report.level]}</span>
      </div>
      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
        <div className="flex items-end justify-between">
          <span className="text-slate-400">{t.report.scoreLabel}</span>
          <span className="text-5xl font-black text-white">{report.score}</span>
        </div>
        <div className="mt-4 h-3 rounded-full bg-slate-800"><div className="h-3 rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-rose-400" style={{ width: `${report.score}%` }} /></div>
      </div>
      <div className="mt-5">
        <h3 className="font-semibold text-white">{t.report.categoriesTitle}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {report.categories.length ? report.categories.map((category) => <span key={category} className="risk-chip">{t.categories[category]}</span>) : <span className="risk-chip good">{t.report.noCategory}</span>}
        </div>
      </div>
      <PlatformNotes platforms={report.platforms} t={t} />
      <div className="mt-5 space-y-3">
        <h3 className="font-semibold text-white">{t.report.flaggedTitle}</h3>
        {report.matches.length === 0 && <p className="rounded-2xl bg-emerald-300/10 p-4 text-sm text-emerald-100">{t.report.noMatches}</p>}
        {report.matches.map((match, index) => {
          const platformName = t.platformLabels[match.platform] || match.platform;
          const categoryName = t.categories[match.category] || match.category;
          const explanation = match.custom ? t.customDictionary.customExplanation(platformName, categoryName) : t.ruleExplanations[match.phrase];

          return (
            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4" key={`${match.phrase}-${index}`}>
              <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-950">{match.phrase}</span><span className="risk-chip">{t.severityLabels[match.severity]}</span><span className="risk-chip">{platformName}</span></div>
              <p className="mt-3 text-sm text-slate-300"><strong>{t.report.whyRisky}:</strong> {explanation}</p>
              <p className="mt-2 text-sm text-teal-100"><strong>{t.report.guidance}:</strong> {t.categoryGuidance[match.category]}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PlatformNotes({ platforms, t }) {
  return (
    <div className="mt-5">
      <h3 className="font-semibold text-white">{t.report.platformNotesTitle}</h3>
      <div className="mt-2 space-y-2">
        {platforms.map((platform) => <p key={platform} className="rounded-2xl bg-white/5 p-3 text-sm text-slate-300"><strong>{t.platformLabels[platform]}:</strong> {t.platformNotes[platform]}</p>)}
      </div>
    </div>
  );
}

function Roadmap({ t }) {
  return (
    <section className="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2 lg:col-span-3"><div className="section-title"><Lightbulb /> {t.roadmap.title}</div></div>
      {t.roadmap.items.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-950/50 p-4 text-slate-200"><CheckCircle2 className="text-teal-300" /> {item}</div>)}
    </section>
  );
}

function Pricing({ t }) {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      {t.pricing.plans.map((plan) => <div className="card" key={plan.name}><CircleDollarSign className="mb-3 text-teal-300" /><h3 className="text-2xl font-bold text-white">{plan.name}</h3><p className="mt-2 text-slate-300">{plan.detail}</p><p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">{t.pricing.placeholder}</p></div>)}
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
