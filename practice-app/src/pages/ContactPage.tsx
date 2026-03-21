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
    <div className="page">
      <div className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
        <h1>Contact Us</h1>
        {success && (
          <div className="success-banner" data-testid="success-message">
            Thank you! We'll respond within 24 hours.
          </div>
        )}
        <div className="form-group">
          <label>Name *</label>
          <input data-testid="name-input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
          {errors.name && <p className="field-error" data-testid="name-error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input data-testid="contact-email-input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
          {errors["contact-email"] && <p className="field-error" data-testid="contact-email-error">{errors["contact-email"]}</p>}
        </div>
        <div className="form-group">
          <label>Phone <span style={{ color: "#999" }}>(optional)</span></label>
          <input data-testid="phone-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="555-123-4567" />
          {errors.phone && <p className="field-error" data-testid="phone-error">{errors.phone}</p>}
        </div>
        <div className="form-group">
          <label>Subject *</label>
          <select data-testid="subject-select" value={form.subject} onChange={(e) => update("subject", e.target.value)}>
            <option value="">Select a subject...</option>
            <option value="General">General</option>
            <option value="Support">Support</option>
            <option value="Sales">Sales</option>
            <option value="Bug Report">Bug Report</option>
          </select>
          {errors.subject && <p className="field-error" data-testid="subject-error">{errors.subject}</p>}
        </div>
        <div className="form-group">
          <label>Message *</label>
          <textarea data-testid="message-input" value={form.message} onChange={(e) => update("message", e.target.value)} rows={4} placeholder="How can we help? (min 20 characters)" />
          {errors.message && <p className="field-error" data-testid="message-error">{errors.message}</p>}
        </div>
        <button data-testid="submit-button" onClick={handleSubmit} className="btn-primary">Send Message</button>
      </div>
    </div>
  );
}
