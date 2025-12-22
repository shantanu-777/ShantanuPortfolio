import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Linkedin, Github } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { useContactInformation, useHero } from '../hooks/useStrapiData';
import { getIcon } from '../utils/iconMapper';

export function ContactSection() {
  const { data: contactInfo } = useContactInformation();
  const { data: heroData } = useHero();
  
  // Debug: Log contact info and hero data
  console.log('Contact info from Strapi:', contactInfo);
  console.log('Hero data from Strapi:', heroData);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get recipient email from Strapi or use fallback
      const recipientEmail = contactInfo?.email || 'shantanumodhave@gmail.com';
      
      // Use EmailJS to send email
      // First, try to use EmailJS if configured
      const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
      if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
        // Dynamic import of EmailJS
        const emailjs = await import('@emailjs/browser');
        
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          to_email: recipientEmail,
          message: formData.message,
          reply_to: formData.email,
        };
        
        await emailjs.send(
          emailjsServiceId,
          emailjsTemplateId,
          templateParams,
          emailjsPublicKey
        );
        
        toast.success('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitting(false);
      } else {
        // Fallback to mailto if EmailJS is not configured
        const subject = encodeURIComponent(`Portfolio Contact: ${formData.name}`);
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );
        
        window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
        toast.success('Opening your email client... Please send the message!');
        
        setTimeout(() => {
          setFormData({ name: '', email: '', message: '' });
          setIsSubmitting(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Custom Kaggle Icon Component
  const KaggleIcon = ({ className }: { className?: string }) => (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
    >
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.493c0-.236.118-.353.354-.353h2.431c.234 0 .351.117.351.353v8.412l6.367-6.037c.117-.129.267-.194.449-.194h3.271c.117 0 .2.024.247.071.047.047.059.111.035.188-.023.055-.058.129-.105.199l-4.918 5.247 5.672 7.392c.046.082.070.164.070.235z"/>
    </svg>
  );

  // Get social links from Strapi (from Hero or Contact Information)
  const getSocialLinks = () => {
    // Try to get from contact info first, then from hero
    let links = contactInfo?.socialLinks || heroData?.socialLinks || [];
    
    // Handle case where links might be nested or not an array
    if (!Array.isArray(links)) {
      links = [];
    }
    
    if (links.length === 0) {
      return [];
    }
    
    return links.map((link: any) => {
      // Handle different Strapi response formats
      const platform = link.platform || link.name || '';
      const url = link.url || link.href || '';
      const iconName = link.icon || platform;
      
      let IconComponent = Linkedin; // default
      
      // Map icon names to components
      if (iconName === 'LinkedIn' || iconName === 'Linkedin' || platform === 'LinkedIn' || platform === 'Linkedin') {
        IconComponent = Linkedin;
      } else if (iconName === 'GitHub' || iconName === 'Github' || platform === 'GitHub' || platform === 'Github') {
        IconComponent = Github;
      } else if (iconName === 'Kaggle' || platform === 'Kaggle') {
        IconComponent = KaggleIcon;
      } else {
        IconComponent = getIcon(iconName) || Linkedin;
      }
      
      return {
        name: platform,
        url: url,
        icon: IconComponent,
        color: platform === 'LinkedIn' || platform === 'Linkedin' ? 'hover:text-blue-600' :
               platform === 'GitHub' || platform === 'Github' ? 'hover:text-gray-900 dark:hover:text-gray-100' :
               platform === 'Kaggle' ? 'hover:text-blue-500' : 'hover:text-primary'
      };
    }).filter(link => link.url && link.name); // Filter out invalid links
  };

  const socialLinks = getSocialLinks();

  // Get contact info from Strapi
  const getContactInfo = () => {
    const info = [];
    
    // Email (required, always show)
    const email = contactInfo?.email || 'shantanumodhave@gmail.com';
    info.push({
      icon: Mail,
      label: 'Email',
      value: email,
      href: `mailto:${email}`
    });
    
    // Phone (optional)
    if (contactInfo?.phone) {
      info.push({
        icon: Phone,
        label: 'Phone',
        value: contactInfo.phone,
        href: `tel:${contactInfo.phone}`
      });
    }
    
    // Location (optional)
    if (contactInfo?.location) {
      info.push({
        icon: MapPin,
        label: 'Location',
        value: contactInfo.location,
        href: null
      });
    }
    
    return info;
  };

  const contactInfoList = getContactInfo();
  
  // Get contact message from Strapi
  const contactMessage = contactInfo?.contactMessage || 
    "I'm always interested in discussing new opportunities, collaborations, or just chatting about AI and machine learning. Feel free to reach out!";

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl mb-4">Get In Touch</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {contactMessage}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project or just say hello..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfoList.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                        {item.href ? (
                          <a 
                            href={item.href}
                            className="hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div>{item.value}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl mb-6">Connect With Me</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ 
                            duration: 0.6, 
                            delay: index * 0.1,
                            scale: { type: "spring", stiffness: 300, damping: 20 }
                          }}
                          viewport={{ once: true }}
                          className={`w-12 h-12 bg-muted rounded-full flex items-center justify-center transition-colors ${social.color}`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="sr-only">{social.name}</span>
                        </motion.a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}