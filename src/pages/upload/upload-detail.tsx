import React from "react";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { useLoaderData } from "react-router";
import ImportJobSummaryComponent from "../../components/upload/import-job-summary.component";
import ImportJobTransactionComponent from "../../components/upload/import-job-transaction.component";
import { Card } from "primereact/card";
import { i10n } from "../../config/prime-locale";

const ImportJobResultOverview = () => {
  const importJob = useLoaderData()

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.settings.import.details') }
  </div>

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.settings'/>
      <BreadCrumbItem label='page.nav.settings.import' href='/upload'/>
      <BreadCrumbItem label='page.nav.settings.import.status'/>
    </BreadCrumbs>

    <Card header={ header } className='my-4 mx-2'>
      <ImportJobSummaryComponent importJob={ importJob }/>
      <ImportJobTransactionComponent slug={ importJob.slug }/>
    </Card>
  </>
}

export default ImportJobResultOverview
