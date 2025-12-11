
import { ISCOData, ISCOMajorGroup, ISCOSubMajorGroup, ISCOMinorGroup, ISCOUnitGroup } from '../types';

const ISCO_CSV_URL = 'https://webapps.ilo.org/ilostat-files/Documents/isco.csv';

// Simple CSV parser that handles quoted fields containing commas
const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let currentVal = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && i + 1 < line.length && line[i+1] === '"') { // Handle "" as escaped quote
                currentVal += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(currentVal.trim().replace(/^"|"$/g, '')); // Also trim quotes from ends of unquoted segments if any
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    values.push(currentVal.trim().replace(/^"|"$/g, '')); // Add the last value
    return values;
};

const parseISCOCsvTextToData = (csvText: string): ISCOData | null => {
    const lines = csvText.split(/\r\n|\n/); 

    const colIndices = { // Based on the provided CSV structure
        majorCode: 0, majorTitleEN: 1,
        subMajorCode: 4, subMajorTitleEN: 5,
        minorCode: 8, minorTitleEN: 9,
        unitCode: 12, unitTitleEN: 13,
    };
    
    const majorGroupsMap = new Map<string, ISCOMajorGroup>();
    const subMajorGroupsMap = new Map<string, ISCOSubMajorGroup>();
    const minorGroupsMap = new Map<string, ISCOMinorGroup>();
    const unitGroupsMap = new Map<string, ISCOUnitGroup>();

    for (let i = 1; i < lines.length; i++) { // Skip header line
      if (!lines[i].trim()) continue; 

      const values = parseCSVLine(lines[i]);

      // Ensure that we have enough columns before trying to access them
      if (values.length < Math.max(colIndices.majorCode, colIndices.majorTitleEN, colIndices.subMajorCode, colIndices.subMajorTitleEN, colIndices.minorCode, colIndices.minorTitleEN, colIndices.unitCode, colIndices.unitTitleEN) + 1) {
          console.warn(`Skipping malformed CSV line ${i+1}: Not enough columns. Line: ${lines[i]}`);
          continue;
      }
      
      const majorCode = values[colIndices.majorCode]?.trim();
      const majorTitle = values[colIndices.majorTitleEN]?.trim();
      const subMajorCode = values[colIndices.subMajorCode]?.trim();
      const subMajorTitle = values[colIndices.subMajorTitleEN]?.trim();
      const minorCode = values[colIndices.minorCode]?.trim();
      const minorTitle = values[colIndices.minorTitleEN]?.trim();
      const unitCode = values[colIndices.unitCode]?.trim();
      const unitTitle = values[colIndices.unitTitleEN]?.trim();

      if (majorCode && majorTitle && !majorGroupsMap.has(majorCode)) {
        majorGroupsMap.set(majorCode, { code: majorCode, title: majorTitle, subMajorGroups: [] });
      }

      if (subMajorCode && subMajorTitle && majorCode && !subMajorGroupsMap.has(subMajorCode)) {
        subMajorGroupsMap.set(subMajorCode, { code: subMajorCode, title: subMajorTitle, majorGroupCode: majorCode, minorGroups: [] });
      }

      if (minorCode && minorTitle && subMajorCode && !minorGroupsMap.has(minorCode)) {
        minorGroupsMap.set(minorCode, { code: minorCode, title: minorTitle, subMajorGroupCode: subMajorCode, unitGroups: [] });
      }
      
      if (unitCode && unitTitle && minorCode && !unitGroupsMap.has(unitCode)) {
        unitGroupsMap.set(unitCode, {
          code: unitCode,
          title: unitTitle,
          minorGroupCode: minorCode,
          educationPaths: [],
          requiredSkills: [],
          salaryRange: 'N/A',
          demandOutlook: 'N/A',
          specializedRoles: [],
        });
      }
    }
    
    console.log(`Parsed ISCO Data: ${majorGroupsMap.size} Major, ${subMajorGroupsMap.size} Sub-Major, ${minorGroupsMap.size} Minor, ${unitGroupsMap.size} Unit Groups.`);

    if (majorGroupsMap.size === 0 && subMajorGroupsMap.size === 0 && minorGroupsMap.size === 0 && unitGroupsMap.size === 0 && lines.length > 1) {
        console.warn("CSV parsing resulted in zero groups. Check CSV format or column indices.");
        return null; // Indicate parsing failure if data was expected
    }

    return {
      majorGroups: Array.from(majorGroupsMap.values()),
      subMajorGroups: Array.from(subMajorGroupsMap.values()),
      minorGroups: Array.from(minorGroupsMap.values()),
      unitGroups: Array.from(unitGroupsMap.values()),
    };
};

// Sample CSV data as a fallback
const SAMPLE_ISCO_CSV_DATA = `ISCO08_1D_CODE,ISCO08_1D_TITLE_EN,ISCO08_1D_TITLE_FR,ISCO08_1D_TITLE_ES,ISCO08_2D_CODE,ISCO08_2D_TITLE_EN,ISCO08_2D_TITLE_FR,ISCO08_2D_TITLE_ES,ISCO08_3D_CODE,ISCO08_3D_TITLE_EN,ISCO08_3D_TITLE_FR,ISCO08_3D_TITLE_ES,ISCO08_4D_CODE,ISCO08_4D_TITLE_EN,ISCO08_4D_TITLE_FR,ISCO08_4D_TITLE_ES,ISCO08_LEVEL
1,"Managers","Directeurs et cadres de direction","Directores y gerentes",11,"Chief Executives, Senior Officials and Legislators","Dirigeants et cadres supérieurs de l'administration publique, législateurs et pouvoirs exécutifs","Directores ejecutivos, personal directivo de la administración pública y miembros del poder ejecutivo y de los cuerpos legislativos",111,"Legislators and Senior Officials","Membres des corps législatifs et dirigeants de l'administration publique","Miembros del poder legislativo y personal directivo de la administración pública",1111,"Legislators","Membres des corps législatifs","Miembros del poder legislativo",1
1,"Managers","Directeurs et cadres de direction","Directores y gerentes",11,"Chief Executives, Senior Officials and Legislators","Dirigeants et cadres supérieurs de l'administration publique, législateurs et pouvoirs exécutifs","Directores ejecutivos, personal directivo de la administración pública y miembros del poder ejecutivo y de los cuerpos legislativos",111,"Legislators and Senior Officials","Membres des corps législatifs et dirigeants de l'administration publique","Miembros del poder legislativo y personal directivo de la administración pública",1112,"Senior Government Officials","Dirigeants de l'administration publique","Personal directivo de la administración pública",2
1,"Managers","Directeurs et cadres de direction","Directores y gerentes",12,"Administrative and Commercial Managers","Directeurs et cadres de direction, services administratifs et commerciaux","Directores administrativos y comerciales",121,"Business Services and Administration Managers","Directeurs et cadres de direction, services aux entreprises et services administratifs","Directores de servicios de administración y otros servicios de apoyo",1211,"Finance Managers","Directeurs financiers","Directores financieros",3
2,"Professionals","Professions intellectuelles et scientifiques","Profesionales científicos e intelectuales",21,"Science and Engineering Professionals","Spécialistes des sciences et de l'ingénierie","Profesionales de las ciencias y de la ingeniería",214,"Engineering Professionals (excluding Electrotechnology)","Ingénieurs (électrotechnologie exceptée)","Ingenieros (excluida la electrotecnología)",2143,"Electronics Engineers","Ingénieurs électroniciens","Ingenieros en electrónica",4
2,"Professionals","Professions intellectuelles et scientifiques","Profesionales científicos e intelectuales",21,"Science and Engineering Professionals","Spécialistes des sciences et de l'ingénierie","Profesionales de las ciencias y de la ingeniería",214,"Engineering Professionals (excluding Electrotechnology)","Ingénieurs (électrotechnologie exceptée)","Ingenieros (excluida la electrotecnología)",2144,"Mechanical Engineers","Ingénieurs mécaniciens","Ingenieros mecánicos",4
3,"Technicians and Associate Professionals","Techniciens et professions intermédiaires","Técnicos y profesionales de nivel medio",31,"Science and Engineering Associate Professionals","Techniciens et professionnels intermédiaires des sciences et de l'ingénierie","Profesionales de nivel medio de las ciencias y la ingeniería",311,"Physical and Engineering Science Technicians","Techniciens des sciences physiques et de l'ingénierie","Técnicos en ciencias físicas y en ingeniería",3112,"Civil Engineering Technicians","Techniciens du génie civil","Técnicos en ingeniería civil",2
`;


export const fetchAndParseISCOData = async (): Promise<ISCOData | null> => {
  let csvText: string | null = null;
  try {
    const response = await fetch(ISCO_CSV_URL, {
        method: 'GET',
        // Adding 'no-cors' mode can sometimes bypass simple CORS issues for GET requests,
        // but the response will be "opaque" and its body inaccessible directly.
        // This won't work for reading CSV content.
        // We rely on the server having permissive CORS or fallback to sample data.
        // mode: 'no-cors', // This would prevent reading the response body if it succeeded.
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ISCO CSV: ${response.status} ${response.statusText}`);
    }
    csvText = await response.text();
    console.log("Successfully fetched ISCO CSV data from URL.");
  } catch (error) {
    console.warn(`Could not fetch live ISCO CSV data from ${ISCO_CSV_URL}. Error: ${error instanceof Error ? error.message : String(error)}. Falling back to sample data.`);
    csvText = SAMPLE_ISCO_CSV_DATA;
  }

  if (!csvText) {
      console.error("No CSV data available (fetch failed and no sample data).");
      return null;
  }

  try {
    const parsedData = parseISCOCsvTextToData(csvText);
    if (!parsedData) {
        console.error("Failed to parse CSV text into ISCOData structure, even from sample data.");
        return null;
    }
    return parsedData;
  } catch (parseError) {
    console.error("Critical error during CSV parsing:", parseError);
    return null;
  }
};
