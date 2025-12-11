
// models/educationSystemTypes.ts

export interface CompetitiveExam {
  id: string; // e.g., "jee_main", "neet_ug"
  name: string; // e.g., "Joint Entrance Examination Main"
  shortName?: string; // e.g., "JEE Main"
  description: string; // Purpose, conducting body
  level: 'National' | 'State' | 'University' | 'International';
  targetStages: string[]; // e.g., "UG Engineering", "UG Medical", "PG Management"
  typicalSubjectsCovered?: string[];
  officialWebsite?: string;
}

export interface PhdOption {
  id: string; // e.g., "phd_cs_ml"
  name: string; // e.g., "PhD in Computer Science (Machine Learning)"
  description: string;
  typicalDurationYearsRange: [number, number]; // e.g., [3, 5]
  commonResearchAreas: string[];
  competitiveExamsForPhD?: CompetitiveExam[]; // e.g., UGC-NET, CSIR-NET, specific university tests
  // Eligibility criteria could also be a field here, e.g., "Master's degree in relevant field"
}

export interface PgDegreeOption {
  id: string; // e.g., "mtech_ai", "mba_finance"
  name: string; // e.g., "Master of Technology in Artificial Intelligence"
  description: string;
  durationYears: number;
  typicalSpecializations?: string[];
  competitiveExamsForPG?: CompetitiveExam[]; // e.g., GATE, CAT, CMAT, CUET-PG
  phdOptions?: PhdOption[];
}

export interface UgDegreeOption {
  id: string; // e.g., "be_cse", "bcom_hons", "mbbs"
  name: string; // e.g., "Bachelor of Engineering in Computer Science"
  description: string;
  durationYears: number;
  typicalSubjectsCore?: string[];
  competitiveExamsForUG?: CompetitiveExam[]; // e.g., JEE Main/Advanced, NEET-UG, CUET-UG, CLAT
  pgOptions?: PgDegreeOption[];
}

export interface Stream {
  id: string; // e.g., "science_mpc", "commerce_with_math"
  name: string; // e.g., "Science (Mathematics, Physics, Chemistry)"
  description: string;
  typicalSubjects: string[];
  grade12EquivalentExamName: string; // Name of the 12th board exam, e.g., "AISSCE", "ISC"
  competitiveExamsPost10th?: CompetitiveExam[]; // Exams taken during or right after 10th for 11-12th prep or early talent search
  ugOptions: UgDegreeOption[];
}

export interface Curriculum {
  id: string; // e.g., "cbse", "cisce", "ib"
  name: string; // e.g., "Central Board of Secondary Education"
  shortName?: string; // e.g., "CBSE"
  description: string;
  grade10EquivalentExamName: string; // Name of the 10th board exam, e.g., "AISSE", "ICSE"
  streamsAfter10th: Stream[];
}

export interface IndianEducationSystem {
  version: string;
  lastUpdated: string;
  curricula: Curriculum[];
  // Global list of all unique competitive exams for reference, if needed
  // allCompetitiveExams?: CompetitiveExam[];
}

// Example Usage (not part of types, but for illustration)
/*
const cbseBoard: Curriculum = {
  id: "cbse",
  name: "Central Board of Secondary Education",
  // ... other fields
  streamsAfter10th: [
    {
      id: "cbse_science_mpc",
      name: "Science (MPC)",
      // ... other fields
      ugOptions: [
        {
          id: "be_cse_cbse",
          name: "B.E./B.Tech in Computer Science",
          // ... other fields
          competitiveExamsForUG: [{id: "jee_main", name:"JEE Main", ...}],
          pgOptions: [
            // ...
          ]
        }
      ]
    }
  ]
};
*/
