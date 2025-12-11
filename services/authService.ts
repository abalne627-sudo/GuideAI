
import { User } from '../types';
import { SIMULATED_OTP } from '../constants';
import { dbGetUserByMobile, dbCreateUser, dbSetCurrentUserSession, dbGetCurrentUserSession, dbClearCurrentUserSession } from './dbService';

const OTP_STORAGE_KEY_PREFIX = 'guideai_otp_'; // guideai_otp_9876543210

// Simulates sending an OTP. In a real app, this would call an SMS gateway.
export const requestOtp = async (mobile: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!/^\d{10}$/.test(mobile)) { // Basic 10-digit mobile validation
        resolve({ success: false, message: "Invalid mobile number format." });
        return;
      }
      // Store the simulated OTP for verification.
      // In a real app, the OTP is sent to the user and not stored client-side like this for verification.
      // This is purely for simulation.
      localStorage.setItem(`${OTP_STORAGE_KEY_PREFIX}${mobile}`, SIMULATED_OTP);
      console.log(`Simulated OTP for ${mobile}: ${SIMULATED_OTP}`);
      resolve({ success: true, message: `OTP sent to ${mobile}. (Simulated: ${SIMULATED_OTP})` });
    }, 1000);
  });
};

// Simulates verifying an OTP.
export const verifyOtp = async (mobile: string, otp: string): Promise<{ success: boolean; user?: User; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedOtp = localStorage.getItem(`${OTP_STORAGE_KEY_PREFIX}${mobile}`);
      localStorage.removeItem(`${OTP_STORAGE_KEY_PREFIX}${mobile}`); // OTP is one-time

  alert(storedOtp)
      if (!storedOtp || storedOtp !== otp) {
        resolve({ success: false, message: "Invalid OTP. Please try again." });
        return;
      }

      let user = dbGetUserByMobile(mobile);
      if (!user) {
        user = dbCreateUser(mobile);
      }
      
      dbSetCurrentUserSession(user); // "Log in" the user
      resolve({ success: true, user, message: "Login successful." });
    }, 1000);
  });
};

export const getCurrentUser = (): User | null => {
  return dbGetCurrentUserSession();
};

export const logout = (): void => {
  dbClearCurrentUserSession();
};
