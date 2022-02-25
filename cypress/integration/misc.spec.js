describe('misc', () => {
  it('workbench data is persistent', () => {
    // we'll test this by uploading an image, refreshing the
    // page and making sure its still there
    cy.visit('/');
    cy.get('input[type="file"]')
      .attachFile("pic-transition-patrol.jpeg")
    cy.get('img[src^="blob"]').should('exist');

    cy.reload();
    cy.get('img[src^="blob"]').should('exist');
  });
})