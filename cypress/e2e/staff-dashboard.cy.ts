// cypress/e2e/dashboard.cy.ts

describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/staff/dashboard')
  })

  it('should render dashboard header and order history card', () => {
    cy.contains('h1', 'Dashboard').should('be.visible')
    cy.contains('Get summary of your portal here.').should('be.visible')
    cy.contains('Order history').should('be.visible')
  })

  it('should render orders in desktop or mobile layout', () => {
    cy.get('body').then(($body) => {
      if ($body.find('.lg\\:grid').length > 0) {
        // Desktop layout
        cy.get('.lg\\:grid-cols-10').should('exist')
      } else {
        // Mobile layout
        cy.get('[class*=p-4]').should('exist')
      }
    })
  })

  it('should allow expanding and collapsing order rows', () => {
    cy.get('.cursor-pointer').first().as('firstRow')
    cy.get('@firstRow').click()
    cy.get('@firstRow').next().should('be.visible')
    cy.get('@firstRow').click()
    cy.get('@firstRow').next().should('not.be.visible')
  })

  it('should show non-editable status as badge or link', () => {
    cy.get('[class*=cursor-pointer]').each(($row) => {
      cy.wrap($row).find('a, .badge').should('exist')
    })
  })

  it('should allow changing editable order status via dropdown', () => {
    cy.get('[class*=cursor-pointer]').each(($row) => {
      cy.wrap($row).within(() => {
        if ($row.find('button[role=combobox]').length) {
          cy.get('button[role=combobox]').click()
          cy.get('[role=option]').first().click()
          cy.get('[role=option]').first().then($option => {
            const optionText = Cypress._.trim($option.text());
            cy.get('button[role=combobox]').should('contain.text', optionText);
          })
        }
      })
    })
  })

  it('should open uploads modal or perform uploads button action', () => {
    cy.get('button').contains('Uploads').first().click()
    // Assuming clicking "Uploads" shows a modal or triggers some UI
    // Add specific assertions based on actual UI behavior:
    // e.g., cy.get('.upload-modal').should('be.visible')
  })

  it('should navigate to sender-details if status is "Quote downloaded"', () => {
    cy.get('a')
      .contains('Quote downloaded')
      .first()
      .should('have.attr', 'href')
      .and('include', '/staff/dashboard/sender-details')
  })
})
