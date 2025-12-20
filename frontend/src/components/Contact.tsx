import React, { useRef } from 'react';

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo: just reset the form
    if (formRef.current) formRef.current.reset();
    alert('Thank you for contacting us!');
  };

  return (
    <section id="contact" className="relative py-32 px-6 bg-black text-white">
      <div className="max-w-xl mx-auto">
        <h2 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
          Contact Us
        </h2>
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 bg-blue-950/20 rounded-2xl shadow-lg">
          <input type="text" name="name" placeholder="Your Name" required className="p-3 rounded bg-gray-900 text-white" />
          <input type="email" name="email" placeholder="Your Email" required className="p-3 rounded bg-gray-900 text-white" />
          <textarea name="message" placeholder="Your Message" required rows={4} className="p-3 rounded bg-gray-900 text-white" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded font-bold transition">Send Message</button>
        </form>
      </div>
    </section>
  );
}
