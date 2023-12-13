import React, { useState } from "react";
import Icon from '@mdi/react'
import config from '../config/sidebar-config.js'
import { Translation } from "./localization";
import { mdiChevronDown, mdiChevronLeft, mdiClose, mdiLogoutVariant, mdiMenu } from "@mdi/js";
import { NavLink, useNavigate } from "react-router-dom";
import SecurityRepository from "./repositories/security-repository";
import { Buttons } from "./index";

import logo from '../assets/logo.png'
import '../assets/css/Sidebar.scss'
import PropTypes from "prop-types";
import ProfilePicture from "../profile/profile-picture.component";


export const Sidebar = ({ logoutCallback }) => {
    const [open, setOpen] = useState(() => {
        return window.document.body.clientWidth > 500
    })
    const navigate = useNavigate()

    const onToggleClick = () => setOpen(!open)
    const onLogout = () => SecurityRepository.logout() || logoutCallback() || navigate('/')

    return (
        <div className={'sidebar ' + (open ? '' : 'closed')}>
            <div className='brand'>
                <img src={logo} alt='logo'/>
                <span>Pledger<span style={{ color: 'var(--app-text-muted-color)' }}>.io</span></span>
                <span className='toggle' onClick={onToggleClick}>
                    <Icon path={open ? mdiClose : mdiMenu}
                          size={ 1 }/>
                </span>
            </div>
            {config
                .map((section, index) => {
                    switch (section.type) {
                        case 'section': return <ExpandableSection key={index} icon={section.icon} label={section.label} links={section.links}/>
                        case 'button': return <SidebarButton key={index} label={section.label} href={section.href} icon={section.icon}/>
                        case 'divider': return <div className='divider' key={index}><Translation label={section.label}/></div>
                        default: return ''
                    }
                })}
            <div className='spacer'/>
            <footer>
                <NavLink to='/user/profile/theme' className='Profile'>
                    <ProfilePicture size='40'/>
                </NavLink>
                <span className="text"/>
                <Buttons.Button icon={mdiLogoutVariant}
                                onClick={onLogout}
                                variant='icon'
                                className='logout'/>
            </footer>
        </div>
    )
}
Sidebar.propTypes = {
    logoutCallback: PropTypes.func
}


const ExpandableSection = ({ label, icon, links }) => {
    const [expanded, setExpanded] = useState(false)
    const onClick = () => setExpanded(!expanded)

    return (
        <section className='expandable'>
            <span className='button' onClick={onClick}>
                <Icon path={icon} size={1} />
                <Translation label={label} />
                <Icon path={expanded ? mdiChevronDown : mdiChevronLeft}
                      className='expand'
                      size={1}/>
            </span>
            <div className={'expand-buttons' + (expanded ? ' active' : '')}>
                {links.map((link, index) =>
                    <SidebarButton
                        key={index}
                        label={link.label}
                        href={link.href}
                        icon={link.icon}/>)}
            </div>
        </section>
    )
}
ExpandableSection.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.any,
    links: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        href: PropTypes.string,
        icon: PropTypes.any
    }))
}

/**
 * Add a buttons that is specific to the sidebar.
 */
const SidebarButton = ({ href, icon, label }) => {
    return (
        <NavLink to={href} className='button'>
            <Icon path={icon}
                  size={.9}/>
            <Translation label={label}/>
        </NavLink>
    )
}
SidebarButton.propTypes = {
    href: PropTypes.string,
    icon: PropTypes.any,
    label: PropTypes.string
}

