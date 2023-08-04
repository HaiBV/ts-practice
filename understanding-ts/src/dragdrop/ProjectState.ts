// Project state management
class ProjectState {
  private listener: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = {
      id: Math.random().toString(),
      title,
      description,
      people,
    };

    this.projects.push(newProject);

    for (const listenerFn of this.listener) {
      listenerFn(this.projects.slice());
    }
  }

  addListener(listenerFn: Function) {
    this.listener.push(listenerFn);
  }
}

export default ProjectState;
