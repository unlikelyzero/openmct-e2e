import { expect } from 'chai'
import moment from 'moment'

/**
 *
 * Requirement Description:
 *  The application shall retrieve the last 15 minutes of historical telemetry
 *  data from the telemetry server when loaded.
 *
 *  TODO Replace momentjs with dayjs
 *
 **/

describe('OPENMCT-1 Functional', () => {
  it('OPENMCT-1-F001 - Application receives 15 minutes of historical telemetry data from server and renders data on table', () => {
    cy.intercept('GET', '/sockjs-node/info?t=**').as('loaded') //cy.intercept exposes the browser network traffic to the test
    cy.intercept({
      pathname: '/history/pwr.v',
      query: {
        start: '**',
        end: '**',
      },
    }).as('pwrv')
    cy.intercept({
      pathname: '/history/pwr.c',
      query: {
        start: '**',
        end: '**',
      },
    }).as('pwrc')
    cy.visit('/')
    cy.wait(['@loaded', '@loaded']).then((intercepted) => {
      cy.log('Verify sockjs request starttimes')
      expect(intercepted[0].request.url).to.exist
      expect(intercepted[1].request.url).to.exist
      const start0_time = moment(parseInt(intercepted[0].request.url.match(/\d+$/)))
      const start1_time = moment(parseInt(intercepted[1].request.url.match(/\d+$/)))
      cy.log('sockjs request start0=' + start0_time)
      cy.log('sockjs request start1=' + start1_time)
    })
    cy.wait('@pwrv').then((intercepted) => {
      expect(intercepted.response.url).to.exist
      expect(intercepted.response.statusCode).to.eq(200)

      cy.log('Verify /history/pwr.v server response')
      const start_url = moment(parseInt(intercepted.response.url.match(/\d+/g)[1])) //TODO Fix Regex
      const end_url = moment(parseInt(intercepted.response.url.match(/\d+$/))) //TODO Fix Regex
      const duration_url = Math.round(end_url.diff(start_url, 'minutes', true))
      cy.log('/history/pwr.v server response start=' + start_url)
      cy.log('/history/pwr.v server response end=' + end_url)
      cy.log('/history/pwr.v duration=' + duration_url + ' minutes')
      expect(duration_url).to.deep.equal(15)

      cy.log('Verify /history/pwr.v payload')
      const first_timestamp = moment(parseInt(intercepted.response.body[0].timestamp))
      const last_timestamp = moment(parseInt(intercepted.response.body.pop().timestamp))
      const duration_timestamp = Math.round(last_timestamp.diff(first_timestamp, 'minutes', true))
      cy.log('/history/pwr.v payload start=' + first_timestamp)
      cy.log('/history/pwr.v payload end=' + last_timestamp)
      cy.log('/history/pwr.v payload duration=' + duration_timestamp + ' minutes')
      expect(duration_url).to.deep.equal(15)
    })
    cy.wait('@pwrc').then((intercepted) => {
      expect(intercepted.response.url).to.exist
      expect(intercepted.response.statusCode).to.eq(200)

      cy.log('Verify /history/pwr.c server response')
      const start_url = moment(parseInt(intercepted.response.url.match(/\d+/g)[1])) //TODO Fix Regex
      const end_url = moment(parseInt(intercepted.response.url.match(/\d+$/))) //TODO Fix Regex
      const duration_url = Math.round(end_url.diff(start_url, 'minutes', true))
      cy.log('/history/pwr.c server response start=' + start_url)
      cy.log('/history/pwr.c server response end=' + end_url)
      cy.log('/history/pwr.c duration=' + duration_url + ' minutes')
      expect(duration_url).to.deep.equal(15)

      cy.log('Verify /history/pwr.c payload')
      const first_timestamp = moment(parseInt(intercepted.response.body[0].timestamp)) //TODO optimize
      const last_timestamp = moment(parseInt(intercepted.response.body.pop().timestamp))
      const duration_timestamp = Math.round(last_timestamp.diff(first_timestamp, 'minutes', true))
      cy.log('/history/pwr.c payload start=' + first_timestamp)
      cy.log('/history/pwr.c payload end=' + last_timestamp)
      cy.log('/history/pwr.c payload duration=' + duration_timestamp + ' minutes')
      expect(duration_url).to.deep.equal(15)
    })

    cy.get('.timestamp-sort').should('be.visible')
    cy.checkTableFirstAndLastValue(15)
  })
  it('OPENMCT-1-F002 - Application receives 15 minutes of historical telemetry data from server when choosing each or all telemetry point(s)', () => {
    cy.intercept('GET', '/sockjs-node/info?t=**').as('loaded')
    cy.visit('/')
    cy.wait(['@loaded', '@loaded'])

    cy.checkTableFirstAndLastValue(15)
    cy.get('[value="pwr.v"]').click()
    cy.checkTableFirstAndLastValue(15)
    cy.get('[value="pwr.c"]').click()
    cy.checkTableFirstAndLastValue(15)
    cy.get('[value="pwr.v"]').click({ shiftKey: true }) //Selects both pwr.v and pwr.c
    cy.checkTableFirstAndLastValue(15)
  })
})

describe('OPENMCT-1 Negative', () => {
  it('OPENMCT-1-N001 - Application does not render table if telemetry data is not received from server', () => {
    cy.intercept('/sockjs-node/info?t=**', { forceNetworkError: true }) //Intercepts and blocks all network requests against a target URL
    cy.intercept('/history/', { forceNetworkError: true })
    cy.visit('/')
    cy.get('.timestamp-sort').should('exist').and('be.visible')
    cy.get('[class="content-body"]').should('exist').and('not.be.visible')
  })
  it('OPENMCT-1-N003 - Historical data is requested based on browser clock and historical data does not appear if not available', () => {
    cy.intercept('GET', '/sockjs-node/info?t=**').as('loaded')
    cy.visit('/')
    cy.wait(['@loaded', '@loaded'])

    cy.get('[class="content-body"]').then((tbody) => {
      const first_record = tbody.find('tr:first>td').eq(1)
      cy.log('Verify Table Timestamp values')

      const first_timestamp = moment(first_record[0].innerText) //i.e. "2021-02-20T03:32:48.749Z"
      cy.log(first_timestamp._i)
    })
    cy.checkTableFirstAndLastValue(15)

    const past = Date.UTC(2018, 10, 30)
    cy.clock(past, ['Date'])
    cy.log('Set time of browser to time in past ' + past + ' and reload page')

    cy.reload() //refresh browser with new date
    cy.wait(['@loaded', '@loaded']).then((intercepted) => {
      cy.log('Verify sockjs request starttimes')
      expect(intercepted[0].request.url).to.exist
      expect(intercepted[1].request.url).to.exist
      const start0_time = moment(parseInt(intercepted[0].request.url.match(/\d+$/)))
      const start1_time = moment(parseInt(intercepted[1].request.url.match(/\d+$/)))
      cy.log('sockjs request start0=' + start0_time)
      cy.log('sockjs request start1=' + start1_time)
      expect(start0_time).to.deep.equal(moment(parseInt(past)))
      expect(start1_time).to.deep.equal(moment(parseInt(past)))
      cy.log(start0_time + ' and ' + start1_time + ' are equal to new clock value=' + moment(parseInt(past)))
    })
    cy.verifyEmptyTable()
  })
})

describe('OPENMCT-1 Non-functional', () => {
  it('OPENMCT-1-NF001 - Application displays locale-based timestamp format for non-en browsers', () => {
    //Note: This test will fail due to the missing locales
    cy.intercept('GET', '/sockjs-node/info?t=**').as('loaded')
    cy.visit('/')
    cy.wait(['@loaded', '@loaded'])
    cy.reload(true).then((window) => {
      // Set language on Launch
      Object.defineProperty(window.navigator, 'language', { value: 'ja-JP' })
      Object.defineProperty(window.navigator, 'languages', ['ja-JP'])
    })
    cy.wait(['@loaded', '@loaded'])
    cy.get('[class="content-body"]').then((tbody) => {
      const first_record = tbody.find('tr:first>td').eq(1)
      cy.log('Verify Table Timestamp values')

      const first_timestamp = moment(first_record[0].innerText) //i.e. "2021-02-20T03:32:48.749Z"
      cy.log(first_timestamp)
      expect(first_timestamp._i).to.contain(/日+/)
    })
  })
})
