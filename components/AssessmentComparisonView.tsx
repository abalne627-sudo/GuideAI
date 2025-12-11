
import React from 'react';
import { AssessmentRecord, StudentProfile, BigFiveCategory, RIASECCategory, ValueCategory, MBTICategory } from '../types'; // Assuming ValueCategory is in types

interface AssessmentComparisonViewProps {
  assessment1: AssessmentRecord;
  assessment2: AssessmentRecord;
}

const renderScoreComparison = (score1?: number, score2?: number) => {
  if (score1 === undefined && score2 === undefined) return <span className="text-gray-500">N/A</span>;
  
  const s1 = score1 !== undefined ? score1.toFixed(1) : 'N/A';
  const s2 = score2 !== undefined ? score2.toFixed(1) : 'N/A';
  let changeIndicator = "";
  if (score1 !== undefined && score2 !== undefined) {
    if (score2 > score1) changeIndicator = "text-green-500 (↑)";
    else if (score2 < score1) changeIndicator = "text-red-500 (↓)";
    else changeIndicator = "text-gray-500 (NC)";
  }

  return (
    <>
      <span className={score1 === undefined ? 'text-gray-400' : ''}>{s1}</span>
      <span className="mx-1 text-gray-400">vs</span>
      <span className={score2 === undefined ? 'text-gray-400' : ''}>{s2}</span>
      {changeIndicator && <span className={`ml-1 text-xs ${changeIndicator}`}>{changeIndicator.includes('↑') ? 'Increased' : changeIndicator.includes('↓') ? 'Decreased' : 'No Change'}</span>}
    </>
  );
};

const renderMBTIComparison = (
    mbti1?: Partial<Record<MBTICategory, { dominantPole: string; scoreDominant: number }>>,
    mbti2?: Partial<Record<MBTICategory, { dominantPole: string; scoreDominant: number }>>
) => {
    if (!mbti1 || !mbti2) return <span className="text-gray-500">N/A</span>;
    const categories = Object.values(MBTICategory);
    return categories.map(cat => {
        const pole1 = mbti1[cat]?.dominantPole || 'N/A';
        const pole2 = mbti2[cat]?.dominantPole || 'N/A';
        let changeIndicator = "";
        if (pole1 !== 'N/A' && pole2 !== 'N/A' && pole1 !== pole2) {
            changeIndicator = "text-blue-500 (Changed)";
        } else if (pole1 !== 'N/A' && pole2 !== 'N/A' && pole1 === pole2) {
            changeIndicator = "text-gray-500 (Same)";
        }
        return (
            <div key={cat} className="mb-1">
                <strong>{cat}:</strong> {pole1} vs {pole2} {changeIndicator && <span className={`ml-1 text-xs ${changeIndicator}`}>{changeIndicator.includes('Changed') ? 'Preference Shifted' : 'Preference Same'}</span>}
            </div>
        );
    });
};


const ComparisonSection: React.FC<{ title: string; data1?: Partial<Record<string, number>>; data2?: Partial<Record<string, number>>; categories: string[] }> = ({ title, data1, data2, categories }) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
      <h4 className="text-xl font-semibold text-gray-700 mb-3">{title}</h4>
      {categories.map(category => (
        <div key={category} className="mb-2 flex justify-between items-center">
          <span className="font-medium text-neutral-dark">{category}:</span>
          <span className="text-sm">{renderScoreComparison(data1?.[category], data2?.[category])}</span>
        </div>
      ))}
    </div>
  );
};

const AssessmentComparisonView: React.FC<AssessmentComparisonViewProps> = ({ assessment1, assessment2 }) => {
  if (!assessment1 || !assessment2) {
    return <p className="text-red-500 text-center">Error: One or both assessments are missing for comparison.</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-center text-primary mb-8 font-roboto-slab">Assessment Comparison</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-6 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700">Assessment 1</h3>
          <p className="text-xs text-gray-600">{assessment1.assessmentName || new Date(assessment1.timestamp).toLocaleDateString()}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg mt-2 md:mt-0">
          <h3 className="text-lg font-semibold text-green-700">Assessment 2</h3>
          <p className="text-xs text-gray-600">{assessment2.assessmentName || new Date(assessment2.timestamp).toLocaleDateString()}</p>
        </div>
      </div>

      <ComparisonSection title="Big Five Traits" data1={assessment1.profile.bigFive} data2={assessment2.profile.bigFive} categories={Object.values(BigFiveCategory)} />
      <ComparisonSection title="RIASEC Interests" data1={assessment1.profile.riasec} data2={assessment2.profile.riasec} categories={Object.values(RIASECCategory)} />
      <ComparisonSection title="Work Values" data1={assessment1.profile.values} data2={assessment2.profile.values} categories={Object.values(ValueCategory)} />
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
        <h4 className="text-xl font-semibold text-gray-700 mb-3">MBTI-Style Preferences</h4>
        {renderMBTIComparison(assessment1.profile.mbti as any, assessment2.profile.mbti as any)}
      </div>

      <div className="mt-8 text-center">
         <p className="text-sm text-gray-500">This comparison highlights changes in your self-reported traits and interests over time.</p>
      </div>
    </div>
  );
};

export default AssessmentComparisonView;
