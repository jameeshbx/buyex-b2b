describe('Advantage Section', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('should render the section with correct layout', () => {
      cy.get('section')
        .should('have.class', 'py-16')
        .should('have.class', 'px-4')
        .should('have.class', 'max-w-7xl')
        .should('have.class', 'mx-auto');
    });
  
    it('should display the main heading with correct styling', () => {
      cy.get('section h2')
        .should('contain', 'The Buyex Forex Advantage')
        .should('be.visible')
        .should('have.class', 'text-4xl')
        .should('have.class', 'md:text-5xl')
        .should('have.class', 'font-bold')
        .should('have.class', 'font-playfair')
        .should('have.class', 'text-dark-blue')
        .should('have.class', 'mb-3');
    });
  
    it('should display the description paragraph with correct styling', () => {
      cy.get('section p')
        .should('contain', 'Buyex Forex B2B Services covers a wide range')
        .should('be.visible')
        .should('have.class', 'text-light-gray')
        .should('have.class', 'max-w-3xl')
        .should('have.class', 'mx-auto');
    });
  
    it('should display all advantage items with correct structure', () => {
      cy.get('.grid').should('have.class', 'grid-cols-1').and('have.class', 'md:grid-cols-3');
      cy.get('.grid').should('have.class', 'gap-8');
  
      cy.get('.bg-off-white').should('have.length', advantageItems.length);
  
      advantageItems.forEach((item, index) => {
        cy.get(`.bg-off-white:eq(${index})`).within(() => {
          // Check card container styling
          cy.root()
            .should('have.class', 'shadow-lg')
            .should('have.class', 'shadow-blue-500/20')
            .should('have.class', 'p-8')
            .should('have.class', 'rounded-lg');
  
          // Check icon
          cy.get('.relative')
            .should('have.class', 'w-10')
            .should('have.class', 'h-10')
            .should('have.class', 'mb-4');
          
          cy.get('img')
            .should('have.attr', 'alt', item.title)
            .should('have.attr', 'width', '40')
            .should('have.attr', 'height', '40')
            .should('have.class', 'object-contain');
  
          // Check title
          cy.get('h3')
            .should('contain', item.title)
            .should('have.class', 'text-xl')
            .should('have.class', 'font-semibold')
            .should('have.class', 'mb-3');
  
          // Check description
          cy.get('p')
            .should('contain', item.description)
            .should('have.class', 'text-light-gray');
        });
      });
    });
  
    it('should use fallback image when imageSrc is not provided', () => {
      // If any item might not have imageSrc, test the fallback
      const itemsWithFallback = advantageItems.filter(item => !item.imageSrc);
      if (itemsWithFallback.length > 0) {
        cy.get('img[src="/placeholder.svg"]').should('exist');
      }
    });
  });
  
  // Mock your advantageItems data to match your actual data structure
  const advantageItems = [
    {
      title: "Education Remittance",
      description: "Partner with us for custom B2B Study Abroad Forex Solutions...",
      imageSrc: "/path/to/image1.svg"
    },
    {
      title: "Blocked Account Opening",
      description: "A blocked account proves financial readiness for German visas...",
      imageSrc: "/path/to/image2.svg"
    },
    {
      title: "Education Loans", 
      description: "We simplify student loan approvals with expert guidance...",
      imageSrc: "/path/to/image3.svg"
    }
  ];