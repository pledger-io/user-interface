import React from "react";
import { mdiPlus } from "@mdi/js";

import OverviewTableComponent from "../../components/upload/overview-table.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../components/layout/button";
import Card from "../../components/layout/card.component";

const BatchOverview = () => {

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.settings.import'/>
        </BreadCrumbs>

        <Card actions={ [<Button icon={ mdiPlus }
                                                key='new'
                                                href='/upload/create'
                                                label='page.settings.import.new'/>] }
                     title='page.nav.settings.import'>
            <OverviewTableComponent />
        </Card>
    </>
}

export default BatchOverview