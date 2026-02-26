import React from 'react';
import { useSpring, animated } from 'react-spring';
import './portfolio.css';
import { useProjects } from '../../../hooks/useProjects';

// Fallback image if none provided
const PLACEHOLDER_IMG = '/placeholder-project.svg';

function Portfolio() {
  const { projects, loading, error } = useProjects();

  const props = useSpring({
    opacity: 1,
    fontWeight: 700,
    from: { opacity: 0, fontWeight: 400 },
  });

  return (
    <animated.section id="portfolio" className="portfolio" style={props}>
      <div className="portfolio__content">
        <h2 className="portfolio__title">Portfolio</h2>

        {loading && <p className="portfolio__loading">Loading projects...</p>}
        {error && <p className="portfolio__error">{error}</p>}

        {!loading && !error && (
          <div className="portfolio__items">
            {projects.map((project) => {
              const { id, title, description, live_url, image_url, tech } = project;
              const displayImage = image_url || PLACEHOLDER_IMG;

              return (
                <div className="portfolio__item" key={id}>
                  <img src={displayImage} alt={title} className="portfolio__item-image" loading="lazy" />
                  <div className="portfolio__item-content">
                    <h3 className="portfolio__item-title">{title}</h3>
                    <p className="portfolio__item-description">{description}</p>
                    {tech && tech.length > 0 && (
                      <ul className="portfolio__item-tech">
                        {tech.map((t) => (
                          <li key={t} className="portfolio__item-tech-tag">{t}</li>
                        ))}
                      </ul>
                    )}
                    {live_url && (
                      <a href={live_url} target="_blank" rel="noopener noreferrer" className="portfolio__item-link">
                        View Site
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && (
              <p className="portfolio__empty">No projects found. Add them in the Admin Dashboard!</p>
            )}
          </div>
        )}
      </div>
    </animated.section>
  );
}

export default Portfolio;
