import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
    setSuccess(false);
  };

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Name is required";
    else if (form.name.length < 2) e.name = "Name must be at least 2 characters";
    if (!form.email) e["contact-email"] = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e["contact-email"] = "Please enter a valid email address";
    if (form.phone && !/^\d{3}-\d{3}-\d{4}$/.test(form.phone)) e.phone = "Phone must be xxx-xxx-xxxx";
    if (!form.subject) e.subject = "Subject is required";
    if (!form.message) e.message = "Message is required";
    else if (form.message.length < 20) e.message = "Message must be at least 20 characters";

    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSuccess(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-[520px] mx-auto mt-10">
        <h1 className="text-[22px] font-bold mb-5 text-slate-900">Contact Us</h1>
        {success && (
          <div className="text-sm text-green-700 px-4 py-3 bg-green-50 border border-green-200 rounded-lg mb-5 font-medium" data-testid="success-message">
            Thank you! We'll respond within 24 hours.
          </div>
        )}
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Name *</label>
          <input data-testid="name-input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10" />
          {errors.name && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="name-error">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email *</label>
          <input data-testid="contact-email-input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10" />
          {errors["contact-email"] && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="contact-email-error">{errors["contact-email"]}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Phone <span className="text-gray-400">(optional)</span></label>
          <input data-testid="phone-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="555-123-4567" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10" />
          {errors.phone && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="phone-error">{errors.phone}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Subject *</label>
          <select data-testid="subject-select" value={form.subject} onChange={(e) => update("subject", e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10">
            <option value="">Select a subject...</option>
            <option value="General">General</option>
            <option value="Support">Support</option>
            <option value="Sales">Sales</option>
            <option value="Bug Report">Bug Report</option>
          </select>
          {errors.subject && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="subject-error">{errors.subject}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Message *</label>
          <textarea data-testid="message-input" value={form.message} onChange={(e) => update("message", e.target.value)} rows={4} placeholder="How can we help? (min 20 characters)" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors resize-y focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10" />
          {errors.message && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="message-error">{errors.message}</p>}
        </div>
        <button data-testid="submit-button" onClick={handleSubmit} className="block w-full py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700">Send Message</button>
      </div>
    </div>
  );
}
