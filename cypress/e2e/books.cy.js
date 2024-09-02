describe("login process", () => {
  beforeEach(() => {
    cy.visit("/");
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
});

import { faker } from "@faker-js/faker";
let bookData;

beforeEach(() => {
  cy.visit("/");
  cy.login("test@test.com", "test");
  bookData = {
    title: faker.company.catchPhraseAdjective(),
    author: faker.name.fullName(),
  };
});

describe("Favorite books testing", () => {
  it('Create book"', () => {
    cy.createNewBook(bookData.title, bookData.author);
    cy.get(".card-title").should("contain", bookData.title);
  });

  it('Add book to favorite through creating book', () => {
    cy.addBookToFavorite(bookData.title, bookData.author);
    cy.contains(bookData.title).should("be.visible")
    cy.visit("/favorites");
    cy.contains(bookData.title).should("be.visible");
  });

   it("Add book to favorite through pressing a button", () => {
     cy.createNewBook(bookData.title, bookData.author);
     cy.contains(bookData.title)
       .should("be.visible")
       .within(() => cy.contains("Add to favorite").click({ force: true }));
     cy.visit("/favorites");
     cy.contains(bookData.title).should("be.visible");
   });

  it("Delete book from favorite", () => {
    cy.addBookToFavorite(bookData.title, bookData.author);
    cy.visit("/favorites");
    cy.contains(bookData.title)
      .should("be.visible")
      .within(() => cy.get(".card-footer > .btn").click({ force: true }));
    cy.contains(bookData.title).should("not.exist");
  });
});
