import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutContactPage: React.FC<{ initialSection?: 'about' | 'contact' }> = ({
  initialSection = 'about',
}) => {
  const { businessInfo, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'about' | 'contact'>(initialSection);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Form incomplete', 'Please fill in all required fields.', 'error');
      return;
    }
    setIsSent(true);
    showToast('Message Sent', `Thank you ${name}! Our team will get back to you within 2 business hours.`, 'success');
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setIsSent(false);
    }, 4000);
  };

  const openWhatsApp = () => {
    const cleanNumber = businessInfo.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${businessInfo.name}! I am contacting you through the website contact desk.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Tab Switcher */}
      <div className="flex items-center justify-center mb-10">
        <div className="bg-stone-200/80 p-1.5 rounded-2xl flex items-center gap-1">
          <button
            id="tab-about-btn"
            onClick={() => setActiveTab('about')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            About Us
          </button>
          <button
            id="tab-contact-btn"
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'contact'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Contact & Location
          </button>
        </div>
      </div>

      {activeTab === 'about' ? (
        <div className="space-y-12">
          {/* Hero Story */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Our Philosophy
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Engineering Daily Objects into Precision Instruments
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {businessInfo.aboutStory}
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-stone-900 text-lg">Material Honesty</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We reject hollow plastics in favor of aerospace grade 5 titanium, CNC machined anodized aluminum, and sapphire crystal glass.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-bold text-stone-900 text-lg">Uncompromising Quality</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every unit undergoes rigorous acoustic, thermal, and mechanical stress checks before leaving our distribution centers.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-stone-900 text-lg">Direct Customer Care</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                No automated phone trees. Instant WhatsApp and hotline access directly with our technical product consultants.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Contact Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Info, Address, Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-stone-900 mb-1">Get in Touch</h2>
                <p className="text-xs text-stone-500">
                  We are available Mon–Sat for consultations, corporate orders, and product assistance.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-900">Direct Telephone Desk</span>
                    <a
                      id="contact-page-phone-link"
                      href={`tel:${businessInfo.phone}`}
                      className="text-stone-600 hover:text-stone-900 font-semibold"
                    >
                      {businessInfo.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-200">
                    <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-900">WhatsApp Instant Desk</span>
                    <button
                      id="contact-page-whatsapp-btn"
                      onClick={openWhatsApp}
                      className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      Chat with us ({businessInfo.whatsappNumber})
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-900">Official Inquiries & Support</span>
                    <a
                      href={`mailto:${businessInfo.email}`}
                      className="text-stone-600 hover:text-stone-900 font-semibold"
                    >
                      {businessInfo.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-900">Headquarters & Showroom</span>
                    <p className="text-stone-600 leading-snug">
                      {businessInfo.address}
                      <br />
                      {businessInfo.city}, {businessInfo.country}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-900">Operating Hours</span>
                    <p className="text-stone-600">{businessInfo.hours}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-stone-100">
                <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Follow & Connect
                </span>
                <div className="flex items-center space-x-2">
                  <a
                    href={businessInfo.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={businessInfo.socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={businessInfo.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                    title="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={businessInfo.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Map Card Preview */}
            <div className="bg-white rounded-3xl border border-stone-200 p-4 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-stone-900">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Showroom Map Location</span>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${businessInfo.address}, ${businessInfo.city}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="h-44 w-full rounded-2xl bg-stone-100 relative overflow-hidden border border-stone-200">
                <iframe
                  title="Business Location Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${businessInfo.address}, ${businessInfo.city}`
                  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-1">Send a Direct Message</h2>
              <p className="text-xs text-stone-500 mb-6">
                Have questions regarding specifications, bulk orders, or shipping? Reach out directly.
              </p>

              {isSent ? (
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-stone-900 text-base">Inquiry Dispatched!</h3>
                  <p className="text-xs text-stone-600">
                    A specialist from {businessInfo.name} will reach out to you within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-form-name"
                        type="text"
                        required
                        placeholder="Alex Hayes"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-form-email"
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                      <input
                        id="contact-form-phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Inquiry Subject</label>
                      <input
                        id="contact-form-subject"
                        type="text"
                        placeholder="e.g. Bulk studio order pricing"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Message / Question <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-form-message"
                      rows={4}
                      required
                      placeholder="How can our technical team assist you?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                    />
                  </div>

                  <button
                    id="contact-form-submit-btn"
                    type="submit"
                    className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Customer Support</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
