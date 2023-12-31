
import logo from '../../assets/logo.png'
import config from '../../config/sidebar-config.js'
import React from "react";
import { NavLink } from "react-router-dom";
import ProfilePicture from "../../profile/profile-picture.component";
import { Buttons } from "../index";
import { mdiLogoutVariant } from "@mdi/js";
import SidebarDivider from "./divider";
import SidebarButtonComponent from "./sidebar-button.component";
import { SidebarButton, SidebarSection } from "./sidebar.types";
import SidebarSectionComponent from "./sidebar-section.component";
import SecurityRepository from "../repositories/security-repository";


type SidebarProps = {
    logoutCallback: () => void
}

const Sidebar = ({ logoutCallback } : SidebarProps) => {
    const onLogout = () => {
        SecurityRepository.logout()
        logoutCallback()
    }

    return <>
        <div className='h-screen max-w-[218px] flex-col overflow-y-auto
                        hidden md:flex
                        text-white bg-[var(--sidebar-background)]'>
            <div className='py-1 px-3 mb-5 flex flex-row items-center
                            bg-[var(--sidebar-sub-background)]'>
                <img className='max-w-[35px] max-h-[35px] flex-1'
                     src={ logo } alt='logo'/>
                <span className='flex-1 pt-1 text-center text-lg'>
                    Pledger
                    <span className='text-[var(--app-text-muted-color)]'>.io</span>
                </span>
            </div>

            {
                config.map((section, idx) => {
                    switch (section.type) {
                        case 'divider': return <SidebarDivider key={ idx } item={ section } />
                        case 'button': return <SidebarButtonComponent key={ idx } config={ section as SidebarButton } />
                        case 'section': return <SidebarSectionComponent config={ section as SidebarSection } key={ idx } />
                    }
                })
            }

            <div className='flex-auto'/>

            <footer className='flex items-center justify-between bg-[var(--sidebar-sub-background)]'>
                <NavLink to='/user/profile/theme' className='px-2 py-1'>
                    <ProfilePicture size={ 40 }
                                    className='bg-[var(--sidebar-title-color)] rounded'/>
                </NavLink>

                <Buttons.Button icon={ mdiLogoutVariant }
                                onClick={ onLogout }
                                variant='icon'
                                className='px-2 text-[var(--sidebar-icon-color)]'/>
            </footer>
        </div>
    </>
}

export default Sidebar