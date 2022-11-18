import restAPI from "../../core/RestAPI";
import {Notifications} from "../../core";

export const TransactionService = {
    fetchAccount: ({id}) => {
        return restAPI.get(`accounts/${id}`)
    },

    fetchTransaction: ({id, transactionId}) => {
        if (isNaN(transactionId)) {
            return new Promise(resolve => resolve());
        }

        return restAPI.get(`accounts/${id}/transactions/${transactionId}`)
            .then(transaction => {
                return {
                    ...transaction,
                    metadata: {
                        contract: transaction.metadata.contract ? {id: -1, name: transaction.metadata.contract} : undefined,
                        category: transaction.metadata.category ? {id: -1, name: transaction.metadata.category} : undefined,
                        budget: transaction.metadata.budget ? {id: -1, name: transaction.metadata.budget} : undefined,
                        tags: transaction.metadata.tags
                    }
                }
            })
    },

    persist: (account, entity, navigate, id = NaN) => {
        console.log(entity)
        const transaction = {
            description: entity.description,
            source: {id: entity.from.id, name: entity.from.name},
            destination: {id: entity.to.id, name: entity.to.name},
            amount: entity.amount,
            currency: account.account.currency,
            date: entity.date,
            budget: entity.budget ? {id: -1, name: entity.budget.name} : null,
            category: entity.category ? {id: -1, name: entity.category.name} : null,
            contract: entity.contract ? {id: -1, name: entity.contract.name} : null,
            tags: entity.tags,
        }

        const promises = []
        if (isNaN(id)) {
            promises.push(restAPI.put(`accounts/${account.id}/transactions`, transaction));
        } else {
            promises.push(restAPI.post(`accounts/${account.id}/transactions/${id}`, transaction))
        }

        if (entity.split) {
            promises.push(restAPI.patch(`accounts/${account.id}/transactions/${id}`))
        }

        Promise.all(promises)
            .then(() => Notifications.Service.success(replaceAction('page.transaction.{action}.success', id)))
            .then(() => navigate(-1))
            .catch(() => Notifications.Service.warning(replaceAction('page.transaction.{action}.failed', id)))
    }
};

function replaceAction(text, id = null) {
    const action = isNaN(id) ? 'add' : 'update'
    return text.replaceAll('{action}', action)
}
