import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="travel-about">
      {/* Hero Section */}
      <header className="about-hero">
        <div className="about-hero-content">
          <h1>ABOUT <span>OUR</span> SERVICE</h1>
          <p>Your journey starts with us</p>
        </div>
      </header>

      {/* Main Content */}
      <section className="about-content">
        <div className="about-glass">
          <h2>Our Story</h2>
          <p>
            As a solo developer passionate about travel, I created this bus ticket booking platform 
            to simplify your travel planning. What started as a personal project has grown into 
            a comprehensive service connecting travelers with reliable bus operators across the country.
          </p>
          <p>
            My goal is to make bus travel booking as seamless and stress-free as possible, with 
            transparent pricing, real-time availability, and easy-to-use features.
          </p>
        </div>

        <div className="about-glass">
          <h2>Our Mission</h2>
          <p>
            To provide the most reliable and user-friendly bus ticket booking experience. 
            I'm committed to continuously improving the platform based on user feedback 
            and the latest technologies.
          </p>
          <p>
            Every feature is designed with your convenience in mind - from simple search 
            to instant booking confirmations.
          </p>
        </div>

        {/* Features Section */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚌</div>
            <h3>Wide Network</h3>
            <p>Connecting you to hundreds of destinations with multiple bus operators</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Easy Payments</h3>
            <p>Secure payment options with instant confirmation</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Book tickets anytime, anywhere from your device</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Reliable Service</h3>
            <p>Verified operators and transparent pricing</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="stats-glass">
          <h2>By The Numbers</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Tickets Booked</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Destinations</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Support</p>
            </div>
            <div className="stat-item">
              <h3>99%</h3>
              <p>Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
            {/* Contact Section */}
            <section className="about-contact">
        <div className="contact-glass">
          <h2>Contact Us</h2>
          <p>Have questions? Get in touch with us:</p>
          <div className="contact-actions">
            <a href="mailto:support@busbooking.com" className="email-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email Support
            </a>
            <div className="contact-phone">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              +1-800-BUS-TRIP
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;