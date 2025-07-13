describe('Proceso de compra completo con autenticación', () => {

  it('Agrega al carrito y completa la compra', () => {
    cy.intercept('GET', '/api/user').as('getUser');
    cy.intercept('POST', '/api/login').as('postLogin');
    cy.intercept('GET', '/api/products').as('getProducts');
    cy.intercept('GET', '/api/orders').as('getOrders');
    cy.intercept('POST', '/api/orders').as('createOrder');

    // Hacer el login
    cy.visit("http://localhost:5173/login");    
    cy.get('input[name="email"]').type("user_prueba@iglusshop.com");
    cy.get('input[name="password"]').type("password");
    cy.get("button").contains("Log In").click();

    // Esperamos que el login y la carga del usuario se completen
    cy.wait('@postLogin');
    cy.wait('@getUser');
    cy.url().should('include', '/profile/orders');
    cy.wait('@getOrders');
    // Ir a la pagina de productos
    cy.visit('http://localhost:5173/products');
    cy.wait('@getUser');
    cy.wait('@getProducts');

    // Click en el primer botón de "agregar al carrito"
    cy.get('[data-cy="add_product"]').first().click();

    // Ir al carrito
    cy.wait('@getUser');
    cy.get('[data-cy="cart-link"]').click();

    // Confirmar que se muestra el resumen del carrito
    cy.get('[data-cy="cart-summary"]').should('be.visible');

    // Enviar formulario
    cy.get('[data-cy="checkout-form"]').submit();
    cy.wait('@createOrder');

    cy.url().should('include', '/profile/orders');
    // Volver a la página del carrito
    cy.get('[data-cy="cart-link"]').click();
    cy.get('[data-cy="empty-cart-message"]').should('be.visible');
  });
});
