import React from "react";
import { useLoaderData } from "react-router";
import UploadTransactionsComponent from "../../components/upload/upload-transactions";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import AnalyzeTransactions from "../../components/upload/analyze-transactions";
import { Card } from "primereact/card";
import { i10n } from "../../config/prime-locale";

const ImportJobFormView = () => {
  const importJob = useLoaderData()

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.nav.settings.import') }
  </div>

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.settings'/>
      <BreadCrumbItem label='page.nav.settings.import'/>
      <BreadCrumbItem label='page.nav.settings.import.start'/>
    </BreadCrumbs>

    <Card header={ header } className='my-4 mx-2'>
      { !importJob && <UploadTransactionsComponent/> }
      { importJob && <AnalyzeTransactions importJob={ importJob }/> }
    </Card>
  </>
}

export default ImportJobFormView
