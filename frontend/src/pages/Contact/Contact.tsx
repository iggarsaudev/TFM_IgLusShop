import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import "./contact.css"
import toast from "react-hot-toast";


type FormData = {
  name: string;
  email: string;
  message: string;
};

const ContactForm =  () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

 if (!form.name || !form.email || !form.message) {
      toast.error("Please fill out all fields.");
      return;
    }
    toast.success("Your message has been sent!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="form__container">
      <h1 className="form__title">Send us a message</h1>
      <form id="contactForm" className="form__body" onSubmit={handleSubmit}>
        <div className="form__group">
          <label htmlFor="name" className="form__label">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form__input"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form__group">
          <label htmlFor="email" className="form__label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form__input"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form__group">
          <label htmlFor="message" className="form__label">Message:</label>
          <textarea
            id="message"
            name="message"
            className="form__textarea"
            value={form.message}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="form__button">Send</button>
      </form>
    </div>
  );
};

export default ContactForm;