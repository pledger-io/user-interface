import React from "react";
import PropTypes from 'prop-types';

// Export all core classes and functions
import * as Dialog from './popups'
import * as Notifications from './Notification'
import * as Buttons from './buttons'
import * as Pagination from './Paginator'
import * as Statistical from './Statistical'
import * as Translations from './localization'
import * as Formats from './Formatters'
import * as Attachments from './Attachment'
import * as Attachment from './attachment/index'
import * as Dates from './Dates'
import * as Dropdown from './dropdown'
import * as Layout from './layout'
import { BreadCrumbs, BreadCrumbItem, BreadCrumbMenu } from "./breadcrumb";

import '../assets/css/BreadCrumbs.scss'
import '../assets/css/Message.scss'

export class Message extends React.Component {
    static propTypes = {
        // The translation key to display, if set then `message` is ignored
        label: PropTypes.string,
        // The styling of the message
        variant: PropTypes.oneOf(['warning', 'info']),
        // The message to display
        message: PropTypes.string
    }

    render() {
        const { label, variant, message } = this.props;
        const className = 'Message ' + variant;

        if (label) {
            return (
                <div className={className}>
                    <Translations.Translation label={label}/>
                </div>
            )
        }

        return (
            <div className={className}>{message}</div>
        )
    }
}

const Progressbar = ({ total = 1, current = 0, className = '' }) => {
    const percentage = Math.min(100, Math.round(current / total * 100))

    return <>
        <div className={`Progressbar ${className}`} title={`${percentage}%`}>
            <div className='fg-color' style={{ width: `${percentage}%` }} />
        </div>
    </>
}
Progressbar.propTypes = {
    // the total that can be achieved (this is 100%)
    total: PropTypes.number.isRequired,
    // the current value
    current: PropTypes.number
}

class When extends React.Component {
    static propTypes = {
        // The condition that needs to be true for the children to be rendered.
        condition: PropTypes.bool
    }
    render() {
        const { condition, children } = this.props;

        if (condition) {
            return children;
        }

        return null;
    }
}

const ACCOUNT_TYPE_CONVERSION_MAP = {
    loan: 'liability',
    debt: 'liability',
    mortgage: 'liability',
    debtor: 'revenue',
    creditor: 'expense'
}
const Resolver = {
    Account: {
        resolveUrl({ id, type }) {
            const frontEndType = ACCOUNT_TYPE_CONVERSION_MAP[type] || 'own'
            return `/accounts/${frontEndType}/${id}`
        },
        isDebtor({ type }) {
            return type === 'debtor'
        },
        isCreditor({ type }) {
            return type === 'creditor'
        },
        isManaged({ type }) {
            return ['debtor', 'creditor', 'reconcile', 'debt', 'loan', 'mortgage']
                .indexOf(type) > -1
        },
        convertToBackendType(type) {
            switch (type) {
                case 'own': return 'accounts'
                case 'revenue': return 'debtor'
                case 'expense': return 'creditor'
                default: return ''
            }
        }
    },
    Transaction: {
        isCredit({ type }) {
            return type?.code === 'CREDIT'
        },
        isDebit({ type }) {
            return type?.code === 'DEBIT'
        },
        isTransfer({ type }) {
            return type?.code === 'TRANSFER'
        },
        resolveUrl({ id, source }) {
            return `${Resolver.Account.resolveUrl(source)}/transaction/${id}`
        }
    },
    uuid: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                // eslint-disable-next-line
                const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            })
    }
}

export {
    Buttons,
    Notifications,
    Dialog,
    Pagination,
    Statistical,
    Translations,
    BreadCrumbs,
    BreadCrumbItem,
    BreadCrumbMenu,
    Attachment,
    Attachments,
    When,
    Dropdown,
    Formats,
    Dates,
    Resolver,
    Progressbar,
    Layout
}
