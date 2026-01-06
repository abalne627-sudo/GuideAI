
import React from 'react';
import Card from './shared/Card';
import Breadcrumbs from './shared/Breadcrumbs';
import { BreadcrumbItem } from '../types';

interface BibliographyPageProps {
  navigateToDashboard: () => void;
}

interface ReferenceEntry {
  title: string;
  author: string;
  year?: string;
  description: string;
  link?: string;
}

const ReferenceItem: React.FC<{ entry: ReferenceEntry }> = ({ entry }) => (
  <div className="mb-6 last:mb-0 pb-6 border-b border-gray-100 last:border-0">
    <h4 className="text-lg font-semibold text-primary">{entry.title}</h4>
    <p className="text-sm font-medium text-gray-700">{entry.author} {entry.year && `(${entry.year})`}</p>
    <p className="text-sm text-gray-600 mt-2">{entry.description}</p>
    {entry.link && (
      <a 
        href={entry.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-xs text-blue-600 hover:underline mt-2 inline-block"
      >
        View Source
      </a>
    )}
  </div>
);

const BibliographyPage: React.FC<BibliographyPageProps> = ({ navigateToDashboard }) => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', onClick: navigateToDashboard },
    { label: 'Sources & References' }
  ];

  const psychometricRefs: ReferenceEntry[] = [
    {
      title: "An alternative 'description of personality': The Big-Five factor structure",
      author: "Goldberg, L. R.",
      year: "1990",
      description: "Foundational academic paper defining the Five-Factor Model (Big Five) traits used in our personality assessment.",
      link: "https://doi.org/10.1037/0022-3514.59.6.1216"
    },
    {
      title: "Making Vocational Choices: A Theory of Vocational Personalities and Work Environments",
      author: "Holland, J. L.",
      year: "1997",
      description: "The primary source for the RIASEC (Holland Codes) framework used to map student interests to career environments.",
    },
    {
      title: "Manual: A guide to the development and use of the Myers-Briggs Type Indicator",
      author: "Myers, I. B., & McCaulley, M. H.",
      year: "1985",
      description: "Technical manual for the MBTI framework, providing the basis for our energy, information, decision, and lifestyle preference scales."
    }
  ];

  const occupationalRefs: ReferenceEntry[] = [
    {
      title: "International Standard Classification of Occupations (ISCO-08)",
      author: "International Labour Organization (ILO)",
      year: "2012",
      description: "The global standard for classifying jobs, used to power our Global Occupations Explorer.",
      link: "https://www.ilo.org/public/english/bureau/stat/isco/isco08/"
    },
    {
      title: "O*NET OnLine",
      author: "U.S. Department of Labor",
      description: "Comprehensive database used for mapping personality traits and skills to specific occupational requirements.",
      link: "https://www.onetonline.org/"
    }
  ];

  const academicRefs: ReferenceEntry[] = [
    {
      title: "National Education Policy (NEP) 2020",
      author: "Ministry of Education, Government of India",
      year: "2020",
      description: "Contextual framework for multidisciplinary education and stream selection in the Indian school system.",
      link: "https://www.education.gov.in/nep-2020"
    }
  ];

  const techRefs: ReferenceEntry[] = [
    {
      title: "Gemini: A Family of Highly Capable Multimodal Models",
      author: "Google DeepMind",
      year: "2024",
      description: "Technical documentation for the Generative AI models (Gemini Flash/Pro) that power our personalized guidance and AI Mentor.",
      link: "https://ai.google.dev/"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-20">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-neutral-dark font-roboto-slab">Sources & References</h2>
        <p className="text-gray-600 mt-2">The scientific and data foundations of NextStep.</p>
      </div>

      <div className="space-y-8">
        <Card title="Psychometric & Personality Frameworks">
          {psychometricRefs.map((ref, i) => <ReferenceItem key={i} entry={ref} />)}
        </Card>

        <Card title="Occupational Standards">
          {occupationalRefs.map((ref, i) => <ReferenceItem key={i} entry={ref} />)}
        </Card>

        <Card title="Educational System Data">
          {academicRefs.map((ref, i) => <ReferenceItem key={i} entry={ref} />)}
        </Card>

        <Card title="AI & Technology">
          {techRefs.map((ref, i) => <ReferenceItem key={i} entry={ref} />)}
        </Card>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={navigateToDashboard}
          className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BibliographyPage;
