import { Layout, Translations } from "../../core";
import { useEffect, useState } from "react";
import { ImportJob, Pagination } from "../../core/types";
import { useQueryParam } from "../../core/hooks";
import ImportJobRepository from "../../core/repositories/import-job.repository";
import OverviewRowComponent from "./overview-row.component";
import { Paginator } from "../../core/Paginator";

const OverviewTableComponent = () => {
    const [pagination, setPagination] = useState<Pagination>()
    const [batchImports, setBatchImports] = useState<ImportJob[]>()
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })

    useEffect(() => {
        setBatchImports(undefined)
        ImportJobRepository.list(parseInt(page))
            .then(({ content, info }) => {
                setBatchImports(content || [])
                setPagination(info)
            })
    }, [page])

    const isLoading = !batchImports
    const hasResults = !isLoading && batchImports.length > 0
    const showPaginator = pagination && pagination.records > pagination.pageSize
    return <>
        <table className='Table'>
            <thead>
            <tr>
                <th colSpan={ 2 }>
                    <Translations.Translation label="BatchImport.slug"/>
                </th>
                <th className="hidden md:table-cell">
                    <Translations.Translation label="BatchImport.config"/>
                </th>
                <th className='text-center'>
                    <Translations.Translation label="BatchImport.created"/>
                </th>
                <th className="text-center">
                    <Translations.Translation label="BatchImport.finished"/>
                </th>
            </tr>
            </thead>
            <tbody>

            { isLoading && <tr>
                <td colSpan={ 5 } className="text-center"><Layout.Loading/></td>
            </tr> }

            { !hasResults && <tr>
                <td colSpan={ 5 } className="text-center text-muted">
                    <Translations.Translation label="common.overview.noresults"/>
                </td>
            </tr> }

            { !isLoading && batchImports.map((importJob) =>
                <OverviewRowComponent importJob={ importJob } key={ importJob.slug }/>) }

            </tbody>
        </table>

        { showPaginator && <Paginator records={ pagination?.records }
                                      page={ parseInt(page) }
                                      pageSize={ pagination?.pageSize }/> }
    </>
}

export default OverviewTableComponent