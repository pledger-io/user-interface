import { mdiClockTimeTwoOutline, mdiHistory, mdiPlus } from "@mdi/js";
import { useEffect, useState } from "react";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";

import ContractTable from "../../components/contract/contract-table";
import { Button } from "../../components/layout/button";
import Card from "../../components/layout/card.component";
import Loading from "../../components/layout/loading.component";
import Tabs from "../../components/layout/tab.component";
import ContractRepository, { ContractList } from "../../core/repositories/contract-repository";

type TabSection = 'active' | 'terminated'

const ContractOverview = () => {
    const [contracts, setContracts] = useState<ContractList>()
    const [tabSection, setTabSection] = useState<TabSection>('active')

    useEffect(() => {
        ContractRepository.list()
            .then(setContracts)
    }, [])

    return <>
        <div className='ContractOverview'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.finances'/>
                <BreadCrumbItem label='page.nav.budget.contracts'/>
            </BreadCrumbs>

            <Card title='page.budget.contracts.title'
                  actions={ [
                      <Button href='/contracts/create'
                              icon={ mdiPlus }
                              key='create-button'
                              label='page.budget.contracts.add'/>
                  ] }>
                <Tabs onChange={ section => setTabSection(section as TabSection) }
                      activeTab={ tabSection }
                      buttons={ [
                          { id: 'active', title: 'page.budget.contracts.active', icon: mdiClockTimeTwoOutline },
                          { id: 'terminated', title: 'page.budget.contracts.inactive', icon: mdiHistory }] }>

                    { !contracts && <Loading/> }
                    { contracts && <ContractTable contracts={ contracts[tabSection] }/> }
                </Tabs>
            </Card>
        </div>
    </>
}

export default ContractOverview