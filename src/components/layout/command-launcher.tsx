import { Icon } from "@iconify-icon/react";
import React, { useEffect, useId, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useLocation, useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";
import { navigationSections, resolveActiveSection, SectionId } from "../../navigation/sections";

export type CommandAction = {
  id: string
  section: SectionId
  label: string
  description: string
  to: string
  icon: string
  keywords: string[]
  aliases: string[]
  matchPrefixes: string[]
}

type CommandLauncherProps = {
  visible: boolean
  commands: CommandAction[]
  onHide: () => void
}

const recentCommandsStorageKey = 'command-launcher-recent-v1'

const readRecentCommandIds = () => {
  const fallback: string[] = []
  try {
    const stored = localStorage.getItem(recentCommandsStorageKey)
    if (!stored) {
      return fallback
    }
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return fallback
    }
    return parsed.filter(value => typeof value === 'string')
  } catch {
    return fallback
  }
}

const writeRecentCommandIds = (ids: string[]) => {
  try {
    localStorage.setItem(recentCommandsStorageKey, JSON.stringify(ids.slice(0, 8)))
  } catch {
    // Ignore storage write failures.
  }
}

const CommandLauncher = ({ visible, commands, onHide }: CommandLauncherProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const listboxId = useId()
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>(() => readRecentCommandIds())
  const activeSection = resolveActiveSection(location.pathname)

  const updateRecentCommandIds = (commandId: string) => {
    setRecentCommandIds(previous => {
      const next = [commandId, ...previous.filter(id => id !== commandId)].slice(0, 8)
      writeRecentCommandIds(next)
      return next
    })
  }

  useEffect(() => {
    const matchingCommand = commands.find(command =>
      command.matchPrefixes.some(prefix => location.pathname.startsWith(prefix)))
    if (!matchingCommand) {
      return
    }
    updateRecentCommandIds(matchingCommand.id)
  }, [commands, location.pathname])

  const commandById = useMemo(() => {
    const byId = new Map<string, CommandAction>()
    commands.forEach(command => byId.set(command.id, command))
    return byId
  }, [commands])

  const commandScores = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) {
      return new Map<string, number>()
    }

    const scoreById = new Map<string, number>()
    const searchWords = search.split(/\s+/).filter(Boolean)
    commands.forEach(command => {
      const label = command.label.toLowerCase()
      const description = command.description.toLowerCase()
      const keywordText = command.keywords.join(' ').toLowerCase()
      const aliasText = command.aliases.join(' ').toLowerCase()
      const words = label.split(/[^a-z0-9]+/).filter(Boolean)

      let textScore = 0
      if (label === search) {
        textScore += 120
      }
      if (label.startsWith(search)) {
        textScore += 90
      }
      if (searchWords.some(word => words.includes(word))) {
        textScore += 70
      }
      if (keywordText.includes(search) || aliasText.includes(search) || description.includes(search)) {
        textScore += 45
      }
      if (textScore === 0) {
        return
      }

      let score = textScore
      if (command.section === activeSection) {
        score += 20
      }
      if (recentCommandIds.includes(command.id)) {
        score += 15
      }

      if (score > 0) {
        scoreById.set(command.id, score)
      }
    })
    return scoreById
  }, [activeSection, commands, query, recentCommandIds])

  const isSearching = query.trim().length > 0

  const orderedMatchingCommands = useMemo(() => {
    if (!isSearching) {
      return commands
    }
    return commands
      .filter(command => commandScores.has(command.id))
      .sort((first, second) => {
        const scoreDelta = (commandScores.get(second.id) ?? 0) - (commandScores.get(first.id) ?? 0)
        if (scoreDelta !== 0) {
          return scoreDelta
        }
        return first.label.localeCompare(second.label)
      })
  }, [commandScores, commands, isSearching])

  const recentCommands = useMemo(() => {
    return recentCommandIds
      .map(commandId => commandById.get(commandId))
      .filter((command): command is CommandAction => !!command)
      .filter(command => !isSearching || commandScores.has(command.id))
  }, [commandById, commandScores, isSearching, recentCommandIds])

  const inSectionCommands = useMemo(() => {
    const usedIds = new Set(recentCommands.map(command => command.id))
    return orderedMatchingCommands
      .filter(command => command.section === activeSection)
      .filter(command => !usedIds.has(command.id))
  }, [activeSection, orderedMatchingCommands, recentCommands])

  const allDestinationCommands = useMemo(() => {
    const usedIds = new Set([
      ...recentCommands.map(command => command.id),
      ...inSectionCommands.map(command => command.id)
    ])
    return orderedMatchingCommands.filter(command => !usedIds.has(command.id))
  }, [inSectionCommands, orderedMatchingCommands, recentCommands])

  const allVisibleCommands = useMemo(() => [
    ...recentCommands,
    ...inSectionCommands,
    ...allDestinationCommands
  ], [allDestinationCommands, inSectionCommands, recentCommands])

  useEffect(() => {
    if (allVisibleCommands.length === 0) {
      setHighlightedIndex(-1)
      return
    }
    if (highlightedIndex >= allVisibleCommands.length) {
      setHighlightedIndex(0)
    }
  }, [allVisibleCommands.length, highlightedIndex])

  const onSelect = (command: CommandAction) => {
    setQuery('')
    setHighlightedIndex(-1)
    updateRecentCommandIds(command.id)
    onHide()
    navigate(command.to)
  }

  const closeDialog = () => {
    setQuery('')
    setHighlightedIndex(-1)
    onHide()
  }

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (allVisibleCommands.length === 0) {
        return
      }
      setHighlightedIndex(previous => {
        if (previous < 0 || previous >= allVisibleCommands.length - 1) {
          return 0
        }
        return previous + 1
      })
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (allVisibleCommands.length === 0) {
        return
      }
      setHighlightedIndex(previous => {
        if (previous <= 0) {
          return allVisibleCommands.length - 1
        }
        return previous - 1
      })
      return
    }

    if (event.key === 'Enter' && allVisibleCommands.length > 0) {
      event.preventDefault()
      const selectedIndex = highlightedIndex >= 0 ? highlightedIndex : 0
      onSelect(allVisibleCommands[selectedIndex])
    }
  }

  const translate = (key: string) => {
    const translated = i10n(key)
    if (translated === key || translated.startsWith('_missing_localization_')) {
      return key
    }
    return translated
  }

  const activeOptionId = highlightedIndex >= 0 ? `${ listboxId }-option-${ highlightedIndex }` : undefined
  const sectionTitle = (sectionId: SectionId) => {
    const sectionKey = navigationSections.find(section => section.id === sectionId)?.labelKey ?? 'page.nav.dashboard'
    return translate(sectionKey)
  }

  const renderCommand = (command: CommandAction, index: number) => {
    return <button
      key={ `${ command.id }-${ index }` }
      type='button'
      id={ `${ listboxId }-option-${ index }` }
      role='option'
      onClick={ () => onSelect(command) }
      onMouseEnter={ () => setHighlightedIndex(index) }
      tabIndex={ -1 }
      aria-selected={ highlightedIndex === index }
      className={ `ui-interactive-surface flex w-full items-start gap-2 px-3 py-2 text-left ${
        highlightedIndex === index ? 'ui-interactive-active' : ''
      }` }>
      <Icon icon={ command.icon } width='1.2em' className='mt-0.5'/>
      <span className='min-w-0 grow'>
        <span className='block truncate font-medium'>{ command.label }</span>
        <span className='block truncate text-sm text-muted'>{ command.description }</span>
      </span>
    </button>
  }

  let optionIndex = 0
  const nextOptionIndex = () => {
    const next = optionIndex
    optionIndex += 1
    return next
  }

  const groupedAllDestinations = allDestinationCommands.reduce<Record<SectionId, CommandAction[]>>((groups, command) => {
    groups[command.section] = groups[command.section] || []
    groups[command.section].push(command)
    return groups
  }, {
    overview: [],
    transactions: [],
    budgets: [],
    accounts: [],
    automation: [],
    settings: []
  })

  return <Dialog
    header={ translate('layout.command.title') }
    visible={ visible }
    onHide={ closeDialog }
    className='w-[38rem] max-w-[95vw]'
    dismissableMask
    closeOnEscape>
    <div className='flex flex-col gap-3'>
      <span className='p-input-icon-left'>
        <Icon icon='mdi:magnify' className='ml-3 text-muted' width='1em'/>
        <InputText
          value={ query }
          autoFocus
          aria-label={ translate('a11y.command.input') }
          role='combobox'
          aria-controls={ listboxId }
          aria-expanded={ true }
          aria-autocomplete='list'
          aria-activedescendant={ activeOptionId }
          onChange={ event => {
            setQuery(event.target.value)
            setHighlightedIndex(-1)
          } }
          onKeyDown={ onInputKeyDown }
          placeholder={ translate('layout.command.placeholder') }
          className='w-full'
        />
      </span>

      <div
        id={ listboxId }
        role='listbox'
        aria-label={ translate('layout.command.title') }
        className='max-h-[22rem] overflow-y-auto border border-separator rounded-md'>
        <div className='border-b border-separator'>
          <div className='px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted'>{ translate('layout.command.group.recent') }</div>
          { recentCommands.length > 0
            ? recentCommands.map(command => renderCommand(command, nextOptionIndex()))
            : <div className='px-3 pb-3 text-sm text-muted'>{ translate('layout.command.empty.recent') }</div> }
        </div>
        <div className='border-b border-separator'>
          <div className='px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted'>{ translate('layout.command.group.section') }</div>
          { inSectionCommands.length > 0
            ? inSectionCommands.map(command => renderCommand(command, nextOptionIndex()))
            : <div className='px-3 pb-3 text-sm text-muted'>{ translate('layout.command.empty.section') }</div> }
        </div>
        <div>
          <div className='px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted'>{ translate('layout.command.group.all') }</div>
          { (Object.keys(groupedAllDestinations) as SectionId[])
            .filter(sectionId => groupedAllDestinations[sectionId].length > 0)
            .map(sectionId => (
              <div key={ sectionId } className='pb-1'>
                <div className='px-3 py-1 text-xs text-muted'>{ sectionTitle(sectionId) }</div>
                { groupedAllDestinations[sectionId].map(command => renderCommand(command, nextOptionIndex())) }
              </div>
            )) }
          { allDestinationCommands.length === 0 && <div className='px-3 pb-3 text-sm text-muted'>
            { translate('layout.command.empty.all') }
          </div> }
        </div>
        { allVisibleCommands.length === 0 && <div className='border-t border-separator px-3 py-4 text-sm text-muted'>
          { translate('layout.command.empty') }
        </div> }
      </div>
    </div>
  </Dialog>
}

export default CommandLauncher
