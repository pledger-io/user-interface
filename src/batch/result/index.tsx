import { BreadCrumbItem, BreadCrumbs } from "../../core";
import React, { useEffect } from "react";
import { ImportJob } from "../../core/types";
import { useParams } from "react-router-dom";
import ImportJobRepository from "../../core/repositories/import-job.repository";

import ImportJobSummaryComponent from "./import-job-summary.component";
import ImportJobTransactionComponent from "./import-job-transaction.component";
import Card from "../../components/layout/card.component";
import Loading from "../../components/layout/loading.component";

const ImportJobResultOverview = () => {
    const [importJob, setImportJob] = React.useState<ImportJob>()
    const { slug } = useParams()

    useEffect(() => {
        if (!slug) return

        ImportJobRepository.get(slug)
            .then(setImportJob)
            .catch(console.error)
    }, [slug])

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.settings.import' href='/upload' />
            <BreadCrumbItem label='page.nav.settings.import.status'/>
        </BreadCrumbs>

        <Card title='page.settings.import.details'>
            { !importJob && <Loading /> }

            { importJob && <ImportJobSummaryComponent importJob={ importJob } /> }

            { importJob && <ImportJobTransactionComponent slug={ importJob.slug } /> }
        </Card>
    </>
}

export default ImportJobResultOverview