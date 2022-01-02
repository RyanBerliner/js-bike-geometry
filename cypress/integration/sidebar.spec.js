import {DISTORTION_ROTATIONAL, DISTORTION_TRANSLATIONAL} from '../../src/workbenchReducer';

describe('layer ui', () => {
  before(() => {
    cy.visit('/');
  });

  it('can add many distortion layers', () => {
    for (var i = 1; i <= 3; i++) {
      cy.get('button').contains(/add distortion layer/i).click();
      cy.get('#layer-modal input[name="name"]').clear().type(`layer ${i}`, {delay:0});
      cy.get('#layer-modal select[name="type"]').select(DISTORTION_TRANSLATIONAL);
      cy.get('#layer-modal button[type="submit"]').click();

      // new layer should exist in the list
      cy.get('li').contains(`layer ${i}`).should('exist');
    }
  });

  it('can edit distortion layers through the modal', () => {
    cy.get('button[data-bs-layerid="2"]').click();
    cy.get('#layer-modal input[name="name"]').type(' - changed', {delay:0});
    cy.get('#layer-modal select[name="type"]').select(DISTORTION_ROTATIONAL);
    cy.get('#layer-modal button[type="submit"]').click();

    // should show up updated in the list
    cy.get('li').contains(/layer 2 - changed/i).should('exist');
    cy.get('li').contains(/rotational/i).should('exist');
  });

  it('can delete distortion layers through the modal', () => {
    cy.get('button[data-bs-layerid="1"]').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting, testing-library/await-async-utils
    cy.wait(500);  // bootstrap modals cannot be hidden while transitioning

    cy.get('#layer-modal button').contains('Delete').click();
    
    // should hide modal and remove from list
    cy.get('#layer-modal').should('not.be.visible');
    cy.get('li').contains(/layer 1/i).should('not.exist');
  });

  it('can select and unselect layer to draw', () => {
    // toggle a single one on and off
    cy.get('#layer-2 button').contains(/draw/i).click();
    cy.get('#layer-2 button').contains(/stop/i).should('exist');
    cy.get('#layer-2 button').contains(/stop/i).click();
    cy.get('#layer-2 button').contains(/draw/i).should('exist');

    // stop drawing by starting to draw another
    cy.get('#layer-2 button').contains(/draw/i).click();
    cy.get('#layer-2 button').contains(/stop/i).should('exist');
    cy.get('#layer-3 button').contains(/draw/i).click();
    cy.get('#layer-2 button').contains(/stop/i).should('not.exist');
    cy.get('#layer-3 button').contains(/stop/i).should('exist');
    cy.get('#layer-3 button').contains(/stop/i).click();
  });
})