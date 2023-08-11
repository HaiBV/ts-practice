import { autobind } from "../utils/utils.js";
import { Component } from "./BaseComponent.js";
import { Project } from "../models/Project.js";
import { Dragable } from "../models/DragDrop.js";

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Dragable {
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