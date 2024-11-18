// Smooth scroll function
export const handleNavClick = (sectionId, ref, setActiveSection) => {
    setActiveSection(sectionId);
    ref.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
};

