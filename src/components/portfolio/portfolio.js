import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './portfolio.css';
import { getProjects } from '../../services/projectsService';

// Fallback image if none provided
const PLACEHOLDER_IMG = '/placeholder-project.svg';

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const props = useSpring({
    opacity: 1,
    fontWeight: 700,
    from: { opacity: 0, fontWeight: 400 },
  });

  useEffect(() => {
    const fetchPortfolioProjects = async () => {
      try {
        setProjects(await getProjects());
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Could not load projects. Ensure backend or Firestore is configured.");
        setLoading(false);
      }
    };

    fetchPortfolioProjects();
  }, []);

  return (
    <animated.section id="portfolio" className="portfolio" style={props}>
      <div className="portfolio__content">
        <h2 className="portfolio__title">Portfolio</h2>

        {loading && <p className="portfolio__loading">Loading projects...</p>}
        {error && <p className="portfolio__error">{error}</p>}

        {!loading && !error && (
          <div className="portfolio__items">
            {projects.map((project) => {
              // Custom API returns flat snake_case objects
              const { id, title, description, live_url, image_url } = project;

              const displayImage = image_url || PLACEHOLDER_IMG;

              return (
                <div className="portfolio__item" key={id}>
                  <img src={displayImage} alt={title} className="portfolio__item-image" loading="lazy" />
                  <h3 className="portfolio__item-title">{title}</h3>
                  <p className="portfolio__item-description">{description}</p>
                  {live_url && (
                    <a href={live_url} target="_blank" rel="noopener noreferrer" className="portfolio__item-link">
                      View Site
                    </a>
                  )}
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
