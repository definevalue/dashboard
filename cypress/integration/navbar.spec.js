const { default: axios } = require('axios')

describe('test home page', () => {
    beforeEach(() => {
        cy.intercept('post', '/auth', { fixture: 'login.json' }).as('login')
        cy.intercept('post', '/general-info', { fixture: 'generalInfo.json' }).as('generalInfo')
        cy.intercept('post', '/get-config', { fixture: 'getConfig.json' }).as('getConfig')
        cy.intercept('post', '/update-config', { fixture: 'updateConfig.json' }).as('updateConfig')
        cy.intercept('post', 'feedback', { fixture: 'feedback.json' }).as('feedback')

        sessionStorage.auth_key = null
        axios.defaults.headers.common.Authorization = null
        cy.visit('/')
        cy.contains('Welcome Back!')
        cy.get('input').type('test')
        cy.get('button').click()
    })

    it('test nav bar elements', () => {
        // close notification
        cy.get('.notyf__dismiss-btn').click()

        // check left navbar links
        cy.get('#import-candles-page-button').click()
        cy.url().should('include', '/candles/1')

        cy.get('#backtest-page-button').click()
        cy.url().should('include', '/backtest/1')

        cy.get('#live-page-button').click()
        cy.url().should('include', '/live/1')

        // check feedback
        cy.get('#open-feedback-button').click()
        cy.wait(50)
        cy.get('#feedback-description').should('include.text', "I would love to hear your feedback whether it's about a bug, suggestion, something you like, or something you hate about Jesse")
        // submit button is disabled when description is empty
        cy.get('#feedback-submit-button').should('be.disabled')
        cy.get('#description').type('some test description')
        cy.wait(50)
        cy.get('#description').should('have.value', 'some test description')
        cy.get('#feedback-submit-button').should('not.disabled')
        cy.get('#feedback-submit-button').click()
        cy.get('.notyf__message').should('include.text', 'Feedback submitted successfully')
        cy.get('#feedback-description').should('have.value', '')
        cy.get('#feedback-cancel-button').click()
        cy.get('#feedback-description').should('not.exist')
    })
})