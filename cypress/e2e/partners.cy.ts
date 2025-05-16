describe('Partners Marquee Component', () => {
    const expectedPartners = [
      "Thomas Cook", "RBL Bank", "Fintiba", 
      "Orient Exchange", "Ebix", "Coracle", 
      "Credila", "Wxfs", "Nium"
    ];
  
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('should render the section container with correct styling', () => {
      cy.get('section')
        .should('have.class', 'py-16')
        .should('have.class', 'px-4')
        .should('have.class', 'max-w-7xl')
        .should('have.class', 'mx-auto');
    });
  
    it('should display the heading with correct text and styling', () => {
      cy.get('section h2')
        .should('have.text', 'The Force Behind Our Forex Flow')
        .should('be.visible')
        .should('have.class', 'text-4xl')
        .should('have.class', 'md:text-5xl')
        .should('have.class', 'font-bold')
        .should('have.class', 'font-playfair')
        .should('have.class', 'text-dark-blue')
        .should('have.class', 'mb-12');
    });
  
    it('should have a marquee container with correct attributes', () => {
      cy.get('[ref]').should('exist').as('marqueeContainer');
      cy.get('@marqueeContainer')
        .should('have.class', 'overflow-hidden')
        .should('have.class', 'scroll-smooth')
        .should('have.css', 'scrollbar-width', 'none')
        .should('have.css', '-ms-overflow-style', 'none')
        .should('have.css', '-webkit-overflow-scrolling', 'touch');
    });
  
    it('should render all partner logos in duplicate with correct structure', () => {
      // Verify the flex container
      cy.get('.flex')
        .should('have.class', 'items-center')
        .children()
        .should('have.length', expectedPartners.length * 2);
  
      // Check both sets of logos
      expectedPartners.forEach(partnerName => {
        cy.get(`img[alt="${partnerName}"]`)
          .should('have.length', 2) // Original + duplicate
          .each($img => {
            cy.wrap($img)
              .should('have.css', 'object-fit', 'contain')
              .should('have.prop', 'naturalWidth').should('be.greaterThan', 0);
          });
      });
  
      // Verify logo container styling
      cy.get('.flex-shrink-0').first()
        .should('have.class', 'mx-8')
        .should('have.class', 'w-[180px]')
        .should('have.class', 'h-[80px]')
        .should('have.class', 'relative');
    });
  
    it('should have a smooth scrolling animation', () => {
      cy.get('[ref]').then($marquee => {
        const initialScroll = $marquee[0].scrollLeft;
        
        // Wait for animation to progress
        cy.wait(2000).then(() => {
          const newScroll = $marquee[0].scrollLeft;
          expect(newScroll).to.be.greaterThan(initialScroll);
          
          // Verify reset behavior after reaching midpoint
          if (newScroll >= $marquee[0].scrollWidth / 2 - $marquee[0].clientWidth) {
            cy.wait(2000).then(() => {
              expect($marquee[0].scrollLeft).to.be.lessThan(newScroll);
            });
          }
        });
      });
    });
  
    it('should clean up animation on unmount', () => {
      // This test would require mocking requestAnimationFrame
      // and verifying cancelAnimationFrame is called
      // Implementation depends on your testing setup
    });
  
    it('should maintain image aspect ratios', () => {
        cy.get('.flex-shrink-0').each($container => {
          cy.wrap($container)
            .find('img')
            .should(img => {
              // Ensure img is not undefined
              expect(img).to.not.be.undefined;
      
              // Safely access width and height
              const aspectRatio = img[0].naturalWidth / img[0].naturalHeight;
              expect(aspectRatio).to.be.closeTo(180 / 80, 0.5);
            });
        });
      });
  });