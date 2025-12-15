
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { Trash2, Plus, Edit, Save, X, Terminal, Users, Box, MessageSquare, Building2 } from 'lucide-react';
import { Service, BlogPost, Partner, Testimonial, TeamMember } from '../../types';

type AdminTab = 'blogs' | 'partners' | 'products' | 'testimonials' | 'industries' | 'team';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Contraseña del dashboard - Desde variable de entorno o fallback
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Elevate2024!Secure';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-md border border-emerald-900/50 bg-neutral-900/20 p-8 backdrop-blur-md">
           <h1 className="font-display text-2xl text-emerald-500 mb-6 tracking-widest">ACCESO AL SISTEMA</h1>
           <input 
             type="password" 
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             onKeyDown={(e) => {
               if (e.key === 'Enter' && password === ADMIN_PASSWORD) {
                 setIsAuthenticated(true);
               }
             }}
             className="w-full bg-black border border-gray-800 p-4 text-emerald-500 font-mono mb-4 focus:border-emerald-500 outline-none"
             placeholder="INGRESAR_CLAVE"
           />
           <button 
             onClick={() => { if(password === ADMIN_PASSWORD) setIsAuthenticated(true) }}
             className="w-full bg-emerald-900/20 border border-emerald-500/50 text-emerald-500 py-3 font-mono hover:bg-emerald-500 hover:text-black transition-all"
           >
             AUTENTICAR
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-12 border-b border-white/10 pb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-4xl mb-2">CENTRO DE COMANDO</h1>
            <div className="flex items-center gap-2 text-emerald-500 text-xs">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              ACCESO DE ESCRITURA CONCEDIDO
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} label="SERVICIOS" icon={<Box size={16}/>} />
            <TabButton active={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')} label="BLOGS" icon={<Terminal size={16}/>} />
            <TabButton active={activeTab === 'partners'} onClick={() => setActiveTab('partners')} label="SOCIOS" icon={<Users size={16}/>} />
            <TabButton active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} label="TESTIMONIOS" icon={<MessageSquare size={16}/>} />
            <TabButton active={activeTab === 'industries'} onClick={() => setActiveTab('industries')} label="INDUSTRIAS" icon={<Building2 size={16}/>} />
            <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} label="EQUIPO" icon={<Users size={16}/>} />
          </div>
        </header>

        <main className="min-h-[60vh]">
            <AnimatePresence mode="wait">
                {activeTab === 'products' && <ProductManager key="prod" />}
                {activeTab === 'blogs' && <BlogManager key="blog" />}
                {activeTab === 'partners' && <PartnerManager key="part" />}
                {activeTab === 'testimonials' && <TestimonialManager key="test" />}
                {activeTab === 'industries' && <IndustryManager key="ind" />}
                {activeTab === 'team' && <TeamManager key="team" />}
            </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 border transition-all text-sm ${active ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-gray-800 hover:border-emerald-500 hover:text-emerald-500'}`}
  >
    {icon}
    <span className="font-bold tracking-wider">{label}</span>
  </button>
);

// --- PRODUCT MANAGER ---
const ProductManager = () => {
  const { products, deleteProduct, addProduct, updateProduct } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    price: '',
    features: []
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', features: [] });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.price) return;
    
    const newProduct: Service = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: formData.price,
      features: formData.features || []
    };

    if (editingId) {
      updateProduct(editingId, newProduct);
    } else {
      addProduct(newProduct);
    }
    resetForm();
  };

  const startEdit = (product: Service) => {
    setFormData(product);
    setEditingId(product.id);
    setIsAdding(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl text-gray-400">/ MNT / SERVICIOS</h2>
        <button onClick={() => { resetForm(); setIsAdding(true); }} className="flex items-center gap-2 text-emerald-500 hover:text-white transition-colors">
            <Plus size={18} /> NUEVA ENTRADA
        </button>
      </div>

      {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-6 border border-emerald-500/30 bg-emerald-900/5 space-y-4"
          >
              <input 
                className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
                placeholder="Título del Servicio"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <textarea
                className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none min-h-[80px]"
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <input 
                className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
                placeholder="Precio (ej: USD 2,000 | 6 Horas)"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Características (una por línea):</label>
                <textarea
                  className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none min-h-[100px]"
                  placeholder="Mapeo de Procesos&#10;Análisis de Riesgos&#10;..."
                  value={formData.features?.join('\n') || ''}
                  onChange={(e) => setFormData({...formData, features: e.target.value.split('\n').filter(f => f.trim())})}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors">
                  <Save size={16} className="inline mr-2" />
                  {editingId ? 'ACTUALIZAR' : 'CONFIRMAR'}
                </button>
                <button onClick={resetForm} className="px-4 py-2 border border-gray-700 hover:border-gray-500 transition-colors">
                  <X size={16} className="inline mr-2" />
                  CANCELAR
              </button>
          </div>
          </motion.div>
      )}

      <div className="grid gap-4">
        {products.map(p => (
          <div key={p.id} className="flex justify-between items-start p-6 border border-white/5 bg-white/5 hover:border-white/20 transition-all">
            <div className="flex-1">
              <div className="font-display text-xl mb-1">{p.title}</div>
              <div className="text-xs text-gray-500 uppercase mb-2">{p.price}</div>
              <div className="text-sm text-gray-400 mb-2">{p.description}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {p.features.map((f, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-gray-800 rounded">{f}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-4 ml-4">
              <button onClick={() => startEdit(p)} className="text-gray-500 hover:text-emerald-500 transition-colors">
                <Edit size={18} />
              </button>
              <button onClick={() => deleteProduct(p.id)} className="text-red-900 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- BLOG MANAGER ---
const BlogManager = () => {
  const { blogs, deleteBlog, addBlog, updateBlog } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    image: '',
    date: '',
    readTime: '',
    category: '',
    slug: ''
  });

  const resetForm = () => {
    setFormData({ title: '', excerpt: '', image: '', date: '', readTime: '', category: '', slug: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.title || !formData.excerpt || !formData.image) return;
    
    const newBlog: BlogPost = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      image: formData.image,
      date: formData.date || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
      readTime: formData.readTime || '5 MIN LECTURA',
      category: formData.category || 'GENERAL',
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-')
    };

    if (editingId) {
      updateBlog(editingId, newBlog);
    } else {
      addBlog(newBlog);
    }
    resetForm();
  };

  const startEdit = (blog: BlogPost) => {
    setFormData(blog);
    setEditingId(blog.id);
    setIsAdding(true);
  };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl text-gray-400">/ MNT / BLOGS</h2>
        <button onClick={() => { resetForm(); setIsAdding(true); }} className="flex items-center gap-2 text-emerald-500 hover:text-white transition-colors">
          <Plus size={18} /> NUEVO BLOG
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-6 border border-emerald-500/30 bg-emerald-900/5 space-y-4"
        >
          <input 
            className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
            placeholder="Título"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <textarea
            className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none min-h-[80px]"
            placeholder="Resumen/Excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          />
          <input 
            className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
            placeholder="URL de Imagen"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
              placeholder="Fecha (ej: OCT 12, 2025)"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
            <input 
              className="bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
              placeholder="Tiempo de lectura"
              value={formData.readTime}
              onChange={(e) => setFormData({...formData, readTime: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
              placeholder="Categoría"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
            <input 
              className="bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
              placeholder="Slug (URL)"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors">
              <Save size={16} className="inline mr-2" />
              {editingId ? 'ACTUALIZAR' : 'CONFIRMAR'}
            </button>
            <button onClick={resetForm} className="px-4 py-2 border border-gray-700 hover:border-gray-500 transition-colors">
              <X size={16} className="inline mr-2" />
              CANCELAR
                </button>
            </div>
        </motion.div>
      )}

            <div className="grid gap-4">
                {blogs.map(b => (
                    <div key={b.id} className="flex justify-between items-center p-6 border border-white/5 bg-white/5 hover:border-white/20 transition-all">
            <div className="flex items-center gap-6 flex-1">
              <div className="w-24 h-16 bg-gray-800 overflow-hidden relative flex-shrink-0">
                <img src={b.image} alt={b.title} className="opacity-50 w-full h-full object-cover" />
                            </div>
              <div className="flex-1">
                                <div className="font-display text-lg mb-1">{b.title}</div>
                <div className="text-xs text-emerald-500 uppercase mb-2">{b.category} // {b.date}</div>
                <div className="text-sm text-gray-400">{b.excerpt}</div>
                            </div>
                        </div>
            <div className="flex gap-4 ml-4">
              <button onClick={() => startEdit(b)} className="text-gray-500 hover:text-emerald-500 transition-colors">
                <Edit size={18} />
              </button>
              <button onClick={() => deleteBlog(b.id)} className="text-red-900 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// --- PARTNER MANAGER ---
const PartnerManager = () => {
  const { partners, deletePartner, addPartner, updatePartner } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState('');

  const handleSave = () => {
    if (!partnerName.trim()) return;
    
    if (editingId) {
      updatePartner(editingId, { id: editingId, name: partnerName });
    } else {
      addPartner({ id: Date.now().toString(), name: partnerName });
    }
    setPartnerName('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (partner: Partner) => {
    setPartnerName(partner.name);
    setEditingId(partner.id);
    setIsAdding(true);
  };

     return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl text-gray-400">/ MNT / SOCIOS</h2>
                <button 
          onClick={() => { setPartnerName(''); setEditingId(null); setIsAdding(true); }}
                    className="flex items-center gap-2 text-emerald-500 hover:text-white transition-colors"
                >
          <Plus size={18} /> NUEVO SOCIO
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-6 border border-emerald-500/30 bg-emerald-900/5"
        >
          <input 
            className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none mb-4"
            placeholder="Nombre del Socio"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors">
              <Save size={16} className="inline mr-2" />
              {editingId ? 'ACTUALIZAR' : 'CONFIRMAR'}
            </button>
            <button onClick={() => { setPartnerName(''); setIsAdding(false); setEditingId(null); }} className="px-4 py-2 border border-gray-700 hover:border-gray-500 transition-colors">
              <X size={16} className="inline mr-2" />
              CANCELAR
                </button>
            </div>
        </motion.div>
      )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {partners.map(p => (
          <div key={p.id} className="p-6 border border-white/5 bg-white/5 flex justify-between items-center hover:border-white/20 transition-all">
            <span className="font-display text-sm">{p.name}</span>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="text-gray-500 hover:text-emerald-500 transition-colors">
                <Edit size={14} />
              </button>
              <button onClick={() => deletePartner(p.id)} className="text-red-900 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// --- TESTIMONIAL MANAGER ---
const TestimonialManager = () => {
  const { testimonials, deleteTestimonial, addTestimonial, updateTestimonial } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    quote: '',
    author: '',
    role: '',
    company: '',
    industry: ''
  });

  const resetForm = () => {
    setFormData({ quote: '', author: '', role: '', company: '', industry: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.quote || !formData.author) return;
    
    const newTestimonial: Testimonial = {
      id: editingId || Date.now().toString(),
      quote: formData.quote,
      author: formData.author,
      role: formData.role || '',
      company: formData.company || '',
      industry: formData.industry || ''
    };

    if (editingId) {
      updateTestimonial(editingId, newTestimonial);
    } else {
      addTestimonial(newTestimonial);
    }
    resetForm();
  };

  const startEdit = (testimonial: Testimonial) => {
    setFormData(testimonial);
    setEditingId(testimonial.id);
    setIsAdding(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl text-gray-400">/ MNT / TESTIMONIOS</h2>
        <button onClick={() => { resetForm(); setIsAdding(true); }} className="flex items-center gap-2 text-emerald-500 hover:text-white transition-colors">
          <Plus size={18} /> NUEVO TESTIMONIO
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-6 border border-emerald-500/30 bg-emerald-900/5 space-y-4"
        >
          <textarea
            className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none min-h-[100px]"
            placeholder="Cita/Testimonio"
            value={formData.quote}
            onChange={(e) => setFormData({...formData, quote: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
              placeholder="Autor"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
            />
            <input 
              className="bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
              placeholder="Rol (ej: CTO)"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
              placeholder="Empresa"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
            <input 
              className="bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
              placeholder="Industria"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors">
              <Save size={16} className="inline mr-2" />
              {editingId ? 'ACTUALIZAR' : 'CONFIRMAR'}
            </button>
            <button onClick={resetForm} className="px-4 py-2 border border-gray-700 hover:border-gray-500 transition-colors">
              <X size={16} className="inline mr-2" />
              CANCELAR
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4">
        {testimonials.map(t => (
          <div key={t.id} className="flex justify-between items-start p-6 border border-white/5 bg-white/5 hover:border-white/20 transition-all">
            <div className="flex-1">
              <div className="text-lg mb-2 italic text-gray-300">"{t.quote}"</div>
              <div className="text-sm text-gray-400">
                <span className="font-bold">{t.author}</span> - {t.role} @ {t.company}
                {t.industry && <span className="text-emerald-500 ml-2">({t.industry})</span>}
              </div>
            </div>
            <div className="flex gap-4 ml-4">
              <button onClick={() => startEdit(t)} className="text-gray-500 hover:text-emerald-500 transition-colors">
                <Edit size={18} />
              </button>
              <button onClick={() => deleteTestimonial(t.id)} className="text-red-900 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- INDUSTRY MANAGER ---
const IndustryManager = () => {
  const { industries, deleteIndustry, addIndustry, updateIndustry } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [industryName, setIndustryName] = useState('');

  const handleSave = () => {
    if (!industryName.trim()) return;
    
    if (editingIndex !== null) {
      updateIndustry(editingIndex, industryName);
    } else {
      addIndustry(industryName);
    }
    setIndustryName('');
    setIsAdding(false);
    setEditingIndex(null);
  };

  const startEdit = (index: number) => {
    setIndustryName(industries[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl text-gray-400">/ MNT / INDUSTRIAS</h2>
        <button 
          onClick={() => { setIndustryName(''); setEditingIndex(null); setIsAdding(true); }}
          className="flex items-center gap-2 text-emerald-500 hover:text-white transition-colors"
        >
          <Plus size={18} /> NUEVA INDUSTRIA
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-6 border border-emerald-500/30 bg-emerald-900/5"
        >
          <input 
            className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none mb-4"
            placeholder="Nombre de la Industria"
            value={industryName}
            onChange={(e) => setIndustryName(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors">
              <Save size={16} className="inline mr-2" />
              {editingIndex !== null ? 'ACTUALIZAR' : 'CONFIRMAR'}
            </button>
            <button onClick={() => { setIndustryName(''); setIsAdding(false); setEditingIndex(null); }} className="px-4 py-2 border border-gray-700 hover:border-gray-500 transition-colors">
              <X size={16} className="inline mr-2" />
              CANCELAR
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {industries.map((industry, index) => (
          <div key={index} className="p-6 border border-white/5 bg-white/5 flex justify-between items-center hover:border-white/20 transition-all">
            <span className="font-display text-sm">{industry}</span>
            <div className="flex gap-2">
              <button onClick={() => startEdit(index)} className="text-gray-500 hover:text-emerald-500 transition-colors">
                <Edit size={14} />
              </button>
              <button onClick={() => deleteIndustry(index)} className="text-red-900 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- TEAM MANAGER ---
const TeamManager = () => {
  const { teamMembers, deleteTeamMember, addTeamMember, updateTeamMember } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    bio: '',
    isFounder: false,
  });

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', isFounder: false });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name?.trim() || !formData.role?.trim() || !formData.bio?.trim()) return;
    
    const newMember: TeamMember = {
      id: editingId || `team-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      bio: formData.bio,
      isFounder: formData.isFounder || false,
    };

    if (editingId) {
      updateTeamMember(editingId, newMember);
    } else {
      addTeamMember(newMember);
    }
    resetForm();
  };

  const startEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      isFounder: member.isFounder || false,
    });
    setEditingId(member.id);
    setIsAdding(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl text-gray-400">/ MNT / EQUIPO</h2>
        <button 
          onClick={() => { resetForm(); setIsAdding(true); }}
          className="flex items-center gap-2 text-emerald-500 hover:text-white transition-colors"
        >
          <Plus size={18} /> NUEVO MIEMBRO
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-6 border border-emerald-500/30 bg-emerald-900/5"
        >
          <div className="grid gap-4 mb-4">
            <input 
              className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
              placeholder="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input 
              className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
              placeholder="Rol / Posición"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            <textarea 
              className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:border-emerald-500 outline-none min-h-[80px]"
              placeholder="Biografía"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input 
                type="checkbox"
                checked={formData.isFounder || false}
                onChange={(e) => setFormData({ ...formData, isFounder: e.target.checked })}
                className="w-4 h-4 accent-emerald-500"
              />
              <span>Es Fundador</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors">
              <Save size={16} className="inline mr-2" />
              {editingId ? 'ACTUALIZAR' : 'CONFIRMAR'}
            </button>
            <button onClick={resetForm} className="px-4 py-2 border border-gray-700 hover:border-gray-500 transition-colors">
              <X size={16} className="inline mr-2" />
              CANCELAR
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4">
        {teamMembers.map(m => (
          <div key={m.id} className="flex justify-between items-start p-6 border border-white/5 bg-white/5 hover:border-white/20 transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-display text-lg text-white">{m.name}</span>
                {m.isFounder && (
                  <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 text-xs font-mono uppercase">
                    FUNDADOR
                  </span>
                )}
              </div>
              <div className="text-sm text-emerald-500 mb-2 font-mono uppercase">{m.role}</div>
              <div className="text-sm text-gray-400">{m.bio}</div>
            </div>
            <div className="flex gap-4 ml-4">
              <button onClick={() => startEdit(m)} className="text-gray-500 hover:text-emerald-500 transition-colors">
                <Edit size={18} />
              </button>
              <button onClick={() => deleteTeamMember(m.id)} className="text-red-900 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

