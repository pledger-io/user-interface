import { BreadCrumbItem, BreadCrumbs, Buttons, Layout } from "../../core";
import React from "react";
import { mdiPlus } from "@mdi/js";
import OverviewTableComponent from "./overview-table.component";

const BatchOverview = () => {

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.settings.import'/>
        </BreadCrumbs>

        <Layout.Card actions={ [<Buttons.Button icon={ mdiPlus }
                                                href='/upload/create'
                                                label='page.settings.import.new'/>] }
                     title='page.nav.settings.import'>
            <OverviewTableComponent />
        </Layout.Card>
    </>
}

export default BatchOverview