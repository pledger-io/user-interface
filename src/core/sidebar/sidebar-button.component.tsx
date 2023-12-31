import { NavLink } from "react-router-dom";
import Icon from "@mdi/react";
import { Translation } from "../localization";
import React from "react";
import { SidebarButton } from "./sidebar.types";

const SidebarButtonComponent = (props: { config: SidebarButton }) => {
    const { href, icon, label } = props.config

    return <NavLink to={ href }
                    className={({ isActive, isPending }) =>
                           `flex flex-row items-center
                            pl-4 py-2 gap-1
                            ${ isActive ? 'bg-[var(--sidebar-sub-background)] font-bold' : '' }
                            hover:bg-[var(--app-background)] hover:text-[var(--app-header-text)]
                            text-[var(--sidebar-title-color)]`}>
        <Icon path={ icon }
              className='pl-1'
              size={.9}/>
        <Translation label={ label }/>
    </NavLink>
}

export default SidebarButtonComponent