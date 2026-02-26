import React from 'react';
import './skills.css';

function Skills() {
  const skillCategories = [
    {
      title: 'Frontend Development',
      skills: ['JavaScript', 'TypeScript', 'React', 'Redux', 'Angular', 'HTML5', 'CSS']
    },
    {
      title: 'Backend Development',
      skills: ['ExpressJs', 'Python', 'GraphQL', 'Databases']
    },
    {
      title: 'Cloud & Infrastructure',
      skills: ['Google Firebase', 'Google Cloud Platform', 'Microsoft Azure', 'Netlify']
    },
    {
      title: 'Methodologies & Practices',
      skills: ['Agile', 'SCRUM', 'Kanban', 'Lean', 'Testing', 'Quality Assurance']
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
