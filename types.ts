
export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  type?: 'timeline' | 'development'; // 'timeline' para los 3 primeros, 'development' para desarrollos
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  industry: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  isFounder?: boolean;
  image_url?: string;
}

export type ViewState = 'home' | 'products' | 'intelligence' | 'network' | 'about-us' | 'contact' | 'admin';

export interface NavItem {
  label: string;
  view: ViewState;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  result: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url?: string;
}
