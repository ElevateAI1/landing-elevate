import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';

interface BlogPostPageProps {
  slug: string;
  onBack?: () => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onBack }) => {
  const { blogs } = useData();
  const post = blogs.find(b => b.slug === slug);

  useEffect(() => {
    // Update document title and meta tags for SEO
    if (post) {
      document.title = `${post.title} | Elevate AI`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = post.excerpt;
        document.head.appendChild(meta);
      }

      // Update Open Graph tags
      const updateOrCreateMeta = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (meta) {
          meta.setAttribute('content', content);
        } else {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      };

      updateOrCreateMeta('og:title', post.title);
      updateOrCreateMeta('og:description', post.excerpt);
      updateOrCreateMeta('og:image', post.image);
      updateOrCreateMeta('og:type', 'article');
      updateOrCreateMeta('og:url', window.location.href);

      // Twitter Card tags
      updateOrCreateMeta('twitter:card', 'summary_large_image');
      updateOrCreateMeta('twitter:title', post.title);
      updateOrCreateMeta('twitter:description', post.excerpt);
      updateOrCreateMeta('twitter:image', post.image);

      // Article structured data for SEO
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: post.date,
        author: {
          '@type': 'Organization',
          name: 'Elevate AI'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Elevate AI',
          logo: {
            '@type': 'ImageObject',
            url: window.location.origin + '/logo.png'
          }
        }
      };

      // Remove existing structured data script if any
      const existingScript = document.getElementById('blog-structured-data');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.id = 'blog-structured-data';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup: restore default title
      document.title = 'Elevate AI | Infrastructure';
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#080808] pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display text-emerald-500 mb-4">Artículo no encontrado</h1>
          <button
            onClick={onBack || (() => window.history.back())}
            className="mt-8 px-6 py-3 bg-emerald-500 text-black font-display font-bold hover:bg-emerald-400 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('URL copiada al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack || (() => window.history.back())}
          className="mb-8 flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors font-mono text-sm"
        >
          <ArrowLeft size={18} />
          Volver a Inteligencia
        </motion.button>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 font-mono text-xs tracking-widest uppercase">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400 font-mono text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-emerald-500" />
              <span>{post.readTime}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
            >
              <Share2 size={16} />
              Compartir
            </button>
          </div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 relative overflow-hidden rounded-lg border border-emerald-500/20"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-50" />
          </motion.div>

          {/* Article Content */}
          <div className="prose prose-invert prose-emerald max-w-none">
            <div className="font-mono text-gray-300 leading-relaxed space-y-6 text-lg">
              {/* Excerpt as lead paragraph */}
              <p className="text-xl text-emerald-200/90 first-letter:text-4xl first-letter:text-emerald-500 first-letter:float-left first-letter:mr-2 first-letter:font-bold">
                {post.excerpt}
              </p>

              {/* Main content - using placeholder for now, but this should come from the blog post data */}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              {/* Quote Block */}
              <div className="p-6 bg-emerald-900/10 border-l-4 border-emerald-500 my-8 italic text-emerald-200/80 font-display text-xl">
                "Critical infrastructure requires absolute certainty in output generation."
              </div>

              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>

              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl text-white mb-2">¿Te resultó útil este artículo?</h3>
                <p className="font-mono text-sm text-gray-400">Comparte con tu red</p>
              </div>
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-emerald-500 text-black font-display font-bold hover:bg-emerald-400 transition-colors flex items-center gap-2"
              >
                <Share2 size={18} />
                Compartir
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPostPage;

