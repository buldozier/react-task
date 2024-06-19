import ProjectsList from "../pages/ProjectsList/ProjectsList";
import Project from "../pages/Project/Project";

export const routes = [
    {path: "/:id", element: <Project/>, exact: true},
    {path: "/:id/:taskId", element: <Project/>, exact: true},
    {path: "/:id/:taskId/:taskSlug", element: <Project/>, exact: true},
    {path: "/", element: <ProjectsList/>},
]