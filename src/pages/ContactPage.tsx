import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="bg-[#FDFCFB] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-20"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B58E72] mb-4 block">Concierge Desk</span>
              <h1 className="text-6xl font-serif font-black text-[#2D241E] leading-tight mb-8">Reach Out <br />to the <span className="text-[#B58E72]">Archive.</span></h1>
              <p className="text-xl text-[#2D241E]/60 max-w-md font-light italic">
                Have a question about a specific edition or looking to partner with us? Our team is standing by.
              </p>
            </motion.div>

            <div className="space-y-12">
               {[
                 { icon: <Mail />, label: "Email the Curator", value: "hello@enovel.store" },
                 { icon: <Phone />, label: "Private Line", value: "+1 (555) 888-BOOK" },
                 { icon: <MapPin />, label: "The Archive HQ", value: "42 Literature Lane, Oxford" },
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 items-center group">
                    <div className="w-14 h-14 bg-white border border-[#2D241E]/5 rounded-2xl flex items-center justify-center text-[#B58E72] group-hover:bg-[#2D241E] group-hover:text-white transition-all shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72] mb-1">{item.label}</p>
                      <p className="text-lg font-serif font-bold text-[#2D241E]">{item.value}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 lg:p-16 rounded-[3rem] shadow-2xl border border-[#2D241E]/5"
          >
            <h3 className="text-3xl font-serif font-bold text-[#2D241E] mb-10">Send a Transmission</h3>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72] ml-1">Your Name</label>
                    <input type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#B58E72] outline-none transition-all font-medium" placeholder="Juliet Capulet" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72] ml-1">Email</label>
                    <input type="email" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#B58E72] outline-none transition-all font-medium" placeholder="juliet@verona.com" />
                  </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72] ml-1">Subject</label>
                 <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#B58E72] outline-none transition-all font-medium appearance-none">
                    <option>General Inquiry</option>
                    <option>Author Partnership</option>
                    <option>Collector Support</option>
                    <option>Media Inquiry</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72] ml-1">Message</label>
                 <textarea rows={5} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#B58E72] outline-none transition-all font-medium resize-none" placeholder="What's on your mind?"></textarea>
               </div>
               <button className="w-full bg-[#1A1513] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#B58E72] transition-all shadow-xl group">
                 Send Message
                 <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
