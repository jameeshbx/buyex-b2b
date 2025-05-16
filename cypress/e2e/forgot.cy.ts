/// <reference types="cypress" />

describe('Forgot Password Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/forgot-password');
  });

  it('should display the forgot password form', () => {
    cy.get('[data-cy="reset-form"]').should('exist');
    cy.get('[data-cy="email-input"]').should('exist');
    cy.get('[data-cy="reset-button"]').should('exist');
    cy.contains('Forgotten Password').should('exist');
    cy.contains('Want to go back?').should('exist');
  });

  it('should show validation error for invalid email', () => {
    cy.get('[data-cy="email-input"]').type('invalid-email');
    cy.get('[data-cy="reset-button"]').click();
    cy.contains('Please enter a valid email').should('exist');
  });

  it('should submit the form successfully', () => {
    // Mock successful API response
    cy.intercept('POST', '/api/auth/forgot-password', {
      statusCode: 200,
      body: { message: 'Password reset email sent' },
    }).as('forgotPassword');

    cy.get('[data-cy="email-input"]').type('valid@example.com');
    cy.get('[data-cy="reset-button"]').click();

    cy.wait('@forgotPassword');
    cy.contains('Password reset email sent').should('exist');
  });

  it('should show error message when submission fails', () => {
    // Mock failed API response
    cy.intercept('POST', '/api/auth/forgot-password', {
      statusCode: 400,
      body: { message: 'Email not found' },
    }).as('forgotPasswordFail');

    cy.get('[data-cy="email-input"]').type('nonexistent@example.com');
    cy.get('[data-cy="reset-button"]').click();

    cy.wait('@forgotPasswordFail');
    cy.contains('Email not found').should('exist');
  });

  it('should navigate back to login page', () => {
    cy.contains('Login').click();
    cy.url().should('include', '/signin');
  });

  it('should show loading state during submission', () => {
    // Mock slow API response
    cy.intercept('POST', '/api/auth/forgot-password', {
      delay: 1000,
      statusCode: 200,
      body: { message: 'Password reset email sent' },
    }).as('forgotPasswordSlow');

    cy.get('[data-cy="email-input"]').type('valid@example.com');
    cy.get('[data-cy="reset-button"]').click();

    // Check for loading spinner
    cy.get('[data-cy="reset-button"]').within(() => {
      cy.get('div[class*="animate-spin"]').should('exist');
    });

    cy.wait('@forgotPasswordSlow');
  });
});