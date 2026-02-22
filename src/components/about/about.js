import React, { useState } from 'react';
import './about.css';
import profileImage from '../../photos/aaron_adams_fullstack_full_stack_engineer_react_software_developer.png.jpg';
import resumeFile from './finalized resume 3.docx';

function About() {
  const [showPopup, setShowPopup] = useState(false);

  const handleDownloadClick = () => {
    setShowPopup(true);
    const link = document.createElement('a');
    link.href = resumeFile;
    link.download = 'finalized_resume_3.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const highlights = [
    { icon: '🚀', title: 'Mortgage to Tech', desc: '5+ years in finance before making the leap to software development' },
    { icon: '📚', title: 'Always Learning', desc: 'Completed ZTM React, Full-Stack, and exploring ML & cloud computing' },
    { icon: '💡', title: 'Problem Solver', desc: 'I build tools that genuinely make people\'s lives easier' },
  ];

  return (
    <section id="about" className="about">
      <div className="about__content">
        {/* Left: Image */}
        <div className="about__image-wrapper">
          <div className="about__image-glow"></div>
          <img src={profileImage} alt="Aaron Adams - Professional headshot" className="about__image" />
        </div>

        {/* Right: Text */}
        <div className="about__text">
          <h2 className="about__title">About Me</h2>
          <p className="about__description">
            I transitioned into tech after 5+ years in the mortgage industry, and I haven't looked back since.
            I've always been the go-to person for fixing tech issues—turns out restarting the router was just the beginning!
          </p>
          <p className="about__description">
            Now I build and design tools that make people's lives easier. I'm passionate about spending time with loved ones,
            making people laugh, and succeeding at whatever I set my mind to.
          </p>

          {/* Highlight Cards */}
          <div className="about__highlights">
            {highlights.map((item, i) => (
              <div key={i} className="about__highlight-card">
                <span className="about__highlight-icon">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="about__resume-link" onClick={handleDownloadClick}>
            📄 Download My Resume
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="about__popup" onClick={handlePopupClose}>
          <div className="about__popup-content" onClick={e => e.stopPropagation()}>
            <p className="about__popup-message">Thank you... you won't regret this :)</p>
            <button className="about__popup-close" onClick={handlePopupClose}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default About;
