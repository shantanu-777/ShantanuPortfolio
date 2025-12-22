import { motion } from 'motion/react';
import { useHero } from '../hooks/useStrapiData';

export function Footer() {
  const { data: heroData } = useHero();
  
  // Extract name from hero data
  const getName = (): string => {
    if (!heroData?.name) return 'Shantanu Modhave';
    // Remove "Hi, I'm" or similar prefixes
    const name = heroData.name.replace(/^(Hi,?\s*I'?m\s*)/i, '').trim();
    return name || 'Shantanu Modhave';
  };

  const displayName = getName();
  const title = heroData?.title || 'AI & ML Engineer';

  return (
    <footer className="bg-secondary/50 py-12 border-t">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-2"
        >
          <div className="text-2xl tracking-tight font-semibold">{displayName}</div>
          <div className="text-sm text-muted-foreground">
            {title}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}