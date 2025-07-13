describe('Compra sin autenticación', () => {
  it('Debe redirigir al login si intenta comprar sin estar autenticado', () => {
    cy.visit('http://localhost:5173/products');

    // Agregar el primer producto (usa clase del botón "+")
    cy.get('[data-cy="add_product"]').first().click();

    // Esperar redirección al login
    cy.url().should('include', '/login');

    // Verificar el mensaje del toast
    cy.contains('You must login before buy').should('be.visible');
  });
});