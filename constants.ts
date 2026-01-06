
import { Question, Framework, BigFiveCategory, MBTICategory, MBTIPole, RIASECCategory, ValueCategory, ResourceItem } from './types';

export const QUESTIONS_DATA: Question[] = [
  // Big Five (2 questions per category for brevity)
  { id: 'b5_o1', text: 'I enjoy trying new and different activities, even if they seem unusual.', framework: Framework.BigFive, category: BigFiveCategory.Openness },
  { id: 'b5_o2', text: 'I am curious and love exploring places or learning about how things work.', framework: Framework.BigFive, category: BigFiveCategory.Openness },
  { id: 'b5_c1', text: 'I always try to complete my schoolwork or tasks before doing something fun.', framework: Framework.BigFive, category: BigFiveCategory.Conscientiousness },
  { id: 'b5_c2', text: 'I make plans (like a schedule or list) and try to follow them.', framework: Framework.BigFive, category: BigFiveCategory.Conscientiousness },
  { id: 'b5_e1', text: 'I enjoy being around people and having lively conversations.', framework: Framework.BigFive, category: BigFiveCategory.Extraversion },
  { id: 'b5_e2', text: 'I often feel energized when I am with a group of friends.', framework: Framework.BigFive, category: BigFiveCategory.Extraversion },
  { id: 'b5_a1', text: 'I enjoy helping other people when they have a problem.', framework: Framework.BigFive, category: BigFiveCategory.Agreeableness },
  { id: 'b5_a2', text: 'I believe it is important to be kind and understanding to others.', framework: Framework.BigFive, category: BigFiveCategory.Agreeableness },
  { id: 'b5_n1', text: 'I often feel anxious or worried about things that might happen.', framework: Framework.BigFive, category: BigFiveCategory.Neuroticism },
  { id: 'b5_n2', text: 'I get upset or irritated easily, even by small issues.', framework: Framework.BigFive, category: BigFiveCategory.Neuroticism },

  // MBTI (1 question per pole for brevity)
  { id: 'mbti_ei_e', text: 'I feel energized and enthusiastic when I am with friends or a group of people.', framework: Framework.MBTI, category: MBTICategory.ExtraversionIntroversion, pole: MBTIPole.Extraversion },
  { id: 'mbti_ei_i', text: 'After being with people for a long time, I need some time alone to relax.', framework: Framework.MBTI, category: MBTICategory.ExtraversionIntroversion, pole: MBTIPole.Introversion },
  { id: 'mbti_sn_s', text: 'I prefer to focus on facts and details that I can observe.', framework: Framework.MBTI, category: MBTICategory.SensingIntuition, pole: MBTIPole.Sensing },
  { id: 'mbti_sn_n', text: 'I enjoy thinking about new ideas and imagining how things could be.', framework: Framework.MBTI, category: MBTICategory.SensingIntuition, pole: MBTIPole.Intuition },
  { id: 'mbti_tf_t', text: 'I make decisions based on logic and reason rather than my feelings.', framework: Framework.MBTI, category: MBTICategory.ThinkingFeeling, pole: MBTIPole.Thinking },
  { id: 'mbti_tf_f', text: 'I care more about other people\'s feelings when making decisions.', framework: Framework.MBTI, category: MBTICategory.ThinkingFeeling, pole: MBTIPole.Feeling },
  { id: 'mbti_jp_j', text: 'I like keeping my plans and schedules organized.', framework: Framework.MBTI, category: MBTICategory.JudgingPerceiving, pole: MBTIPole.Judging },
  { id: 'mbti_jp_p', text: 'I enjoy leaving my options open and being spontaneous.', framework: Framework.MBTI, category: MBTICategory.JudgingPerceiving, pole: MBTIPole.Perceiving },

  // RIASEC (2 questions per category for brevity)
  { id: 'riasec_r1', text: 'I enjoy building or fixing things (like models, machines, or gadgets).', framework: Framework.RIASEC, category: RIASECCategory.Realistic },
  { id: 'riasec_r2', text: 'I like working outdoors (for example, gardening, hiking, or sports).', framework: Framework.RIASEC, category: RIASECCategory.Realistic },
  { id: 'riasec_i1', text: 'I enjoy doing science experiments or learning about science.', framework: Framework.RIASEC, category: RIASECCategory.Investigative },
  { id: 'riasec_i2', text: 'I like solving puzzles and brainteasers.', framework: Framework.RIASEC, category: RIASECCategory.Investigative },
  { id: 'riasec_a1', text: 'I enjoy drawing, painting, or other art activities.', framework: Framework.RIASEC, category: RIASECCategory.Artistic },
  { id: 'riasec_a2', text: 'I like playing a musical instrument or singing.', framework: Framework.RIASEC, category: RIASECCategory.Artistic },
  { id: 'riasec_s1', text: 'I enjoy helping other people with their problems.', framework: Framework.RIASEC, category: RIASECCategory.Social },
  { id: 'riasec_s2', text: 'I like teaching or explaining things to friends or classmates.', framework: Framework.RIASEC, category: RIASECCategory.Social },
  { id: 'riasec_e1', text: 'I enjoy leading others and taking charge of group activities.', framework: Framework.RIASEC, category: RIASECCategory.Enterprising },
  { id: 'riasec_e2', text: 'I like to persuade people to follow my ideas.', framework: Framework.RIASEC, category: RIASECCategory.Enterprising },
  { id: 'riasec_c1', text: 'I like organizing things (like my room or files) in a neat way.', framework: Framework.RIASEC, category: RIASECCategory.Conventional },
  { id: 'riasec_c2', text: 'I enjoy working with numbers and data (like math problems or charts).', framework: Framework.RIASEC, category: RIASECCategory.Conventional },

  // Values Inventory (1 question per category for brevity)
  { id: 'val_aut1', text: 'I prefer to work independently and make my own decisions about how to do things.', framework: Framework.Values, category: ValueCategory.Autonomy },
  { id: 'val_team1', text: 'I achieve more and enjoy work most when I am part of a collaborative team.', framework: Framework.Values, category: ValueCategory.Teamwork },
  { id: 'val_stab1', text: 'Having a secure and predictable job is very important to me.', framework: Framework.Values, category: ValueCategory.Stability },
  { id: 'val_innov1', text: 'I am excited by opportunities to work on new, cutting-edge projects and ideas.', framework: Framework.Values, category: ValueCategory.Innovation },
  { id: 'val_wlb1', text: 'It is important for me to have a good balance between my work/studies and my personal life.', framework: Framework.Values, category: ValueCategory.WorkLifeBalance },
];

export const LIKERT_SCALE_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export const GEMINI_API_KEY = process.env.API_KEY;
// Using recommended models as per guidelines
export const GEMINI_TEXT_MODEL = 'gemini-3-flash-preview';
export const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image';
export const SIMULATED_OTP = "123456";


interface TraitInterpretation {
  general: string;
  high: string;
  moderate: string;
  low: string;
}

export const BIG_FIVE_DESCRIPTIONS: Record<BigFiveCategory, TraitInterpretation> = {
  [BigFiveCategory.Openness]: { general: "Reflects imagination, curiosity, artistic sensitivity, and a preference for variety.", high: "You are likely adventurous, creative, and open to new experiences and abstract ideas.", moderate: "You have a balanced approach; open to new things but also appreciating routine and the familiar.", low: "You tend to be practical, conventional, and prefer routines and familiar experiences over new ones." },
  [BigFiveCategory.Conscientiousness]: { general: "Concerns the way we control, regulate, and direct our impulses. It includes traits like organization, dependability, and self-discipline.", high: "You are typically organized, dependable, responsible, and self-disciplined. You likely prefer planned rather than spontaneous behavior.", moderate: "You are reasonably reliable and organized, but can also be flexible and occasionally spontaneous.", low: "You may be more spontaneous, flexible, and less concerned with precise organization and planning." },
  [BigFiveCategory.Extraversion]: { general: "Characterized by positive emotions, assertiveness, sociability, and the tendency to seek stimulation in the company of others.", high: "You are likely outgoing, energetic, and sociable. You enjoy being around people and in stimulating environments.", moderate: "You enjoy a mix of social interaction and solitude, adapting to different social situations.", low: "You are probably more reserved, independent, and prefer quieter settings or solitude to recharge." },
  [BigFiveCategory.Agreeableness]: { general: "Reflects individual differences in concern with cooperation and social harmony. Traits include being courteous, flexible, trusting, and cooperative.", high: "You tend to be compassionate, cooperative, and considerate of others. You likely value getting along with people.", moderate: "You are generally cooperative and kind, but can also assert your own views when necessary.", low: "You may be more analytical, detached, and potentially competitive, prioritizing your own interests or principles." },
  [BigFiveCategory.Neuroticism]: { general: "Reflects the tendency to experience negative emotions, such as anger, anxiety, or depression. Also known as Emotional Stability (low Neuroticism).", high: "You might experience mood swings, anxiety, or irritability more frequently. You may be more sensitive to stress.", moderate: "You experience a normal range of emotions and can generally cope with stress effectively.", low: "You are likely calm, emotionally stable, and resilient, not easily upset or stressed." }
};

interface MBTIDescription {
  dimension: string;
  pole1: { pole: MBTIPole; name: string; description: string; };
  pole2: { pole: MBTIPole; name: string; description: string; };
}

export const MBTI_DESCRIPTIONS: Record<MBTICategory, MBTIDescription> = {
  [MBTICategory.ExtraversionIntroversion]: { dimension: "Focus of Energy: How you direct and receive energy.", pole1: { pole: MBTIPole.Extraversion, name: "Extraversion (E)", description: "You likely focus on the outer world of people and things. You are energized by interacting with others and taking action." }, pole2: { pole: MBTIPole.Introversion, name: "Introversion (I)", description: "You likely focus on your inner world of ideas and experiences. You are energized by spending time alone or in quiet reflection." } },
  [MBTICategory.SensingIntuition]: { dimension: "Information Gathering: How you prefer to take in information.", pole1: { pole: MBTIPole.Sensing, name: "Sensing (S)", description: "You tend to focus on the present and concrete information gathered through your senses. You prefer dealing with facts and details." }, pole2: { pole: MBTIPole.Intuition, name: "Intuition (N)", description: "You tend to focus on patterns, possibilities, and the future. You prefer dealing with abstract concepts and new ideas." } },
  [MBTICategory.ThinkingFeeling]: { dimension: "Decision Making: How you prefer to make decisions.", pole1: { pole: MBTIPole.Thinking, name: "Thinking (T)", description: "You tend to make decisions based on logic and objective analysis. You value fairness and consistency." }, pole2: { pole: MBTIPole.Feeling, name: "Feeling (F)", description: "You value harmony and empathy." } },
  [MBTICategory.JudgingPerceiving]: { dimension: "Lifestyle Preference: How you prefer to live your outer life.", pole1: { pole: MBTIPole.Judging, name: "Judging (J)", description: "You prefer a planned, organized approach to life. You like to have things decided and enjoy structure." }, pole2: { pole: MBTIPole.Perceiving, name: "Perceiving (P)", description: "You prefer a flexible, spontaneous approach to life. You like to keep your options open and enjoy adapting to new situations." } }
};

export const RIASEC_DESCRIPTIONS: Record<RIASECCategory, TraitInterpretation> = {
  [RIASECCategory.Realistic]: { general: "Prefers practical, hands-on activities and working with tools, machines, or animals. Values material rewards for tangible accomplishments.", high: "You likely enjoy practical tasks, working with your hands, and seeing tangible results. Careers in skilled trades, technology, or outdoors might appeal.", moderate: "You are comfortable with some practical tasks but may also enjoy other types of activities.", low: "You may prefer working with ideas, people, or data rather than hands-on, physical tasks." },
  [RIASECCategory.Investigative]: { general: "Prefers activities involving thinking, organizing, and understanding. Enjoys solving complex problems and analytical tasks.", high: "You are likely analytical, curious, and enjoy problem-solving. Careers in science, research, or academia could be a good fit.", moderate: "You have some interest in analytical tasks and research but may balance it with other preferences.", low: "You might prefer action-oriented tasks or working with people over deep, analytical thinking." },
  [RIASECCategory.Artistic]: { general: "Prefers activities that are creative, original, and unsystematic, allowing for self-expression. Values aesthetics and originality.", high: "You are likely imaginative, expressive, and enjoy creative activities. Careers in arts, design, writing, or performance may suit you.", moderate: "You appreciate creativity and may have artistic hobbies, but it might not be your primary focus.", low: "You may prefer more structured, practical, or analytical tasks over unstructured creative pursuits." },
  [RIASECCategory.Social]: { general: "Prefers activities that involve helping, teaching, or providing service to others. Values social interaction and making a difference.", high: "You likely enjoy helping, teaching, and interacting with others. Careers in counseling, education, healthcare, or social work could be fulfilling.", moderate: "You are generally helpful and enjoy people, but may also value other aspects in your work.", low: "You might prefer working with data, things, or ideas rather than focusing primarily on helping others directly." },
  [RIASECCategory.Enterprising]: { general: "Prefers activities that involve persuading, leading, or managing others for organizational goals or economic gain. Values ambition and influence.", high: "You are likely persuasive, ambitious, and enjoy leading or influencing others. Careers in business, sales, management, or politics might be a match.", moderate: "You are comfortable taking initiative and leading at times, but may not always seek out such roles.", low: "You may prefer supporting roles or working independently rather than leading or persuading others." },
  [RIASECCategory.Conventional]: { general: "Prefers activities that involve organizing data, following procedures, and working with details. Values order and precision.", high: "You likely enjoy organized, systematic work and paying attention to detail. Careers in finance, administration, or data management could suit you.", moderate: "You appreciate order and can handle detailed work, but may also enjoy some flexibility.", low: "You might prefer less structured tasks and a bigger-picture focus over detailed, routine work." }
};

// New: Descriptions for Value Categories
export const VALUE_DESCRIPTIONS: Record<ValueCategory, TraitInterpretation> = {
  [ValueCategory.Autonomy]: {
    general: "Relates to the preference for independence, self-direction, and control over one's work.",
    high: "You highly value freedom in your work, preferring to make your own decisions and manage your own tasks.",
    moderate: "You appreciate having some independence in your work, but are also comfortable with guidance and structure.",
    low: "You may prefer clearer direction and established procedures, and feel more comfortable when tasks are well-defined by others."
  },
  [ValueCategory.Teamwork]: {
    general: "Indicates the preference for collaborative environments and working effectively with others.",
    high: "You thrive in team settings, enjoy collaboration, and believe collective effort leads to better outcomes.",
    moderate: "You are a good team player when needed, but can also work effectively on your own.",
    low: "You may prefer working alone or in settings where individual contributions are more emphasized than group efforts."
  },
  [ValueCategory.Stability]: {
    general: "Reflects the importance of security, predictability, and long-term prospects in a job or career.",
    high: "You place a high importance on job security, clear paths for advancement, and a stable work environment.",
    moderate: "You value stability but are also open to some level of change or risk if the opportunity is right.",
    low: "You may be more comfortable with change, risk-taking, and less predictable work environments, perhaps prioritizing excitement or rapid growth."
  },
  [ValueCategory.Innovation]: {
    general: "Concerns the preference for working on new ideas, creative projects, and forward-thinking tasks.",
    high: "You are energized by new challenges, creative problem-solving, and opportunities to pioneer new approaches.",
    moderate: "You enjoy new ideas and can be innovative, but also appreciate refining existing methods.",
    low: "You may prefer working with established processes and proven methods rather than constantly seeking novelty or untested ideas."
  },
  [ValueCategory.WorkLifeBalance]: {
    general: "Highlights the importance of maintaining a healthy equilibrium between professional and personal life.",
    high: "You strongly prioritize a clear separation and balance between your work/studies and personal time, valuing flexibility and personal well-being.",
    moderate: "You aim for a good work-life balance, understanding that demands may fluctuate but a healthy boundary is important.",
    low: "You may be highly career-focused and willing to dedicate significant time to work, potentially seeing less distinction between professional and personal life, especially when pursuing ambitious goals."
  }
};


// Expanded Static Resources for Resource Hub
export const STATIC_RESOURCES: ResourceItem[] = [
  { id: 'yc_school', title: "Y Combinator's Startup School", type: 'course_platform', url: 'https://www.startupschool.org/', description: "The premier free online course for aspiring entrepreneurs. Learn how to build, launch, and grow a startup from the experts who funded Airbnb, Stripe, and Dropbox.", tags: ['entrepreneurship', 'YC', 'startups', 'innovation'] },
  { id: 'sat_bluebook', title: "Bluebook™ Digital Testing App", type: 'tool', url: 'https://bluebook.collegeboard.org/', description: "The official app for the Digital SAT. Essential for taking full-length practice tests and getting familiar with the actual digital testing environment.", tags: ['SAT', 'digital', 'official'] },
  { id: 'sat1', title: "Official SAT Practice - Khan Academy", type: 'tool', url: 'https://www.khanacademy.org/sat', description: "The world standard for SAT prep. Personalized practice plans based on your diagnostic results, built in partnership with College Board.", tags: ['SAT', 'test prep', 'college admission'] },
  { id: 'sat2', title: "SAT Suite of Assessments (International)", type: 'article', url: 'https://satsuite.collegeboard.org/sat/international', description: "Detailed information for students in India and abroad, including test center locations, international fees, and ID requirements.", tags: ['SAT', 'international', 'admission'] },
  { id: 'mit_highschool', title: "MIT OpenCourseWare: Highlights for High School", type: 'course_platform', url: 'https://ocw.mit.edu/high-school/', description: "Access free MIT course materials specifically curated for high school students. A great way to explore advanced STEM topics early.", tags: ['STEM', 'advanced', 'academics'] },
  { id: 'res1', title: "Understanding Your RIASEC Score", type: 'article', url: 'https://www.onetcenter.org/IP.html', description: "Learn more about the Holland Codes and how your interest patterns map to the world of work.", tags: ['riasec', 'career exploration'] },
  { id: 'res3', title: "Mastering Study Skills & Time Management", type: 'article', url: 'https://learningcenter.unc.edu/tips-and-tools/', description: "Proven techniques to improve your memory, concentration, and organizational skills for school success.", tags: ['study skills', 'productivity'] },
  { id: 'res4', title: "Coursera: Career Discovery Specializations", type: 'course_platform', url: 'https://www.coursera.org/browse/personal-development', description: "Beginner-friendly courses to explore different industries before committing to a major.", tags: ['online learning', 'discovery'] },
  { id: 'res5', title: "Headspace for Students", type: 'tool', url: 'https://www.headspace.com/studentplan', description: "Mindfulness and meditation tools designed to help students manage exam stress and improve focus.", tags: ['well-being', 'mental health'] },
  { id: 'res8', title: "Google Career Certificates", type: 'tool', url: 'https://grow.google/certificates/', description: "Professional-grade training for high-growth fields like Data Analytics, UX Design, and IT Support.", tags: ['skills', 'certification'] },
];
