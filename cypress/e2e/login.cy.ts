/// <reference types="cypress" />

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signin'); // Adjust if your login route is different
  });

  it('shows validation errors for empty fields', () => {
    cy.get('[data-testid="login-button"]').click();

    cy.contains('Email is required').should('exist');
    cy.contains('Password is required').should('exist');
  });

  it('shows error for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Invalid credentials');
    });
  });

  it('logs in with valid credentials and redirects to dashboard', () => {
    // Mocking signIn response (requires backend or mock server)
    cy.intercept('POST', '/api/auth/callback/credentials', {
      statusCode: 200,
      body: { ok: true, url: '/dashboard' },
    }).as('loginRequest');

    cy.get('[data-testid="email-input"]').type('valid@example.com');
    cy.get('[data-testid="password-input"]').type('correctpassword');
    cy.get('[data-testid="login-button"]').click();

    // Wait for redirect
    cy.url().should('include', '/dashboard');
  });

  
});
