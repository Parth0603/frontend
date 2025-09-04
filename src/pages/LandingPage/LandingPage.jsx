import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';

// Import all the sections that will be displayed on the landing page
import Hero from './sections/Hero.jsx';
import Stats from './sections/Stats.jsx';
import Solution from './sections/Solution.jsx';
import ZonesPreview from './sections/ZonesPreview.jsx';
import KeyFeatures from './sections/KeyFeatures.jsx';
import Build from './sections/Build.jsx';
import UseCases from './sections/UseCases.jsx';
import HowItWorks from './sections/HowItWorks.jsx';

import CTA from './sections/CTA.jsx';
// The ScrollSVG component is now imported to be used in the layout.
import ScrollSVG from './components/ScrollSVG.jsx';

// The main LandingPage component that orchestrates the layout of all sections.
// It receives the 'navigate' function as a prop to handle routing.
const LandingPage = ({ navigate }) => {
  return (
    <>
      {/* The Navbar is placed at the top of the page */}
      <Navbar navigate={navigate} />
      {/* The ScrollSVG component is added here to render the scroll animation */}
      <ScrollSVG />
      
      {/* The main content area of the landing page */}
      <main>
        {/* Each section is rendered in order */}
        <Hero navigate={navigate} />
        <Stats />
        <Solution />
        <ZonesPreview navigate={navigate} />
        <KeyFeatures />
        <Build />
        <UseCases />
        <HowItWorks />
        <CTA navigate={navigate} />
      </main>
      
      {/* The Footer is placed at the bottom of the page */}
      <Footer navigate={navigate} />
    </>
  );
};

export default LandingPage;
