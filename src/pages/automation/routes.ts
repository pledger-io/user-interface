import { RouteObject } from "react-router-dom";

import scheduled from "./schedule/routes";

const routes = {
    id: 'automation',
    path: 'automation/schedule',
    children: [
        scheduled
    ]
} as RouteObject

export default routes