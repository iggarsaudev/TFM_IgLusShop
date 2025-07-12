describe("User registration", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  it("Allows you to register a new user", () => {
    cy.visit("http://localhost:5173/register");
    cy.get('input[name="name"]').type("User Test");
    cy.get('input[name="email"]').type("test" + Date.now() + "@test.com");
    cy.get('input[name="password"]').type("password");
    cy.get("button").contains("Register").click();
    cy.location("pathname", { timeout: 10000 }).should("eq", "/login");
    cy.get('input[name="email"]').should("exist"); // El formulario de login está visible
  });

  it("It does not allow you to register an existing email address.", () => {
    cy.visit("http://localhost:5173/register");
    cy.get('input[name="name"]').type("Existing User");
    cy.get('input[name="email"]').type("user_prueba@iglusshop.com");
    cy.get('input[name="password"]').type("password");
    cy.get("button").contains("Register").click();
    cy.contains("The email is already registered");
  });
});
