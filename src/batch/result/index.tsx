import { BreadCrumbItem, BreadCrumbs, Layout } from "../../core";
import React, { useEffect } from "react";
import { ImportJob } from "../../core/types";
import { useParams } from "react-router-dom";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import ImportJobSummaryComponent from "./import-job-summary.component";
import ImportJobTransactionComponent from "./import-job-transaction.component";

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

        <Layout.Card title='page.settings.import.details'>
            { !importJob && <Layout.Loading /> }

            { importJob && <ImportJobSummaryComponent importJob={ importJob } /> }

            { importJob && <ImportJobTransactionComponent slug={ importJob.slug } /> }
        </Layout.Card>
    </>
}

export default ImportJobResultOverview