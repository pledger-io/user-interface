import { BreadCrumbItem, BreadCrumbs, Buttons } from "../../core";
import React from "react";
import { mdiPlus } from "@mdi/js";

import OverviewTableComponent from "./overview-table.component";
import Card from "../../components/layout/card.component";

const BatchOverview = () => {

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.settings.import'/>
        </BreadCrumbs>

        <Card actions={ [<Buttons.Button icon={ mdiPlus }
                                                key='new'
                                                href='/upload/create'
                                                label='page.settings.import.new'/>] }
                     title='page.nav.settings.import'>
            <OverviewTableComponent />
        </Card>
    </>
}

export default BatchOverview