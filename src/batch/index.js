import BatchOverview from "./overview";
import { Route } from "react-router-dom";
import ImportJobResultOverview from "./result";
import ImportJobFormView from "./edit";

export const BatchRoutes = [
    <Route key='batch' path='/upload' element={<BatchOverview />} />,

    <Route key='batch-results' path='/upload/:slug/result' element={<ImportJobResultOverview />} />,
    <Route key='batch-create' path='/upload/create' element={<ImportJobFormView />} />,
    <Route key='batch-create' path='/upload/:slug/analyze' element={<ImportJobFormView />} />
]