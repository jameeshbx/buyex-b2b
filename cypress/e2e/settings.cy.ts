/// <reference types="cypress" />

describe('Profile Settings', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/staff/pages/settings') // Adjust the URL as needed
  })

  it('should load the profile settings page', () => {
    cy.contains('h1', 'Profile Settings').should('exist')
    cy.contains('button', 'Profile').should('exist')
    cy.contains('a', 'Change password').should('exist')
  })

  it('should allow switching between tabs', () => {
    cy.contains('button', 'Profile').should('have.class', 'border-blue-500')
    cy.contains('a', 'Change password').click()
    // Verify navigation to change password page
    cy.url().should('include', '/changepassword')
  })

  it('should upload a profile picture', () => {
    const fileName = 'test-avatar.jpg'
    cy.fixture(fileName).then(fileContent => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName,
        mimeType: 'image/jpeg',
      })
    })
    
    cy.get('img[alt="Profile"]').should('exist')
    cy.contains('button', 'Remove photo').should('exist').click()
    cy.get('img[alt="Profile"]').should('not.exist')
  })

  it('should update profile information', () => {
    const testData = {
      fullName: 'John Doe',
      username: 'johndoe',
      bio: 'Software Developer',
      email: 'john.doe@example.com',
      phoneNumber: '9876543210'
    }

    cy.get('#fullName').type(testData.fullName)
    cy.get('#username').type(testData.username)
    cy.get('#bio').type(testData.bio)
    cy.get('#email').type(testData.email)
    cy.get('#phoneNumber').type(testData.phoneNumber)

    // Verify the values were entered correctly
    cy.get('#fullName').should('have.value', testData.fullName)
    cy.get('#username').should('have.value', testData.username)
    cy.get('#bio').should('have.value', testData.bio)
    cy.get('#email').should('have.value', testData.email)
    cy.get('#phoneNumber').should('have.value', testData.phoneNumber)

    cy.contains('button', 'Update Profile').click()
    // Add assertions for successful update here
  })

  it('should reset the form', () => {
    cy.get('#fullName').type('Test Name')
    cy.contains('button', 'Reset').click()
    cy.get('#fullName').should('have.value', '')
  })
})