import React from "react";
import PropTypes from 'prop-types';

// Export all core classes and functions
import * as Attachment from './attachment/index'

import '../assets/css/BreadCrumbs.scss'
import '../assets/css/Message.scss'

const Progressbar = ({ total = 1, current = 0, className = '' }) => {
    const percentage = Math.min(100, Math.round(current / total * 100))

    return <>
        <div className={`Progressbar ${className}`} title={`${percentage}%`}>
            <div className='fg-color' style={{ width: `${percentage}%` }} />
        </div>
    </>
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
            return `${Resolver.Account.resolveUrl(source)}/transactions/${id}`
        }
    },
    uuid: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0, 
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }
}

export {
    Attachment,
    When,
    Resolver,
    Progressbar,
}
