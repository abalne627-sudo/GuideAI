
import { Answers, StudentProfile, Framework, BigFiveCategory, MBTICategory, MBTIPole, RIASECCategory, ValueCategory } from '../types';
import { QUESTIONS_DATA } from '../constants';

const average = (arr: number[]): number => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

export const calculateStudentProfile = (answers: Answers): StudentProfile => {
  const profile: StudentProfile = {
    bigFive: {},
    mbti: {},
    riasec: {},
    values: {}, // Initialize values
  };

  // Big Five
  for (const category of Object.values(BigFiveCategory)) {
    const categoryQuestions = QUESTIONS_DATA.filter(q => q.framework === Framework.BigFive && q.category === category);
    const categoryScores = categoryQuestions.map(q => answers[q.id]).filter(score => score !== undefined) as number[];
    if (categoryScores.length > 0) {
      profile.bigFive[category] = average(categoryScores);
    }
  }

  // MBTI
  for (const category of Object.values(MBTICategory)) {
    let pole1Scores: number[] = [];
    let pole2Scores: number[] = [];
    let pole1Type: MBTIPole | undefined;
    let pole2Type: MBTIPole | undefined;

    switch (category) {
      case MBTICategory.ExtraversionIntroversion: pole1Type = MBTIPole.Extraversion; pole2Type = MBTIPole.Introversion; break;
      case MBTICategory.SensingIntuition: pole1Type = MBTIPole.Sensing; pole2Type = MBTIPole.Intuition; break;
      case MBTICategory.ThinkingFeeling: pole1Type = MBTIPole.Thinking; pole2Type = MBTIPole.Feeling; break;
      case MBTICategory.JudgingPerceiving: pole1Type = MBTIPole.Judging; pole2Type = MBTIPole.Perceiving; break;
    }
    
    if(pole1Type && pole2Type){
        const pole1Questions = QUESTIONS_DATA.filter(q => q.framework === Framework.MBTI && q.category === category && q.pole === pole1Type);
        pole1Scores = pole1Questions.map(q => answers[q.id]).filter(score => score !== undefined) as number[];
        
        const pole2Questions = QUESTIONS_DATA.filter(q => q.framework === Framework.MBTI && q.category === category && q.pole === pole2Type);
        pole2Scores = pole2Questions.map(q => answers[q.id]).filter(score => score !== undefined) as number[];

        const score1 = average(pole1Scores);
        const score2 = average(pole2Scores);

        if (pole1Scores.length > 0 || pole2Scores.length > 0) {
             profile.mbti[category] = {
                dominantPole: score1 >= score2 ? pole1Type : pole2Type,
                scoreDominant: score1 >= score2 ? score1 : score2,
                scoreRecessive: score1 >= score2 ? score2 : score1,
            };
        }
    }
  }

  // RIASEC
  for (const category of Object.values(RIASECCategory)) {
    const categoryQuestions = QUESTIONS_DATA.filter(q => q.framework === Framework.RIASEC && q.category === category);
    const categoryScores = categoryQuestions.map(q => answers[q.id]).filter(score => score !== undefined) as number[];
     if (categoryScores.length > 0) {
      profile.riasec[category] = average(categoryScores);
    }
  }

  // New: Values Inventory
  for (const category of Object.values(ValueCategory)) {
    const categoryQuestions = QUESTIONS_DATA.filter(q => q.framework === Framework.Values && q.category === category);
    const categoryScores = categoryQuestions.map(q => answers[q.id]).filter(score => score !== undefined) as number[];
    if (categoryScores.length > 0) {
      profile.values[category] = average(categoryScores);
    }
  }
  
  profile.summary = generateProfileSummary(profile);
  return profile;
};


const generateProfileSummary = (profile: StudentProfile): string => {
  let summary = "Psychometric Profile Summary:\n";

  if (profile.bigFive && Object.keys(profile.bigFive).length > 0) {
    summary += "Big Five Traits: ";
    const bigFiveEntries = Object.entries(profile.bigFive)
      .map(([trait, score]) => `${trait} (${score?.toFixed(1)}/5)`)
      .join(', ');
    summary += bigFiveEntries + ".\n";
  }

  if (profile.mbti && Object.keys(profile.mbti).length > 0) {
    summary += "MBTI-Style Preferences: ";
    const mbtiEntries = Object.entries(profile.mbti)
      .map(([category, data]) => data ? `${category} (Prefers ${data.dominantPole}: ${data.scoreDominant.toFixed(1)} vs ${data.scoreRecessive.toFixed(1)})` : "")
      .filter(s => s)
      .join(', ');
    summary += mbtiEntries + ".\n";
  }

  if (profile.riasec && Object.keys(profile.riasec).length > 0) {
    summary += "RIASEC Interests: ";
    const riasecEntries = Object.entries(profile.riasec)
      .map(([interest, score]) => `${interest} (${score?.toFixed(1)}/5)`)
      .join(', ');
    summary += riasecEntries + ".\n";
  }

  if (profile.values && Object.keys(profile.values).length > 0) { // New: Add Values to summary
    summary += "Work Values: ";
    const valuesEntries = Object.entries(profile.values)
      .map(([value, score]) => `${value} (${score?.toFixed(1)}/5)`)
      .join(', ');
    summary += valuesEntries + ".\n";
  }
  
  return summary.trim();
};
