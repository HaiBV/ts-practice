import { ProjectStatus } from "./models/Project";
import { ProjectInput } from "./dragdrop/ProjectInput";
import { ProjectList } from "./dragdrop/ProjectList";

new ProjectList(ProjectStatus.Active);
new ProjectList(ProjectStatus.Finished);
new ProjectInput();
