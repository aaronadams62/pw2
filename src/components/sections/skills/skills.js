import React from 'react';
import './skills.css';

function Skills() {
  const skillCategories = [
    {
      title: 'Frontend Development',
      skills: ['JavaScript (ES6+)', 'TypeScript', 'React', 'Next.js', 'Redux', 'Angular', 'HTML5', 'CSS3', 'Tailwind CSS', 'Material UI (MUI)']
    },
    {
      title: 'Backend Development',
      skills: ['Node.js', 'Express.js', 'FastAPI', 'Python', 'GraphQL', 'Databases']
    },
    {
      title: 'Cloud & Hosting',
      skills: ['Firebase', 'Google Cloud Platform', 'Cloudflare', 'Netlify', 'Vercel', 'Microsoft Azure']
    },
    {
      title: 'Tools & DevOps',
      skills: ['Docker', 'Docker Compose', 'Nginx', 'Git', 'GitHub', 'GitHub Actions (CI/CD)', 'Playwright', 'Vitest', 'Jest', 'React Testing Library', 'VS Code']
    },
    {
      title: 'Methodologies & Practices',
      skills: ['Agile', 'Scrum', 'Kanban', 'Lean', 'Testing', 'Quality Assurance']
    },
    {
      title: 'Core Competencies',
      skills: ['Data Structures and Algorithms', 'Object-Oriented Programming', 'Debugging', 'Troubleshooting', 'Code Maintenance', 'Scalability', 'Multithreading']
    }
  ];

  return (
    <section id="skills" className="skills">
      <div className="skills__content">
        <h2 className="skills__title">Skills</h2>
        <div className="skills__categories">
          {skillCategories.map((category, index) => (
            <div key={index} className="skills__category">
              <h3 className="skills__category-title">{category.title}</h3>
              <ul className="skills__list">
                {category.skills.map((skill, skillIndex) => (
                  <li key={skillIndex} className="skills__item">{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
