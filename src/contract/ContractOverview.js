import {useEffect, useState} from "react";
import {ContractRepository} from "../core/RestAPI";
import {BreadCrumbItem, BreadCrumbs, Buttons, Layout} from "../core";
import {ContractTable} from "./ContractTable";
import {mdiClockTimeTwoOutline, mdiHistory} from "@mdi/js";

export const ContractOverview = () => {
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
                <div className="ButtonBar Tabs">
                    <Buttons.Button onClick={() => setTabSection('active')}
                                    variant='text'
                                    icon={mdiClockTimeTwoOutline}
                                    variantType={tabSection === 'active' ? 'Active' : ''}
                                    label='page.budget.contracts.active'/>
                    <Buttons.Button onClick={() => setTabSection('terminated')}
                                    variant='text'
                                    icon={mdiHistory}
                                    variantType={tabSection === 'terminated' ? 'Active' : ''}
                                    label='page.budget.contracts.inactive'/>
                    <div className='Filler'></div>
                </div>

                {!contracts && <Layout.Loading />}
                {contracts && <ContractTable contracts={contracts[tabSection]} />}
            </Layout.Card>
        </div>
    </>
}
