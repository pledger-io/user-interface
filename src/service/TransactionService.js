import { TransactionRepository } from "../core/RestAPI";

export const TransactionService = {
    persist: (account, entity, navigate, id = NaN, success, warning) => {
        const transaction = {
            description: entity.description,
            source: { id: entity.from.id, name: entity.from.name },
            destination: { id: entity.to.id, name: entity.to.name },
            amount: entity.amount,
            currency: account.account.currency,
            date: entity.date,
            budget: entity.budget ? { id: -1, name: entity.budget.name } : null,
            category: entity.category ? { id: -1, name: entity.category.name } : null,
            contract: entity.contract ? { id: -1, name: entity.contract.name } : null,
            tags: entity.tags,
        }

        const promises = []
        if (isNaN(id)) {
            promises.push(TransactionRepository.create(account.id, transaction));
        } else {
            promises.push(TransactionRepository.update(id, transaction))
        }

        if (entity.split) {
            promises.push(TransactionRepository.splits(id, entity.split))
        }

        Promise.all(promises)
            .then(() => success(replaceAction('page.transaction.{action}.success', id)))
            .then(() => navigate(-1))
            .catch(() => warning(replaceAction('page.transaction.{action}.failed', id)))
    }
};

function replaceAction(text, id = null) {
    const action = isNaN(id) ? 'add' : 'update'
    return text.replaceAll('{action}', action)
}
