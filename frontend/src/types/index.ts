export interface Project {
  number: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  stack: string[];
  link?: string;
  linkType?: "Live" | "GitHub";
  status: "published" | "pending";
}
