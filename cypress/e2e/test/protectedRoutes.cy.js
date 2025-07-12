describe("Access to protected routes", () => {
  it("Does not allow access to /profile without login", () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("http://localhost:5173/profile");
    cy.url().should("include", "/login");
    cy.contains("Log In").should("exist");
  });

  it("Allows access to /profile after login", () => {
    cy.visit("http://localhost:5173/login");
    cy.get('input[name="email"]').type("user_prueba@iglusshop.com");
    cy.get('input[name="password"]').type("password");
    cy.get("button").contains("Log In").click();
    cy.url().should("include", "/profile/orders");
    cy.contains("My Orders").should("exist");
  });
});
