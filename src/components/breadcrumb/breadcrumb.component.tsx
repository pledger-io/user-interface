import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from "primereact/menuitem";
import React, { PropsWithChildren, ReactElement } from "react";
import { useNavigate } from "react-router";
import { i10n } from "../../config/prime-locale";
import BreadCrumbItem, { BreadCrumbItemProps } from "./breadcrumb-item.component";
import BreadCrumbMenu from "./breadcrumb-menu.component";


const BreadCrumbs = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()

  // eslint-disable-next-line @eslint-react/no-children-to-array
  const breadCrumbElements: MenuItem[] = React.Children.toArray(children)
    .map((child: any) => {
      if (!React.isValidElement(child) || child.type !== BreadCrumbItem) {
        return undefined
      }

      const props = (child as ReactElement<typeof BreadCrumbItem>).props as BreadCrumbItemProps
      return {
        label: props.label ? i10n(props.label) : props.message,
        visible: true,
        command: () => props.href ? navigate(props.href) : undefined,
      } as MenuItem
    }).filter(item => item !== undefined)

  // eslint-disable-next-line @eslint-react/no-children-to-array
  const breadCrumbMenu = React.Children.toArray(children)
      .filter(child => React.isValidElement(child) && child.type === BreadCrumbMenu)
      .map(child => ((child as ReactElement<typeof BreadCrumbMenu>).props as PropsWithChildren).children)

  return <>
    <div className='bg-white flex justify-between'>
      <BreadCrumb model={ breadCrumbElements } className='border-none!' />

      <div className='flex items-center gap-2'>
        { breadCrumbMenu }
      </div>
    </div>
  </>
}

export default BreadCrumbs
