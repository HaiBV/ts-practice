"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const validate_1 = require("../utils/validate");
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild;
        this.element.id = "user-input";
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.attach();
        this.configure();
    }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        if (!(0, validate_1.validate)({ value: enteredTitle, required: true }) ||
            !(0, validate_1.validate)({ value: enteredDescription, required: true }) ||
            !(0, validate_1.validate)({ value: +enteredPeople, required: true, min: 1 })) {
            alert("Invalid input");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log({ title, desc, people });
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
exports.default = ProjectInput;
__decorate([
    utils_1.autobind
], ProjectInput.prototype, "submitHandler", null);
