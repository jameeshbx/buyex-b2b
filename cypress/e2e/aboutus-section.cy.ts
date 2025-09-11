// cypress/e2e/aboutus-section.cy.ts

// Mock data that matches your actual component data structure
const aboutUsData = {
    title: "About Us",
    paragraphs: [
      "Buyex Forex simplifies the process of sending money abroad for education, making it easier for students and their families. We understand the unique financial challenges of studying overseas and offer tailored forex solutions to meet those needs.",
      "Founded by two ex-bankers with deep expertise in retail and trade forex, Buyex Forex delivers a one-stop, transparent, and compliant forex platform. By leveraging technology and industry experience, we streamline operations for both banks and customers, removing the complexity from currency transactions."
    ],
    recognitions: {
      title: "Recognitions",
      subtitle: "Incubated at Kerala Startup Mission, Kochi",
      groupedImage: "/images/recognitions.png" // This path should match your actual image path
    }
  };
  
  describe('About Us Page Tests', () => {
    beforeEach(() => {
      // Visit the about page - adjust the URL to match your routing
      cy.visit('http://localhost:3000/');
    });
  
    it('should display the main About Us section correctly', () => {
      // Test the main title
      cy.get('h2').first()
        .should('be.visible')
        .and('contain', aboutUsData.title)
        .and('have.class', 'font-playfair')
        .and('have.class', 'text-dark-blue');
  
      // Test paragraphs
      cy.get('div.space-y-2 > p')
        .should('have.length', aboutUsData.paragraphs.length)
        .each(($p, index) => {
          cy.wrap($p)
            .should('be.visible')
            .and('contain', aboutUsData.paragraphs[index])
            .and('have.class', 'text-light-gray');
        });
  
      // Test the dashboard image exists and is visible
      cy.get('div.relative.h-h1')
        .should('be.visible')
        .find('img[alt="Dashboard Preview"]')
        .should('exist')
        .and('be.visible')
        .and('have.class', 'object-contain');
    });
  
    it('should display the Recognitions section correctly', () => {
      // Scroll to recognitions section to ensure it's in view
      cy.get('div.bg-dark-blue').scrollIntoView();
  
      // Test recognition title
      cy.get('div.bg-dark-blue h2')
        .should('be.visible')
        .and('contain', aboutUsData.recognitions.title)
        .and('have.class', 'font-playfair')
        .and('have.class', 'text-white');
  
      // Test recognition subtitle
      cy.get('div.bg-dark-blue p').first()
        .should('be.visible')
        .and('contain', aboutUsData.recognitions.subtitle);
  
      // Test recognition image exists and is visible
      cy.get('div.bg-dark-blue div.relative img[alt="Company Recognitions"]')
        .should('exist')
        .and('be.visible')
        .and('have.class', 'object-contain');
    });
  
    it('should have proper responsive layout', () => {
      // Test mobile view
      cy.viewport('iphone-6');
      cy.get('div.grid').should('have.class', 'grid-cols-1');
      cy.get('div.relative.h-h1').should('have.css', 'margin-bottom', '-80px');
  
      // Test tablet view
      cy.viewport('ipad-2');
      cy.get('div.grid').should('have.class', 'grid-cols-1');
  
      // Test desktop view
      cy.viewport('macbook-15');
      cy.get('div.grid').should('have.class', 'md:grid-cols-2');
      cy.get('div.relative.md\\:h-h2').should('exist');
    });
  
    it('should have proper image overlap on desktop', () => {
      cy.viewport('macbook-15');
      
      // Get the bottom position of the image container
      cy.get('div.relative.h-h1').then(($imageContainer) => {
        const imageBottom = $imageContainer[0].getBoundingClientRect().bottom;
        
        // Get the top position of the recognition section
        cy.get('div.bg-dark-blue').then(($recognition) => {
          const recognitionTop = $recognition[0].getBoundingClientRect().top;
          
          // Verify the image overlaps the recognition section
          expect(imageBottom).to.be.greaterThan(recognitionTop);
        });
      });
    });
  
    it('should have proper spacing and margins', () => {
      // Test container spacing
      cy.get('div.container').should('have.class', 'md:ml-12');
      cy.get('div.container').should('have.class', 'ml-2');
      cy.get('div.grid').should('have.class', 'ml-6');
  
      // Test paragraph spacing
      cy.get('div.space-y-2 > p').first()
        .should('have.css', 'margin-bottom', '8px'); // space-y-2 = 0.5rem = 8px
    });
  });