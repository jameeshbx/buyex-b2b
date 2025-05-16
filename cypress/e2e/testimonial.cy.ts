/// <reference types="cypress" />

describe('GlobalTestimonials Component', () => {
    beforeEach(() => {
      // Visit the page where the component is rendered
      cy.visit('http://localhost:3000');
      // Wait for the component to load
      cy.get('section[class*="py-12"]').should('be.visible');
    });
  
    it('should display the section header and description', () => {
      cy.contains('h2', 'Feedback That Speaks Volumes').should('be.visible');
      cy.contains('p', 'A glimpse into the experiences of those who\'ve scaled with BuyExchange').should('be.visible');
    });
  
    it('should display the world map image', () => {
      // Next.js Image component handling
      cy.get('img[alt="World Map"]')
        .should('be.visible')
        .and('have.attr', 'src')
        .and('include', 'Layer.png');
    });
  
    it('should display testimonial flags on the map', () => {
      // Using class-based selectors specific to flag buttons
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2').should('have.length.greaterThan', 0);
      
      // Verify flag images exist
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2 img').each(($el) => {
        cy.wrap($el)
          .should('be.visible')
          .and('have.attr', 'src')
          .and('not.be.empty');
      });
    });
  
    it('should open and display a testimonial popup when clicking a flag', () => {
      // Click the first testimonial flag
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2').first().click();
      
      // Check that popup appears
      cy.get('div.absolute.z-50.bg-white.rounded-lg').should('be.visible');
      
      // Check popup content
      cy.get('div.absolute.z-50.bg-white.rounded-lg').within(() => {
        cy.get('img[class*="rounded-full"]').should('be.visible'); // Avatar
        cy.get('h3').should('not.be.empty'); // Name
        cy.get('p.text-xs.text-gray-500').should('not.be.empty'); // Company
        cy.get('p.text-xs.sm\\:text-sm.text-gray-700').should('not.be.empty'); // Quote
      });
    });
  
    it('should close the popup when clicking the same flag again', () => {
      // Click first flag to open
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2').first().click();
      cy.get('div.absolute.z-50.bg-white.rounded-lg').should('be.visible');
      
      // Click same flag to close
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2').first().click();
      cy.get('div.absolute.z-50.bg-white.rounded-lg').should('not.exist');
    });
  
    it('should position the popup correctly relative to the flag', () => {
      // Get the first flag's position
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2').first().then(($flag) => {
        const flagRect = $flag[0].getBoundingClientRect();
        
        // Click to open popup
        cy.wrap($flag).click();
        
        // Get popup position
        cy.get('div.absolute.z-50.bg-white.rounded-lg').then(($popup) => {
          const popupRect = $popup[0].getBoundingClientRect();
          
          // Verify popup appears near the flag (with tolerance)
          expect(popupRect.top).to.be.closeTo(flagRect.bottom, 200);
          expect(popupRect.left).to.be.closeTo(flagRect.left, 250);
        });
      });
    });
  
    it('should display different testimonials for different flags', () => {
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2').then(($flags) => {
        if ($flags.length > 1) {
          // Get first testimonial content
          cy.wrap($flags[0]).click();
          cy.get('div.absolute.z-50.bg-white.rounded-lg h3').first().invoke('text').then((firstText) => {
            // Close first popup
            cy.wrap($flags[0]).click();
            
            // Get second testimonial content and compare
            cy.wrap($flags[1]).click();
            cy.get('div.absolute.z-50.bg-white.rounded-lg h3').first().invoke('text').should('not.equal', firstText);
          });
        }
      });
    });
  
    it('should have smooth animation when opening popup', () => {
      // Check animation CSS
      cy.document().should('contain.text', '@keyframes fadeIn');
      
      // Click flag and verify animation
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2').first().click();
      cy.get('div.absolute.z-50.bg-white.rounded-lg')
        .should('have.css', 'opacity', '0') // Initial state
        .and('have.css', 'animation-name', 'fadeIn');
    });
  
    it('should handle responsive design correctly', () => {
      // Mobile view
      cy.viewport('iphone-6');
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2').first().click();
      cy.get('div.absolute.z-50.bg-white.rounded-lg').should('be.visible');
      
      // Tablet view
      cy.viewport('ipad-2');
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2').first().click();
      cy.get('div.absolute.z-50.bg-white.rounded-lg').should('be.visible');
      
      // Desktop view
      cy.viewport('macbook-13');
      cy.get('button.absolute.z-10.transform.-translate-x-1\\/2.-translate-y-1\\/2').first().click();
      cy.get('div.absolute.z-50.bg-white.rounded-lg').should('be.visible');
    });
  });