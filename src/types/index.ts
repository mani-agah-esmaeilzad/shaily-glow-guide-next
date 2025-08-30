
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
    skinType?: string; 
  hairType?: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'skin' | 'hair';
  completed: boolean;
  time: 'morning' | 'evening';
}
