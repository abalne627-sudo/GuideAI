
import { AssessmentRecord, AssessmentResultData } from '../types';
import { dbSaveAssessmentRecord, dbGetAssessmentsByUserId, dbGetAssessmentRecordById } from './dbService';

export const saveUserAssessment = async (userId: string, assessmentData: AssessmentResultData): Promise<AssessmentRecord> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = dbSaveAssessmentRecord(userId, assessmentData);
      resolve(record);
    }, 500); // Simulate network delay
  });
};

export const getUserAssessments = async (userId: string): Promise<AssessmentRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const records = dbGetAssessmentsByUserId(userId);
      resolve(records);
    }, 500);
  });
};

export const getAssessmentById = async (assessmentId: string): Promise<AssessmentRecord | undefined> => {
   return new Promise((resolve) => {
    setTimeout(() => {
      const record = dbGetAssessmentRecordById(assessmentId);
      resolve(record);
    }, 500);
  });
};
