import { Translation } from "../localization";
import React from "react";
import { SidebarItem } from "./sidebar.types";

const SidebarDivider = ({ item } : { item: SidebarItem }) => {
    return <div className='text-[var(--sidebar-icon-color)] pl-4 mt-3 uppercase'>
        <Translation label={ item.label } />
    </div>
}

export default SidebarDivider