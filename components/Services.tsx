
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface ServiceCardProps {
  service: any;
  index: number;
  buttonText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, buttonText }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      viewport={{ once: true }}
      className="group relative border border-white/10 bg-neutral-900/20 p-8 hover:bg-neutral-900/40 transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex flex-col h-full justify-between">
        <div>
           <div className="font-mono text-emerald-500 text-xs mb-4 uppercase tracking-widest">{service.price}</div>
           <h3 className="font-display text-2xl text-white mb-4">{service.title}</h3>
           <p className="font-mono text-gray-400 text-sm mb-8 leading-relaxed">{service.description}</p>
        </div>

        <ul className="space-y-3">
          {service.features.map((feature: string) => (
            <li key={feature} className="flex items-center gap-3 text-gray-300 font-mono text-sm">
              <Check className="w-4 h-4 text-emerald-500" />
              {feature}
            </li>
          ))}
        </ul>

        <button className="mt-8 w-full py-3 border border-white/20 text-white font-mono text-xs hover:bg-white hover:text-black transition-all">
          {buttonText}
        </button>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const { products } = useData();
  
  return (
    <section id="services" className="py-32 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <h2 className="font-display text-4xl md:text-6xl text-white mb-4">CAPACIDADES</h2>
          <div className="h-1 w-20 bg-emerald-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} buttonText="CONFIGURAR" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
