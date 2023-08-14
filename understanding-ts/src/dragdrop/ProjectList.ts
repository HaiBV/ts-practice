import { autobind } from "../decorators/autobind";
import { Component } from "./BaseComponent";
import { Project, ProjectStatus } from "../models/Project";
import { ProjectItem } from "./ProjectItem";
import { DragTarget } from "../models/DragDrop";
import { projectState } from "../state/ProjectState";

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
      listEl.classList.add("droppable");
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
    listEl.classList.remove("droppable");
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