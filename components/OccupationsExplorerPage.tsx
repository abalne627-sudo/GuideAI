
import React, { useState, useEffect, useMemo } from 'react';
import { ISCOData, ISCOMajorGroup, ISCOSubMajorGroup, ISCOMinorGroup, ISCOUnitGroup, BreadcrumbItem, OccupationDeepDive } from '../types';
import { dbGetISCOData } from '../services/dbService';
import { getOccupationDeepDive } from '../services/geminiService';
import LoadingIndicator from './LoadingIndicator';
import Card from './shared/Card';
import Breadcrumbs from './shared/Breadcrumbs';
import SearchBar from './shared/SearchBar';

interface OccupationsExplorerPageProps {
  navigateToDashboard: () => void;
  iscoInitialLoading: boolean;
  iscoLoadError: string | null;
  iscoSuccessfullyLoaded: boolean;
  deepLinkCode?: string | null;
}

const OccupationsExplorerPage: React.FC<OccupationsExplorerPageProps> = ({ navigateToDashboard, iscoInitialLoading, iscoLoadError, iscoSuccessfullyLoaded, deepLinkCode }) => {
  const [iscoData, setIscoData] = useState<ISCOData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedMajorGroup, setSelectedMajorGroup] = useState<ISCOMajorGroup | null>(null);
  const [selectedSubMajorGroup, setSelectedSubMajorGroup] = useState<ISCOSubMajorGroup | null>(null);
  const [selectedMinorGroup, setSelectedMinorGroup] = useState<ISCOMinorGroup | null>(null);
  const [selectedUnitGroup, setSelectedUnitGroup] = useState<ISCOUnitGroup | null>(null);

  const [deepDiveData, setDeepDiveData] = useState<OccupationDeepDive | null>(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);

  useEffect(() => {
    if (iscoSuccessfullyLoaded) {
      setIscoData(dbGetISCOData());
    }
  }, [iscoSuccessfullyLoaded]);

  useEffect(() => {
    if (iscoSuccessfullyLoaded && iscoData && deepLinkCode) {
      const unit = iscoData.unitGroups.find(u => u.code === deepLinkCode);
      if (unit) {
        const minor = iscoData.minorGroups.find(m => m.code === unit.minorGroupCode);
        const subMajor = minor ? iscoData.subMajorGroups.find(sm => sm.code === minor.subMajorGroupCode) : null;
        const major = subMajor ? iscoData.majorGroups.find(m => m.code === subMajor.majorGroupCode) : null;
        if (major) setSelectedMajorGroup(major);
        if (subMajor) setSelectedSubMajorGroup(subMajor);
        if (minor) setSelectedMinorGroup(minor);
        setSelectedUnitGroup(unit);
      }
    }
  }, [iscoSuccessfullyLoaded, iscoData, deepLinkCode]);

  const resetSelections = (level: 'root' | 'major' | 'submajor' | 'minor' = 'root') => {
    if (level === 'root') setSelectedMajorGroup(null);
    if (level === 'root' || level === 'major') setSelectedSubMajorGroup(null);
    if (level === 'root' || level === 'major' || level === 'submajor') setSelectedMinorGroup(null);
    if (level === 'root' || level === 'major' || level === 'submajor' || level === 'minor') setSelectedUnitGroup(null);
    setSearchTerm(''); 
    setDeepDiveData(null);
  };

  const handleFetchDeepDive = async () => {
    if (!selectedUnitGroup) return;
    setLoadingDeepDive(true);
    setDeepDiveData(null);
    try {
      setDeepDiveData(await getOccupationDeepDive(selectedUnitGroup.title, selectedUnitGroup.code));
    } finally {
      setLoadingDeepDive(false);
    }
  };

  const filteredUnitGroups = useMemo(() => {
    if (!iscoData?.unitGroups || !searchTerm) return [];
    return iscoData.unitGroups.filter(ug => 
      ug.title.toLowerCase().includes(searchTerm.toLowerCase()) || ug.code.includes(searchTerm)
    );
  }, [iscoData, searchTerm]);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', onClick: navigateToDashboard },
    { label: 'Occupations', onClick: () => resetSelections('root') }
  ];

  if (iscoInitialLoading) return <LoadingIndicator message="Standardizing Occupational Framework..." />;
  if (!iscoData) return <div className="text-center p-20">Framework Offline.</div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-bold text-text-main font-serif">Global Occupations Navigator</h1>
        <p className="text-text-muted mt-2 max-w-2xl leading-relaxed">Standardized classification using the ILO's ISCO-08 framework. Discover roles, codes, and standardized skill requirements.</p>
      </div>

      <div className="mb-8 relative max-w-xl">
        <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} placeholder="Find by title or code (e.g. 'Software' or '2511')" />
      </div>

      {searchTerm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnitGroups.map(ug => (
            <div key={ug.code} onClick={() => { setSelectedUnitGroup(ug); setSearchTerm(''); }} className="group">
              <Card className="hover:border-primary border border-slate-200 transition-all cursor-pointer h-full">
                <span className="text-xs font-bold text-primary px-2 py-1 bg-blue-50 rounded">{ug.code}</span>
                <h4 className="text-lg font-bold mt-2 group-hover:text-primary transition-colors">{ug.title}</h4>
              </Card>
            </div>
          ))}
          {filteredUnitGroups.length === 0 && <p className="col-span-full text-center py-10 text-text-muted">No matches found.</p>}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Major Groups Navigation */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted pl-1">Framework Hierarchy</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
                  {iscoData.majorGroups.map(mg => (
                    <button 
                      key={mg.code} 
                      onClick={() => { setSelectedMajorGroup(mg); setSelectedSubMajorGroup(null); setSelectedMinorGroup(null); setSelectedUnitGroup(null); }}
                      className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group ${selectedMajorGroup?.code === mg.code ? 'bg-blue-50' : ''}`}
                    >
                      <span className={`text-sm font-bold ${selectedMajorGroup?.code === mg.code ? 'text-primary' : 'text-slate-400'}`}>{mg.code}</span>
                      <span className={`flex-1 mx-3 text-sm font-semibold ${selectedMajorGroup?.code === mg.code ? 'text-primary' : 'text-text-main'}`}>{mg.title}</span>
                      <svg className={`w-4 h-4 transition-transform ${selectedMajorGroup?.code === mg.code ? 'translate-x-1 text-primary' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Drill Down Area */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {!selectedMajorGroup ? (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><use href="#icon-globe-alt"></use></svg>
                <p className="text-text-muted">Select a Major Group to begin exploring the sub-specializations.</p>
              </div>
            ) : !selectedUnitGroup ? (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-primary mb-4">Level 2: Sub-Major Groups</h3>
                  <div className="flex flex-wrap gap-2">
                    {iscoData.subMajorGroups.filter(sm => sm.majorGroupCode === selectedMajorGroup.code).map(sm => (
                      <button 
                        key={sm.code} 
                        onClick={() => { setSelectedSubMajorGroup(sm); setSelectedMinorGroup(null); setSelectedUnitGroup(null); }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedSubMajorGroup?.code === sm.code ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-text-muted hover:bg-slate-200'}`}
                      >
                        {sm.title}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedSubMajorGroup && (
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-fade-in">
                    <h3 className="text-lg font-bold text-primary mb-4">Level 3: Minor Groups</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {iscoData.minorGroups.filter(m => m.subMajorGroupCode === selectedSubMajorGroup.code).map(m => (
                        <button 
                          key={m.code} 
                          onClick={() => { setSelectedMinorGroup(m); setSelectedUnitGroup(null); }}
                          className={`text-left p-3 rounded-xl text-sm font-semibold transition-all border-2 ${selectedMinorGroup?.code === m.code ? 'border-primary bg-blue-50 text-primary' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                        >
                          {m.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMinorGroup && (
                   <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-fade-in">
                    <h3 className="text-lg font-bold text-primary mb-4">Level 4: Unit Group Roles</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {iscoData.unitGroups.filter(u => u.minorGroupCode === selectedMinorGroup.code).map(u => (
                        <button 
                          key={u.code} 
                          onClick={() => setSelectedUnitGroup(u)}
                          className="text-left p-4 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-primary transition-all flex justify-between group"
                        >
                          <span>{u.title}</span>
                          <span className="text-slate-400 group-hover:text-blue-200">#{u.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Detailed Role View */
              <div className="space-y-6 animate-fade-in">
                <Card className="border-t-8 border-primary relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-primary-light">Occupational Deep Dive</span>
                      <h2 className="text-4xl font-bold text-text-main mt-1 font-serif">{selectedUnitGroup.title}</h2>
                    </div>
                    <button onClick={() => setSelectedUnitGroup(null)} className="text-sm font-bold text-slate-400 hover:text-secondary flex items-center transition">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                      Back
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-text-muted uppercase">ISCO Code</p>
                      <p className="text-2xl font-bold text-primary">{selectedUnitGroup.code}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-muted uppercase">Skill Level</p>
                      <p className="text-2xl font-bold text-accent">{selectedUnitGroup.code[0]}</p>
                    </div>
                    <div>
                       <p className="text-xs font-bold text-text-muted uppercase">Framework</p>
                       <p className="text-lg font-bold">ISCO-08</p>
                    </div>
                  </div>

                  <div className="mt-8 bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                           <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                           </div>
                           <h4 className="text-xl font-bold text-primary-dark">AI Market Intelligence</h4>
                        </div>
                        {!deepDiveData && !loadingDeepDive && (
                           <button onClick={handleFetchDeepDive} className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all">
                              Analyze Market
                           </button>
                        )}
                     </div>

                     {loadingDeepDive && (
                        <div className="flex flex-col items-center py-10">
                           <svg className="animate-spin h-8 w-8 text-primary mb-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           <p className="text-sm font-semibold text-primary">Gemini is synthesizing real-world data...</p>
                        </div>
                     )}

                     {deepDiveData && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-fade-in">
                           <div className="p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Est. Salary (India)</p>
                              <p className="text-lg font-bold text-text-main">{deepDiveData.salaryIndia}</p>
                           </div>
                           <div className="p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Automation Risk</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${deepDiveData.automationRisk.includes('Low') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                 {deepDiveData.automationRisk}
                              </span>
                           </div>
                           <div className="p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Growth Outlook</p>
                              <p className="text-sm font-medium text-text-main">{deepDiveData.growthPotential}</p>
                           </div>
                           <div className="p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Success Skills</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                 {deepDiveData.topSkills.map(s => <span key={s} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{s}</span>)}
                              </div>
                           </div>
                           <div className="sm:col-span-2 p-4 bg-white rounded-xl shadow-sm border-l-4 border-accent">
                              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Typical Progression</p>
                              <p className="text-sm italic leading-relaxed">{deepDiveData.careerPathSummary}</p>
                           </div>
                        </div>
                     )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OccupationsExplorerPage;
