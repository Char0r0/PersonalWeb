// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import emailjs from '@emailjs/browser';

function App() {
    const [activeSection, setActiveSection] = useState('home'); // Default active section
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(''); // For displaying sending status
    const [isNavOpen, setIsNavOpen] = useState(false); // 新增状态

    // Create refs
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
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '-50px 0px'
        });

        const handleScroll = () => {
            const viewportHeight = window.innerHeight;
            const sectionPositions = sections.map(section => {
                const rect = section.ref.current?.getBoundingClientRect();
                return {
                    id: section.id,
                    top: rect?.top,
                    height: rect?.height,
                    visible: rect ? (
                        rect.top >= -rect.height / 2 &&
                        rect.top <= viewportHeight - (rect.height / 2)
                    ) : false
                };
            }).filter(section => section.visible);

            if (sectionPositions.length > 0) {
                const currentSection = sectionPositions.reduce((prev, curr) => {
                    const prevCenter = Math.abs(prev.top + prev.height / 2 - viewportHeight / 2);
                    const currCenter = Math.abs(curr.top + curr.height / 2 - viewportHeight / 2);
                    return currCenter < prevCenter ? curr : prev;
                });
                setActiveSection(currentSection.id);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        sections.forEach(section => {
            if (section.ref.current) {
                observer.observe(section.ref.current);
            }
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            sections.forEach(section => {
                if (section.ref.current) {
                    observer.unobserve(section.ref.current);
                }
            });
        };
    }, []);

    useEffect(() => {
        emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');

        emailjs.send(
            process.env.REACT_APP_EMAILJS_SERVICE_ID,
            process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
            {
                from_email: email,
                message: message,
            },
            process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        )
        .then((response) => {
            setStatus('success');
            setEmail('');
            setMessage('');
        })
        .catch((err) => {
            setStatus('error');
            console.error('EmailJS error:', err);
        });
    };

    const handleNavClick = (sectionId, ref) => {
        console.log('Navigation clicked:', sectionId);
        if (ref.current) {
            const yOffset = (() => {
                switch(sectionId) {
                    case 'experience':
                        return -150;
                    case 'skills':
                        return -100;
                    default:
                        return -50;
                }
            })();
            
            const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
            setActiveSection(sectionId);
        }
    };

    const handleContactClick = (e) => {
        e.preventDefault();
        handleNavClick('contact', contactRef);
    };

    const handleDownloadCV = (e) => {
        const cvPath = process.env.PUBLIC_URL + '/files/CharlesCV.pdf';
        fetch(cvPath)
            .then(response => {
                if (!response.ok) {
                    e.preventDefault();
                    alert('CV file is currently unavailable. Please try again later.');
                }
            })
            .catch(error => {
                e.preventDefault();
                alert('Unable to download CV. Please try again later.');
            });
    };

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen); // 切换导航状态
    };

    return (
        <div className="app-container">
            <div className="breathing-background" />
            
            <nav className={`navbar ${isNavOpen ? 'open' : ''}`}>
                <button className="nav-toggle" onClick={toggleNav}>
                    {isNavOpen ? 'Close' : 'Menu'}
                </button>
                <ul>
                    <li 
                        onClick={() => handleNavClick('home', homeRef)}
                        className={activeSection === 'home' ? 'active' : ''}
                    >
                        Home
                    </li>
                    <li 
                        onClick={() => handleNavClick('skills', skillsRef)}
                        className={activeSection === 'skills' ? 'active' : ''}
                    >
                        Skills
                    </li>
                    <li 
                        onClick={() => handleNavClick('experience', experienceRef)}
                        className={activeSection === 'experience' ? 'active' : ''}
                    >
                        Experience
                    </li>
                    <li 
                        onClick={() => handleNavClick('projects', projectsRef)}
                        className={activeSection === 'projects' ? 'active' : ''}
                    >
                        Projects
                    </li>
                    <li 
                        onClick={() => handleNavClick('contact', contactRef)}
                        className={activeSection === 'contact' ? 'active' : ''}
                    >
                        Contact
                    </li>
                </ul>
            </nav>
            <div id="home" ref={homeRef} className="banner">
                <div className="content">
                    <div className="banner-content">
                        <div className="banner-main">
                            <div className="banner-text">
                                <h1>Hello, I'm Charles.</h1>
                                <h2>I am a DevOps Engineer with 8 years of experience in coding, cloud infrastructure, data analysis, and IT system administration.</h2>
                                <div className="buttons">
                                    <a href="#contact" 
                                       className="btn" 
                                       onClick={handleContactClick}>
                                        Contact Me
                                    </a>
                                    <a href={process.env.PUBLIC_URL + '/files/CharlesCV.pdf'} 
                                       className="btn download" 
                                       download
                                       onClick={handleDownloadCV}>
                                        Download CV
                                    </a>
                                    <a href="https://linkedin.com/in/charles-zh" 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="social-link">
                                        <i className="fab fa-linkedin icon"></i>
                                    </a>
                                    <a href="https://github.com/Char0r0" 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       className="social-link">
                                        <i className="fab fa-github icon"></i>
                                    </a>
                                </div>
                            </div>
                            <img 
                                src={process.env.PUBLIC_URL + '/images/profile-photo.jpg'} 
                                alt="Charles" 
                                className="profile-photo"
                            />
                        </div>
                        
                        <div className="about-section">
                            <h2 className="about-title">About Me</h2>
                            <p className="about-description">
                                I am an experienced and detail-focused DevOps Engineer with a strong knowledge of 
                                automating and improving software delivery pipelines with skills in cloud infrastructure design, 
                                automation, CI/CD methodologies, and security measures. I am passionate about 
                                troubleshooting and innovation and have hands-on experience in Full-Stack development.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <section id="skills" ref={skillsRef} className="transparent-bg">
                <h1>My Skills</h1>
                
                <div className="skills-section">
                    <h2>Cloud Platforms</h2>
                    <div className="skills-container">
                        <div className="skill-item">
                            <i className="fab fa-aws skill-icon"></i>
                            <span className="skill-name">AWS</span>
                            <span className="skill-details">EC2, S3, ECS, EKS, RDS, DynamoDB, Lambda, CloudFormation, VPC, Route 53, IAM, CloudWatch</span>
                        </div>
                        <div className="skill-item">
                            <i className="fab fa-microsoft skill-icon"></i>
                            <span className="skill-name">Azure</span>
                            <span className="skill-details">VMs, AKS, App Services, Blob Storage, Azure DevOps, Active Directory</span>
                        </div>
                    </div>
                </div>

                <div className="skills-section">
                    <h2>Infrastructure as Code (IaC)</h2>
                    <div className="skills-container">
                        <div className="skill-item">
                            <i className="fas fa-code skill-icon"></i>
                            <span className="skill-name">Terraform</span>
                        </div>
                        <div className="skill-item">
                            <i className="fas fa-cogs skill-icon"></i>
                            <span className="skill-name">Ansible</span>
                        </div>
                        <div className="skill-item">
                            <i className="fab fa-aws skill-icon"></i>
                            <span className="skill-name">CloudFormation</span>
                        </div>
                        <div className="skill-item">
                            <i className="fab fa-aws skill-icon"></i>
                            <span className="skill-name">AWS CDK</span>
                        </div>
                    </div>
                </div>

                <div className="skills-section">
                    <h2>CI/CD & Containerization</h2>
                    <div className="skills-container">
                        <div className="skill-item">
                            <i className="fab fa-jenkins skill-icon"></i>
                            <span className="skill-name">Jenkins</span>
                        </div>
                        <div className="skill-item">
                            <i className="fab fa-github skill-icon"></i>
                            <span className="skill-name">GitHub Actions</span>
                        </div>
                        <div className="skill-item">
                            <i className="fab fa-docker skill-icon"></i>
                            <span className="skill-name">Docker</span>
                        </div>
                        <div className="skill-item">
                            <i className="fas fa-dharmachakra skill-icon"></i>
                            <span className="skill-name">Kubernetes</span>
                            <span className="skill-details">EKS, AKS, Helm</span>
                        </div>
                    </div>
                </div>

                <div className="skills-section">
                    <h2>Monitoring & Development</h2>
                    <div className="skills-container">
                        <div className="skill-item">
                            <i className="fas fa-chart-line skill-icon"></i>
                            <span className="skill-name">Monitoring</span>
                            <span className="skill-details">Grafana, Prometheus, CloudWatch, Elasticsearch</span>
                        </div>
                        <div className="skill-item">
                            <i className="fas fa-code-branch skill-icon"></i>
                            <span className="skill-name">Version Control</span>
                            <span className="skill-details">Git, GitHub, GitLab, Bitbucket</span>
                        </div>
                        <div className="skill-item">
                            <i className="fas fa-database skill-icon"></i>
                            <span className="skill-name">Databases</span>
                            <span className="skill-details">PostgreSQL, MySQL, MongoDB, MSSQL</span>
                        </div>
                    </div>
                </div>

                <div className="skills-section">
                    <h2>Programming & Tools</h2>
                    <div className="skills-container">
                        <div className="skill-item">
                            <i className="fas fa-terminal skill-icon"></i>
                            <span className="skill-name">Scripting</span>
                            <span className="skill-details">Bash, Python, JAVA, PowerShell, YAML, JSON</span>
                        </div>
                        <div className="skill-item">
                            <i className="fas fa-network-wired skill-icon"></i>
                            <span className="skill-name">Networking</span>
                            <span className="skill-details">HTTP/HTTPS, DNS, TCP/IP, Load Balancers, CDN</span>
                        </div>
                        <div className="skill-item">
                            <i className="fas fa-tools skill-icon"></i>
                            <span className="skill-name">Other Tools</span>
                            <span className="skill-details">Nginx, Apache, Jira, Tableau, Power BI</span>
                        </div>
                    </div>
                </div>
            </section>
            <section id="experience" ref={experienceRef} className="transparent-bg">
                <h1>Work Experience</h1>
                <div className="timeline">
                    <div className="timeline-year">-</div>
                    {/* DevOps Engineer */}
                    <div className="timeline-item">
                        <div className="timeline-content left">
                            <h3>DevOps Engineer</h3>
                            <h4>Sydney, Australia</h4>
                            <p>Implementing DevOps best practices, including IaC, CI/CD pipelines, and monitoring, to ensure the scalability and reliability of a meeting collaboration platform deployed on AWS and Azure.</p>
                            <span className="timeline-date">Mar 2024 - Present</span>
                        </div>
                        <div className="timeline-marker">
                            <i className="fas fa-briefcase"></i>
                        </div>
                        <div className="timeline-content right" style={{ visibility: 'hidden' }}></div>
                    </div>

                    <div className="timeline-year">2024</div>
                    {/* Spatial Data Controller */}
                    <div className="timeline-item">
                        <div className="timeline-content left" style={{ visibility: 'hidden' }}></div>
                        <div className="timeline-marker">
                            <i className="fas fa-briefcase"></i>
                        </div>
                        <div className="timeline-content right">
                            <h3>Spatial Data Controller</h3>
                            <h4>Newcastle, Australia</h4>
                            <p>Managed high-precision spatial datasets and performed quality control processes to support infrastructure and transport planning.</p>
                            <span className="timeline-date">Aug 2023 - May 2024</span>
                        </div>
                    </div>

                    <div className="timeline-year">2023</div>
                    <div className="timeline-item">
                        <div className="timeline-content left">
                            <h3>Master of Information Technology</h3>
                            <h4>Newcastle, Australia</h4>
                            <p>Completed a Master of Information Technology at the University of Newcastle, specializing in IT and Business Analytics</p>
                            <span className="timeline-date">Aug 2021 - Aug 2023</span>
                        </div>
                        <div className="timeline-marker">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                        <div className="timeline-content right" style={{ visibility: 'hidden' }}></div>
                    </div>
                    {/* IT Project System*/}
                    <div className="timeline-item">
                        <div className="timeline-content left">
                            <h3>IT System Administrator</h3>
                            <h4>China</h4>
                            <p>Assisted in managing IT systems, coordinating teams, and setting up CI/CD pipelines to ensure seamless project execution.</p>
                            <span className="timeline-date">Aug 2019 - Jun 2022</span>
                        </div>
                        <div className="timeline-marker">
                            <i className="fas fa-briefcase"></i>
                        </div>
                        <div className="timeline-content right" style={{ visibility: 'hidden' }}></div>
                    </div>

                    <div className="timeline-year">2019</div>
                    {/* IT Support Specialist */}
                    <div className="timeline-item">
                        <div className="timeline-content left" style={{ visibility: 'hidden' }}></div>
                        <div className="timeline-marker">
                            <i className="fas fa-briefcase"></i>
                        </div>
                        <div className="timeline-content right">
                            <h3>IT Support Specialist</h3>
                            <h4>China</h4>
                            <p>Provided technical support, automated routine tasks, and optimized network performance to enhance IT system efficiency.</p>
                            <span className="timeline-date">Aug 2016 - Aug 2019</span>
                        </div>
                    </div>
                    <div className="timeline-year">2016</div>
                </div>
            </section>
            <section id="projects" ref={projectsRef} className="transparent-bg">
                <h1>My Projects</h1>
                <div className="projects-container">
                    {/* Student Application Project */}
                    <div className="project-card">
                        <div className="project-content">
                            <h2>Student Adverse Circumstance Application</h2>
                            <p>Led the development of a web-based application prototype that allowed students to report and request support for adverse circumstances, focusing on user-centered design.</p>
                            <div className="tech-stack">
                                <span className="tech-tag">VUE.js</span>
                                <span className="tech-tag">C#</span>
                                <span className="tech-tag">SQL</span>
                                <span className="tech-tag">Azure</span>
                                <span className="tech-tag">GitHub Action</span>
                            </div>
                        </div>
                        <div className="project-image" style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL}/images/student-app.jpg)`
                        }}>
                        </div>
                    </div>

                    {/* E-commerce Platform Project */}
                    <div className="project-card">
                        <div className="project-content">
                            <h2>E-commerce Platform Development</h2>
                            <p>Developed an e-commerce platform with real-time data processing and cloud hosting, streamlining workflows and reducing operational costs.</p>
                            <div className="tech-stack">
                                <span className="tech-tag">HTML, CSS, JavaScript</span>
                                <span className="tech-tag">JAVA</span>
                                <span className="tech-tag">MySQL</span>
                                <span className="tech-tag">Payment Gateway Integration</span>
                            </div>
                        </div>
                        <div className="project-image" style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL}/images/ecommerce.jpg)`
                        }}>
                        </div>
                    </div>

                    {/* Holiday Inn Project */}
                    <div className="project-card">
                        <div className="project-content">
                            <h2>Holiday Inn Hotel Network Upgrade</h2>
                            <p>Upgraded the local area network for a hotel, including needs analysis, hardware procurement, installation, testing, and staff training to ensure a secure and reliable IT system.</p>
                            <div className="tech-stack">
                                <span className="tech-tag">Network Design</span>
                                <span className="tech-tag">Aruba Network</span>
                                <span className="tech-tag">Opera PMS</span>
                                <span className="tech-tag">Stress Testing</span>
                                <span className="tech-tag">Kanban</span>
                            </div>
                        </div>
                        <div className="project-image" style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL}/images/network.jpg)`
                        }}>
                        </div>
                    </div>
                </div>
            </section>
            <section id="contact" ref={contactRef} className="transparent-bg">
                <h1>Contact Me</h1>
                <p>Please contact me directly at <a href="mailto:charles.zh56@hotmail.com">charles.zh56@hotmail.com</a> or through this form.</p>
                
                <form className="contact-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Your email" 
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <textarea 
                        placeholder="Your message" 
                        className="form-input message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                    <div className="submit-container">
                        <button type="submit" className="submit-btn" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Sending...' : 'Submit'} <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    {status === 'success' && <p className="success-message">Message sent successfully!</p>}
                    {status === 'error' && <p className="error-message">Failed to send message. Please try again.</p>}
                </form>
            </section>
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-text">
                        <p className="copyright">© 2024 Charles. All rights reserved.</p>
                        <p className="about-website">About this website: built with Oracle Cloud, Cloudflare, Next.js, TypeScript, Tailwind CSS, Framer Motion, React Email & Resend.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
