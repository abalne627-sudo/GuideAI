
import React, { useState, useEffect, useMemo } from 'react';
import { ISCOData, ISCOMajorGroup, ISCOSubMajorGroup, ISCOMinorGroup, ISCOUnitGroup, BreadcrumbItem } from '../types';
import { dbGetISCOData } from '../services/dbService';
import LoadingIndicator from './LoadingIndicator';
import Card from './shared/Card';
import Breadcrumbs from './shared/Breadcrumbs';
import SearchBar from './shared/SearchBar';

interface OccupationsExplorerPageProps {
  navigateToDashboard: () => void;
  iscoInitialLoading: boolean;
  iscoLoadError: string | null;
  iscoSuccessfullyLoaded: boolean;
}

const OccupationsExplorerPage: React.FC<OccupationsExplorerPageProps> = ({ navigateToDashboard, iscoInitialLoading, iscoLoadError, iscoSuccessfullyLoaded }) => {
  const [iscoData, setIscoData] = useState<ISCOData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedMajorGroup, setSelectedMajorGroup] = useState<ISCOMajorGroup | null>(null);
  const [selectedSubMajorGroup, setSelectedSubMajorGroup] = useState<ISCOSubMajorGroup | null>(null);
  const [selectedMinorGroup, setSelectedMinorGroup] = useState<ISCOMinorGroup | null>(null);
  const [selectedUnitGroup, setSelectedUnitGroup] = useState<ISCOUnitGroup | null>(null);

  useEffect(() => {
    if (iscoSuccessfullyLoaded) {
      const data = dbGetISCOData();
      setIscoData(data);
    }
  }, [iscoSuccessfullyLoaded]);

  const resetSelections = (level: 'root' | 'major' | 'submajor' | 'minor' = 'root') => {
    if (level === 'root') setSelectedMajorGroup(null);
    if (level === 'root' || level === 'major') setSelectedSubMajorGroup(null);
    if (level === 'root' || level === 'major' || level === 'submajor') setSelectedMinorGroup(null);
    if (level === 'root' || level === 'major' || level === 'submajor' || level === 'minor') setSelectedUnitGroup(null);
    setSearchTerm(''); // Reset search term when hierarchy changes
  };

  const handleSelectMajor = (group: ISCOMajorGroup) => { resetSelections('major'); setSelectedMajorGroup(group); };
  const handleSelectSubMajor = (group: ISCOSubMajorGroup) => { resetSelections('submajor'); setSelectedSubMajorGroup(group); };
  const handleSelectMinor = (group: ISCOMinorGroup) => { resetSelections('minor'); setSelectedMinorGroup(group); };
  const handleSelectUnitGroup = (group: ISCOUnitGroup) => { setSelectedUnitGroup(group); };

  const filteredUnitGroups = useMemo(() => {
    if (!iscoData?.unitGroups) return [];
    if (!searchTerm) return iscoData.unitGroups;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return iscoData.unitGroups.filter(ug => 
      ug.title.toLowerCase().includes(lowerSearchTerm) || 
      ug.code.includes(lowerSearchTerm)
    );
  }, [iscoData, searchTerm]);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', onClick: navigateToDashboard },
    { label: 'Occupations', onClick: selectedMajorGroup ? () => resetSelections('root') : undefined }
  ];
  if (selectedMajorGroup) breadcrumbItems.push({ label: selectedMajorGroup.title, onClick: selectedSubMajorGroup ? () => resetSelections('major') : undefined });
  if (selectedSubMajorGroup) breadcrumbItems.push({ label: selectedSubMajorGroup.title, onClick: selectedMinorGroup ? () => resetSelections('submajor') : undefined });
  if (selectedMinorGroup) breadcrumbItems.push({ label: selectedMinorGroup.title, onClick: selectedUnitGroup ? () => resetSelections('minor') : undefined });
  if (selectedUnitGroup) breadcrumbItems.push({ label: selectedUnitGroup.title });


  if (iscoInitialLoading) return <LoadingIndicator message="Loading ISCO occupational data framework..." />;
  if (iscoLoadError || !iscoSuccessfullyLoaded || !iscoData) {
    return (
      <Card className="text-center">
        <h2 className="text-xl font-semibold text-secondary mb-2">Occupational Data Unavailable</h2>
        <p className="text-gray-600 mb-4">{iscoLoadError || "The ISCO occupational data could not be loaded. Please try again later or contact support."}</p>
        <button onClick={navigateToDashboard} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600">Back to Dashboard</button>
      </Card>
    );
  }
  
  const currentSubMajorGroups = selectedMajorGroup ? iscoData.subMajorGroups.filter(smg => smg.majorGroupCode === selectedMajorGroup.code) : [];
  const currentMinorGroups = selectedSubMajorGroup ? iscoData.minorGroups.filter(mg => mg.subMajorGroupCode === selectedSubMajorGroup.code) : [];
  const currentUnitGroups = selectedMinorGroup ? iscoData.unitGroups.filter(ug => ug.minorGroupCode === selectedMinorGroup.code) : [];


  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-3xl font-bold text-neutral-dark mb-6 font-roboto-slab">Global Occupations Explorer (ISCO-08)</h1>
      
      <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} placeholder="Search occupations by name or code..." className="mb-6" />

      {searchTerm && (
        <Card title={`Search Results for "${searchTerm}" (${filteredUnitGroups.length})`} className="mb-6">
          {filteredUnitGroups.length === 0 && <p className="text-gray-500">No occupations found matching your search.</p>}
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUnitGroups.map(ug => (
              <li key={ug.code} 
                  onClick={() => {
                    // To show details, we need to find its parent groups
                    const minor = iscoData.minorGroups.find(m => m.code === ug.minorGroupCode);
                    const subMajor = minor ? iscoData.subMajorGroups.find(sm => sm.code === minor.subMajorGroupCode) : null;
                    const major = subMajor ? iscoData.majorGroups.find(m => m.code === subMajor.majorGroupCode) : null;
                    if (major) setSelectedMajorGroup(major);
                    if (subMajor) setSelectedSubMajorGroup(subMajor);
                    if (minor) setSelectedMinorGroup(minor);
                    setSelectedUnitGroup(ug);
                    setSearchTerm(''); // Clear search to show hierarchy context
                  }}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer border border-gray-200">
                <p className="font-medium text-primary">{ug.title} <span className="text-xs text-gray-500">({ug.code})</span></p>
                <p className="text-xs text-gray-600">Part of Minor Group: {iscoData.minorGroups.find(m=>m.code === ug.minorGroupCode)?.title || 'N/A'}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {!searchTerm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Major Groups */}
          <Card title="1. Major Groups" className={selectedMajorGroup ? 'opacity-60' : ''}>
            <ul className="space-y-1 max-h-96 overflow-y-auto">
              {iscoData.majorGroups.map(mg => (
                <li key={mg.code} onClick={() => handleSelectMajor(mg)}
                    className={`p-2 rounded-md cursor-pointer ${selectedMajorGroup?.code === mg.code ? 'bg-primary text-white font-semibold' : 'hover:bg-blue-50'}`}>
                  {mg.code} - {mg.title}
                </li>
              ))}
            </ul>
          </Card>

          {/* Sub-Major Groups */}
          <Card title="2. Sub-Major Groups" className={!selectedMajorGroup ? 'opacity-30' : selectedSubMajorGroup ? 'opacity-60' : ''}>
            {selectedMajorGroup && currentSubMajorGroups.length > 0 ? (
              <ul className="space-y-1 max-h-96 overflow-y-auto">
                {currentSubMajorGroups.map(smg => (
                  <li key={smg.code} onClick={() => handleSelectSubMajor(smg)}
                      className={`p-2 rounded-md cursor-pointer ${selectedSubMajorGroup?.code === smg.code ? 'bg-primary text-white font-semibold' : 'hover:bg-blue-50'}`}>
                    {smg.code} - {smg.title}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-400">{selectedMajorGroup ? "No sub-major groups." : "Select a Major Group."}</p>}
          </Card>

          {/* Minor Groups */}
          <Card title="3. Minor Groups" className={!selectedSubMajorGroup ? 'opacity-30' : selectedMinorGroup ? 'opacity-60' : ''}>
            {selectedSubMajorGroup && currentMinorGroups.length > 0 ? (
              <ul className="space-y-1 max-h-96 overflow-y-auto">
                {currentMinorGroups.map(mg => (
                  <li key={mg.code} onClick={() => handleSelectMinor(mg)}
                      className={`p-2 rounded-md cursor-pointer ${selectedMinorGroup?.code === mg.code ? 'bg-primary text-white font-semibold' : 'hover:bg-blue-50'}`}>
                    {mg.code} - {mg.title}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-400">{selectedSubMajorGroup ? "No minor groups." : "Select a Sub-Major Group."}</p>}
          </Card>

          {/* Unit Groups */}
          <Card title="4. Unit Groups" className={!selectedMinorGroup ? 'opacity-30' : selectedUnitGroup ? 'opacity-60' : ''}>
            {selectedMinorGroup && currentUnitGroups.length > 0 ? (
              <ul className="space-y-1 max-h-96 overflow-y-auto">
                {currentUnitGroups.map(ug => (
                  <li key={ug.code} onClick={() => handleSelectUnitGroup(ug)}
                      className={`p-2 rounded-md cursor-pointer ${selectedUnitGroup?.code === ug.code ? 'bg-primary text-white font-semibold' : 'hover:bg-blue-50'}`}>
                    {ug.code} - {ug.title}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-400">{selectedMinorGroup ? "No unit groups." : "Select a Minor Group."}</p>}
          </Card>
        </div>
      )}

      {selectedUnitGroup && (
        <Card title={`Details for: ${selectedUnitGroup.title} (${selectedUnitGroup.code})`} className="mt-6 bg-blue-50 border border-blue-200">
          <div className="space-y-3">
            <p><strong>ISCO Code:</strong> {selectedUnitGroup.code}</p>
            <p><strong>Title:</strong> {selectedUnitGroup.title}</p>
            <p><strong>Minor Group:</strong> ({selectedUnitGroup.minorGroupCode}) {iscoData.minorGroups.find(m=>m.code === selectedUnitGroup.minorGroupCode)?.title}</p>
            <p><strong>Education Paths:</strong> {selectedUnitGroup.educationPaths?.join(', ') || <span className="italic text-gray-500">Not specified</span>}</p>
            <p><strong>Required Skills:</strong></p>
            {selectedUnitGroup.requiredSkills && selectedUnitGroup.requiredSkills.length > 0 ? (
              <ul className="list-disc list-inside ml-4 text-sm">
                {selectedUnitGroup.requiredSkills.map(skill => <li key={skill.name}>{skill.name} ({skill.type})</li>)}
              </ul>
            ) : <p className="italic text-gray-500 text-sm ml-4">Not specified</p>}
            <p><strong>Salary Range (Example):</strong> {selectedUnitGroup.salaryRange || <span className="italic text-gray-500">Not specified</span>}</p>
            <p><strong>Demand Outlook (Example):</strong> {selectedUnitGroup.demandOutlook || <span className="italic text-gray-500">Not specified</span>}</p>
            <p><strong>Specialized Roles:</strong></p>
            {selectedUnitGroup.specializedRoles && selectedUnitGroup.specializedRoles.length > 0 ? (
              <ul className="list-disc list-inside ml-4 text-sm">
                {selectedUnitGroup.specializedRoles.map(role => (
                  <li key={role.name}>
                    {role.name} 
                    {role.toolsets.length > 0 && ` (Tools: ${role.toolsets.join(', ')})`}
                    {role.typicalDegrees.length > 0 && ` (Degrees: ${role.typicalDegrees.join(', ')})`}
                  </li>
                ))}
              </ul>
            ) : <p className="italic text-gray-500 text-sm ml-4">No specialized roles listed</p>}
             <button onClick={() => setSelectedUnitGroup(null)} className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm">Clear Detail View</button>
          </div>
        </Card>
      )}

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

export default OccupationsExplorerPage;
