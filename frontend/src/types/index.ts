export interface Project {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  link: string;
  linkType: "Live" | "GitHub";
  featured: boolean;
}

export interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
  floatDistance: number; // negative px value e.g. -12
  floatDuration: number; // seconds e.g. 3.2
  floatDelay: number;    // seconds e.g. 0
}

export interface ContactLink {
  command: string;
  value: string;
  href: string;
}
