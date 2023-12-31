
export type SidebarItem = {
    label: string
}

export type SidebarSection = SidebarItem & {
    icon: string,
    links: SidebarButton[]
}

export type SidebarButton = SidebarItem & {
    icon: string,
    href: string
}