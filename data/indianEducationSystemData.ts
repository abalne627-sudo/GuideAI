
// data/indianEducationSystemData.ts
import { IndianEducationSystem, Curriculum, Stream, UgDegreeOption, PgDegreeOption, PhdOption, CompetitiveExam } from '../models/educationSystemTypes';

// Define common competitive exams once to avoid repetition and ensure consistency
const EXAMS = {
  JEE_MAIN: { 
    id: "jee_main", name: "Joint Entrance Examination Main", shortName: "JEE Main",
    description: "National level entrance examination for admission to undergraduate engineering programs (B.E./B.Tech) in NITs, IIITs, and other Centrally Funded Technical Institutions (CFTIs), and serves as a qualifier for JEE Advanced.",
    level: "National", targetStages: ["UG Engineering"], typicalSubjectsCovered: ["Physics", "Chemistry", "Mathematics"], officialWebsite: "https://jeemain.nta.nic.in/"
  } as CompetitiveExam,
  JEE_ADVANCED: {
    id: "jee_advanced", name: "Joint Entrance Examination Advanced", shortName: "JEE Advanced",
    description: "National level entrance examination for admission to undergraduate programs (B.Tech, B.S., B.Arch, etc.) in Indian Institutes of Technology (IITs).",
    level: "National", targetStages: ["UG Engineering (IITs)"], typicalSubjectsCovered: ["Physics", "Chemistry", "Mathematics (Advanced)"], officialWebsite: "https://jeeadv.ac.in/"
  } as CompetitiveExam,
  NEET_UG: {
    id: "neet_ug", name: "National Eligibility cum Entrance Test (Undergraduate)", shortName: "NEET-UG",
    description: "National level entrance examination for admission to undergraduate medical courses (MBBS), dental courses (BDS), and AYUSH courses in India.",
    level: "National", targetStages: ["UG Medical", "UG Dental", "UG AYUSH"], typicalSubjectsCovered: ["Physics", "Chemistry", "Biology (Botany & Zoology)"], officialWebsite: "https://neet.nta.nic.in/"
  } as CompetitiveExam,
  CUET_UG: {
    id: "cuet_ug", name: "Common University Entrance Test (Undergraduate)", shortName: "CUET-UG",
    description: "National level entrance examination for admission to various undergraduate programs in Central Universities and other participating universities in India.",
    level: "National", targetStages: ["UG Arts", "UG Science", "UG Commerce", "UG Others"], officialWebsite: "https://cuet.samarth.ac.in/"
  } as CompetitiveExam,
  CUET_PG: {
    id: "cuet_pg", name: "Common University Entrance Test (Postgraduate)", shortName: "CUET-PG",
    description: "National level entrance examination for admission to various postgraduate programs in Central Universities and other participating universities in India.",
    level: "National", targetStages: ["PG Arts", "PG Science", "PG Commerce", "PG Others"], officialWebsite: "https://cuet.nta.nic.in/WebInfo/Page/Page?PageId=1&LangId=P" // Official PG site might differ or be same as UG's portal
  } as CompetitiveExam,
  CLAT: {
    id: "clat", name: "Common Law Admission Test", shortName: "CLAT",
    description: "National level entrance examination for admission to undergraduate and postgraduate law programs in National Law Universities (NLUs) and other participating institutions.",
    level: "National", targetStages: ["UG Law", "PG Law"], officialWebsite: "https://consortiumofnlus.ac.in/"
  } as CompetitiveExam,
  GATE: {
    id: "gate", name: "Graduate Aptitude Test in Engineering", shortName: "GATE",
    description: "National level examination that primarily tests the comprehensive understanding of various undergraduate subjects in engineering and science for admission into Master's programs and recruitment by some Public Sector Companies.",
    level: "National", targetStages: ["PG Engineering/Technology", "PhD Engineering/Technology", "PSU Recruitment"], officialWebsite: "https://gate.iitk.ac.in/" // Example, changes yearly by organizing IIT
  } as CompetitiveExam,
  CAT: {
    id: "cat", name: "Common Admission Test", shortName: "CAT",
    description: "National level entrance examination for admission to Master of Business Administration (MBA) and other postgraduate management programs in Indian Institutes of Management (IIMs) and other top business schools in India.",
    level: "National", targetStages: ["PG Management"], officialWebsite: "https://iimcat.ac.in/"
  } as CompetitiveExam,
  UGC_NET: {
    id: "ugc_net", name: "University Grants Commission National Eligibility Test", shortName: "UGC-NET",
    description: "National level test to determine eligibility for 'Assistant Professor' and for 'Junior Research Fellowship and Assistant Professor' in Indian universities and colleges.",
    level: "National", targetStages: ["PhD Fellowship", "Assistant Professor Eligibility"], officialWebsite: "https://ugcnet.nta.nic.in/"
  } as CompetitiveExam,
  CSIR_UGC_NET: {
    id: "csir_ugc_net", name: "Council of Scientific and Industrial Research UGC National Eligibility Test", shortName: "CSIR-UGC NET",
    description: "National level test conducted by CSIR to determine eligibility for Junior Research Fellowship (JRF) and for Lectureship/Assistant Professor in Indian universities and colleges in science subjects.",
    level: "National", targetStages: ["PhD Fellowship (Science)", "Assistant Professor Eligibility (Science)"], officialWebsite: "https://csirnet.nta.nic.in/"
  } as CompetitiveExam,
  NTSE: {
    id: "ntse", name: "National Talent Search Examination", shortName: "NTSE",
    description: "A national-level scholarship program in India to identify and nurture talented students. Conducted for students studying in Class X.",
    level: "National", targetStages: ["Scholarship (Class X)"], typicalSubjectsCovered: ["Mental Ability Test (MAT)", "Scholastic Aptitude Test (SAT) - Social Science, Science, Maths"], officialWebsite: "https://ncert.nic.in/"
  } as CompetitiveExam,
};


const cbseScienceMPCStream: Stream = {
  id: "cbse_science_mpc",
  name: "Science (MPC - Maths, Physics, Chemistry)",
  description: "Focuses on Mathematics, Physics, and Chemistry, preparing for engineering, physical sciences, and related fields.",
  typicalSubjects: ["Mathematics", "Physics", "Chemistry", "English", "Optional (e.g., Computer Science, Physical Education, Economics)"],
  grade12EquivalentExamName: "AISSCE (All India Senior School Certificate Examination)",
  competitiveExamsPost10th: [EXAMS.NTSE],
  ugOptions: [
    {
      id: "be_btech_cse", name: "B.E./B.Tech. in Computer Science & Engineering",
      description: "Undergraduate degree focusing on computer hardware, software, networking, and AI.",
      durationYears: 4,
      typicalSubjectsCore: ["Data Structures", "Algorithms", "Operating Systems", "Database Management", "Computer Networks", "Artificial Intelligence"],
      competitiveExamsForUG: [EXAMS.JEE_MAIN, EXAMS.JEE_ADVANCED, EXAMS.CUET_UG], // CUET for some univ like DU B.Tech
      pgOptions: [
        {
          id: "mtech_cse", name: "M.Tech. in Computer Science & Engineering",
          description: "Postgraduate specialization in advanced computer science topics.",
          durationYears: 2,
          typicalSpecializations: ["Artificial Intelligence", "Machine Learning", "Data Science", "Cybersecurity"],
          competitiveExamsForPG: [EXAMS.GATE],
          phdOptions: [
            {
              id: "phd_cs_ai", name: "Ph.D. in Computer Science (Focus: AI/ML)",
              description: "Doctoral research in advanced areas of Artificial Intelligence and Machine Learning.",
              typicalDurationYearsRange: [3, 5],
              commonResearchAreas: ["Deep Learning", "Natural Language Processing", "Robotics", "Computer Vision"],
              competitiveExamsForPhD: [EXAMS.GATE, EXAMS.UGC_NET, EXAMS.CSIR_UGC_NET], // CSIR for CS with mathematical focus
            }
          ]
        }
      ]
    },
    {
      id: "bsc_physics", name: "B.Sc. (Honours) in Physics",
      description: "Undergraduate degree focusing on fundamental principles of physics.",
      durationYears: 3,
      typicalSubjectsCore: ["Classical Mechanics", "Electromagnetism", "Quantum Mechanics", "Thermodynamics", "Optics"],
      competitiveExamsForUG: [EXAMS.CUET_UG],
      pgOptions: [
        {
          id: "msc_physics", name: "M.Sc. in Physics",
          description: "Postgraduate degree for advanced study in physics.",
          durationYears: 2,
          typicalSpecializations: ["Astrophysics", "Condensed Matter Physics", "Nuclear Physics"],
          competitiveExamsForPG: [EXAMS.CUET_PG, EXAMS.GATE], // GATE Physics for M.Sc. in some IITs/NITs and PhD
           phdOptions: [
            {
              id: "phd_physics_astro", name: "Ph.D. in Physics (Focus: Astrophysics)",
              description: "Doctoral research in astrophysics and cosmology.",
              typicalDurationYearsRange: [3, 5],
              commonResearchAreas: ["Stellar Evolution", "Galaxy Formation", "Cosmology"],
              competitiveExamsForPhD: [EXAMS.UGC_NET, EXAMS.CSIR_UGC_NET, EXAMS.GATE],
            }
          ]
        }
      ]
    }
  ]
};

const cbseScienceBiPCStream: Stream = {
  id: "cbse_science_bipc",
  name: "Science (BiPC - Biology, Physics, Chemistry)",
  description: "Focuses on Biology, Physics, and Chemistry, preparing for medical, biological sciences, and related fields.",
  typicalSubjects: ["Biology", "Physics", "Chemistry", "English", "Optional (e.g., Mathematics, Psychology, Physical Education)"],
  grade12EquivalentExamName: "AISSCE (All India Senior School Certificate Examination)",
  competitiveExamsPost10th: [EXAMS.NTSE],
  ugOptions: [
    {
      id: "mbbs", name: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
      description: "Undergraduate medical degree to become a doctor.",
      durationYears: 5.5, // Including internship
      typicalSubjectsCore: ["Anatomy", "Physiology", "Biochemistry", "Pharmacology", "Pathology"],
      competitiveExamsForUG: [EXAMS.NEET_UG],
      pgOptions: [
        {
          id: "md_ms", name: "MD/MS (Doctor of Medicine / Master of Surgery)",
          description: "Postgraduate medical specialization.",
          durationYears: 3,
          typicalSpecializations: ["Cardiology", "Pediatrics", "General Surgery", "Obstetrics & Gynaecology"],
          // NEET-PG is the main exam, but it's undergoing changes (NExT proposed)
          competitiveExamsForPG: [{ 
            id: "neet_pg", name: "National Eligibility cum Entrance Test (Postgraduate)", shortName: "NEET-PG",
            description: "Entrance exam for MD/MS and PG Diploma courses.", level: "National", 
            targetStages: ["PG Medical"], officialWebsite: "https://nbe.edu.in/"
          }],
          // PhD options also exist after MD/MS
        }
      ]
    },
    {
      id: "bsc_biotech", name: "B.Sc. in Biotechnology",
      description: "Undergraduate degree in the application of biological systems for technological purposes.",
      durationYears: 3,
      typicalSubjectsCore: ["Microbiology", "Genetics", "Molecular Biology", "Immunology", "Bioprocess Engineering"],
      competitiveExamsForUG: [EXAMS.CUET_UG],
      pgOptions: [
        {
          id: "msc_biotech", name: "M.Sc. in Biotechnology",
          description: "Postgraduate degree for advanced study in biotechnology.",
          durationYears: 2,
          competitiveExamsForPG: [EXAMS.CUET_PG, EXAMS.GATE], // GATE (BT paper)
          phdOptions: [
             {
              id: "phd_biotech_pharma", name: "Ph.D. in Biotechnology (Focus: Pharmaceutical)",
              description: "Doctoral research in pharmaceutical biotechnology.",
              typicalDurationYearsRange: [3, 5],
              commonResearchAreas: ["Drug Discovery", "Vaccine Development", "Biologics"],
              competitiveExamsForPhD: [EXAMS.UGC_NET, EXAMS.CSIR_UGC_NET, EXAMS.GATE],
            }
          ]
        }
      ]
    }
  ]
};

const cbseCommerceStream: Stream = {
  id: "cbse_commerce_with_math",
  name: "Commerce (with Mathematics)",
  description: "Focuses on Accountancy, Business Studies, Economics, and Mathematics, preparing for careers in finance, business, and management.",
  typicalSubjects: ["Accountancy", "Business Studies", "Economics", "Mathematics", "English", "Optional (e.g., Entrepreneurship, Informatics Practices)"],
  grade12EquivalentExamName: "AISSCE (All India Senior School Certificate Examination)",
  competitiveExamsPost10th: [EXAMS.NTSE],
  ugOptions: [
    {
      id: "bcom_hons", name: "B.Com. (Honours)",
      description: "In-depth undergraduate degree in commerce and finance.",
      durationYears: 3,
      typicalSubjectsCore: ["Financial Accounting", "Corporate Law", "Business Statistics", "Income Tax", "Auditing"],
      competitiveExamsForUG: [EXAMS.CUET_UG],
      pgOptions: [
        {
          id: "mcom", name: "M.Com.",
          description: "Postgraduate degree in commerce.",
          durationYears: 2,
          typicalSpecializations: ["Finance", "Accounting", "International Business"],
          competitiveExamsForPG: [EXAMS.CUET_PG],
        },
        {
          id: "mba_finance", name: "MBA in Finance",
          description: "Master of Business Administration with a specialization in Finance.",
          durationYears: 2,
          competitiveExamsForPG: [EXAMS.CAT, /* XAT, CMAT, etc. */],
           phdOptions: [
            {
              id: "phd_mgmt_finance", name: "Ph.D. in Management (Focus: Finance)",
              description: "Doctoral research in financial management.",
              typicalDurationYearsRange: [3, 5],
              commonResearchAreas: ["Corporate Finance", "Investment Management", "Financial Markets"],
              competitiveExamsForPhD: [EXAMS.UGC_NET, EXAMS.CAT], // CAT scores sometimes considered for FPM programs
            }
          ]
        }
      ]
    },
    {
      id: "bba", name: "BBA (Bachelor of Business Administration)",
      description: "General management undergraduate degree.",
      durationYears: 3,
      typicalSubjectsCore: ["Principles of Management", "Marketing Management", "Human Resource Management", "Financial Management"],
      competitiveExamsForUG: [EXAMS.CUET_UG /*, specific university BBA entrances */],
      pgOptions: [
        // MBA is a common option, already covered above.
      ]
    }
  ]
};

const cbseHumanitiesStream: Stream = {
  id: "cbse_humanities",
  name: "Humanities/Arts",
  description: "Focuses on subjects like History, Political Science, Sociology, Psychology, preparing for careers in civil services, law, journalism, academia, and social work.",
  typicalSubjects: ["History", "Political Science", "Sociology", "Psychology", "Economics", "Geography", "English", "Optional (e.g., Legal Studies, Fine Arts, Home Science)"],
  grade12EquivalentExamName: "AISSCE (All India Senior School Certificate Examination)",
  ugOptions: [
    {
      id: "ba_hons_polsci", name: "B.A. (Honours) in Political Science",
      description: "Undergraduate degree focusing on political systems, theories, and international relations.",
      durationYears: 3,
      competitiveExamsForUG: [EXAMS.CUET_UG],
      pgOptions: [
        {
          id: "ma_polsci", name: "M.A. in Political Science",
          description: "Postgraduate degree for advanced study in political science.",
          durationYears: 2,
          competitiveExamsForPG: [EXAMS.CUET_PG],
          phdOptions: [
             {
              id: "phd_polsci_ir", name: "Ph.D. in Political Science (Focus: International Relations)",
              description: "Doctoral research in international relations and global politics.",
              typicalDurationYearsRange: [3, 5],
              commonResearchAreas: ["Foreign Policy Analysis", "Global Governance", "Conflict Studies"],
              competitiveExamsForPhD: [EXAMS.UGC_NET],
            }
          ]
        }
      ]
    },
    {
      id: "ba_llb", name: "B.A. LL.B. (Honours)",
      description: "Integrated undergraduate degree in Arts and Law.",
      durationYears: 5,
      competitiveExamsForUG: [EXAMS.CLAT, /* AILET, LSAT India, etc. */],
      // PG in Law (LLM) could be an option here.
    }
  ]
};


const cbseCurriculum: Curriculum = {
  id: "cbse",
  name: "Central Board of Secondary Education",
  shortName: "CBSE",
  description: "A national level board of education in India for public and private schools, controlled and managed by the Government of India.",
  grade10EquivalentExamName: "AISSE (All India Secondary School Examination)",
  streamsAfter10th: [
    cbseScienceMPCStream,
    cbseScienceBiPCStream,
    cbseCommerceStream,
    cbseHumanitiesStream
    // Vocational streams can be added here
  ]
};

// Placeholder for CISCE (ICSE/ISC)
const cisceCurriculum: Curriculum = {
  id: "cisce",
  name: "Council for the Indian School Certificate Examinations",
  shortName: "CISCE",
  description: "A privately held national-level board of school education in India that conducts the Indian Certificate of Secondary Education (ICSE) and the Indian School Certificate (ISC) examinations.",
  grade10EquivalentExamName: "ICSE (Indian Certificate of Secondary Education)",
  streamsAfter10th: [
    // Simplified example, would mirror CBSE structure but with ISC nomenclature and potentially slightly different subject combos/names
    {
      id: "isc_science_pcm", name: "ISC Science (Physics, Chemistry, Maths)",
      description: "Equivalent to CBSE Science MPC for ISC board.",
      typicalSubjects: ["Physics", "Chemistry", "Mathematics", "English", "Optional"],
      grade12EquivalentExamName: "ISC (Indian School Certificate)",
      ugOptions: [ /* Similar to CBSE MPC UG options, referencing common exams */
        {...cbseScienceMPCStream.ugOptions[0], id:"be_btech_cse_isc"}, // Example: B.Tech CSE
      ] 
    }
  ]
};

// Placeholder for IB (International Baccalaureate)
const ibCurriculum: Curriculum = {
  id: "ib",
  name: "International Baccalaureate",
  shortName: "IB",
  description: "Offers high-quality programmes of international education: Primary Years Programme (PYP), Middle Years Programme (MYP), Diploma Programme (DP), and Career-related Programme (CP).",
  grade10EquivalentExamName: "IB Middle Years Programme (MYP) Certificate (or school internal if not pursuing certificate)",
  streamsAfter10th: [
    {
      id: "ib_dp", name: "IB Diploma Programme (DP)",
      description: "A two-year pre-university course for students aged 16 to 19. Students choose subjects from six subject groups.",
      // Subjects are highly customizable in IB DP (HL/SL choices across 6 groups)
      typicalSubjects: ["Group 1: Studies in Language and Literature", "Group 2: Language Acquisition", "Group 3: Individuals and Societies", "Group 4: Sciences", "Group 5: Mathematics", "Group 6: The Arts (or another subject from groups 1-5)", "Theory of Knowledge (TOK)", "Extended Essay (EE)", "Creativity, Activity, Service (CAS)"],
      grade12EquivalentExamName: "IB Diploma",
      ugOptions: [
        // UG options are global, but for India, students might take JEE/NEET/CUET alongside or based on IB scores for some private universities.
         {
          id: "btech_ib_overseas", name: "B.Tech/B.S. (International Universities or Indian Pvt. Univ accepting IB scores)",
          description: "Engineering or Science degrees from universities globally or Indian private universities.",
          durationYears: 4,
          competitiveExamsForUG: [/* SAT, ACT for US; specific country exams; some Indian pvt univ direct admission or own tests */ EXAMS.JEE_MAIN, EXAMS.NEET_UG], // If aiming for Indian professional courses
         }
      ]
    }
  ]
};


export const IndianEducationSystemData: IndianEducationSystem = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  curricula: [
    cbseCurriculum,
    cisceCurriculum,
    ibCurriculum,
    // Cambridge (IGCSE -> A Levels) placeholder
    {
      id: "cambridge", name: "Cambridge Assessment International Education", shortName: "Cambridge",
      description: "Provides international education programs and qualifications for 5 to 19-year-olds, including Cambridge IGCSE and Cambridge International A Level.",
      grade10EquivalentExamName: "Cambridge IGCSE",
      streamsAfter10th: [
        {
          id: "cambridge_a_levels_science", name: "Cambridge International A Levels (Science Focus)",
          description: "Advanced level qualifications typically chosen in 3-4 subjects, science-focused.",
          typicalSubjects: ["Physics (A Level)", "Chemistry (A Level)", "Mathematics (A Level)", "Further Mathematics (AS/A Level - optional)", "Biology (A Level - optional)"],
          grade12EquivalentExamName: "Cambridge International A Levels",
          ugOptions: [ /* Similar to IB, global options + Indian professional exams if targeted */
            {...ibCurriculum.streamsAfter10th[0].ugOptions[0], id:"btech_alevel_overseas"}
          ],
        }
      ]
    },
    // NIOS (National Institute of Open Schooling) placeholder
    {
      id: "nios", name: "National Institute of Open Schooling", shortName: "NIOS",
      description: "An open school to provide education to all segments of society with the motto 'Reach Out and Reach All'.",
      grade10EquivalentExamName: "NIOS Secondary Examination",
      streamsAfter10th: [ // NIOS offers flexibility, students pick subjects rather than fixed streams.
        {
          id: "nios_senior_secondary_science", name: "NIOS Senior Secondary (Science Subjects)",
          description: "Students choose a combination of subjects, can include science subjects.",
          typicalSubjects: ["Physics", "Chemistry", "Mathematics", "Biology", "English", "etc."],
          grade12EquivalentExamName: "NIOS Senior Secondary Examination",
          ugOptions: [ /* Similar to other boards, eligibility depends on subjects chosen */
            {...cbseScienceMPCStream.ugOptions[0], id:"be_btech_cse_nios"},
            {...cbseScienceBiPCStream.ugOptions[0], id:"mbbs_nios"},
          ],
        }
      ]
    }
  ],
  // Could also have a flat list of all unique exams here for easier lookup if needed:
  // allCompetitiveExams: Object.values(EXAMS)
};

// Example of how one might query (conceptual)
/*
function findUgOptions(curriculumId: string, streamId: string): UgDegreeOption[] | undefined {
  const curriculum = IndianEducationSystemData.curricula.find(c => c.id === curriculumId);
  if (curriculum) {
    const stream = curriculum.streamsAfter10th.find(s => s.id === streamId);
    return stream?.ugOptions;
  }
  return undefined;
}

// const btechOptionsForCbseMpc = findUgOptions("cbse", "cbse_science_mpc");
// console.log(btechOptionsForCbseMpc);
*/
