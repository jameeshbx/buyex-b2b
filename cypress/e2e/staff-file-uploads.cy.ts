/// <reference types="cypress" />

describe('File Upload Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/staff/dashboard/upload-files/ORD040')
  })

  it('should load the page with main components', () => {
    // Check topbar
    cy.get('h1').should('contain', 'File Upload')

    // Check left card (upload section)
    cy.contains('Zoe Fernandes').should('exist')
    cy.contains('Completed').should('exist')
    cy.contains('Drag and drop files here').should('exist')

    // Check right card (messages section) 
    cy.get('input[placeholder="Type a message"]').should('exist')

    // Check files table
    cy.get('table').should('exist')
    cy.contains('Files').should('exist')
    cy.contains('Comment').should('exist')
    cy.contains('Actions').should('exist')
  })

  describe('File Upload', () => {
    it('should select and upload a file', () => {
      // Create a simple test file
      const fileName = 'test.txt'
      const fileContent = 'Hello World'
      
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: fileName,
        mimeType: 'text/plain'
      }, { force: true })

      // Add comment
      cy.get('input[placeholder="Add a comment..."]').type('Test comment')

      // Click upload button
      cy.contains('Upload').click()

      // Verify success message
      cy.contains('Files uploaded successfully').should('exist')

      // Verify file appears in table
      cy.get('table').contains(fileName).should('exist')
    })

    it('should show drag and drop area styling', () => {
      // Check initial state
      cy.get('.border-dashed').should('exist')
      
      // Test drag enter effect
      cy.get('.border-dashed').trigger('dragenter')
      cy.get('.border-dashed').should('have.class', 'border-blue-500')
    })
  })

  describe('File Management', () => {
    beforeEach(() => {
      // Upload a test file first
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('test content'),
        fileName: 'sample.txt',
        mimeType: 'text/plain'
      }, { force: true })

      cy.get('input[placeholder="Add a comment..."]').type('Initial comment')
      cy.contains('Upload').click()
      cy.contains('Files uploaded successfully').should('exist')
    })

    it('should allow file editing', () => {
      // Click edit button (first edit icon in the table)
      cy.get('table').within(() => {
        cy.get('button').contains('svg').first().click() // Edit button
      })

      // Check if edit dialog opens
      cy.contains('Edit File').should('exist')

      // Edit the file name and comment
      cy.get('#fileName').clear().type('updated-file.txt')
      cy.get('#comment').clear().type('Updated comment')

      // Save changes
      cy.contains('Save Changes').click()

      // Verify success message
      cy.contains('File updated successfully').should('exist')
    })

    it('should allow file deletion', () => {
      // Click delete button (last button in actions)
      cy.get('table').within(() => {
        cy.get('button svg').last().click() // Delete button
      })

      // Verify deletion message
      cy.contains('File deleted').should('exist')
    })

    it('should allow file selection for sharing', () => {
      // Select file checkbox
      cy.get('table input[type="checkbox"]').first().check()

      // Click share button
      cy.contains('Share to Student').click()

      // Verify share message
      cy.contains('has been shared with the student').should('exist')
    })
  })

  describe('Messaging', () => {
    it('should send a message', () => {
      const testMessage = 'Test message from Cypress'
      
      // Type message
      cy.get('input[placeholder="Type a message"]').type(testMessage)
      
      // Send message (click send button)
      cy.get('button').contains('svg').click() // Send button
      
      // Verify message appears in chat
      cy.contains(testMessage).should('exist')
    })

    it('should send message with Enter key', () => {
      const testMessage = 'Test message with Enter'
      
      // Type message and press Enter
      cy.get('input[placeholder="Type a message"]').type(`${testMessage}{enter}`)
      
      // Verify message appears
      cy.contains(testMessage).should('exist')
    })
  })
})