given("there are no export jobs pending", () => {
  cy.server();

  //login
  cy.fixture('admin').as("user");
  cy.get('@user').then((userData) => {
    cy.getToken(userData.username, userData.password)
      .then((token) => {
        // get job list
        cy.request({
          'url': Cypress.env('apiUrl') + '/v2/export/jobs',
          'method': 'GET',
          'auth': {'bearer': token}
        }).then((queriesResponce) => {
          queriesResponce.body["exportJobs"].map(x => x["id"]).forEach(x => {
            cy.request({
              'url': Cypress.env('apiUrl') + '/v2/export/' + x,
              'method': 'DELETE',
              'auth': {'bearer': token}
            });
          })
        });

      })
  });
});

when('I select all data', () => {
  cy.get('.gb-nav').contains('Export').click();
  cy.get('.checkAllText').find(".ui-chkbox-box").click()
});

when('I export this data with the name {string}', (jobName) => {
  cy.get('#exportJobNameInput').type(jobName);
  cy.contains('Create export').click();
});

then('then the job {string} has status {string}', (jobName, status) => {
  cy.get('tr.ui-datatable-even').should('contain', jobName).and('contain', status);
});
