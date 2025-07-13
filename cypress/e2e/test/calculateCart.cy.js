describe('Comprobación de subtotal,Iva y total', () => {
it('calcula correctamente el subtotal, IVA y total', () => {
  // Login
   cy.intercept('GET', '/api/user').as('getUser');
    cy.intercept('POST', '/api/login').as('postLogin');
    cy.intercept('GET', '/api/products').as('getProducts');
    cy.intercept('GET', '/api/outlet').as('getOulet');
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
    cy.get('[data-cy="add_product"]').first().click();

    cy.visit('http://localhost:5173/outlet');
    cy.wait('@getUser');
    cy.wait('@getOulet');

    cy.get('[data-cy="add_product"]').first().click();

    // Ir al carrito
    cy.get('[data-cy="cart-link"]').click();
    cy.url().should('include', '/cart');

    // Verificar totales
    let subtotal = 0;

    cy.get('[data-cy="cart-item"]').each(($el) => {
        cy.wrap($el).find('[data-cy="product-price"]').invoke('text').then((priceText) => {
        const price = parseFloat(priceText.replace('$', ''));

        cy.wrap($el).find('[data-cy="product-quantity"]').invoke('val').then((qty) => {
            const quantity = parseInt(qty);
            subtotal += price * quantity;
        });
        });
    });

    cy.then(() => {
        const tax = +(subtotal * 0.21).toFixed(2);
        const total = +(subtotal + tax).toFixed(2);

        cy.get('[data-cy="summary-subtotal"]').invoke('text').then((text) => {
        expect(+text.replace('$', '')).to.eq(+subtotal.toFixed(2));
        });

        cy.get('[data-cy="summary-tax"]').invoke('text').then((text) => {
        expect(+text.replace('$', '')).to.eq(tax);
        });

        cy.get('[data-cy="summary-total"]').invoke('text').then((text) => {
        expect(+text.replace('$', '')).to.eq(total);
        });
    });
});
})