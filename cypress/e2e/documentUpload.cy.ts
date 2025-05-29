/// <reference types="cypress" />

describe('Document Upload Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/staff/dashboard/document-upload')
  })

  it('should load the form correctly', () => {
    cy.contains('h2', 'Sender Details').should('be.visible')
    cy.contains('h2', 'Student Details').should('be.visible')
    cy.contains('h2', 'University related documents').should('be.visible')
    cy.contains('button', /CONTINUE/i).should('be.visible')
    cy.contains('button', /RESET/i).should('be.visible')
  })

  describe('Sender Details Section', () => {
    it('should validate required fields in sender details', () => {
      cy.contains('button', /CONTINUE/i).click()
      cy.contains('Payer PAN is required').should('be.visible')
      cy.contains('Aadhaar is required').should('be.visible')
    })

    it('should accept valid file uploads for sender details', () => {
      // Create test files if they don't exist
      cy.writeFile('cypress/fixtures/test-image.jpg', '')
      
      // Payer PAN
      cy.contains('label', /Payer's PAN\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })
      cy.contains('test-image.jpg').should('be.visible')
      
      // Aadhaar
      cy.contains('label', /Aadhaar \(front and back\)\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })
      cy.contains('test-image.jpg').should('be.visible')
    })

    it('should show error for invalid file types', () => {
      // Create test files if they don't exist
      cy.writeFile('cypress/fixtures/test-file.txt', '')
      
      cy.contains('label', /Payer's PAN\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-file.txt', { force: true })
      cy.contains('Invalid file type').should('be.visible')
    })
  })

  describe('Student Details Section', () => {
    it('should validate required fields in student details', () => {
      cy.contains('button', /CONTINUE/i).click()
      cy.contains('Payer PAN is required').should('be.visible')
      cy.contains('Aadhaar is required').should('be.visible')
    })

    it('should accept valid file uploads for student details', () => {
      // Create test files if they don't exist
      cy.writeFile('cypress/fixtures/test-image.jpg', '')
      
      // Payer PAN
      cy.contains('label', /Payer's PAN\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })
      cy.contains('test-image.jpg').should('be.visible')
    })
  })

  describe('University Documents Section', () => {
    it('should validate required fields in university documents', () => {
      cy.contains('button', /CONTINUE/i).click()
      cy.contains('Fee receipt is required').should('be.visible')
      cy.contains('Loan sanction letter is required').should('be.visible')
      cy.contains('Offer letter is required').should('be.visible')
    })

    it('should accept only PDF files for university documents', () => {
      // Create test files if they don't exist
      cy.writeFile('cypress/fixtures/test-document.pdf', '')
      cy.writeFile('cypress/fixtures/test-image.jpg', '')
      
      // Fee receipt
      cy.contains('label', /University fee receipt\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-document.pdf', { force: true })
      cy.contains('test-document.pdf').should('be.visible')
      
      // Try invalid file type
      cy.contains('label', /University fee receipt\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })
      cy.contains('Only PDF files are allowed').should('be.visible')
    })
  })

  describe('Form Submission', () => {
    it('should submit successfully when all required fields are filled', () => {
      // Create test files if they don't exist
      cy.writeFile('cypress/fixtures/test-image.jpg', '')
      cy.writeFile('cypress/fixtures/test-document.pdf', '')
      
      // Fill sender details
      cy.contains('label', /Payer's PAN\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })
      cy.contains('label', /Aadhaar \(front and back\)\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })

      // Fill student details
      cy.contains('label', /Payer's PAN\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })
      cy.contains('label', /Aadhaar \(front and back\)\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })

      // Fill university documents
      cy.contains('label', /University fee receipt\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-document.pdf', { force: true })
      cy.contains('label', /Education loan sanction letter\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-document.pdf', { force: true })
      cy.contains('label', /University offer letter\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-document.pdf', { force: true })

      cy.contains('button', /CONTINUE/i).click()
      // Check for success message in toast
      cy.get('.sonner-toast').should('contain', 'Documents uploaded successfully!')
    })

    it('should show error toast when required fields are missing', () => {
      cy.contains('button', /CONTINUE/i).click()
      // Check for error message in toast
      cy.get('.sonner-toast').should('contain', 'Please fill all required fields')
    })
  })

  describe('Reset Functionality', () => {
    it('should clear all form fields when reset is clicked', () => {
      // Create test files if they don't exist
      cy.writeFile('cypress/fixtures/test-image.jpg', '')
      cy.writeFile('cypress/fixtures/test-document.pdf', '')
      
      // Fill some fields
      cy.contains('label', /Payer's PAN\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })
      cy.contains('label', /Aadhaar \(front and back\)\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })
      cy.contains('label', /University fee receipt\*/i).parent().find('input[type="file"]').selectFile('cypress/fixtures/test-document.pdf', { force: true })

      // Click reset
      cy.contains('button', /RESET/i).click()

      // Verify fields are cleared
      cy.contains('test-image.jpg').should('not.exist')
      cy.contains('test-document.pdf').should('not.exist')
    })
  })
})