import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, BlogPost, Partner, Testimonial, TeamMember } from '../types';
import { CONTENT } from '../constants';
import { supabase } from '../lib/supabase';

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
  loading: boolean;
  addProduct: (item: Service) => Promise<void>;
  updateProduct: (id: string, item: Service) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBlog: (item: BlogPost) => Promise<void>;
  updateBlog: (id: string, item: BlogPost) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  addPartner: (item: Partner) => Promise<void>;
  updatePartner: (id: string, item: Partner) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  addTestimonial: (item: Testimonial) => Promise<void>;
  updateTestimonial: (id: string, item: Testimonial) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  addIndustry: (industry: string) => Promise<void>;
  updateIndustry: (index: number, industry: string) => Promise<void>;
  deleteIndustry: (index: number) => Promise<void>;
  addTeamMember: (item: TeamMember) => Promise<void>;
  updateTeamMember: (id: string, item: TeamMember) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Service[]>(INITIAL_PRODUCTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [industries, setIndustries] = useState<string[]>(INITIAL_INDUSTRIES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Supabase al iniciar
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    if (!supabase) {
      console.warn('⚠️ Supabase no está configurado. Los datos NO se guardarán permanentemente.');
      console.warn('📝 Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Vercel.');
      setLoading(false);
      return;
    }

    try {
      // Cargar products
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          product_features (
            feature_text,
            display_order
          )
        `)
        .order('display_order', { ascending: true });
      
      if (productsData && productsData.length > 0) {
        setProducts(productsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          type: p.type || 'timeline',
          features: (p.product_features || [])
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((f: any) => f.feature_text)
        })));
      }

      // Cargar blogs
      const { data: blogsData } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (blogsData && blogsData.length > 0) {
        setBlogs(blogsData.map((b: any) => ({
          id: b.id,
          title: b.title,
          excerpt: b.excerpt,
          image: b.image || '',
          date: b.date || '',
          readTime: b.read_time || '',
          category: b.category || '',
          slug: b.slug
        })));
      }

      // Cargar partners
      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (partnersData && partnersData.length > 0) {
        setPartners(partnersData.map((p: any) => ({
          id: p.id,
          name: p.name,
          logo_url: p.logo_url
        })));
      }

      // Cargar testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (testimonialsData && testimonialsData.length > 0) {
        setTestimonials(testimonialsData.map((t: any) => ({
          id: t.id,
          quote: t.quote,
          author: t.author,
          role: t.role || '',
          company: t.company || '',
          industry: t.industry || ''
        })));
      }

      // Cargar industries
      const { data: industriesData } = await supabase
        .from('industries')
        .select('name')
        .order('display_order', { ascending: true });
      
      if (industriesData && industriesData.length > 0) {
        setIndustries(industriesData.map((i: any) => i.name));
      }

      // Cargar team members
      const { data: teamData } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (teamData && teamData.length > 0) {
        setTeamMembers(teamData.map((t: any) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          bio: t.bio,
          isFounder: t.is_founder || false,
          image_url: t.image_url
        })));
      }
    } catch (error: any) {
      console.error('❌ Error al cargar datos desde Supabase:', error?.message || error);
      console.error('📝 Verifica que:');
      console.error('   1. Las tablas existan (ejecuta database/02_create_tables.sql)');
      console.error('   2. Las políticas RLS estén configuradas (ejecuta database/03_create_policies.sql)');
      console.error('   3. Las variables de entorno estén configuradas en Vercel');
    } finally {
      setLoading(false);
    }
  };

  // --- Blogs CRUD ---
  const addBlog = async (item: BlogPost) => {
    const previousBlogs = blogs;
    setBlogs([...blogs, item]);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            image: item.image,
            date: item.date,
            read_time: item.readTime,
            category: item.category,
            slug: item.slug
          });
        if (error) throw error;
      } catch (error) {
        console.error('Error adding blog:', error);
        setBlogs(previousBlogs);
      }
    }
  };

  const updateBlog = async (id: string, item: BlogPost) => {
    const previousBlogs = blogs;
    const updated = blogs.map(b => b.id === id ? item : b);
    setBlogs(updated);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: item.title,
            excerpt: item.excerpt,
            image: item.image,
            date: item.date,
            read_time: item.readTime,
            category: item.category,
            slug: item.slug
          })
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error updating blog:', error);
        setBlogs(previousBlogs);
      }
    }
  };

  const deleteBlog = async (id: string) => {
    const previousBlogs = blogs;
    const filtered = blogs.filter(b => b.id !== id);
    setBlogs(filtered);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting blog:', error);
        setBlogs(previousBlogs);
      }
    }
  };

  // --- Partners CRUD ---
  const addPartner = async (item: Partner) => {
    const previousPartners = partners;
    setPartners([...partners, item]);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('partners')
          .insert({
            id: item.id,
            name: item.name,
            logo_url: item.logo_url
          });
        if (error) throw error;
      } catch (error) {
        console.error('Error adding partner:', error);
        setPartners(previousPartners);
      }
    }
  };

  const updatePartner = async (id: string, item: Partner) => {
    const previousPartners = partners;
    const updated = partners.map(p => p.id === id ? item : p);
    setPartners(updated);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('partners')
          .update({
            name: item.name,
            logo_url: item.logo_url
          })
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error updating partner:', error);
        setPartners(previousPartners);
      }
    }
  };

  const deletePartner = async (id: string) => {
    const previousPartners = partners;
    const filtered = partners.filter(p => p.id !== id);
    setPartners(filtered);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('partners')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting partner:', error);
        setPartners(previousPartners);
      }
    }
  };

  // --- Testimonials CRUD ---
  const addTestimonial = async (item: Testimonial) => {
    const previousTestimonials = testimonials;
    setTestimonials([...testimonials, item]);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .insert({
            id: item.id,
            quote: item.quote,
            author: item.author,
            role: item.role,
            company: item.company,
            industry: item.industry
          });
        if (error) throw error;
      } catch (error) {
        console.error('Error adding testimonial:', error);
        setTestimonials(previousTestimonials);
      }
    }
  };

  const updateTestimonial = async (id: string, item: Testimonial) => {
    const previousTestimonials = testimonials;
    const updated = testimonials.map(t => t.id === id ? item : t);
    setTestimonials(updated);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .update({
            quote: item.quote,
            author: item.author,
            role: item.role,
            company: item.company,
            industry: item.industry
          })
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error updating testimonial:', error);
        setTestimonials(previousTestimonials);
      }
    }
  };

  const deleteTestimonial = async (id: string) => {
    const previousTestimonials = testimonials;
    const filtered = testimonials.filter(t => t.id !== id);
    setTestimonials(filtered);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        setTestimonials(previousTestimonials);
      }
    }
  };

  // --- Industries CRUD ---
  const addIndustry = async (industry: string) => {
    const previousIndustries = industries;
    setIndustries([...industries, industry]);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('industries')
          .insert({ name: industry });
        if (error) throw error;
      } catch (error) {
        console.error('Error adding industry:', error);
        setIndustries(previousIndustries);
      }
    }
  };

  const updateIndustry = async (index: number, industry: string) => {
    const previousIndustries = industries;
    const oldIndustry = industries[index];
    const newIndustries = [...industries];
    newIndustries[index] = industry;
    setIndustries(newIndustries);
    if (supabase) {
      try {
        // Necesitamos el ID de la industria, así que hacemos una búsqueda
        const { data } = await supabase
          .from('industries')
          .select('id')
          .eq('name', oldIndustry)
          .single();
        
        if (data) {
          const { error } = await supabase
            .from('industries')
            .update({ name: industry })
            .eq('id', data.id);
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error updating industry:', error);
        setIndustries(previousIndustries);
      }
    }
  };

  const deleteIndustry = async (index: number) => {
    const previousIndustries = industries;
    const industryToDelete = industries[index];
    const filtered = industries.filter((_, i) => i !== index);
    setIndustries(filtered);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('industries')
          .delete()
          .eq('name', industryToDelete);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting industry:', error);
        setIndustries(previousIndustries);
      }
    }
  };

  // --- Team Members CRUD ---
  const addTeamMember = async (item: TeamMember) => {
    const previousTeamMembers = teamMembers;
    setTeamMembers([...teamMembers, item]);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('team_members')
          .insert({
            id: item.id,
            name: item.name,
            role: item.role,
            bio: item.bio,
            is_founder: item.isFounder || false,
            image_url: item.image_url
          });
        if (error) throw error;
      } catch (error) {
        console.error('Error adding team member:', error);
        setTeamMembers(previousTeamMembers);
      }
    }
  };

  const updateTeamMember = async (id: string, item: TeamMember) => {
    const previousTeamMembers = teamMembers;
    const updated = teamMembers.map(t => t.id === id ? item : t);
    setTeamMembers(updated);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('team_members')
          .update({
            name: item.name,
            role: item.role,
            bio: item.bio,
            is_founder: item.isFounder || false,
            image_url: item.image_url
          })
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error updating team member:', error);
        setTeamMembers(previousTeamMembers);
      }
    }
  };

  const deleteTeamMember = async (id: string) => {
    const previousTeamMembers = teamMembers;
    const filtered = teamMembers.filter(t => t.id !== id);
    setTeamMembers(filtered);
    if (supabase) {
      try {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting team member:', error);
        setTeamMembers(previousTeamMembers);
      }
    }
  };

  // --- Products CRUD ---
  const addProduct = async (item: Service) => {
    const previousProducts = products;
    setProducts([...products, item]);
    if (supabase) {
      try {
        // Insertar producto
        const { data: productData, error: productError } = await supabase
          .from('products')
          .insert({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            type: item.type || 'timeline'
          })
          .select()
          .single();
        
        if (productError) throw productError;

        // Insertar features si existen
        if (item.features && item.features.length > 0 && productData) {
          const featuresToInsert = item.features.map((feature, index) => ({
            product_id: productData.id,
            feature_text: feature,
            display_order: index
          }));

          const { error: featuresError } = await supabase
            .from('product_features')
            .insert(featuresToInsert);
          
          if (featuresError) throw featuresError;
        }
      } catch (error) {
        console.error('Error adding product:', error);
        setProducts(previousProducts);
      }
    }
  };

  const updateProduct = async (id: string, item: Service) => {
    const previousProducts = products;
    const updated = products.map(p => p.id === id ? item : p);
    setProducts(updated);
    if (supabase) {
      try {
        // Actualizar producto
        const { error: productError } = await supabase
          .from('products')
          .update({
            title: item.title,
            description: item.description,
            price: item.price,
            type: item.type || 'timeline'
          })
          .eq('id', id);
        
        if (productError) throw productError;

        // Eliminar features antiguas
        const { error: deleteError } = await supabase
          .from('product_features')
          .delete()
          .eq('product_id', id);
        
        if (deleteError) throw deleteError;

        // Insertar nuevas features
        if (item.features && item.features.length > 0) {
          const featuresToInsert = item.features.map((feature, index) => ({
            product_id: id,
            feature_text: feature,
            display_order: index
          }));

          const { error: featuresError } = await supabase
            .from('product_features')
            .insert(featuresToInsert);
          
          if (featuresError) throw featuresError;
        }
      } catch (error) {
        console.error('Error updating product:', error);
        setProducts(previousProducts);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const previousProducts = products;
    const filtered = products.filter(p => p.id !== id);
    setProducts(filtered);
    if (supabase) {
      try {
        // Las features se eliminan automáticamente por CASCADE
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting product:', error);
        setProducts(previousProducts);
      }
    }
  };

  return (
    <DataContext.Provider value={{
      products, blogs, partners, testimonials, industries, teamMembers, loading,
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
