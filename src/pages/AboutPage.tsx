import { motion } from 'motion/react';
import { BookOpen, Award, Users, Shield } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="bg-[#FDFCFB] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-24"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B58E72] mb-4 block">Since 2026</span>
          <h1 className="text-6xl md:text-8xl font-serif font-black text-[#2D241E] leading-none mb-10">Our <br /><span className="italic font-light text-[#B58E72]">Manifesto.</span></h1>
          <p className="text-xl text-[#2D241E]/60 leading-relaxed font-light italic">
            "eNovel was born from a simple observation: the digital transformation of literature lost its soul. We are here to reclaim it."
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
          <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1000" 
              alt="Team" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl font-serif font-bold text-[#2D241E] mb-8">The Bibliophile Standard</h2>
            <p className="text-[#2D241E]/70 leading-relaxed mb-6 font-medium">
              We don't just sell books; we curate experiences. Every novel on our platform is verified for quality and originality. We empower independent authors by giving them a premium stage to showcase their life's work.
            </p>
            <p className="text-[#2D241E]/70 leading-relaxed mb-10 font-medium">
              Our community is built on the pillars of respect for the written word and the pursuit of intellectual growth. Whether you're a first-time reader or a seasoned collector, you belong here.
            </p>
            <div className="grid grid-cols-2 gap-8">
               <div>
                  <h4 className="text-2xl font-serif font-bold text-[#2D241E]">50k+</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72]">Active Collectors</p>
               </div>
               <div>
                  <h4 className="text-2xl font-serif font-bold text-[#2D241E]">12k</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72]">Verified Authors</p>
               </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: <BookOpen />, title: "Curated Content", desc: "Hand-picked literary excellence." },
            { icon: <Award />, title: "Author First", desc: "Supporting independent creators." },
            { icon: <Users />, title: "Elite Community", desc: "A network of like-minded dreamers." },
            { icon: <Shield />, title: "Authenticity", desc: "Verified editions and data security." },
          ].map((feature, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               viewport={{ once: true }}
               className="p-10 bg-white border border-[#2D241E]/5 rounded-[2.5rem] hover:shadow-xl transition-all"
            >
               <div className="w-12 h-12 bg-[#2D241E] text-white flex items-center justify-center rounded-2xl mb-6">
                 {feature.icon}
               </div>
               <h4 className="text-lg font-serif font-bold text-[#2D241E] mb-3">{feature.title}</h4>
               <p className="text-xs text-[#2D241E]/50 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
