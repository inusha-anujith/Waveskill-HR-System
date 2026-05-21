"use client";

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Info, 
  HelpCircle, 
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function SupportPage() {
  // Navigation tabs state switcher
  const [activeTab, setActiveTab] = useState<'contact' | 'hours' | 'help' | 'faq'>('contact');

  // Interactive state tracking array for individual FAQ accordion clicks
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Static FAQ dataset
  const faqs = [
    { 
      q: "How do I reset password?", 
      a: "Go to your Account Profile settings page, open the Security section tab panel, input your alternative secret characters, and select save changes." 
    },
    { 
      q: "How do I contact support?", 
      a: "You can reach us instantly via our direct support mailbox at support@company.com or via WhatsApp chat link parameters during regular operational cycles." 
    },
    { 
      q: "How do I check my project status?", 
      a: "Open up the central Projects module workspace navigation panel tab. Every initiative features live indicators mapping progress values explicitly." 
    },
    { 
      q: "What if I find a bug?", 
      a: "Please capture comprehensive layout screenshots highlighting your dashboard console log files and dispatch them over to our email helpdesk line." 
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* --- TOP BRAND HEADER BLOCKS --- */}
      <div className="px-1">
        <h1 className="text-2xl font-bold text-black">Support Center</h1>
        <p className="text-sm text-gray-500">Need deployment or layout alignment help? Explore quick channels here</p>
      </div>

      {/* --- CLEAN VERY SIMPLE NAVBAR TABS --- */}
      <div className="bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-1">
        <button 
          onClick={() => setActiveTab('contact')}
          className={`flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'contact' ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
        >
          <Phone size={14} /> Contact Us
        </button>
        <button 
          onClick={() => setActiveTab('hours')}
          className={`flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'hours' ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
        >
          <Clock size={14} /> Working Hours
        </button>
        <button 
          onClick={() => setActiveTab('help')}
          className={`flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'help' ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
        >
          <Info size={14} /> Help Info
        </button>
        <button 
          onClick={() => setActiveTab('faq')}
          className={`flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'faq' ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
        >
          <HelpCircle size={14} /> FAQ
        </button>
      </div>

      {/* --- RE-ARRANGED DYNAMIC CORE CONTROLLER VIEWPORT --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 min-h-[340px]">
        
        {/* ================= SECTION 1: 📞 CONTACT US CHANNELS ================= */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-bold text-black">Get In Touch</h3>
              <p className="text-sm text-gray-500">Pick your preferred contact method to connect directly with our studio engine</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Gateway channel box */}
              <div className="border border-gray-200 bg-gray-50/30 p-5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-black font-bold text-sm">
                  <Mail size={16} className="text-gray-700" />
                  <h4>Email Support</h4>
                </div>
                <p className="text-lg font-bold text-blue-600">support@company.com</p>
                <p className="text-xs text-gray-400 font-medium">“We reply within 24 hours”</p>
              </div>

              {/* Phone Line channel box */}
              <div className="border border-gray-200 bg-gray-50/30 p-5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-black font-bold text-sm">
                  <Phone size={16} className="text-gray-700" />
                  <h4>Phone Support</h4>
                </div>
                <p className="text-lg font-bold text-black">+94 11 234 5678</p>
                <p className="text-xs text-gray-400 font-medium">“Available during working hours”</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Action Button: WhatsApp Integration channel */}
              <div className="border border-gray-200 bg-gray-50/30 p-5 rounded-xl flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-black font-bold text-sm">
                    <MessageCircle size={16} className="text-green-600" />
                    <h4>WhatsApp Chat</h4>
                  </div>
                  <p className="text-xs text-gray-500">Instant developer messaging channel link access protocol.</p>
                </div>
                <a 
                  href="https://wa.me/94112345678" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-green-700 shadow-sm text-center transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={14} /> Chat on WhatsApp
                </a>
              </div>

              {/* Action Button: Physical Office Location maps link */}
              <div className="border border-gray-200 bg-gray-50/30 p-5 rounded-xl flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-black font-bold text-sm">
                    <MapPin size={16} className="text-red-500" />
                    <h4>Office Headquarters Location</h4>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold text-black">100 Galle Road, Colombo 03, Sri Lanka</p>
                </div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-black shadow-sm text-center transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin size={14} /> Google Maps Link
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: 🕒 WORKING HOURS TIMELINES ================= */}
        {activeTab === 'hours' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-bold text-black">Operational Schedule</h3>
              <p className="text-sm text-gray-500">Track business timing boundaries before requesting immediate updates</p>
            </div>

            {/* Timetable card structure layout */}
            <div className="border border-gray-200 rounded-xl bg-gray-50/40 divide-y divide-gray-200 text-sm overflow-hidden">
              <div className="flex justify-between p-4 bg-white">
                <span className="font-semibold text-gray-700">Monday – Friday</span>
                <span className="font-bold text-black">9:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between p-4 bg-white">
                <span className="font-semibold text-gray-700">Saturday</span>
                <span className="font-bold text-black">9:00 AM – 1:00 PM</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50">
                <span className="font-semibold text-gray-400">Sunday</span>
                <span className="font-bold text-red-600 uppercase tracking-wider text-xs my-auto">Closed</span>
              </div>
            </div>

            {/* Timing notice message banner */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 font-medium leading-relaxed">
              “Requests outside working hours will be answered next business day.”
            </div>
          </div>
        )}

        {/* ================= SECTION 3: ℹ️ HELP INFORMATION USER STEPS ================= */}
        {activeTab === 'help' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-bold text-black">How to Get Fast Support</h3>
              <p className="text-sm text-gray-500">Follow these simple instructional steps to expedite issue resolution loops</p>
            </div>

            {/* Linear instructions list steps blocks mapping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white font-bold text-xs shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-sm text-black mb-0.5">Check FAQ Panel</h4>
                  <p className="text-xs text-gray-500">Review common questions instantly in the next tab before writing code flags.</p>
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white font-bold text-xs shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-sm text-black mb-0.5">Select Communication Channel</h4>
                  <p className="text-xs text-gray-500">Contact our core design center team either via direct email or WhatsApp text options.</p>
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white font-bold text-xs shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-sm text-black mb-0.5">Clarify Anomaly Clearly</h4>
                  <p className="text-xs text-gray-500">Mention exact environment parameters where unexpected layouts trigger details.</p>
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white font-bold text-xs shrink-0">4</span>
                <div>
                  <h4 className="font-bold text-sm text-black mb-0.5">Attach Proof Files</h4>
                  <p className="text-xs text-gray-500">Include layout screenshots or desktop terminal stack output logs as clear references.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 4: 📚 FAQ ACCORDIONS WIDGET ================= */}
        {activeTab === 'faq' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-bold text-black">Frequently Asked Questions</h3>
              <p className="text-sm text-gray-500">Click individual questions below to expand instant resolution answers</p>
            </div>

            {/* Click Expandable Accordion Loops */}
            <div className="space-y-2 pt-2">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx} 
                    className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm transition-all"
                  >
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center px-4 py-3 text-left font-bold text-sm text-black hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle size={15} className="text-blue-500 shrink-0" /> {faq.q}
                      </span>
                      {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </button>
                    
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed pl-9 bg-gray-50/30 animate-in slide-in-from-top-2 duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* --- 🚨 EMERGENCY SUPPORT FOOTER BANNER BOX (Always Visible at Base) --- */}
      <div className="bg-red-50/40 border border-red-200 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-3 items-start">
          <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-red-900">Urgent Systems Emergency?</h4>
            <p className="text-xs text-red-800">Critical dashboard runtime loops or complete staging crashes? Call directly.</p>
          </div>
        </div>
        <p className="text-sm font-bold text-red-700 bg-white border border-red-200 px-3 py-1 rounded-lg shadow-sm whitespace-nowrap">
          Hotline: +94 77 999 8888
        </p>
      </div>

    </div>
  );
}