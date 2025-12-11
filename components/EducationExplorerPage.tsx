
import React, { useState } from 'react';
import { IndianEducationSystem, Curriculum, Stream, UgDegreeOption, PgDegreeOption, PhdOption, CompetitiveExam } from '../models/educationSystemTypes';
import { BreadcrumbItem } from '../../types'; // Corrected import path
import Card from './shared/Card';
import Breadcrumbs from './shared/Breadcrumbs';

interface EducationExplorerPageProps {
  educationSystemData: IndianEducationSystem;
  navigateToDashboard: () => void;
}

const ExamCard: React.FC<{ exam: CompetitiveExam }> = ({ exam }) => (
  <Card className="mb-3 bg-yellow-50 border border-yellow-200">
    <h5 className="font-semibold text-yellow-700">{exam.name} {exam.shortName && `(${exam.shortName})`}</h5>
    <p className="text-xs text-gray-600 mt-1">{exam.description}</p>
    <p className="text-xs mt-1"><strong>Level:</strong> {exam.level}</p>
    {exam.targetStages && <p className="text-xs"><strong>Targets:</strong> {exam.targetStages.join(', ')}</p>}
    {exam.officialWebsite && <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Official Website</a>}
  </Card>
);

const EducationExplorerPage: React.FC<EducationExplorerPageProps> = ({ educationSystemData, navigateToDashboard }) => {
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [selectedUgOption, setSelectedUgOption] = useState<UgDegreeOption | null>(null);
  const [selectedPgOption, setSelectedPgOption] = useState<PgDegreeOption | null>(null);

  const resetSelections = (level: 'root' | 'curriculum' | 'stream' | 'ug' | 'pg' = 'root') => {
    if (level === 'root') setSelectedCurriculum(null);
    if (level === 'root' || level === 'curriculum') setSelectedStream(null);
    if (level === 'root' || level === 'curriculum' || level === 'stream') setSelectedUgOption(null);
    if (level === 'root' || level === 'curriculum' || level === 'stream' || level === 'ug') setSelectedPgOption(null);
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', onClick: navigateToDashboard },
    { label: 'Education Paths', onClick: selectedCurriculum ? () => resetSelections('root') : undefined }
  ];
  if (selectedCurriculum) breadcrumbItems.push({ label: selectedCurriculum.shortName || selectedCurriculum.name, onClick: selectedStream ? () => resetSelections('curriculum') : undefined });
  if (selectedStream) breadcrumbItems.push({ label: selectedStream.name, onClick: selectedUgOption ? () => resetSelections('stream') : undefined });
  if (selectedUgOption) breadcrumbItems.push({ label: selectedUgOption.name, onClick: selectedPgOption ? () => resetSelections('ug') : undefined });
  if (selectedPgOption) breadcrumbItems.push({ label: selectedPgOption.name });

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-3xl font-bold text-neutral-dark mb-6 font-roboto-slab">FutureStream Education Explorer (India)</h1>
      <p className="text-gray-600 mb-6 text-sm">Explore curricula, streams, degrees, and competitive exams in the Indian education system. Data is illustrative.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1: Curricula & Streams */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="1. Select Curriculum">
            <select
              value={selectedCurriculum?.id || ""}
              onChange={(e) => {
                resetSelections('curriculum');
                setSelectedCurriculum(educationSystemData.curricula.find(c => c.id === e.target.value) || null);
              }}
              className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              aria-label="Select Curriculum"
            >
              <option value="">-- Select Curriculum --</option>
              {educationSystemData.curricula.map(curr => (
                <option key={curr.id} value={curr.id}>{curr.name} ({curr.shortName})</option>
              ))}
            </select>
            {selectedCurriculum && (
              <div className="mt-3 text-xs text-gray-500">
                <p><strong>10th Exam:</strong> {selectedCurriculum.grade10EquivalentExamName}</p>
                <p>{selectedCurriculum.description}</p>
              </div>
            )}
          </Card>

          {selectedCurriculum && (
            <Card title="2. Select Stream (After 10th)">
              <select
                value={selectedStream?.id || ""}
                onChange={(e) => {
                  resetSelections('stream');
                  setSelectedStream(selectedCurriculum.streamsAfter10th.find(s => s.id === e.target.value) || null);
                }}
                disabled={!selectedCurriculum}
                className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                aria-label="Select Stream"
              >
                <option value="">-- Select Stream --</option>
                {selectedCurriculum.streamsAfter10th.map(stream => (
                  <option key={stream.id} value={stream.id}>{stream.name}</option>
                ))}
              </select>
              {selectedStream && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-neutral-dark">Typical Subjects:</p>
                  <ul className="list-disc list-inside text-xs text-gray-600">
                    {selectedStream.typicalSubjects.map(sub => <li key={sub}>{sub}</li>)}
                  </ul>
                  <p className="text-xs text-gray-500 mt-1"><strong>12th Exam:</strong> {selectedStream.grade12EquivalentExamName}</p>
                  {selectedStream.competitiveExamsPost10th && selectedStream.competitiveExamsPost10th.length > 0 && (
                    <>
                      <p className="text-sm font-medium text-neutral-dark mt-2">Relevant Exams (Post 10th):</p>
                      {selectedStream.competitiveExamsPost10th.map(exam => <ExamCard key={exam.id} exam={exam} />)}
                    </>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Column 2: UG Options */}
        <div className="lg:col-span-1 space-y-6">
          {selectedStream && (
            <Card title="3. Undergraduate (UG) Options">
              <select
                value={selectedUgOption?.id || ""}
                onChange={(e) => {
                  resetSelections('ug');
                  setSelectedUgOption(selectedStream.ugOptions.find(ug => ug.id === e.target.value) || null);
                }}
                disabled={!selectedStream}
                className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                aria-label="Select Undergraduate Option"
              >
                <option value="">-- Select UG Option --</option>
                {selectedStream.ugOptions.map(ug => (
                  <option key={ug.id} value={ug.id}>{ug.name}</option>
                ))}
              </select>
              {selectedUgOption && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600">{selectedUgOption.description}</p>
                  <p className="text-xs text-gray-500 mt-1"><strong>Duration:</strong> {selectedUgOption.durationYears} years</p>
                  {selectedUgOption.typicalSubjectsCore && selectedUgOption.typicalSubjectsCore.length > 0 && (
                     <> <p className="text-sm font-medium text-neutral-dark mt-2">Core Subjects (Typical):</p>
                      <ul className="list-disc list-inside text-xs text-gray-600">
                        {selectedUgOption.typicalSubjectsCore.map(sub => <li key={sub}>{sub}</li>)}
                      </ul></>
                  )}
                  {selectedUgOption.competitiveExamsForUG && selectedUgOption.competitiveExamsForUG.length > 0 && (
                    <>
                      <p className="text-sm font-medium text-neutral-dark mt-2">Relevant Exams for UG:</p>
                      {selectedUgOption.competitiveExamsForUG.map(exam => <ExamCard key={exam.id} exam={exam} />)}
                    </>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Column 3: PG & PhD Options */}
        <div className="lg:col-span-1 space-y-6">
          {selectedUgOption && selectedUgOption.pgOptions && selectedUgOption.pgOptions.length > 0 && (
            <Card title="4. Postgraduate (PG) Options">
              <select
                value={selectedPgOption?.id || ""}
                onChange={(e) => {
                    resetSelections('pg');
                    setSelectedPgOption(selectedUgOption.pgOptions?.find(pg => pg.id === e.target.value) || null);
                }}
                disabled={!selectedUgOption}
                className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                aria-label="Select Postgraduate Option"
              >
                <option value="">-- Select PG Option --</option>
                {selectedUgOption.pgOptions.map(pg => (
                  <option key={pg.id} value={pg.id}>{pg.name}</option>
                ))}
              </select>
              {selectedPgOption && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600">{selectedPgOption.description}</p>
                  <p className="text-xs text-gray-500 mt-1"><strong>Duration:</strong> {selectedPgOption.durationYears} years</p>
                  {selectedPgOption.typicalSpecializations && selectedPgOption.typicalSpecializations.length > 0 && (
                     <> <p className="text-sm font-medium text-neutral-dark mt-2">Specializations (Typical):</p>
                      <ul className="list-disc list-inside text-xs text-gray-600">
                        {selectedPgOption.typicalSpecializations.map(spec => <li key={spec}>{spec}</li>)}
                      </ul></>
                  )}
                  {selectedPgOption.competitiveExamsForPG && selectedPgOption.competitiveExamsForPG.length > 0 && (
                    <>
                      <p className="text-sm font-medium text-neutral-dark mt-2">Relevant Exams for PG:</p>
                      {selectedPgOption.competitiveExamsForPG.map(exam => <ExamCard key={exam.id} exam={exam} />)}
                    </>
                  )}

                  {selectedPgOption.phdOptions && selectedPgOption.phdOptions.length > 0 && (
                     <Card title="5. PhD Options" className="mt-4">
                       <ul className="space-y-2">
                        {selectedPgOption.phdOptions.map(phd => (
                          <li key={phd.id} className="p-2 border-b border-gray-100">
                            <h6 className="font-semibold text-sm text-neutral-dark">{phd.name}</h6>
                            <p className="text-xs text-gray-600">{phd.description}</p>
                            <p className="text-xs text-gray-500">Duration: {phd.typicalDurationYearsRange.join('-')} years</p>
                            {phd.competitiveExamsForPhD && phd.competitiveExamsForPhD.length > 0 && (
                                <>
                                <p className="text-xs font-medium text-neutral-dark mt-1">Exams for PhD:</p>
                                {phd.competitiveExamsForPhD.map(exam => <ExamCard key={exam.id} exam={exam} />)}
                                </>
                            )}
                          </li>
                        ))}
                       </ul>
                     </Card>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
      <div className="mt-8 text-center">
            <button
                onClick={navigateToDashboard}
                className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
            >
                Back to Dashboard
            </button>
        </div>
    </div>
  );
};

export default EducationExplorerPage;
