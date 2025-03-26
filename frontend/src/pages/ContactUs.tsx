import React, { useState } from "react";
import "../App.css";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceID = "service_474sere";
    const templateID = "template_0wgn5q8";
    const publicKey = "GuwMNAx0xx5E5BUSq";

    const templateParams = {
      name: name,
      email: email,
      title: message, // this maps to the {{title}} in your template
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        alert("Message sent! 🎉");
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch((err) => {
        alert("Something went wrong 😥");
        console.error("EmailJS Error:", err);
      });
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-box">
        <h2 className="contact-heading">Contact Us</h2>
        <p className="contact-subtext">
          We'd love to hear from you! Just drop us a message.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Your Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Your Message</label>
            <textarea
              placeholder="Enter your message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="contact-button">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
