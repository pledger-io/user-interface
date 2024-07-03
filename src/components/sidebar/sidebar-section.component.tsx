import { mdiChevronDown, mdiChevronLeft } from "@mdi/js";
import Icon from "@mdi/react";
import React, { Attributes, useState } from "react";
import Translation from "../localization/translation.component";

import SidebarButtonComponent from "./sidebar-button.component";
import { SidebarSection } from "./sidebar.types";


const SidebarSectionComponent = ({ config } : Attributes & { config: SidebarSection }) => {
    const [open, setOpen] = useState(false)

    return <>
        <div>
            <div onClick={ () => setOpen(!open) }
                 className='flex flex-row items-center
                            pl-4 py-2 gap-1 cursor-pointer
                            hover:bg-[var(--app-background)] hover:text-[var(--app-header-text)]
                            text-[var(--sidebar-title-color)]'>
                <Icon path={ config.icon }
                      className='pl-1 max-w-[1.35rem]'
                      size={ .9 } />
                <Translation label={ config.label } />
                <Icon path={open ? mdiChevronDown : mdiChevronLeft}
                      className='text-[var(--app-text-muted-color)] ml-auto pr-2'
                      size={1}/>
            </div>

            { open &&
                <div className='ml-2 rounded-bl-[5px] rounded-br-[5px] bg-[var(--sidebar-sub-background)] overflow-hidden'>
                    { config.links.map((link, idx) =>
                        <SidebarButtonComponent config={ link } key={ idx } />
                    )}
                </div>
            }
        </div>
    </>
}

export default SidebarSectionComponent