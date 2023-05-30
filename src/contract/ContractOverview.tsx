import {FC, useEffect, useState} from "react";
import {ContractRepository} from "../core/RestAPI";
import {BreadCrumbItem, BreadCrumbs, Layout} from "../core";
import {ContractTable} from "./ContractTable";
import {mdiClockTimeTwoOutline, mdiHistory} from "@mdi/js";

export const ContractOverview: FC<void> = () => {
    const [contracts, setContracts] = useState()
    const [tabSection, setTabSection] = useState('active')

    useEffect(() => {
        ContractRepository.list()
            .then(setContracts)
    }, [])

    return <>
        <div className='ContractOverview'>
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.finances' />
                <BreadCrumbItem label='page.nav.budget.contracts' />
            </BreadCrumbs>

            <Layout.Card title='page.budget.contracts.title'>
                <Layout.Tabs onChange={setTabSection}
                             activeTab={tabSection}
                             buttons={[
                                 {id: 'active', title: 'page.budget.contracts.active', icon: mdiClockTimeTwoOutline},
                                 {id: 'terminated', title: 'page.budget.contracts.inactive', icon: mdiHistory}]}>

                    {!contracts && <Layout.Loading />}
                    {contracts && <ContractTable contracts={contracts[tabSection]} />}
                </Layout.Tabs>
            </Layout.Card>
        </div>
    </>
}
