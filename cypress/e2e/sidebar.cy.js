import 'cypress-file-upload';
import {DISTORTION_ROTATIONAL, DISTORTION_TRANSLATIONAL} from '../../src/workbenchReducer';

// needs extra help setting range slider value
// https://github.com/cypress-io/cypress/issues/1570#issuecomment-450966053
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

describe('image upload ui', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can upload image, remove and repalce', () => {
    cy.get('input[type="file"]')
      .attachFile("pic-transition-patrol.jpeg")
    cy.get('img[src^="blob"]').should('exist');
    cy.get('[data-testid="remove-upload"]').should('exist');
    cy.get('[data-testid="upload-dimensions"]').contains(/2400 x 1464/i).should('exist');
    cy.get('[data-testid="remove-upload"]').click();
    cy.get('input[type="file"]').should('be.focused');
    cy.get('input[type="file"]')
      .attachFile("pic-commencal-meta-sx.jpeg")
    cy.get('img[src^="blob"]').should('exist');
    cy.get('[data-testid="remove-upload"]').should('exist');
    cy.get('[data-testid="upload-dimensions"]').contains(/2000 x 1280/i).should('exist');
  })
})

describe('layer ui', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.get('button').contains(/add distortion layer/i).as('addBtn');
    cy.get('#layer-modal').as('modal')
    cy.get('#layer-modal input[name="name"]').as('modalName')
    cy.get('#layer-modal select[name="type"]').as('modalType')
    cy.get('#layer-modal button[type="submit"]').as('modalSubmit')
  });

  it('can add many distortion layers', () => {
    for (var i = 1; i <= 3; i++) {
      cy.get('@addBtn').click();
      cy.get('@modalName').clear().type(`layer ${i}`, {delay:0});

      if (i >= 2) {
        cy.get('@modalType').select(DISTORTION_TRANSLATIONAL);
        cy.get('@modal').find('input[name="translationalx"]').clear().type('20', {delay:0});
        cy.get('@modal').find('input[name="translationaly"]').clear().type('30', {delay:0});
      } else {
        cy.get('@modal').find('input[name="rotationalangle"]').then(($range) => {
          const range = $range[0];
          nativeInputValueSetter.call(range, 25);
          range.dispatchEvent(new Event('change', { value: 25, bubbles: true }));
        });

        cy.get('@modal').find('label').contains(/25 deg/i).should('exist');
        cy.get('@modal').find('input[name="rotationaloriginx"]').clear().type('10', {delay:0});
        cy.get('@modal').find('input[name="rotationaloriginy"]').clear().type('15', {delay:0});
      }

      // new layer should exist in the list after submitting
      cy.get('@modalSubmit').click();
      cy.get('li').contains(`layer ${i}`).should('exist');
    }
  });

  it('can edit distortion layers through the modal', () => {
    // create a layer
    cy.get('@addBtn').click();
    cy.get('@modalType').select(DISTORTION_TRANSLATIONAL);
    cy.get('@modal').find('input[name="translationalx"]').clear().type('20', {delay:0});
    cy.get('@modal').find('input[name="translationaly"]').clear().type('30', {delay:0});
    cy.get('@modalSubmit').click();

    // make sure we can edit it
    cy.get('button[data-bs-layerid="1"]').click();
    cy.get('@modalName').type(' - changed', {delay:0});
    cy.get('@modalSubmit').click();

    cy.get('li').contains(/layer - changed/i).should('exist');
  });

  it('can delete distortion layers through the modal', () => {
    // create a layer
    cy.get('@addBtn').click();
    cy.get('@modalType').select(DISTORTION_TRANSLATIONAL);
    cy.get('@modal').find('input[name="translationalx"]').clear().type('20', {delay:0});
    cy.get('@modal').find('input[name="translationaly"]').clear().type('30', {delay:0});
    cy.get('@modalSubmit').click();

    cy.get('li').contains(/new layer/i).should('exist');

    cy.get('button[data-bs-layerid="1"]').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting, testing-library/await-async-utils
    cy.wait(500);  // bootstrap modals cannot be hidden while transitioning

    cy.get('@modal').find('button').contains('Delete').click();
    
    // should hide modal and remove from list
    cy.get('@modal').should('not.be.visible');
    cy.get('li').contains(/new layer/i).should('not.exist');
  });

  it('can select and unselect layer to draw', () => {
    for (let i = 0; i < 2; i++) {
      cy.get('@addBtn').click();
      cy.get('@modalType').select(DISTORTION_TRANSLATIONAL);
      cy.get('@modal').find('input[name="translationalx"]').clear().type('20', {delay:0});
      cy.get('@modal').find('input[name="translationaly"]').clear().type('30', {delay:0});
      cy.get('@modalSubmit').click();
    }

    // toggle a single one on and off
    cy.get('#layer-1 button').contains(/draw/i).click();
    cy.get('#layer-1 button').contains(/stop/i).should('exist');
    cy.get('#layer-1 button').contains(/stop/i).click();
    cy.get('#layer-1 button').contains(/draw/i).should('exist');

    // stop drawing by starting to draw another
    cy.get('#layer-2 button').contains(/draw/i).click();
    cy.get('#layer-2 button').contains(/stop/i).should('exist');
    cy.get('#layer-1 button').contains(/draw/i).click();
    cy.get('#layer-2 button').contains(/stop/i).should('not.exist');
    cy.get('#layer-1 button').contains(/stop/i).should('exist');
    cy.get('#layer-1 button').contains(/stop/i).click();
  });

  it('can quick edit disortion layer adjustments inline', () => {
    cy.get('@addBtn').click();
    cy.get('@modalType').select(DISTORTION_TRANSLATIONAL);
    cy.get('@modal').find('input[name="translationalx"]').clear().type('20', {delay:0});
    cy.get('@modal').find('input[name="translationaly"]').clear().type('30', {delay:0});
    cy.get('@modalSubmit').click();

    cy.get('#layer-1 input[name="translationalx"]').clear().type('99', {delay:0});
    cy.get('#layer-1 input[name="translationaly"]').clear().type('100', {delay:0});
  })
})