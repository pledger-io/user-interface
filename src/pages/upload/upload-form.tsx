import React, { useEffect } from "react";
import { useParams } from "react-router";
import UploadTransactionsComponent from "../../components/upload/upload-transactions";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import { ImportJob } from "../../types/types";
import AnalyzeTransactions from "../../components/upload/analyze-transactions";

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