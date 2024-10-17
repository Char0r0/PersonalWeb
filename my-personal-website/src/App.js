// src/App.js
import React from 'react';
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import './App.css';

function App() {
    return (
        <div>
            {/* Render the header component */}
            <Header />
            {/* Render the about section */}
            <About />
            {/* Render the projects section */}
            <Projects />
            {/* Render the contact section */}
            <Contact />
        </div>
    );
}

export default App;

