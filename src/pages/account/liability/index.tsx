import { mdiPlus } from "@mdi/js";
import React, { useEffect, useState } from "react";
import LiabilityRowComponent from "../../../components/account/liability-row.component";
import BreadCrumbItem from "../../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../../components/layout/button";
import Card from "../../../components/layout/card.component";
import Loading from "../../../components/layout/loading.component";
import Translation from "../../../components/localization/translation.component";
import { Paginator } from "../../../components/layout/paginator.component";
import AccountRepository from "../../../core/repositories/account-repository";
import { Account, Pagination } from "../../../types/types";
import useQueryParam from "../../../hooks/query-param.hook";

const LiabilityOverview = () => {
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })
    const [accounts, setAccounts] = useState<Account[] | undefined>(undefined)
    const [pagination, setPagination] = useState<Pagination>()

    const reload = () => {
        setAccounts(undefined)
        AccountRepository.search({
            types: ['loan', 'mortgage', 'debt'] as any,
            page: parseInt(page)
        }).then(resultPage => {
            setAccounts(resultPage.content || [])
            setPagination(resultPage.info)
        })
    }

    useEffect(reload, [page])

    const isLoaded = accounts
    const hasContent = isLoaded && accounts?.length > 0
    return (
        <div id='LiabilityOverview'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.accounts'/>
                <BreadCrumbItem label='page.nav.accounts.liability'/>
            </BreadCrumbs>

            <Card title='page.nav.accounts.liability'
                  actions={ [<Button label='page.title.accounts.liabilities.add'
                                     key='add'
                                     icon={ mdiPlus }
                                     href='./add'
                                     variant='primary'/>] }>
                <table className='Table'>
                    <thead>
                    <tr>
                        <th className='w-[30px]' />
                        <th><Translation label='Account.name'/></th>
                        <th className='hidden md:table-cell w-[150px]'>
                            <Translation label='Account.interest'/>
                            (<Translation label='Account.interestPeriodicity'/>)
                        </th>
                        <th className='w-[120px]'><Translation label='common.account.saldo'/></th>
                        <th className='w-[25px]'/>
                    </tr>
                    </thead>
                    <tbody>
                    { !isLoaded && <tr>
                        <td colSpan={ 5 }><Loading/></td>
                    </tr> }
                    { !hasContent && isLoaded &&
                        <tr>
                            <td colSpan={ 5 } className='text-center text-gray-500'>
                                <Translation label='common.overview.noresults'/>
                            </td>
                        </tr> }
                    { hasContent && accounts?.map(a => <LiabilityRowComponent key={ a.id } account={ a }
                                                                              deleteCallback={ reload }/>) }
                    </tbody>
                </table>

                { hasContent && <Paginator page={ parseInt(page) }
                                           records={ pagination?.records }
                                           pageSize={ pagination?.pageSize }/> }
            </Card>
        </div>
    )
}

export default LiabilityOverview
