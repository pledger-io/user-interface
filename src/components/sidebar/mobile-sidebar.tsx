import { mdiCloseBox, mdiLogoutVariant } from "@mdi/js";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import config from '../../config/sidebar-config.js'
import { Button } from "../layout/button";
import ProfilePicture from "../profile/profile-picture.component";
import SidebarDivider from "./divider.component";
import SidebarButtonComponent from "./sidebar-button.component";
import SidebarSectionComponent from "./sidebar-section.component";
import { SidebarButton, SidebarSection } from "./sidebar.types";


type SidebarProps = {
    logoutCallback: () => void
}

const MobileSidebar = ({ logoutCallback }: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const onMenuClick = () => setIsOpen(previous => !previous)

        window.addEventListener('hamburger-menu-click', onMenuClick)
        return () => window.removeEventListener('hamburger-menu-click', onMenuClick)
    }, [])

    if (!isOpen) return <></>
    return <div
        className='fixed md:hidden left-0 top-[38px] z-1055 h-full w-full bg-[#00000099] flex items-center justify-center'>
        <div className='mx-auto w-fit min-w-[20em] bg-[var(--sidebar-background)] p-4 rounded-2xl overflow-hidden'>
            {
                config.map((section, idx) => {
                    switch (section.type) {
                        case 'divider':
                            return <SidebarDivider key={ idx } item={ section }/>
                        case 'button':
                            return <SidebarButtonComponent key={ idx } config={ section as SidebarButton }/>
                        case 'section':
                            return <SidebarSectionComponent config={ section as SidebarSection } key={ idx }/>
                        default:
                            return null
                    }
                })
            }

                <footer
                    className='mx-[-1rem] mb-[-.9rem] mt-5 flex items-center justify-between bg-[var(--sidebar-sub-background)]'>
                    <NavLink to='/user/profile/theme' className='px-2 py-1'>
                        <ProfilePicture size={ 40 }
                                        className='bg-[var(--sidebar-title-color)] rounded-sm'/>
                    </NavLink>

                    <Button label='common.action.close'
                            icon={ mdiCloseBox }
                            onClick={ () => setIsOpen(false) }
                            variant='primary'
                            className='border-none text-white!'/>

                    <Button icon={ mdiLogoutVariant }
                            onClick={ logoutCallback }
                            variant='icon'
                            className='px-2 text-[var(--sidebar-icon-color)]'/>
                </footer>
            </div>
        </div>
}

export default MobileSidebar