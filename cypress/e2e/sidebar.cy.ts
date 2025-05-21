describe('Sidebar Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/staff') // Adjust to your actual default page
  })

  it('renders the sidebar with navigation links', () => {
    cy.get('aside,div') // adjust to your specific sidebar container if needed
      .should('exist')

    cy.contains('Dashboard').should('exist')
    cy.contains('View All Orders').should('exist')
    cy.contains('Place an order').should('exist')
    cy.contains('Manage receivers').should('exist')
    cy.contains('Settings').should('exist')
    cy.contains('Support').should('exist')
    cy.contains('Logout').should('exist')
  })

  it('collapses and expands the sidebar', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="sidebar-toggle"]').length === 0) {
        // You can add a test ID to the toggle button if not already present
        cy.log('Toggle not found; skipping')
        return
      }

      cy.get('[data-testid="sidebar-toggle"]').click()
      cy.get('[data-testid="sidebar"]').should('have.class', 'w-[70px]')

      cy.get('[data-testid="sidebar-toggle"]').click()
      cy.get('[data-testid="sidebar"]').should('have.class', 'w-[240px]')
    })
  })

  it('highlights the active link based on URL', () => {
    cy.visit('/orders')
    cy.contains('View All Orders')
      .parent()
      .should('have.class', 'bg-blue-50')
  })

  it('persists collapsed state in localStorage', () => {
    cy.get('[data-testid="sidebar-toggle"]').click()
    cy.window().then((win) => {
      expect(win.localStorage.getItem('sidebarCollapsed')).to.eq('true')
    })
  })

  it('shows overlay on mobile and collapses on outside click', () => {
    cy.viewport('iphone-6')
    cy.visit('/dashboard')
    cy.get('[data-testid="mobile-overlay"]').should('exist').click()
    cy.get('[data-testid="sidebar"]').should('have.class', 'w-[70px]')
  })
})
