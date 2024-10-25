export interface Difference {
    x: number;
    y: number;
    radius: number;
  }
  
  export interface Level {
    id: number;
    originalImage: string;
    modifiedImage: string;
    coverImage: string;
    differences: Difference[];
    isLocked?: boolean;
  }