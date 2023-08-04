"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProjectState {
    constructor() {
        this.listener = [];
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
    addListener(listenerFn) {
        this.listener.push(listenerFn);
    }
}
exports.default = ProjectState;
