import { FC, useEffect, useState } from "react";
import { BreadCrumbItem, BreadCrumbs, Buttons, Layout } from "../../core";
import { mdiClockTimeTwoOutline, mdiHistory, mdiPlus } from "@mdi/js";
import ContractTable from "./contract-table";
import ContractRepository, { ContractList } from "../../core/repositories/contract-repository";

type TabSection = 'active' | 'terminated'

const ContractOverview: FC<void> = () => {
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

            <Layout.Card title='page.budget.contracts.title'
                         actions={[
                             <Buttons.Button href='/contracts/create'
                                             icon={ mdiPlus }
                                             key='create-button'
                                             label='page.budget.contracts.add' />
                         ]}
            >
                <Layout.Tabs onChange={ section => setTabSection(section as TabSection) }
                             activeTab={tabSection}
                             buttons={[
                                 { id: 'active', title: 'page.budget.contracts.active', icon: mdiClockTimeTwoOutline },
                                 { id: 'terminated', title: 'page.budget.contracts.inactive', icon: mdiHistory }]}>

                    {!contracts && <Layout.Loading/>}
                    {contracts && <ContractTable contracts={contracts[tabSection]}/>}
                </Layout.Tabs>
            </Layout.Card>
        </div>
    </>
}

export default ContractOverview