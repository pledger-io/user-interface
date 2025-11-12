import RestApi from "./rest-api";
import { Identifier, Rule, RuleGroup, Unique } from "../../types/types";
import { Resolver } from "../index";

function entities_unique<T extends Unique>(entities: T[]) {
  return entities.map(e => {
    return {
      ...e,
      uuid: e.uuid || Resolver.uuid()
    }
  })
}

function rule_unique(rule: Rule): Rule {
  return {
    ...rule,
    conditions: entities_unique(rule.conditions),
    changes: entities_unique(rule.changes)
  }
}

const RuleRepository = (api => {
  return {
    groups: (): Promise<RuleGroup[]> => api.get('transaction-rules'),
    createGroup: (name: string) => api.post('transaction-rules', { name }),
    deleteGroup: (group: string) => api.delete(`transaction-rules/${ group }`),
    groupUp: (group: string) => api.get(`transaction-rules/groups/${ group }/move-up`),
    groupDown: (group: string) => api.get(`transaction-rules/groups/${ group }/move-down`),
    rules: (group: string): Promise<Rule[]> => api.get(`transaction-rules/${ group }`),
    rule: (group: string, id: Identifier) => api.get<Rule>(`transaction-rules/${ group }/${ id }`).then(rule_unique),
    updateRule: (group: string, id: Identifier, rule: any) => api.put(`transaction-rules/${ group }/${ id }`, rule),
    createRule: (group: string, rule: any) => api.post(`transaction-rules/${ group }`, rule),
    deleteRule: (group: string, id: Identifier) => api.delete(`transaction-rules/${ group }/${ id }`),
  }
})(RestApi)

export default RuleRepository