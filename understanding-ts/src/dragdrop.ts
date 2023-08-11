import { ProjectStatus } from "./models/Project.js";
import { ProjectInput } from "./dragdrop/ProjectInput.js";
import { ProjectList } from "./dragdrop/ProjectList.js";

new ProjectList(ProjectStatus.Active);
new ProjectList(ProjectStatus.Finished);
new ProjectInput();
