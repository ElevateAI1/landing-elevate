
import { Service, Testimonial, BlogPost, Partner, NavItem } from './types';

const NAV_ITEMS_EN: NavItem[] = [
  { label: 'Home', view: 'home' },
  { label: 'Products', view: 'products' },
  { label: 'Intelligence', view: 'intelligence' },
  { label: 'Network', view: 'network' },
  { label: 'Contact', view: 'contact' },
];

const NAV_ITEMS_ES: NavItem[] = [
  { label: 'Inicio', view: 'home' },
  { label: 'Productos', view: 'products' },
  { label: 'Inteligencia', view: 'intelligence' },
  { label: 'Red', view: 'network' },
  { label: 'Contacto', view: 'contact' },
];

const SERVICES_EN: Service[] = [
  {
    id: 'audit',
    title: 'Strategic Audit',
    description: 'The entry point. A deep-dive operational analysis to map risks and opportunities.',
    price: 'USD 2,000 | 6 Hours',
    features: ['Process Mapping', 'Risk Analysis', 'AI Roadmap', 'Business Case ROI'],
    type: 'timeline',
  },
  {
    id: 'deploy',
    title: 'Embedded Deployment',
    description: 'Forward-deployed engineering teams building custom architecture within your ecosystem.',
    price: 'Custom Pricing',
    features: ['Dedicated Team', 'Legacy Integration', 'Custom Dev', 'Tech Transfer'],
    type: 'timeline',
  },
  {
    id: 'gov',
    title: 'AI Governance',
    description: 'Compliance-by-design frameworks ensuring your AI remains an asset, not a liability.',
    price: 'Retainer Model',
    features: ['Compliance Framework', 'Continuous Audit', 'Policy Ops', 'Exec Reporting'],
    type: 'timeline',
  },
];

const SERVICES_ES: Service[] = [
  {
    id: 'audit',
    title: 'Auditoría Estratégica',
    description: 'El punto de entrada. Un análisis operativo profundo para mapear riesgos y oportunidades.',
    price: 'USD 2,000 | 6 Horas',
    features: ['Mapeo de Procesos', 'Análisis de Riesgos', 'Hoja de Ruta IA', 'ROI de Caso de Negocio'],
    type: 'timeline',
  },
  {
    id: 'deploy',
    title: 'Despliegue Embebido',
    description: 'Equipos de ingeniería desplegados construyendo arquitectura personalizada dentro de su ecosistema.',
    price: 'Precio Personalizado',
    features: ['Equipo Dedicado', 'Integración Legacy', 'Desarrollo Custom', 'Transferencia Tecnológica'],
    type: 'timeline',
  },
  {
    id: 'gov',
    title: 'Gobernanza de IA',
    description: 'Marcos de cumplimiento por diseño asegurando que su IA siga siendo un activo, no un pasivo.',
    price: 'Modelo de Retención',
    features: ['Marco de Cumplimiento', 'Auditoría Continua', 'Ops de Políticas', 'Reportes Ejecutivos'],
    type: 'timeline',
  },
];

const TESTIMONIALS_EN: Testimonial[] = [
  {
    id: '1',
    quote: "They didn't just build a model; they rebuilt our entire data ingestion workflow to be ISO compliant.",
    author: "Roberto M.",
    role: "CTO",
    company: "FinTech Secure",
    industry: "Finance"
  },
  {
    id: '2',
    quote: "The strategic audit saved us six months of development time on a dead-end architecture.",
    author: "Sarah J.",
    role: "VP Ops",
    company: "AgriData Global",
    industry: "Agroindustry"
  },
  {
    id: '3',
    quote: "Finally, an AI partner that understands regulatory burden is not an afterthought.",
    author: "Dr. A. Chen",
    role: "Director",
    company: "MediCore Systems",
    industry: "Health"
  }
];

const TESTIMONIALS_ES: Testimonial[] = [
  {
    id: '1',
    quote: "No solo construyeron un modelo; reconstruyeron todo nuestro flujo de ingestión de datos para cumplir con ISO.",
    author: "Roberto M.",
    role: "CTO",
    company: "FinTech Secure",
    industry: "Finanzas"
  },
  {
    id: '2',
    quote: "La auditoría estratégica nos ahorró seis meses de desarrollo en una arquitectura sin salida.",
    author: "Sarah J.",
    role: "VP Ops",
    company: "AgriData Global",
    industry: "Agroindustria"
  },
  {
    id: '3',
    quote: "Finalmente, un socio de IA que entiende que la carga regulatoria no es algo secundario.",
    author: "Dr. A. Chen",
    role: "Director",
    company: "MediCore Systems",
    industry: "Salud"
  }
];

const BLOG_POSTS_EN: BlogPost[] = [
  {
    id: '1',
    title: 'The Death of Black Box Algorithms in FinTech',
    excerpt: 'Why explainability is no longer a feature, but a regulatory requirement for 2026.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
    date: 'OCT 12, 2025',
    readTime: '8 MIN READ',
    category: 'REGULATION',
    slug: 'death-of-black-box'
  },
  {
    id: '2',
    title: 'Synthetic Data: The Ethical Loophole?',
    excerpt: 'Navigating the gray areas of training models on generated patient data in healthcare.',
    image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1000',
    date: 'SEP 28, 2025',
    readTime: '12 MIN READ',
    category: 'ETHICS',
    slug: 'synthetic-data-ethics'
  },
  {
    id: '3',
    title: 'Operationalizing Large Language Models on Premise',
    excerpt: 'A technical guide to air-gapped deployment for defense contractors.',
    image: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=1000',
    date: 'SEP 15, 2025',
    readTime: '25 MIN READ',
    category: 'INFRASTRUCTURE',
    slug: 'llm-on-premise'
  },
  {
    id: '4',
    title: 'Auditing the Auditor: Automated Governance',
    excerpt: 'How we built a self-correcting compliance layer for a Tier-1 Bank.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
    date: 'AUG 30, 2025',
    readTime: '6 MIN READ',
    category: 'CASE STUDY',
    slug: 'automated-governance'
  }
];

const BLOG_POSTS_ES: BlogPost[] = [
  {
    id: '1',
    title: 'La Muerte de los Algoritmos de Caja Negra en FinTech',
    excerpt: 'Por qué la explicabilidad ya no es una característica, sino un requisito regulatorio para 2026.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
    date: 'OCT 12, 2025',
    readTime: '8 MIN LECTURA',
    category: 'REGULACIÓN',
    slug: 'death-of-black-box'
  },
  {
    id: '2',
    title: 'Datos Sintéticos: ¿El Vacío Legal Ético?',
    excerpt: 'Navegando las áreas grises de entrenar modelos con datos de pacientes generados en salud.',
    image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1000',
    date: 'SEP 28, 2025',
    readTime: '12 MIN LECTURA',
    category: 'ÉTICA',
    slug: 'synthetic-data-ethics'
  },
  {
    id: '3',
    title: 'Operacionalizando LLMs On-Premise',
    excerpt: 'Una guía técnica para el despliegue air-gapped para contratistas de defensa.',
    image: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=1000',
    date: 'SEP 15, 2025',
    readTime: '25 MIN LECTURA',
    category: 'INFRAESTRUCTURA',
    slug: 'llm-on-premise'
  },
  {
    id: '4',
    title: 'Auditando al Auditor: Gobernanza Automatizada',
    excerpt: 'Cómo construimos una capa de cumplimiento autocorrectiva para un Banco Tier-1.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
    date: 'AGO 30, 2025',
    readTime: '6 MIN LECTURA',
    category: 'CASO DE ESTUDIO',
    slug: 'automated-governance'
  }
];

const INDUSTRIES_EN = ["Finance", "Insurance", "Healthcare", "Logistics", "Retail", "Agro", "Education", "Defense"];
const INDUSTRIES_ES = ["Finanzas", "Seguros", "Salud", "Logística", "Retail", "Agro", "Educación", "Defensa"];

const PARTNERS: Partner[] = [
  { id: '1', name: 'NVIDIA INCEPTION' },
  { id: '2', name: 'GOOGLE CLOUD' },
  { id: '3', name: 'AWS PARTNER' },
  { id: '4', name: 'MICROSOFT AZURE' },
  { id: '5', name: 'DATABRICKS' },
  { id: '6', name: 'HUGGING FACE' },
  { id: '7', name: 'PINECONE' },
  { id: '8', name: 'LANGCHAIN' },
];

export const CONTENT = {
  en: {
    nav: NAV_ITEMS_EN,
    services: SERVICES_EN,
    testimonials: TESTIMONIALS_EN,
    blogPosts: BLOG_POSTS_EN,
    industries: INDUSTRIES_EN,
    partners: {
      title: "PARTNERS",
      list: PARTNERS
    },
    hero: {
      status: "SYSTEM STATUS: OPTIMAL",
      title_start: "ORDER FROM",
      title_chaos: "CHAOS",
      desc: "We architect high-compliance AI infrastructure for organizations that cannot afford to be wrong.",
      cta: "Deploy Strategy",
      scroll: "Scroll"
    },
    methodology: {
      title: "THE PROTOCOL",
      subtitle: "Three steps to transform risk into infrastructure.",
      steps: [
        {
          num: '01',
          title: 'Strategic Audit',
          subtitle: 'The Bootcamp (6H)',
          desc: 'We map the abyss. A deep-dive analysis of your risks, data readiness, and regulatory constraints. We deliver a roadmap, not slides.',
        },
        {
          num: '02',
          title: 'Embedded Deployment',
          subtitle: 'Forward Deployed',
          desc: 'Our engineers integrate directly into your operations. We build custom architecture that sits on your metal, in your cloud, securely.',
        },
        {
          num: '03',
          title: 'Governance & Scale',
          subtitle: 'Compliance by Design',
          desc: 'The job is not done at deploy. We install automated governance frameworks to ensure your AI behaves as regulations evolve.',
        }
      ]
    },
    capabilities: {
      title: "CAPABILITIES",
      button: "CONFIGURE"
    },
    intelligence: {
      title: "INTELLIGENCE",
      live: "LIVE FEED",
      access: "ACCESS FILE",
      swipe: "SWIPE DATA"
    },
    evidence: {
      title: "EVIDENCE",
      desc: "Trust is not given. It is audited. Verified outcomes from regulated sectors.",
      badge: "COMPLIANCE BADGE",
      badgeText: "ISO 27001 Certified Processes"
    },
    contact: {
      title: "INITIATE SEQUENCE",
      subtitle: "Are you ready to plan your infrastructure for 2026?",
      labels: {
        identity: "Identify Yourself",
        org: "Organization",
        comms: "Comms Channel",
        mission: "Mission Parameters"
      },
      placeholders: {
        name: "Name",
        org: "Company Name",
        email: "Corporate Email",
        brief: "Brief operational context..."
      },
      button: "Request Uplink",
      footer: {
        base: "BASED IN BUENOS AIRES",
        global: "OPERATING GLOBALLY",
        rights: "ELEVATE AI © 2025",
        infra: "SECURE INFRASTRUCTURE"
      }
    },
    problem: {
      highlight: "operational suicide",
      text1: "In 2025, deploying AI without governance is",
      text2: "The vendors want to sell you a black box. We are here to open it, inspect it, and rebuild it so it doesn't break your business."
    },
    nav_audit: "Book Audit"
  },
  es: {
    nav: NAV_ITEMS_ES,
    services: SERVICES_ES,
    testimonials: TESTIMONIALS_ES,
    blogPosts: BLOG_POSTS_ES,
    industries: INDUSTRIES_ES,
    partners: {
      title: "SOCIOS",
      list: PARTNERS
    },
    hero: {
      status: "ESTADO DEL SISTEMA: ÓPTIMO",
      title_start: "ORDEN DESDE EL",
      title_chaos: "CAOS",
      desc: "Diseñamos infraestructura de IA de alto cumplimiento para organizaciones que no pueden permitirse fallar.",
      cta: "Desplegar Estrategia",
      scroll: "Desplazar"
    },
    methodology: {
      title: "EL PROTOCOLO",
      subtitle: "Tres pasos para transformar riesgo en infraestructura.",
      steps: [
        {
          num: '01',
          title: 'Auditoría Estratégica',
          subtitle: 'El Bootcamp (6H)',
          desc: 'Mapeamos el abismo. Un análisis profundo de sus riesgos, preparación de datos y restricciones regulatorias. Entregamos una hoja de ruta, no diapositivas.',
        },
        {
          num: '02',
          title: 'Despliegue Embebido',
          subtitle: 'Despliegue Avanzado',
          desc: 'Nuestros ingenieros se integran directamente en sus operaciones. Construimos arquitectura personalizada que se asienta en su hardware, en su nube, de forma segura.',
        },
        {
          num: '03',
          title: 'Gobernanza y Escala',
          subtitle: 'Cumplimiento por Diseño',
          desc: 'El trabajo no termina en el despliegue. Instalamos marcos de gobernanza automatizados para asegurar que su IA se comporte conforme evolucionan las regulaciones.',
        }
      ]
    },
    capabilities: {
      title: "CAPACIDADES",
      button: "CONFIGURAR"
    },
    intelligence: {
      title: "INTELIGENCIA",
      live: "TRANSMISIÓN EN VIVO",
      access: "ACCEDER ARCHIVO",
      swipe: "DESLIZAR DATOS"
    },
    evidence: {
      title: "EVIDENCIA",
      desc: "La confianza no se da. Se audita. Resultados verificados de sectores regulados.",
      badge: "INSIGNIA DE CUMPLIMIENTO",
      badgeText: "Procesos Certificados ISO 27001"
    },
    contact: {
      title: "INICIAR SECUENCIA",
      subtitle: "¿Está listo para planificar su infraestructura para 2026?",
      labels: {
        identity: "Identifíquese",
        org: "Organización",
        comms: "Canal de Comunicación",
        mission: "Parámetros de Misión"
      },
      placeholders: {
        name: "Nombre",
        org: "Nombre de Empresa",
        email: "Email Corporativo",
        brief: "Breve contexto operativo..."
      },
      button: "Solicitar Enlace",
      footer: {
        base: "BASADO EN BUENOS AIRES",
        global: "OPERANDO GLOBALMENTE",
        rights: "ELEVATE AI © 2025",
        infra: "INFRAESTRUCTURA SEGURA"
      }
    },
    problem: {
      highlight: "suicidio operativo",
      text1: "En 2025, desplegar IA sin gobernanza es",
      text2: "Los proveedores quieren venderle una caja negra. Estamos aquí para abrirla, inspeccionarla y reconstruirla para que no rompa su negocio."
    },
    nav_audit: "Auditoría"
  }
};
