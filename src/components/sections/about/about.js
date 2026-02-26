import React, { useState } from 'react';
import './about.css';
import profileImage from '../../../assets/images/aaron_adams_fullstack_full_stack_engineer_react_software_developer.png.jpg';
import resumeFile from '../../../assets/documents/aaron-adams-resume.pdf';

function About() {
  const [showPopup, setShowPopup] = useState(false);

  const handleDownloadClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const highlights = [
    { icon: '\u{1F680}', title: 'Mortgage to Tech', desc: '5+ years in finance before making the leap to software development' },
    { icon: '\u{1F4DA}', title: 'Always Learning', desc: 'Completed ZTM React, Full-Stack, and exploring ML & cloud computing' },
    { icon: '\u{1F4A1}', title: 'Problem Solver', desc: "I build tools that genuinely make people's lives easier" },
  ];

  return (
    <section id="about" className="about">
      <div className="about__content">
        <div className="about__image-wrapper">
          <div className="about__image-glow"></div>
          <img src={profileImage} alt="Aaron Adams - Professional headshot" className="about__image" />
        </div>

        <div className="about__text">
          <h2 className="about__title">About Me</h2>
          <p className="about__description">
            I transitioned into tech after 5+ years in the mortgage industry, and I have not looked back since.
            I have always been the go-to person for fixing tech issues. Restarting the router was just the beginning.
          </p>
          <p className="about__description">
            Now I build and design tools that make people's lives easier. I am passionate about spending time with loved ones,
            making people laugh, and succeeding at whatever I set my mind to.
          </p>

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

          <div className="about__resume-actions">
            <a
              className="about__resume-link"
              href={resumeFile}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
            <a
              className="about__resume-link about__resume-link--secondary"
              href={resumeFile}
              download="aaron-adams-resume.pdf"
              onClick={handleDownloadClick}
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="about__popup" onClick={handlePopupClose}>
          <div className="about__popup-content" onClick={e => e.stopPropagation()}>
            <p className="about__popup-message">Thank you... you will not regret this :)</p>
            <button className="about__popup-close" onClick={handlePopupClose}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default About;
