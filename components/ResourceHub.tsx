
import React from 'react';
import { STATIC_RESOURCES } from '../constants';
import { ResourceItem } from '../types';

const ResourceCard: React.FC<{ resource: ResourceItem }> = ({ resource }) => {
  let icon;
  switch (resource.type) {
    case 'article':
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
      break;
    case 'video':
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>;
      break;
    case 'tool':
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
      break;
    case 'course_platform':
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg>;
      break;
    default:
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>;
  }

  return (
    <a 
      href={resource.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200"
      aria-label={`Learn more about ${resource.title}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 pt-1">{icon}</div>
        <div>
          <h4 className="text-lg font-semibold text-neutral-dark group-hover:text-primary">{resource.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
          {resource.tags && resource.tags.length > 0 && (
            <div className="mt-2">
              {resource.tags.map(tag => (
                <span key={tag} className="inline-block bg-gray-100 text-gray-700 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
};


const ResourceHub: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-center text-primary mb-8 font-roboto-slab">Resource Hub</h2>
      <p className="text-center text-gray-600 mb-10">
        Explore these curated resources to further your learning and career exploration journey.
      </p>
      
      {STATIC_RESOURCES.length === 0 ? (
        <p className="text-gray-500 text-center">No resources available at the moment. Please check back later.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STATIC_RESOURCES.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
       <p className="text-center text-sm text-gray-400 mt-12">
        Note: External links are provided for informational purposes. GuideAI is not responsible for the content of external sites.
      </p>
    </div>
  );
};

export default ResourceHub;
