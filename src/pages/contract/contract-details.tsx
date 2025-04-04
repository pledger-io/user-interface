import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import ContractTransactions from "../../components/contract/transaction-list.component";
import Loading from "../../components/layout/loading.component";
import Translation from "../../components/localization/translation.component";
import { i10n } from "../../config/prime-locale";
import ContractRepository from "../../core/repositories/contract-repository";
import { Contract } from "../../types/types";

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
      <BreadCrumbItem label='page.nav.budget.contracts' href='/contracts'/>
      { contract && <BreadCrumbItem message={ contract.name }/> }
    </BreadCrumbs>

    <div className='block md:flex gap-10 my-4 mx-2'>
      <Card className=''>
        <div className='grid grid-rows-3 grid-cols-2'>
          <Translation className='font-bold text-right after:content-[":"] mr-5'
                       label='Contract.name'/>
          { contract?.name }
          <Translation className='font-bold text-right after:content-[":"] mr-5'
                       label='Contract.company'/>
          { contract?.company.name }
          <Translation className='font-bold text-right after:content-[":"] mr-5'
                       label='Contract.start'/>
          { contract?.start }
          <Translation className='font-bold text-right after:content-[":"] mr-5'
                       label='Contract.end'/>
          { contract?.end }
        </div>
      </Card>

      { contract?.description &&
        <Card className='flex-1'>
          <h5 className='font-bold'><Translation label='Contract.description'/></h5>
          { contract?.description }
        </Card> }
    </div>

    <Card title={ i10n('page.title.budget.contracts.transactions') } className='my-4 mx-2'>
      <Loading condition={ contract != null }>
        { contract && <ContractTransactions contract={ contract }/> }
      </Loading>
    </Card>
  </>
}

export default ContractDetail;
