"use client";

import { useState } from 'react';
import CustomerNavi from '../../../components/CustomerNavi/CustomerNavi';
import CustomerTabs from '../../../components/CustomerNavi/CustomerTabs';

import { 
  Phone, 
  Clock, 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  MapPin, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink 
} from 'lucide-react';

type SupportTab = 'CONTACT US' | 'WORKING HOURS' | 'HELP INFO' | 'FAQ';

export default function CustomerSupportPage() {
  const [activeTab, setActiveTab] = useState<SupportTab>('CONTACT US');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleLogout = () => {
    alert("Logged out!");
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    { 
      q: "How do I reset password?", 
      a: "Navigate to the Profile section tab, select 'Change Password' from the left sidebar interface configuration panel, provide your validation keys, and save changes." 
    },
    { 
      q: "How do I contact support?", 
      a: "You can open an automated email matrix stream using our support channel parameters or call the baseline office line directly listed on the 'Contact Us' tab panel parameters." 
    },
    { 
      q: "How do I check my project status?", 
      a: "Your primary telemetry records are mapped on the 'Projects' main workspace interface layer. Click any project container layout element to launch milestone deep dives." 
    },
    { 
      q: "What if I find a bug?", 
      a: "Please take comprehensive high-resolution terminal snapshot logs or console dump details and upload them directly via your communications sync matrix links or email arrays." 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      {/* Imported Shared Navigation */}
      <CustomerNavi 
        customerName="Customer User" 
        role="user" 
        onLogout={handleLogout} 
      />
      <CustomerTabs activeTab="Support" />

      {/* Main Dashboard Content */}
      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Support Title Header Area */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-sm text-gray-400 mt-1">
            Need deployment or layout alignment help? Explore quick channels here
          </p>
        </div>

        {/* Central Switchboard Navigation Bar Wrapper */}
        <div className="bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm grid grid-cols-2 md:flex md:items-center justify-between gap-1">
          {(['CONTACT US', 'WORKING HOURS', 'HELP INFO', 'FAQ'] as SupportTab[]).map((tab) => {
            const getIcon = () => {
              if (tab === 'CONTACT US') return <Phone size={14} />;
              if (tab === 'WORKING HOURS') return <Clock size={14} />;
              if (tab === 'HELP INFO') return <HelpCircle size={14} />;
              return <HelpCircle size={14} />;
            };

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                } md:flex-1`}
              >
                {getIcon()}
                {tab}
              </button>
            );
          })}
        </div>

        {/* INNER CONTAINER: DISPLAY DYNAMICS CHANNELS BASED ON ACTIVE SELECTION */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm min-h-[380px] flex flex-col justify-between">
          
          {/* TAB CONTENT 1: CONTACT US (Ref: 1.5.png) */}
          {activeTab === 'CONTACT US' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Get In Touch</h2>
                <p className="text-xs text-gray-400 mt-0.5">Pick your preferred contact method to connect directly with our studio engine</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Email Panel */}
                <div className="border border-gray-100 bg-[#F8FAFC]/50 p-5 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
                    <Mail size={16} />
                    <span>Email Support</span>
                  </div>
                  <a href="mailto:support@company.com" className="text-blue-600 font-bold text-lg hover:underline mt-1 block">
                    support@company.com
                  </a>
                  <p className="text-xs text-gray-400 mt-0.5">“We reply within 24 hours”</p>
                </div>

                {/* Phone Panel */}
                <div className="border border-gray-100 bg-[#F8FAFC]/50 p-5 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
                    <Phone size={16} />
                    <span>Phone Support</span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg mt-1">
                    +94 11 234 5678
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">“Available during working hours”</p>
                </div>

                {/* WhatsApp Panel */}
                <div className="border border-gray-100 bg-[#F8FAFC]/50 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
                    <MessageSquare size={16} />
                    <span>WhatsApp Chat</span>
                  </div>
                  <p className="text-xs text-gray-400">Instant developer messaging channel link access protocol.</p>
                  <button onClick={() => window.open('https://wa.me/', '_blank')} className="w-full bg-[#00A884] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-1 hover:bg-[#009675] transition-colors">
                    <MessageSquare size={14} /> Chat on WhatsApp
                  </button>
                </div>

                {/* HQ Location Panel */}
                <div className="border border-gray-100 bg-[#F8FAFC]/50 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
                    <MapPin size={16} />
                    <span>Office Headquarters Location</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">100 Galle Road, Colombo 03, Sri Lanka</p>
                  <button onClick={() => window.open('https://maps.google.com', '_blank')} className="w-full bg-black text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-1 hover:bg-gray-900 transition-colors">
                    <MapPin size={14} /> Google Maps Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: WORKING HOURS (Ref: 1.6.png) */}
          {activeTab === 'WORKING HOURS' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Operational Schedule</h2>
                <p className="text-xs text-gray-400 mt-0.5">Track business timing boundaries before requesting immediate updates</p>
              </div>

              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
                {/* Weekdays Row */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-700">Monday – Friday</span>
                  <span className="text-sm font-bold text-gray-900">9:00 AM – 6:00 PM</span>
                </div>
                {/* Saturday Row */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-700">Saturday</span>
                  <span className="text-sm font-bold text-gray-900">9:00 AM – 1:00 PM</span>
                </div>
                {/* Sunday Row */}
                <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50">
                  <span className="text-sm font-bold text-gray-400">Sunday</span>
                  <span className="text-sm font-bold text-red-500 uppercase tracking-wide">Closed</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-2">
                <p className="text-xs text-gray-400 italic text-center">
                  “Requests outside working hours will be answered next business day.”
                </p>
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: HELP INFO (Ref: 1.7.png) */}
          {activeTab === 'HELP INFO' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-gray-900">How to Get Fast Support</h2>
                <p className="text-xs text-gray-400 mt-0.5">Follow these simple instructional steps to expedite issue resolution loops</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Block 1 */}
                <div className="border border-gray-100 rounded-2xl p-5 flex gap-4 bg-white">
                  <div className="w-6 h-6 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Check FAQ Panel</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Review common questions instantly in the next tab before writing code flags.</p>
                  </div>
                </div>
                {/* Block 2 */}
                <div className="border border-gray-100 rounded-2xl p-5 flex gap-4 bg-white">
                  <div className="w-6 h-6 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Select Communication Channel</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Contact our core design center team either via direct email or WhatsApp text options.</p>
                  </div>
                </div>
                {/* Block 3 */}
                <div className="border border-gray-100 rounded-2xl p-5 flex gap-4 bg-white">
                  <div className="w-6 h-6 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Clarify Anomaly Clearly</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Mention exact environment parameters where unexpected layouts trigger details.</p>
                  </div>
                </div>
                {/* Block 4 */}
                <div className="border border-gray-100 rounded-2xl p-5 flex gap-4 bg-white">
                  <div className="w-6 h-6 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shrink-0">4</div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Attach Proof Files</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Include layout screenshots or desktop terminal stack output logs as clear references.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 4: FAQ ACCORDION PANEL (Ref: 1.8.png) */}
          {activeTab === 'FAQ' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
                <p className="text-xs text-gray-400 mt-0.5">Click individual questions below to expand instant resolution answers</p>
              </div>

              <div className="flex flex-col gap-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle size={16} className="text-blue-500 shrink-0" />
                        <span className="text-sm font-bold text-gray-900">{faq.q}</span>
                      </div>
                      {expandedFaq === index ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </button>
                    
                    {expandedFaq === index && (
                      <div className="px-5 pb-4 pt-1 border-t border-gray-100 bg-gray-50/50">
                        <p className="text-xs text-gray-500 leading-relaxed pl-7">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM RED PANIC ALIGNMENT: URGENT SYSTEMS EMERGENCY BAR */}
        <div className="border border-red-200 bg-[#FFF5F5] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mt-2">
          <div className="flex items-start gap-3 text-center sm:text-left">
            <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0 mx-auto sm:mx-0" />
            <div>
              <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider">Urgent Systems Emergency?</h4>
              <p className="text-xs text-red-700 mt-0.5">Critical dashboard runtime loops or complete staging crashes? Call directly.</p>
            </div>
          </div>
          <a 
            href="tel:+94779998888" 
            className="bg-white border border-red-200 px-5 py-2 rounded-xl text-xs font-extrabold text-red-600 shadow-sm hover:bg-red-50/50 transition-colors whitespace-nowrap"
          >
            Hotline: +94 77 999 8888
          </a>
        </div>

      </main>
    </div>
  );
}