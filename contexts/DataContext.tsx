
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Service, BlogPost, Partner, Testimonial, TeamMember } from '../types';
import { CONTENT } from '../constants';

// Initial Data Loading from Constants (Using Spanish content)
const INITIAL_PRODUCTS = CONTENT.es.services;
const INITIAL_BLOGS = CONTENT.es.blogPosts;
const INITIAL_PARTNERS = CONTENT.es.partners.list;
const INITIAL_TESTIMONIALS = CONTENT.es.testimonials;
const INITIAL_INDUSTRIES = CONTENT.es.industries;
const INITIAL_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Fundador 1',
    role: 'CEO & Co-Fundador',
    bio: 'Experiencia en infraestructura de IA y cumplimiento regulatorio.',
    isFounder: true,
  },
  {
    id: '2',
    name: 'Fundador 2',
    role: 'CTO & Co-Fundador',
    bio: 'Arquitecto de sistemas de IA de alto rendimiento y seguridad.',
    isFounder: true,
  },
];

interface DataContextType {
  products: Service[];
  blogs: BlogPost[];
  partners: Partner[];
  testimonials: Testimonial[];
  industries: string[];
  teamMembers: TeamMember[];
  addProduct: (item: Service) => void;
  updateProduct: (id: string, item: Service) => void;
  deleteProduct: (id: string) => void;
  addBlog: (item: BlogPost) => void;
  updateBlog: (id: string, item: BlogPost) => void;
  deleteBlog: (id: string) => void;
  addPartner: (item: Partner) => void;
  updatePartner: (id: string, item: Partner) => void;
  deletePartner: (id: string) => void;
  addTestimonial: (item: Testimonial) => void;
  updateTestimonial: (id: string, item: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  addIndustry: (industry: string) => void;
  updateIndustry: (index: number, industry: string) => void;
  deleteIndustry: (index: number) => void;
  addTeamMember: (item: TeamMember) => void;
  updateTeamMember: (id: string, item: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Service[]>(INITIAL_PRODUCTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [industries, setIndustries] = useState<string[]>(INITIAL_INDUSTRIES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM);

  // --- Products CRUD ---
  const addProduct = (item: Service) => setProducts([...products, item]);
  const updateProduct = (id: string, item: Service) => {
    setProducts(products.map(p => p.id === id ? item : p));
  };
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  // --- Blogs CRUD ---
  const addBlog = (item: BlogPost) => setBlogs([...blogs, item]);
  const updateBlog = (id: string, item: BlogPost) => {
    setBlogs(blogs.map(b => b.id === id ? item : b));
  };
  const deleteBlog = (id: string) => setBlogs(blogs.filter(b => b.id !== id));

  // --- Partners CRUD ---
  const addPartner = (item: Partner) => setPartners([...partners, item]);
  const updatePartner = (id: string, item: Partner) => {
    setPartners(partners.map(p => p.id === id ? item : p));
  };
  const deletePartner = (id: string) => setPartners(partners.filter(p => p.id !== id));

  // --- Testimonials CRUD ---
  const addTestimonial = (item: Testimonial) => setTestimonials([...testimonials, item]);
  const updateTestimonial = (id: string, item: Testimonial) => {
    setTestimonials(testimonials.map(t => t.id === id ? item : t));
  };
  const deleteTestimonial = (id: string) => setTestimonials(testimonials.filter(t => t.id !== id));

  // --- Industries CRUD ---
  const addIndustry = (industry: string) => setIndustries([...industries, industry]);
  const updateIndustry = (index: number, industry: string) => {
    const newIndustries = [...industries];
    newIndustries[index] = industry;
    setIndustries(newIndustries);
  };
  const deleteIndustry = (index: number) => setIndustries(industries.filter((_, i) => i !== index));

  // --- Team Members CRUD ---
  const addTeamMember = (item: TeamMember) => setTeamMembers([...teamMembers, item]);
  const updateTeamMember = (id: string, item: TeamMember) => {
    setTeamMembers(teamMembers.map(t => t.id === id ? item : t));
  };
  const deleteTeamMember = (id: string) => setTeamMembers(teamMembers.filter(t => t.id !== id));

  return (
    <DataContext.Provider value={{
      products, blogs, partners, testimonials, industries, teamMembers,
      addProduct, updateProduct, deleteProduct,
      addBlog, updateBlog, deleteBlog,
      addPartner, updatePartner, deletePartner,
      addTestimonial, updateTestimonial, deleteTestimonial,
      addIndustry, updateIndustry, deleteIndustry,
      addTeamMember, updateTeamMember, deleteTeamMember
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
