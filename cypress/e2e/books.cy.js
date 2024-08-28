describe("login process", () => {
  beforeEach(() => {
    cy.visit("localhost:3000");
  });

  it("logins successfully with correct credentials", () => {
    cy.login("test@test.com", "test");
    cy.contains("Добро пожаловать test@test.com").should("be.visible");
  });

  it("shows ERROR when login is not entered", () => {
    cy.login(null, "test");
    cy.get("#mail")
      .then((el) => el[0].checkValidity())
      .should("be.false");
    cy.get("#mail")
      .then((el) => el[0].validationMessage)
      .should("contain", "Заполните это поле.");
  });

  it("shows ERROR when password is not entered", () => {
    cy.login("test@test.com", null);
    cy.get("#pass")
      .then((el) => el[0].checkValidity())
      .should("be.false");
    cy.get("#pass")
      .then((el) => el[0].validationMessage)
      .should("contain", "Заполните это поле.");
  });

  it("shows logOut", () => {
    cy.login("test@test.com", "test");
    cy.contains("Добро пожаловать test@test.com").should("be.visible");
    cy.contains("Log out").click();
    cy.contains("Log in").should("be.visible");
  });
});

import { faker } from "@faker-js/faker";
let bookData;

beforeEach(() => {
  cy.visit("localhost:3000");
  cy.login("test@test.com", "test");
  bookData = {
    title: faker.company.catchPhraseAdjective(),
    description: faker.company.catchPhrase(),
    author: faker.name.fullName(),
  };
});

describe("Favorite books testing", () => {
  it('Add book to favorite through "add new"', () => {
    cy.createNewBook(bookData);
    cy.visit("/favorites");
    cy.get(".card-title").should("contain", bookData.title);
  });

  it('Add book to favorite through "Book page"', () => {
    cy.addBooktoFavorite(bookData);
    cy.contains(bookData.title)
      .should("be.visible")
      .within(() => cy.get(".card-footer > .btn").click({ force: true }));
    cy.visit("/favorites");
    cy.contains(bookData.title).should("be.visible");
  });

  it("Delete book from favorite", () => {
    cy.createNewBook(bookData);
    cy.visit("/favorites");
    cy.contains(bookData.title)
      .should("be.visible")
      .within(() => cy.get(".card-footer > .btn").click({ force: true }));
    cy.contains(bookData.title).should("not.exist");
  });
});
