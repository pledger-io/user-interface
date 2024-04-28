import { FC, useEffect, useState } from "react";
import { BreadCrumbItem, BreadCrumbs, Layout, Translations } from "../../core";
import { Contract } from "../../core/types";
import { useParams } from "react-router-dom";
import ContractRepository from "../../core/repositories/contract-repository";
import ContractTransactions from "./contract-transactions";

const ContractDetail: FC<void> = () => {
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
            <Layout.Card className=''>
                <div className='grid grid-rows-3 grid-cols-2'>
                    <Translations.Translation className='font-bold text-right after:content-[":"] mr-5'
                                              label='Contract.name' />
                    { contract?.name }
                    <Translations.Translation className='font-bold text-right after:content-[":"] mr-5'
                                              label='Contract.company' />
                    { contract?.company.name }
                    <Translations.Translation className='font-bold text-right after:content-[":"] mr-5'
                                              label='Contract.start' />
                    { contract?.start }
                    <Translations.Translation className='font-bold text-right after:content-[":"] mr-5'
                                              label='Contract.end' />
                    { contract?.end }
                </div>
            </Layout.Card>

            { contract?.description && <>
                <Layout.Card className='flex-1'>
                    <h5 className='font-bold'><Translations.Translation label='Contract.description'/></h5>
                    { contract?.description }
                </Layout.Card>
            </> }
        </div>

        <Layout.Card title='page.title.budget.contracts.transactions'>
            <Layout.Loading condition={ contract != null }>
                { contract && <ContractTransactions contract={ contract } /> }
            </Layout.Loading>
        </Layout.Card>
    </>
}

export default ContractDetail;