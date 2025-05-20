describe('Topbar Component', () => {
  beforeEach(() => {
    // Visit the page where Topbar is used (adjust this to your actual route)
    cy.visit('/your-page-route') // Replace with actual route
  })

  it('renders the breadcrumbs correctly', () => {
    cy.get('nav[aria-label="Breadcrumb"]').should('exist')
    cy.get('nav ol li').should('have.length.greaterThan', 0)

    // Check if the breadcrumb separator "/" exists when index > 0
    cy.get('nav ol li').each(($el, index, $list) => {
      if (index > 0) {
        cy.wrap($el).contains('/')
      }
    })
  })

  it('renders the current breadcrumb without a link', () => {
    // Assumes last breadcrumb is current
    cy.get('nav ol li:last').within(() => {
      cy.get('a').should('not.exist')
      cy.get('span').should('exist').and('not.have.class', 'hover:underline')
    })
  })

  it('renders breadcrumb links for non-current items', () => {
    cy.get('nav ol li a').each(($a) => {
      cy.wrap($a).should('have.attr', 'href')
      cy.wrap($a).should('have.class', 'hover:underline')
    })
  })

  it('renders the page title correctly', () => {
    cy.get('h1').should('have.class', 'text-2xl')
    cy.get('h1').should('not.be.empty')
  })
})
