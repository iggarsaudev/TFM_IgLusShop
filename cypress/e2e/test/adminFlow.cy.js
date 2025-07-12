describe("Admin flow", () => {
  it("Does not allow access to /admin/users as a user role", () => {
    cy.visit("http://localhost:5173/login");
    cy.get('input[name="email"]').type("user_prueba@iglusshop.com");
    cy.get('input[name="password"]').type("password");
    cy.get("button").contains("Log In").click();
    cy.visit("http://localhost:5173/admin/users");
    cy.url().should("include", "/login");
  });

  it("Allows access to /admin/users as admin role", () => {
    cy.visit("http://localhost:5173/login");
    cy.get('input[name="email"]').type("ignacio.garcia@iglusshop.com");
    cy.get('input[name="password"]').type("password");
    cy.get("button").contains("Log In").click();
    cy.url().should("include", "/admin/users");
    cy.contains("Manage Users").should("exist");
  });
});
