describe("Login and Logout", () => {
  beforeEach(() => {
    // Limpia cookies y localStorage antes de cada test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("The user can log in with valid credentials", () => {
    cy.visit("http://localhost:5173/login");
    cy.get('input[name="email"]').type("user_prueba@iglusshop.com");
    cy.get('input[name="password"]').type("password");
    cy.get("button").contains("Log In").click();
    cy.url().should("not.include", "/login");
    cy.contains("Profile").should("exist");
  });

  it("Displays error with invalid credentials", () => {
    cy.visit("http://localhost:5173/login");
    cy.get('input[name="email"]').type("user_prueba@iglusshop.com");
    cy.get('input[name="password"]').type("contraseñaincorrecta");
    cy.get("button").contains("Log In").click();
    cy.contains("Invalid credentials").should("exist");
  });

  it("Allows you to log out", () => {
    cy.visit("http://localhost:5173/login");
    cy.get('input[name="email"]').type("user_prueba@iglusshop.com");
    cy.get('input[name="password"]').type("password");
    cy.get("button").contains("Log In").click();
    cy.contains("Profile").should("exist");
    cy.get("button").contains("Logout").click();
    cy.url().should("include", "/login");
    cy.contains("Log In").should("exist");
  });
});
