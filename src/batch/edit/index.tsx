import { BreadCrumbItem, BreadCrumbs } from "../../core";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import UploadTransactionsComponent from "./upload-transactions";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import { ImportJob } from "../../core/types";
import AnalyzeTransactions from "./analyze-transactions";

import Card from "../../components/layout/card.component";

const ImportJobFormView = () => {
    const { slug } = useParams();
    const [importJob, setImportJob] = React.useState<ImportJob>();

    useEffect(() => {
        if (slug) {
            ImportJobRepository.get(slug)
                .then(setImportJob)
                .catch(console.error);
        }
    }, [slug]);

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.settings.import'/>
            <BreadCrumbItem label='page.nav.settings.import.start'/>
        </BreadCrumbs>

        <Card title='page.nav.settings.import'>
            { !slug && <UploadTransactionsComponent /> }

            { importJob && <AnalyzeTransactions importJob={ importJob } /> }
        </Card>
    </>
}

export default ImportJobFormView