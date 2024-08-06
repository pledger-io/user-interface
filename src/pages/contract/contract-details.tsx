import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Contract } from "../../types/types";
import ContractRepository from "../../core/repositories/contract-repository";

import ContractTransactions from "../../components/contract/transaction-list.component";
import Card from "../../components/layout/card.component";
import Loading from "../../components/layout/loading.component";
import Translation from "../../components/localization/translation.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";

const ContractDetail = () => {
    const { id } = useParams()
    const [contract, setContract] = useState<Contract>()

    useEffect(() => {
        if (id) {
            ContractRepository.get(id)
                .then(setContract)
        }
    }, [id]);

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.finances'/>
            <BreadCrumbItem label='page.nav.budget.contracts' href='/contracts' />
            { contract && <BreadCrumbItem message={ contract.name } /> }
        </BreadCrumbs>

        <div className='block md:flex gap-10'>
            <Card className=''>
                <div className='grid grid-rows-3 grid-cols-2'>
                    <Translation className='font-bold text-right after:content-[":"] mr-5'
                                              label='Contract.name' />
                    { contract?.name }
                    <Translation className='font-bold text-right after:content-[":"] mr-5'
                                              label='Contract.company' />
                    { contract?.company.name }
                    <Translation className='font-bold text-right after:content-[":"] mr-5'
                                              label='Contract.start' />
                    { contract?.start }
                    <Translation className='font-bold text-right after:content-[":"] mr-5'
                                              label='Contract.end' />
                    { contract?.end }
                </div>
            </Card>

            { contract?.description &&
                <Card className='flex-1'>
                    <h5 className='font-bold'><Translation label='Contract.description'/></h5>
                    { contract?.description }
                </Card> }
        </div>

        <Card title='page.title.budget.contracts.transactions'>
            <Loading condition={ contract != null }>
                { contract && <ContractTransactions contract={ contract } /> }
            </Loading>
        </Card>
    </>
}

export default ContractDetail;