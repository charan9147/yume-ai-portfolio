import type { Messages } from '../i18n/en';

export type Intent =
  | 'about'
  | 'projects'
  | 'tech'
  | 'budget'
  | 'stages'
  | 'founder'
  | 'contact'
  | 'robotics';

/**
 * Keyword sets span all fifteen interface languages so the scripted answers
 * still fire when a visitor types in their own language. Anything that misses
 * is forwarded to the optional server-side model.
 */
const KEYWORDS: Record<Intent, string[]> = {
  about: [
    'what is yume', 'what is this site', 'about yume', 'yume ai', '夢', 'what do you do',
    'yume kya', 'yume enti', 'yume nedir', 'was ist yume', 'qu est yume', 'qué es yume',
    'o que é yume', 'yume kya hai', 'युमे', 'युमे एआई', 'యుమే', 'ユメ', 'ゆめ', '유메',
    'युमे क्या', 'yume ai kya hai', 'ما هو يمي', 'يوري', 'yume是什么', 'yume nedir',
  ],
  projects: [
    'project', 'projects', 'tutor', 'companion', 'bridge', 'proposal', 'proposals',
    'projekt', 'projekte', 'projeto', 'projetos', 'proyecto', 'proyectos', 'progetti',
    'प्रोजेक्ट', 'परियोजना', 'प्रकल्प', 'ప్రాజెక్ట', 'పరియోజన', 'プロジェクト', '项目', '項目',
    '프로젝트', 'مشروع', 'مشاريع', 'منصوبہ', 'منصوبے', 'منصوبوں', 'প্রকল্প', 'প্রোজেক্ট',
    'проект', 'проекты', 'proje',
  ],
  tech: [
    'tech', 'technolog', 'stack', 'framework', 'react', 'typescript', 'python', 'ros',
    'nlp', 'ml', 'ai', 'machine learning', 'model', 'speech', 'translation',
    'तकनीक', 'टेक्नोलॉजी', 'సాంకేతిక', '技術', '科技', '기술', 'تقنية', 'প্রযুক্তি',
    'технолог', 'technologie', 'tecnologia', 'tecnología', 'técnica',
  ],
  budget: [
    'budget', 'cost', 'price', 'pricing', 'how much', 'estimate', 'quote', 'rupee', 'money',
    'कीमत', 'लागत', 'बजट', 'खर्च', 'मूल्य', 'ధర', 'ఖర్చు', 'మూల్య', '予算', '費用', '价格',
    '预算', '费用', '가격', '예산', '비용', 'سعر', 'تكلفة', 'قیمت', 'لاگت', 'بجٹ', 'يكلف',
    'মূল্য', 'বাজেট', 'খরচ', 'цена', 'стоимость', 'сколько', 'стоит', 'preis', 'kosten',
    'kostet', 'coût', 'combien', 'coûte', 'prix', 'preço', 'custo', 'quanto', 'precio',
    'costo', 'cuánto', 'cuesta', 'custa',
  ],
  stages: [
    'stage', 'stages', 'step', 'steps', 'process', 'workflow', 'roadmap', 'timeline',
    'चरण', 'प्रक्रिया', 'अवस्था', 'దశ', '工程', '阶段', '단계', 'مرحل', 'مرحلة', 'مراحل',
    'পর্যায়', 'этап', 'phase', 'phases', 'etappe', 'étape', 'etapa', 'ステージ', '段階',
  ],
  founder: [
    'who are you', 'who is sai', 'sai charan', 'founder', 'creator', 'student', 'about you',
    'कौन', 'సాయి', 'సాయి చరణ్', 'साई', 'साई चरण', 'サイ', '谁', '누구', 'من', 'কে',
    'کون', 'кто', 'wer', 'qui', 'quem', 'quién',
  ],
  contact: [
    'contact', 'email', 'gmail', 'whatsapp', 'phone', 'reach', 'talk', 'hire', 'collab',
    'संपर्क', 'ఇమెయిల్', 'సంప్రదించ', '連絡', '联系', '연락', 'اتصال', 'যোগাযোগ',
    'контакт', 'kontakt', 'contato', 'contacto', 'contatti',
  ],
  robotics: [
    'robot', 'robotics', 'mascot', 'automation', 'mechatronics', 'hardware', 'sim-to-real',
    'रोबोट', 'रोबोटिक्स', 'రోబోట్', 'ロボット', '机器人', '로봇', 'روبوت', 'রোবট',
    'робот', 'roboter', 'robô', 'robot',
  ],
};

/** Scripts written without spaces between words, where substring matching is required. */
const NO_WORD_SPACES = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\u0e00-\u0eff]/;

/**
 * Scripts that inflect with suffixes (Telugu "దశ" → "దశలు", Hindi "चरण" → "चरणों"),
 * so short stems still have to match inside a longer word.
 */
const SUFFIXING_SCRIPT = /[\u0900-\u097f\u0980-\u09ff\u0b80-\u0bff\u0c00-\u0c7f\u0d00-\u0d7f]/;

function normalise(raw: string): string {
  return ` ${raw
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g, '') // Arabic/Urdu harakat
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

export function matchIntent(raw: string): Intent | null {
  const text = normalise(raw);
  let best: { intent: Intent; score: number } | null = null;

  for (const [intent, words] of Object.entries(KEYWORDS) as [Intent, string[]][]) {
    let score = 0;
    for (const word of words) {
      // Long keywords may match inside longer words ("technolog" → "technology").
      // Short Latin/Cyrillic/Arabic keywords must be whole words; otherwise they
      // match inside unrelated words (Urdu "منصوبے" contains "من"). Scripts
      // without word spaces (Japanese, Chinese, Korean) always match inside.
      const wholeWord =
        word.length < 4 && !NO_WORD_SPACES.test(word) && !SUFFIXING_SCRIPT.test(word);
      const hit = wholeWord ? text.includes(` ${word} `) : text.includes(word);
      if (hit) score += word.length > 6 ? 2 : 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }

  return best ? best.intent : null;
}

/** Answers come from the active dictionary, so a scripted reply is always in the selected language. */
export function scriptedAnswer(intent: Intent, t: Messages): string {
  return t.chat.answers[intent];
}
