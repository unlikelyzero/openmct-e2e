// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import moment from 'moment'

Cypress.Commands.add('checkTableFirstAndLastValue', (exptectedMinutes) => {
    cy.get('[class="content-body"]').then((tbody) => {
        const first_record = tbody.find('tr:first>td').eq(1)
        const last_record = tbody.find('tr:last>td').eq(1)
        
        cy.log('Verify Table Timestample values')
        const first_timestamp = moment(first_record[0].innerText) //i.e. "2021-02-20T03:32:48.749Z"
        const last_timestamp = moment(last_record[0].innerText) //i.e. "2021-02-20T03:17:49.490Z"
        cy.log('Table first Timestamp value=' + first_timestamp)
        cy.log('Table last Timestamp value=' + last_timestamp)
        
        const duration = Math.round(first_timestamp.diff(last_timestamp,"minutes",true))
        cy.log(duration + ' minutes between first and last Timestamp')
        expect(duration).to.deep.equal(exptectedMinutes)
    })
})
