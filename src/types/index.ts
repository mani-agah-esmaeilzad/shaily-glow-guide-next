export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  age: string;
  gender: string;
  comedones: string;
  redPimples: string;
  fineLines: string;
  foreheadNose: string;
  sideNose: string;
  cheeks: string;
  subscription_plan?: string;
  avatarUrl?: string;

  skinType?: string;
  hairType?: string;
  job?: string;
  skinConcerns?: string[];
  hairConcerns?: string[];
}

// **جدید:** اینترفیس OnboardingData اینجا تعریف می‌شود
export interface OnboardingData {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  gender: string;
  age: string;
  comedones: string;
  redPimples: string;
  fineLines: string;
  foreheadNose: string;
  sideNose: string;
  cheeks: string;
  // این فیلدها برای سازگاری با کدهای قدیمی‌تر ممکن است لازم باشند
  name?: string;
  job?: string;
  skinType?: string;
  skinConcerns?: string[];
  hairType?: string;
  hairConcerns?: string[];
  currentSkinRoutine?: string;
  currentHairRoutine?: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'skin' | 'hair';
  completed: boolean;
  time: 'morning' | 'evening';
}