import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import ContractTable from "../../components/contract/contract-table";
import { i10n } from "../../config/prime-locale";
import ContractRepository, { ContractList } from "../../core/repositories/contract-repository";

const ContractOverview = () => {
  const [contracts, setContracts] = useState<ContractList>()

  useEffect(() => {
    ContractRepository.list()
      .then(response => setContracts({
        active: response.active || [],
        terminated: response.terminated || []
      }))
  }, [])

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.budget.contracts.title') }
  </div>

  return <div className='ContractOverview'>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.finances'/>
      <BreadCrumbItem label='page.nav.budget.contracts'/>
    </BreadCrumbs>

    <Card header={ header } className='mx-2 my-4'>

      <div className='flex justify-end'>
        <NavLink to={ '/contracts/create' }
                 className='p-button p-button-success p-button-sm !mb-4 gap-1 items-center'>
          <Icon path={ mdiPlus } size={ .8 }/> { i10n('page.budget.contracts.add') }
        </NavLink>
      </div>

      <TabView>
        <TabPanel header={ i10n('page.budget.contracts.active') }>
          <ContractTable contracts={ contracts?.active }/>
        </TabPanel>
        <TabPanel header={ i10n('page.budget.contracts.inactive') }>
          <ContractTable contracts={ contracts?.terminated }/>
        </TabPanel>
      </TabView>
    </Card>
  </div>
}

export default ContractOverview
