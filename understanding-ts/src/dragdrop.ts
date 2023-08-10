// Drag & Drop
interface Dragable {
  dragStartHandle(e: DragEvent): void;
  dragEndHandle(e: DragEvent): void;
}

interface DragTarget {
  dragOverHandle(e: DragEvent): void;
  dropHandle(e: DragEvent): void;
  dragLeaveHandle(e: DragEvent): void;
}

// Project type
enum ProjectStatus {
  Active = "active",
  Finished = "finished",
}
class Project {
  constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {}
}

// Project state management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listener: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listener.push(listenerFn);
  }
}
class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);

    this.projects.push(newProject);

    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(proj => proj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
    }

    this.updateListeners();
  }

  private updateListeners() {
    for (const listenerFn of this.listener) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
function validate(validatableInput: Validatable): boolean {
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

// autobind decorator
function autobind(_: any, _1: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);

      return boundFn;
    },
  };

  return adjDescriptor;
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importNode = document.importNode(this.templateElement.content, true);

    this.element = importNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Dragable {
  private project: Project;

  get persons() {
    return this.project.people === 1 ? "1 person" : `${this.project.people} persons`;
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandle(e: DragEvent): void {
    e.dataTransfer!.setData("text/plain", this.project.id);
    e.dataTransfer!.effectAllowed = "move";
  }

  @autobind
  dragEndHandle(e: DragEvent): void {}

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandle);
    this.element.addEventListener("dragend", this.dragEndHandle);
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: ProjectStatus) {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandle(e: DragEvent): void {
    if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
      e.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("dropable");
    }
  }

  @autobind
  dropHandle(e: DragEvent): void {
    const projId = e.dataTransfer!.getData("text/plain");

    projectState.moveProject(projId, this.type);
  }

  @autobind
  dragLeaveHandle(e: DragEvent): void {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("dropable");
  }

  configure(): void {
    this.element.addEventListener("dragover", this.dragOverHandle);
    this.element.addEventListener("drop", this.dropHandle);
    this.element.addEventListener("dragleave", this.dragLeaveHandle);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((proj) => proj.status === this.type);
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const projItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projItem);
    }
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent(): void {}

  private gatherUserInput(): [string, string, number] | undefined {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    if (
      !validate({ value: enteredTitle, required: true }) ||
      !validate({ value: enteredDescription, required: true }) ||
      !validate({ value: +enteredPeople, required: true, min: 1 })
    ) {
      alert("Invalid input");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(e: Event) {
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

const activeProjList = new ProjectList(ProjectStatus.Active);
const finishedProjList = new ProjectList(ProjectStatus.Finished);
const projInput = new ProjectInput();
