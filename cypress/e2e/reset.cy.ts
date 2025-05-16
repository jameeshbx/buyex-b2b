/// <reference types="cypress" />

describe('Reset Password Page', () => {
  const token = 'test-token'; // Replace with a valid one during real test or mock backend

  beforeEach(() => {
    cy.visit(`http://localhost:3000/reset-password`);
  });

  it('shows validation error if passwords do not match', () => {
    cy.get('input#new-password').type('Password123!');
    cy.get('input#confirm-password').type('DifferentPassword!');
    cy.get('button[type="submit"]').contains('Change Password').click();
    cy.contains('Passwords do not match').should('exist');
  });

  it('submits new password successfully', () => {
    // Intercept API call
    cy.intercept('POST', '/api/auth/reset-password', {
      statusCode: 200,
      body: { message: 'Password updated successfully' },
    }).as('resetPassword');

    cy.get('input#new-password').type('Password123!');
    cy.get('input#confirm-password').type('Password123!');
    cy.get('button[type="submit"]').contains('Change Password').click();

    cy.wait('@resetPassword');
    cy.url().should('include', '/signin'); // after 3s redirect
  });

  it('shows server error if reset fails', () => {
    cy.intercept('POST', '/api/auth/reset-password', {
      statusCode: 400,
      body: { message: 'Invalid or expired token' },
    }).as('resetFail');

    cy.get('input#new-password').type('Password123!');
    cy.get('input#confirm-password').type('Password123!');
    cy.get('button[type="submit"]').contains('Change Password').click();

    cy.wait('@resetFail');
    cy.contains('Invalid or expired token').should('exist');
  });

  it('navigates back to login page via link', () => {
    cy.contains('Login').click();
    cy.url().should('include', '/signin');
  });
});
