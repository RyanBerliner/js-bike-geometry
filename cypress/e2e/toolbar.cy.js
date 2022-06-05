// needs extra help setting range slider value
// https://github.com/cypress-io/cypress/issues/1570#issuecomment-450966053
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

describe('toolbar brush settings', () => {
  before(() => {
    cy.visit('/');
  });

  it('can change brush size', () => {
    cy.get('#brush-size').clear().type('20', {delay:0});
    cy.get('#brush-size').should('have.value', '20');
  })

  it('can change brush opacity', () => {
    cy.get('#brush-opacity').clear().type('20', {delay:0});
    cy.get('#brush-opacity').should('have.value', '20');
  })

  it('can change brush fade', () => {
    cy.get('#brush-fade').clear().type('20', {delay:0});
    cy.get('#brush-fade').should('have.value', '20');
  })
});

describe('stage zoom', () => {
  before(() => {
    cy.visit('/');
  });

  it('can be changed', () => {
    cy.get('#stage-zoom').then(($range) => {
      const range = $range[0];
      nativeInputValueSetter.call(range, 25);
      range.dispatchEvent(new Event('change', { value: 25, bubbles: true }));
    });

    cy.get('#stage-zoom').should('have.value', '25');
  });
});
