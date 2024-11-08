// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import { handleNavClick } from './utils'; // 导入函数
import './App.css';

function App() {
    const [activeSection, setActiveSection] = useState('home'); // 默认活动项

    // 创建 refs
    const homeRef = useRef(null);
    const aboutRef = useRef(null);
    const skillsRef = useRef(null);
    const experienceRef = useRef(null);
    const projectsRef = useRef(null);
    const contactRef = useRef(null);

    useEffect(() => {
        const sections = [
            { ref: homeRef, id: 'home' },
            { ref: aboutRef, id: 'about' },
            { ref: skillsRef, id: 'skills' },
            { ref: experienceRef, id: 'experience' },
            { ref: projectsRef, id: 'projects' },
            { ref: contactRef, id: 'contact' },
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id); // 更新活动项
                }
            });
        }, { threshold: 0.5 }); // 50% 可见时触发

        sections.forEach(section => {
            if (section.ref.current) {
                observer.observe(section.ref.current);
            }
        });

        return () => {
            sections.forEach(section => {
                if (section.ref.current) {
                    observer.unobserve(section.ref.current);
                }
            });
        };
    }, []); // 依赖项为空数组，确保只在组件挂载时运行

    return (
        <div>
            <nav className="navbar">
                <ul>
                    <li className={activeSection === 'home' ? 'active' : ''} onClick={() => handleNavClick('home', homeRef, setActiveSection)}>
                        Home
                    </li>
                    <li className={activeSection === 'about' ? 'active' : ''} onClick={() => handleNavClick('about', aboutRef, setActiveSection)}>
                        About
                    </li>
                    <li className={activeSection === 'skills' ? 'active' : ''} onClick={() => handleNavClick('skills', skillsRef, setActiveSection)}>
                        Skills
                    </li>
                    <li className={activeSection === 'experience' ? 'active' : ''} onClick={() => handleNavClick('experience', experienceRef, setActiveSection)}>
                        Experience
                    </li>
                    <li className={activeSection === 'projects' ? 'active' : ''} onClick={() => handleNavClick('projects', projectsRef, setActiveSection)}>
                        Projects
                    </li>
                    <li className={activeSection === 'contact' ? 'active' : ''} onClick={() => handleNavClick('contact', contactRef, setActiveSection)}>
                        Contact
                    </li>
                </ul>
            </nav>
            <div className="banner">
                <div className="content">
                    <h1>Hello, I'm Charles.</h1>
                    <h2>I'm a DevOps Engineer with 2 years of hands-on experience in software development.</h2>
                    <h2>My focus is building <span className="highlight">Cloud Infrastructure.</span></h2>
                    <div className="buttons">
                        <a href="#contact" className="btn download">Contact Me</a>
                        <a href="../public/files/CharlesCV.pdf" className="btn download" download>Download CV</a>
                        <a href="https://linkedin.com/in/charles-zh" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin icon"></i>
                        </a>
                        <a href="https://github.com/Char0r0" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github icon"></i>
                        </a>
                    </div>
                </div>
            </div>
            <section id="about" ref={aboutRef} className="transparent-bg">
                <h1>About</h1>
                <p>Information about me.</p>
            </section>
            <section id="skills" ref={skillsRef} className="transparent-bg">
                <h1>Skills</h1>
                <p>Details about my skills.</p>
            </section>
            <section id="experience" ref={experienceRef} className="transparent-bg">
                <h1>Experience</h1>
                <p>My work experience.</p>
            </section>
            <section id="projects" ref={projectsRef} className="transparent-bg">
                <h1>Projects</h1>
                <p>Projects I have worked on.</p>
            </section>
            <section id="contact" ref={contactRef} className="transparent-bg">
                <h1>Contact</h1>
                <p>How to get in touch with me.</p>
            </section>
        </div>
    );
}

export default App;
