import BatchOverview from "./overview";
import { Route } from "react-router-dom";
import ImportJobResultOverview from "./result";

export const BatchRoutes = [
    <Route key='batch' path='/upload' element={<BatchOverview />} />,

    <Route key='batch-results' path='/upload/:slug/result' element={<ImportJobResultOverview />} />
]