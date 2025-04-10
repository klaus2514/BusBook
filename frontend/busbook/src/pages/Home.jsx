import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: ''
  });

  const popularDestinations = [
    { id: 1, city: 'New Delhi', image: '/newDelhi.jpeg' },
    { id: 2, city: 'Ayodhya', image: '/Ayoydhya.jpeg' },
    { id: 3, city: 'Hyderabad', image: '/hyderabad1.jpeg' },
    { id: 4, city: 'Coimbatore', image: '/comb.jpeg' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
  };

  return (
    <div className="travel-home">
     
      
      {/* Hero Section - Full Screen */}
      <header className="travel-hero">
        <div className="travel-hero-content">
          <div className="hero-text">
            <h1>LET'S <span>TRAVEL</span></h1>
            <p>AROUND THE WORLD</p>
          </div>
        </div>
      </header>

      {/* Popular Destinations */}
      <section className="travel-destinations">
        <h2>POPULAR DESTINATIONS</h2>
        <div className="destinations-grid">
          {popularDestinations.map(destination => (
            <div 
              key={destination.id} 
              className="destination-card"
              style={{ backgroundImage: `url(${destination.image})` }}
              onClick={() => setSearchData({ ...searchData, to: destination.city })}
            >
              <div className="destination-overlay">
                <h3>{destination.city}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;