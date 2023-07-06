import 'cypress-file-upload';

// TODO: come up with another way to verify stage responds appropriately
// visual snapshots?

describe('stage responsiveness', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.get('input[type="file"]')
      .attachFile("pic-transition-patrol.jpeg");
    cy.get('img[src^="blob"]').should('exist');
    cy.get('[data-testid="remove-upload"]').should('exist');
    cy.get('[data-testid="upload-dimensions"]').contains(/2400 x 1464/i).should('exist');
    cy.get('canvas[height="1464"]').should('exist'); // makes sure its loaded in the canvas

    cy.get('#stage-zoom').as('stageZoom');
    cy.get('#stage-img').invoke('css', 'transform').as('stageImgTransform');
  });

  it('can move around by dragging', function () {
    cy.get('@stageZoom').should('have.value', '100');
    cy.get('@stageImgTransform').should('eq', 'matrix(1, 0, 0, 1, 0, 0)');

    let startX = 1120;
    let startY = 157;

    cy.get('[data-testid="bounding-box"]')
      .trigger('mousedown', {which: 1, clientX: startX, clientY: startY})
      .trigger('mousemove', {which: 1, clientX: startX, clientY: startY}) // an implementation hack

    // move slowly
    for (let i = 1; i < 20; i++) {
      cy.get('[data-testid="bounding-box"]')
        .trigger('mousemove', {which: 1, clientX: startX + i, clientY: startY + i})
    }

    cy.get('[data-testid="bounding-box"]').trigger('mouseup')
    cy.get('@stageImgTransform').should('eq', 'matrix(1, 0, 0, 1, -163.441, -163.624)');
  })

  it('can move around by clicking', function () {
    console.log('this is the stage img transform', this.stageImgTransform);
    cy.get('@stageImgTransform').should('eq', 'matrix(1, 0, 0, 1, 0, 0)');
    cy.get('[data-testid="move-by-click-target"]').click(100, 40);
    cy.get('@stageImgTransform').should('eq', 'matrix(1, 0, 0, 1, 339.785, 386.162)');
  })

  it('can fit in stage on double click, stage responds', function () {
    cy.get('@stageZoom').should('have.value', '100');
    cy.get('@stageImgTransform').should('eq', 'matrix(1, 0, 0, 1, 0, 0)');
    cy.get('[data-testid="bounding-box"]').dblclick();
    cy.get('@stageZoom').should('have.value', '35');
    cy.get('@stageImgTransform').should('eq', 'matrix(0.35, 0, 0, 0.35, 0, 0)');
  })
})
