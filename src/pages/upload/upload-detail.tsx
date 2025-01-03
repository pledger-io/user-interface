import React, { useEffect } from "react";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { ImportJob } from "../../types/types";
import { useParams } from "react-router";
import ImportJobRepository from "../../core/repositories/import-job.repository";

import ImportJobSummaryComponent from "../../components/upload/import-job-summary.component";
import ImportJobTransactionComponent from "../../components/upload/import-job-transaction.component";
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