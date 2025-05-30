/// <reference types="cypress" />

describe('Change Password', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/staff/pages/changepassword') // Adjust the URL as needed
  })

  it('should load the change password page', () => {
    cy.contains('h2', 'Change Password').should('exist')
    cy.get('#newPassword').should('exist')
    cy.get('#confirmPassword').should('exist')
  })

  it('should show validation errors', () => {
    cy.contains('button', 'Save New Password').click()
    cy.contains('Please fill in all fields').should('exist')

    cy.get('#newPassword').type('password123')
    cy.get('#confirmPassword').type('differentpassword')
    cy.contains('button', 'Save New Password').click()
    cy.contains('Passwords do not match').should('exist')
  })

  it('should toggle password visibility', () => {
    cy.get('#newPassword').should('have.attr', 'type', 'password')
    cy.get('#confirmPassword').should('have.attr', 'type', 'password')

    // Toggle new password visibility
    cy.get('#newPassword').siblings('button').click()
    cy.get('#newPassword').should('have.attr', 'type', 'text')

    // Toggle confirm password visibility
    cy.get('#confirmPassword').siblings('button').click()
    cy.get('#confirmPassword').should('have.attr', 'type', 'text')
  })

  it('should successfully change password', () => {
    const newPassword = 'SecurePassword123!'

    cy.get('#newPassword').type(newPassword)
    cy.get('#confirmPassword').type(newPassword)
    cy.contains('button', 'Save New Password').click()

    // Verify success state
    cy.contains('Your Password Successfully Changed').should('exist')
    cy.contains('Sign in').should('exist')
  })

  it('should navigate to sign in after success', () => {
    const newPassword = 'SecurePassword123!'

    cy.get('#newPassword').type(newPassword)
    cy.get('#confirmPassword').type(newPassword)
    cy.contains('button', 'Save New Password').click()

    cy.contains('Sign in').click()
    // Verify navigation to sign in page
    cy.url().should('include', '/signin')
  })
})