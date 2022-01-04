import {DISTORTION_ROTATIONAL, DISTORTION_TRANSLATIONAL} from '../../src/workbenchReducer';

// needs extra help setting range slider value
// https://github.com/cypress-io/cypress/issues/1570#issuecomment-450966053
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

describe('layer ui', () => {
  before(() => {
    cy.visit('/');
  });

  it('can add many distortion layers', () => {
    for (var i = 1; i <= 3; i++) {
      cy.get('button').contains(/add distortion layer/i).click();
      cy.get('#layer-modal input[name="name"]').clear().type(`layer ${i}`, {delay:0});

      if (i >= 2) {
        cy.get('#layer-modal select[name="type"]').select(DISTORTION_TRANSLATIONAL);
        cy.get('#layer-modal input[name="translationalx"]').clear().type('20', {delay:0});
        cy.get('#layer-modal input[name="translationaly"]').clear().type('30', {delay:0});
      } else {
        cy.get('#layer-modal input[name="rotationalangle"]').then(($range) => {
          const range = $range[0];
          nativeInputValueSetter.call(range, 25);
          range.dispatchEvent(new Event('change', { value: 25, bubbles: true }));
        });

        cy.get('#layer-modal label').contains(/25 deg/i).should('exist');
        cy.get('#layer-modal input[name="rotationaloriginx"]').clear().type('10', {delay:0});
        cy.get('#layer-modal input[name="rotationaloriginy"]').clear().type('15', {delay:0});
      }

      
      // new layer should exist in the list after submitting
      cy.get('#layer-modal button[type="submit"]').click();
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

  it('can quick edit disortion layer adjustments inline', () => {
    cy.get('#layer-2 input[name="rotationalangle"]').then(($range) => {
      const range = $range[0];
      nativeInputValueSetter.call(range, 50);
      range.dispatchEvent(new Event('change', { value: 50, bubbles: true }));
    });
    cy.get('#layer-2 label').contains(/50 deg/i).should('exist');
    cy.get('#layer-2 input[name="rotationaloriginx"]').clear().type('1', {delay:0});
    cy.get('#layer-2 input[name="rotationaloriginy"]').clear().type('3', {delay:0});

    cy.get('#layer-3 input[name="translationalx"]').clear().type('99', {delay:0});
    cy.get('#layer-3 input[name="translationaly"]').clear().type('100', {delay:0});
  })
})