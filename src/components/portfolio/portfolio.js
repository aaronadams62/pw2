import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './portfolio.css';

// Fallback image if none provided
const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x300?text=Project';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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
    // Fetch projects from Custom API (localhost:4000)
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        // API returns { data: [ ...projects ] }
        setProjects(data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Could not load projects. Ensure Backend is running.");
        setLoading(false);
      }
    };

    fetchProjects();
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
