
import React, { useState, useMemo } from 'react';
import { STATIC_RESOURCES } from '../constants';
import { ResourceItem, BreadcrumbItem } from '../types';
import Breadcrumbs from './shared/Breadcrumbs';
import Card from './shared/Card';

interface ResourceHubProps {
  navigateToDashboard: () => void;
}

const ResourceHub: React.FC<ResourceHubProps> = ({ navigateToDashboard }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const filters = [
    { id: 'all', label: 'All Resources' },
    { id: 'SAT', label: 'SAT Prep' },
    { id: 'entrepreneurship', label: 'Startup School' },
    { id: 'STEM', label: 'Advanced STEM' },
    { id: 'well-being', label: 'Well-being' }
  ];

  const filteredResources = useMemo(() => {
    if (activeFilter === 'all') return STATIC_RESOURCES;
    return STATIC_RESOURCES.filter(r => r.tags.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 pb-20 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Dashboard', onClick: navigateToDashboard }, { label: 'Resource Hub' }]} />
      
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-text-main font-serif">Success Toolkit</h2>
        <p className="text-text-muted mt-2 max-w-xl mx-auto leading-relaxed">Curated tools and platforms to bridge the gap between assessment and action.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {filters.map(f => (
          <button 
            key={f.id} 
            onClick={() => setActiveFilter(f.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${activeFilter === f.id ? 'bg-primary text-white' : 'bg-white text-text-muted border border-slate-200 hover:border-primary-light'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer" className="group">
            <Card className="h-full border border-slate-100 hover:border-primary-light hover:shadow-2xl transition-all relative overflow-hidden flex flex-col">
               {/* Expert Pick Ribbon Fix */}
               {resource.tags.includes('YC') && (
                 <div className="absolute top-4 -right-8 bg-orange-500 text-white text-[9px] font-black py-1 w-32 rotate-45 text-center shadow-sm z-10 select-none">
                    EXPERT PICK
                 </div>
               )}
               {/* Essential Ribbon Fix */}
               {resource.tags.includes('SAT') && (
                 <div className="absolute top-4 -right-8 bg-blue-600 text-white text-[9px] font-black py-1 w-32 rotate-45 text-center shadow-sm z-10 select-none">
                    ESSENTIAL
                 </div>
               )}
               
               <div className="p-2 w-10 h-10 bg-slate-50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
               </div>
               
               <h4 className="text-lg font-bold text-text-main leading-tight group-hover:text-primary transition-colors pr-6">{resource.title}</h4>
               <p className="text-sm text-text-muted mt-3 line-clamp-3 flex-grow">{resource.description}</p>
               
               <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                  {resource.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">#{tag}</span>
                  ))}
               </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResourceHub;
