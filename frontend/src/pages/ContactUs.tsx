import React, { useState } from "react";
import "../App.css";
import emailjs from "@emailjs/browser";
import phone from "../assets/phone.png";
import emails from "../assets/email.png";
import location from "../assets/location.png";
import location1 from "../assets/location1.png";
import location2 from "../assets/location2.png";
import location3 from "../assets/location3.png";

// Contact Us Component
const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // define the service ID, template ID, and public key
    const serviceID = "service_474sere";
    const templateID = "template_0wgn5q8";
    const publicKey = "GuwMNAx0xx5E5BUSq";
    // const template parameters
    const templateParams = {
      name: name,
      email: email,
      title: message,
    };
    // send email using EmailJS
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
  // return  message to the user and reset the form fields when the form is submitted
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="heading text-center">
          <h2>
            Contact <span>Us</span>
          </h2>
          <p>We'd love to hear from you. Feel free to send us a message.</p>
        </div>
        <div className="grid">
          {/* Left Column: Contact Details */}
          <div className="grid-col left-col">
            <div className="card-content">
              <h3>Contact Details</h3>
              <p>Call us or email us for more information.</p>
              <div className="info">
                <img src={phone} alt="Phone" className="info-icon" />
                <span>+123456789</span>
              </div>
              <div className="info">
                <img src={emails} alt="Email" className="info-icon" />
                <span>contact.chaineat@gmail.com</span>
              </div>
              <div className="info">
                <img src={location} alt="Address" className="info-icon" />
                <span>1234 Main St, City</span>
              </div>
            </div>
          </div>

          {/* Center Column: Map */}
          <div className="grid-col center-col">
            <div className="card-content">
              <h3>Our Locations</h3>
              <div className="map-photos">
                <a
                  href="https://maps.app.goo.gl/1PmybRE2gF6MWZbC7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={location1} alt="Location 1" className="map-photo" />
                </a>
                <a
                  href="https://maps.app.goo.gl/SQwHiCh4GxJQ4Ngv8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={location2} alt="Location 2" className="map-photo" />
                </a>
                <a
                  href="https://maps.app.goo.gl/YKrKpUUpqMsUnkQ7A"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={location3} alt="Location 3" className="map-photo" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="grid-col right-col">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
