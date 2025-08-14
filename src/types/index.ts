
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: string;
  job: string;
  gender: string;
  skinType: string;
  skinConcerns: string[];
  hairType: string;
  hairConcerns: string[];
}

export interface Task {
  id: string;
  title: string;
  type: 'skin' | 'hair';
  completed: boolean;
  time: 'morning' | 'evening';
}
