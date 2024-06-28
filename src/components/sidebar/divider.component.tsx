import React, { Attributes } from "react";
import { SidebarItem } from "./sidebar.types";

import Translation from "../localization/translation.component";

const SidebarDivider = ({ item } : Attributes & { item: SidebarItem }) => {
    return <div className='text-[var(--sidebar-icon-color)] pl-4 mt-3 uppercase'>
        <Translation label={ item.label } />
    </div>
}

export default SidebarDivider