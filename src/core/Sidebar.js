import React from "react";
import Icon from '@mdi/react'
import config from '../config/sidebar-config.js'
import {Translation} from "./Translation";
import {mdiChevronDown, mdiChevronLeft, mdiClose, mdiLogoutVariant, mdiMenu} from "@mdi/js";
import {NavLink} from "react-router-dom";
import {ProfilePicture} from "../profile";
import restAPI from "./RestAPI";
import {Buttons} from "./index";

import logo from '../assets/logo.png'
import '../assets/css/Sidebar.scss'

export class Sidebar extends React.Component {
    state = {
        open: true
    }

    render() {
        const sections = config
            .map((section, index) => {
                switch (section.type) {
                    case 'section':
                        return this.section(index, section)
                    case 'button':
                        return this.button(index, section)
                    case 'divider':
                        return this.divider(index, section)
                    default:
                        return ''
                }
            });

        const classes = 'sidebar ' + (this.state.open ? '' : 'closed')
        const icon = this.state.open ? mdiClose : mdiMenu;

        return (
            <div className={classes}>
                <div className='brand'>
                    <img src={logo}/>
                    <span>Finances</span>
                    <a className='toggle' onClick={() => this.onSidebarToggle()}>
                        <Icon path={icon}
                              size={1}/>
                    </a>
                </div>
                {sections}
                <footer>
                    <NavLink to='/user/profile' className='Profile'><ProfilePicture size='40'/></NavLink>
                    <span className="text"/>
                    <Buttons.Button icon={mdiLogoutVariant}
                                    onClick={() => restAPI.logout()}
                                    variant='icon'
                                    className='logout'/>
                </footer>
            </div>
        )
    }

    onSidebarToggle() {
        this.setState({
            open: !this.state.open
        });
    }

    section(index, section) {
        return <ExpandableSection
            key={index}
            icon={section.icon}
            label={section.label}
            links={section.links}/>;
    }

    button(index, section) {
        return <SidebarButton
            key={index}
            label={section.label}
            href={section.href}
            icon={section.icon}/>
    }

    divider(index, section) {
        return (
            <div className='divider' key={index}>
                <Translation label={section.label}/>
            </div>
        )
    }
}

class ExpandableSection extends React.Component {
    state = {
        expanded: false
    }

    onClick() {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    render() {
        const buttons = this.props.links.map((link, index) => <SidebarButton
            key={index}
            label={link.label}
            href={link.href}
            icon={link.icon}/>);
        const icon = this.state.expanded ? mdiChevronDown : mdiChevronLeft;

        return (
            <section className='expandable'>
                <a className='button' onClick={() => this.onClick()}>
                    <Icon path={this.props.icon}
                          size={1}/>
                    <Translation label={this.props.label}/>
                    <Icon path={icon}
                          className='expand'
                          size={1}/>
                </a>
                <div className={'expand-buttons' + (this.state.expanded ? ' active' : '')}>
                    {buttons}
                </div>
            </section>
        )
    }
}

class SidebarButton extends React.Component {

    render() {
        const {href, icon, label} = this.props;

        return (
            <NavLink to={href} className='button'>
                <Icon path={icon}
                      size={.9}/>
                <Translation label={label}/>
            </NavLink>
        )
    }
}
