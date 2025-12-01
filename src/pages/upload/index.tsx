import { useSessionStorage } from "primereact/hooks";
import React, { useEffect, useState } from "react";
import { mdiCheck, mdiClose, mdiDelete, mdiPlus } from "@mdi/js";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { NavLink, useNavigate } from "react-router";
import Icon from "@mdi/react";
import { i10n } from "../../config/prime-locale";
import { Card } from "primereact/card";
import { AvailableSetting, ImportJob, Pagination } from "../../types/types";
import useQueryParam from "../../hooks/query-param.hook";
import { DataTable } from "primereact/datatable";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import { Column } from "primereact/column";
import DateComponent from "../../components/format/date.component";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Button } from "../../components/layout/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const checkMarkIcon = (checked: boolean) => {
  if (checked) return <Icon path={ mdiCheck } size={ 1 } className='text-success mx-auto'/>
  return <Icon path={ mdiClose } size={ 1 } className='text-warning mx-auto'/>
}

const importJobLink = (job: ImportJob) => {
  const link = job.finished ? `/upload/${ job.slug }/result` : `/upload/${ job.slug }/analyze`
  return <NavLink to={ link } className='p-button p-button-text'>{ job.slug }</NavLink>
}

const BatchOverview = () => {
  const [pagination, setPagination] = useState<Pagination>()
  const [batchImports, setBatchImports] = useState<ImportJob[]>()
  const [page] = useQueryParam({ key: 'page', initialValue: "1" })
  const navigate = useNavigate()
  const [numberOfResults, _] = useSessionStorage(20, AvailableSetting.RecordSetPageSize)

  useEffect(() => {
    ImportJobRepository.list((parseInt(page) -1) * numberOfResults, numberOfResults)
      .then(({ content, info }) => {
        setBatchImports(content || [])
        setPagination(info)
      })
  }, [page])

  const onDeleteClick = (slug: string) => {
    confirmDialog({
      message: i10n('page.import.delete.confirm'),
      header: i10n('common.action.delete'),
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept: () => {
        ImportJobRepository.delete(slug).catch(console.error)
      }
    });
  }

  const pageChanged = (event: PaginatorPageChangeEvent) => {
    navigate('?page=' + (event.page + 1))
  }
  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    {i10n('page.nav.settings.import')}
  </div>

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.settings'/>
      <BreadCrumbItem label='page.nav.settings.import'/>
    </BreadCrumbs>

    <ConfirmDialog className='max-w-[25rem]'/>

    <Card header={ header } className='my-4 mx-2'>
      <div className='flex justify-end'>
        <NavLink to={ '/upload/create' }
                 className='p-button p-button-success p-button-sm !mb-4 gap-1 items-center'>
          <Icon path={ mdiPlus } size={ .8 }/> { i10n('page.settings.import.new') }
        </NavLink>
      </div>

      <DataTable value={ batchImports } loading={ !batchImports } size='small'>
        <Column header={ i10n('BatchImport.slug') } body={ job => importJobLink(job) } />
        <Column header={ i10n('BatchImport.config') } field='config.name' />
        <Column header={ i10n('BatchImport.created') }
                bodyClassName='w-[10rem]'
                body={ job => <DateComponent date={ job.created }/> }/>
        <Column header={ i10n('BatchImport.finished') }
                bodyClassName='w-[2rem]'
                body={ job => checkMarkIcon(job.finished) } />
        <Column bodyClassName='w-[2rem]'
                body={ job => <Button icon={ mdiDelete }
                                      tooltipOptions={ { position: 'bottom' } }
                                      tooltip={ i10n('common.action.delete') }
                                      onClick={ () => onDeleteClick(job.slug) }
                                      text
                                      severity='danger' />}/>
      </DataTable>

      { (pagination?.records || 0) > 0
        && <Paginator totalRecords={ pagination?.records }
                      rows={ pagination?.pageSize }
                      first={ (parseInt(page) - 1) * (pagination?.pageSize || 0) }
                      onPageChange={ pageChanged }/> }
    </Card>
  </>
}

export default BatchOverview
