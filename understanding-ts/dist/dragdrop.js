"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["Active"] = "active";
    ProjectStatus["Finished"] = "finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listener = [];
    }
    addListener(listenerFn) {
        this.listener.push(listenerFn);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addProject(title, description, people) {
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateListeners();
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find(proj => proj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
        }
        this.updateListeners();
    }
    updateListeners() {
        for (const listenerFn of this.listener) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}
function autobind(_, _1, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
    }
}
class ProjectItem extends Component {
    get persons() {
        return this.project.people === 1 ? "1 person" : `${this.project.people} persons`;
    }
    constructor(hostId, project) {
        super("single-project", hostId, false, project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    dragStartHandle(e) {
        e.dataTransfer.setData("text/plain", this.project.id);
        e.dataTransfer.effectAllowed = "move";
    }
    dragEndHandle(e) { }
    configure() {
        this.element.addEventListener("dragstart", this.dragStartHandle);
        this.element.addEventListener("dragend", this.dragEndHandle);
    }
    renderContent() {
        this.element.querySelector("h2").textContent = this.project.title;
        this.element.querySelector("h3").textContent = this.persons;
        this.element.querySelector("p").textContent = this.project.description;
    }
}
__decorate([
    autobind
], ProjectItem.prototype, "dragStartHandle", null);
__decorate([
    autobind
], ProjectItem.prototype, "dragEndHandle", null);
class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandle(e) {
        if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
            e.preventDefault();
            const listEl = this.element.querySelector("ul");
            listEl.classList.add("dropable");
        }
    }
    dropHandle(e) {
        const projId = e.dataTransfer.getData("text/plain");
        projectState.moveProject(projId, this.type);
    }
    dragLeaveHandle(e) {
        const listEl = this.element.querySelector("ul");
        listEl.classList.remove("dropable");
    }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandle);
        this.element.addEventListener("drop", this.dropHandle);
        this.element.addEventListener("dragleave", this.dragLeaveHandle);
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter((proj) => proj.status === this.type);
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent = `${this.type.toUpperCase()} PROJECTS`;
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = "";
        for (const projItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul").id, projItem);
        }
    }
}
__decorate([
    autobind
], ProjectList.prototype, "dragOverHandle", null);
__decorate([
    autobind
], ProjectList.prototype, "dropHandle", null);
__decorate([
    autobind
], ProjectList.prototype, "dragLeaveHandle", null);
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent() { }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        if (!validate({ value: enteredTitle, required: true }) ||
            !validate({ value: enteredDescription, required: true }) ||
            !validate({ value: +enteredPeople, required: true, min: 1 })) {
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
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const activeProjList = new ProjectList(ProjectStatus.Active);
const finishedProjList = new ProjectList(ProjectStatus.Finished);
const projInput = new ProjectInput();
