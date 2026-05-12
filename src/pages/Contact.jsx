// Contact.jsx (or Supplements.jsx - rename as needed)
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Posts from "../components/Posts";
import Marquee from "../components/Marquee";
import useContacts from "../hooks/useContacts";
// import "./Contact.css";

// Star Rating Component
const StarRating = ({ rating = 4.7 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star star-full">
          ★
        </span>
      ))}
      {hasHalfStar && <span className="star star-half">½</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star star-empty">
          ☆
        </span>
      ))}
    </div>
  );
};

const clockIconDataUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='24' viewBox='0 0 25 24' fill='none'%3E%3Cpath d='M23.2665 11.988C23.2345 9.95804 22.727 8.08392 21.744 6.36563C20.761 4.64735 19.3904 3.27672 17.6321 2.25375C15.8579 1.24675 13.9838 0.743256 12.0098 0.743256C10.0357 0.743256 8.16161 1.24675 6.38739 2.25375C4.62915 3.27672 3.25852 4.64735 2.2755 6.36563C1.29248 8.08392 0.78499 9.95804 0.753022 11.988C0.78499 14.034 1.29248 15.9161 2.2755 17.6344C3.25852 19.3526 4.62915 20.7233 6.38739 21.7463C8.16161 22.7532 10.0357 23.2567 12.0098 23.2567C13.9838 23.2567 15.8579 22.7532 17.6321 21.7463C19.3904 20.7233 20.761 19.3526 21.744 17.6344C22.727 15.9161 23.2345 14.042 23.2665 12.012V11.988ZM0.00976562 11.988C0.0417337 9.81419 0.581194 7.82018 1.62815 6.00599C2.6751 4.19181 4.13364 2.71728 6.00377 1.58242C7.90587 0.527472 9.90787 0 12.0098 0C14.1117 0 16.1137 0.527472 18.0158 1.58242C19.8859 2.71728 21.3444 4.19181 22.3914 6.00599C23.4383 7.82018 23.9778 9.81419 24.0098 11.988C23.9778 14.1778 23.4383 16.1798 22.3914 17.994C21.3444 19.8082 19.8859 21.2827 18.0158 22.4176C16.1137 23.4725 14.1117 24 12.0098 24C9.90787 24 7.90587 23.4725 6.00377 22.4176C4.13364 21.2827 2.6751 19.8082 1.62815 17.994C0.581194 16.1798 0.0417337 14.1858 0.00976562 12.012V11.988ZM11.6381 4.86713C11.6701 4.65934 11.79 4.53946 11.9978 4.50749C12.2216 4.53946 12.3494 4.65934 12.3814 4.86713V11.8202L16.745 14.6733C16.9049 14.8332 16.9368 15.017 16.8409 15.2248C16.6811 15.3846 16.5053 15.4166 16.3135 15.3207L11.8299 12.3237C11.7021 12.2278 11.6381 12.1239 11.6381 12.012V4.86713Z' fill='black'/%3E%3C/svg%3E";

const emailIconDataUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='27' height='20' viewBox='0 0 27 20' fill='none'%3E%3Cpath d='M3.34057 0.839161C2.64793 0.865801 2.05519 1.10556 1.56235 1.55844C1.10947 2.05128 0.869707 2.64402 0.843067 3.33666V4.7952L11.5124 13.3866C12.0718 13.8395 12.6812 14.0659 13.3406 14.0659C13.9999 14.0659 14.6093 13.8395 15.1687 13.3866L25.8381 4.7952V3.33666C25.7981 2.64402 25.5517 2.05128 25.0988 1.55844C24.6193 1.10556 24.0332 0.865801 23.3406 0.839161H3.34057ZM0.843067 5.8941V16.6633C0.869707 17.356 1.10947 17.9487 1.56235 18.4416C2.05519 18.8944 2.64793 19.1342 3.34057 19.1608H23.3406C24.0332 19.1342 24.6193 18.8944 25.0988 18.4416C25.5517 17.9487 25.7981 17.356 25.8381 16.6633V5.8941L15.6882 14.0659C14.9956 14.6254 14.213 14.9051 13.3406 14.9051C12.4681 14.9051 11.6856 14.6254 10.9929 14.0659L0.843067 5.8941ZM0.00390625 3.33666C0.0438663 2.39094 0.373537 1.60839 0.992917 0.98901C1.6123 0.369629 2.39485 0.039959 3.34057 0H23.3406C24.273 0.039959 25.0522 0.369629 25.6782 0.98901C26.3043 1.60839 26.6373 2.39094 26.6772 3.33666V16.6633C26.6373 17.6091 26.3043 18.3916 25.6782 19.011C25.0522 19.6304 24.273 19.96 23.3406 20H3.34057C2.39485 19.96 1.6123 19.6304 0.992917 19.011C0.373537 18.3916 0.0438663 17.6091 0.00390625 16.6633V3.33666Z' fill='black'/%3E%3C/svg%3E";

// Location icon as data URL
const locationIconDataUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='24' viewBox='0 0 18 24' fill='none'%3E%3Cpath d='M17.2368 8.99135C17.1889 6.65795 16.3818 4.7241 14.8155 3.18981C13.2812 1.62355 11.3394 0.808456 8.99 0.744528C6.6566 0.808456 4.72275 1.62355 3.18845 3.18981C1.6222 4.7241 0.807102 6.65795 0.743173 8.99135C0.743173 9.90234 1.01887 10.9971 1.57025 12.2757C2.12164 13.5543 2.82486 14.8648 3.67991 16.2073C4.53496 17.5498 5.394 18.8164 6.25704 20.0071C7.12008 21.1978 7.86325 22.1687 8.48656 22.9199C8.82219 23.2715 9.1658 23.2715 9.51741 22.9199C10.1407 22.1687 10.8919 21.2018 11.7709 20.0191C12.602 18.8364 13.449 17.5698 14.3121 16.2193C15.1751 14.8688 15.8703 13.5543 16.3978 12.2757C16.9731 10.9652 17.2608 9.87038 17.2608 8.99135H17.2368ZM18.004 8.99135C17.94 10.3978 17.4326 12.024 16.4817 13.8699C15.5307 15.7159 14.4439 17.5059 13.2213 19.24C11.9987 20.974 10.9638 22.3605 10.1167 23.3993C9.81308 23.7669 9.4415 23.9507 9.00199 23.9507C8.56248 23.9507 8.1829 23.7669 7.86325 23.3993C7.03218 22.3605 6.00532 20.974 4.78268 19.24C3.56004 17.5059 2.47325 15.7159 1.52231 13.8699C0.571364 12.024 0.0639289 10.3978 0 8.99135C0.0639289 6.4342 0.938955 4.31256 2.62508 2.62643C4.3112 0.94031 6.43284 0.0652828 8.99 0.00135422C11.5631 0.0652828 13.6928 0.94031 15.3789 2.62643C17.065 4.31256 17.94 6.4342 18.004 8.99135ZM8.99 5.25151C10.3964 5.28348 11.4752 5.90679 12.2264 7.12144C12.9136 8.36805 12.9136 9.62265 12.2264 10.8852C11.4752 12.0999 10.3964 12.7232 8.99 12.7552C7.58356 12.7232 6.50476 12.0999 5.7536 10.8852C5.06636 9.62265 5.06636 8.36805 5.7536 7.12144C6.50476 5.90679 7.58356 5.28348 8.99 5.25151ZM12.0106 8.99135C11.9787 7.8726 11.4752 7.01755 10.5003 6.42621C9.49344 5.86683 8.49455 5.86683 7.50365 6.42621C6.52874 7.01755 6.0253 7.8726 5.99333 8.99135C6.0253 10.1261 6.52874 10.9891 7.50365 11.5805C8.49455 12.1399 9.49344 12.1399 10.5003 11.5805C11.4752 10.9891 11.9707 10.1261 11.9867 8.99135H12.0106Z' fill='black'/%3E%3C/svg%3E";



const trustItems = [
  {
    icon: "/supplements/store.png",
    title: "Store location",
    sub: "7409 Mayfield Rd. Woodhaven, NY 11421",
  },
  {
    icon: locationIconDataUrl,
    title: "Headquarter",
    sub: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
  },
  {
    icon: clockIconDataUrl,
    title: "Office hours",
    sub: "Monday – Friday 8:00am – 4:00pm",
  },
  {
    icon: emailIconDataUrl,
    title: "Contact info",
    sub: "Telephone: (084) 123 - 456 88 Email: info@example.com",
  },
];

const ContactPage = () => {
  const { submitUserContact } = useContacts();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await submitUserContact({
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      setSubmitStatus("success");
      setFormData({ name: "", phone: "", email: "", message: "" });

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div className="supp-page">
        <section className="supp-hero">
          <div className="supp-hero__bg">
            <div className="supp-hero__title-wrap">
              <h1 className="supp-hero__title">Contact</h1>
              <nav className="supp-hero__breadcrumb">
                <span
                  className="supp-hero__breadcrumb-link"
                  onClick={() => window.__navigate && window.__navigate("home")}
                >
                  Home Page
                </span>
                <span className="supp-hero__breadcrumb-sep">•</span>
                <span className="supp-hero__breadcrumb-current">Contact</span>
              </nav>
            </div>
          </div>

          <div className="hm-trust pt-100">
            {trustItems.map((item, i) => (
              <div key={i} className="hm-trust__item">
                <img
                  className="hm-trust__icon"
                  src={item.icon}
                  alt={item.title}
                />
                <div>
                  <p className="hm-trust__title">{item.title}</p>
                  <p className="hm-trust__sub">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Form Section */}
          <div className="pt-100 pb-100">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="feedback-wrapper">
                    <div className="feedback-header">
                      <h2 className="feedback-title">
                        SEND US <span className="feedback"> FEEDBACK </span>
                      </h2>
                      <p className="hm-blog__excerpt">
                        For more information and how we can meet your needs,
                        please fill out the form below and someone from our team
                        will be in touch.
                      </p>
                    </div>

                    {/* Success/Error Messages */}
                    {submitStatus === "success" && (
                      <div className="alert alert-success">
                        Thank you! Your feedback has been sent successfully.
                      </div>
                    )}
                    {submitStatus === "error" && (
                      <div className="alert alert-error">
                        Oops! Something went wrong. Please try again.
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="feedback-form">
                      <div className="form-row">
                        <div className="form-group">
                          {/* <label htmlFor="name">
                            Your Name <span className="required">*</span>
                          </label> */}
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your Name *"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="form-group">
                          {/* <label htmlFor="phone">
                            Phone Number <span className="required">*</span>
                          </label> */}
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Phone Number *"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="form-group full-width">
                        {/* <label htmlFor="email">
                          Email <span className="required">*</span>
                        </label> */}
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Email *"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="form-group full-width">
                        {/* <label htmlFor="message">Say something...</label> */}
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="5"
                          placeholder="Say something..."
                          disabled={isSubmitting}
                        ></textarea>
                      </div>
                      <div class="text-center">
                        <button class="hm-insta__label">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Section */}
          <div className=" ">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11366006.93963093!2d-15.001137513347569!3d54.10341835529073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x25a3b1142c791a9%3A0xc4f8a0433288257a!2sUnited%20Kingdom!5e1!3m2!1sen!2s!4v1775835859544!5m2!1sen!2s"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="UK Map"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Marquee />
        <Posts />
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
