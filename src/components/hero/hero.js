import React from 'react';
import './hero.css';

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero__content">
        <span className="hero__eyebrow">✦ Full-Stack Developer & Marketing Strategist</span>
        <h1 className="hero__title">
          Building <span>Digital Experiences</span> That Drive Results
        </h1>
        <p className="hero__description">
          I'm Aaron Adams — a developer who combines clean code with strategic thinking.
          I create intuitive web applications and marketing solutions that help businesses grow.
        </p>
        <div className="hero__buttons">
          <a href="#portfolio" className="btn btn-primary">View My Work</a>
          <a href="#contact" className="btn btn-secondary">Get In Touch</a>
        </div>
      </div>
      <div className="hero__scroll">Scroll</div>
    </section>
  );
}

export default Hero;
