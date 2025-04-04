import { Card } from "primereact/card";
import React from "react";
import { Outlet, useLocation } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import NavigationComponent from "../../components/profile/navigation.component";
import { i10n } from "../../config/prime-locale";

export const ProfileComponent = () => {
  const location = useLocation()

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.title.user.profile') }
  </div>

  const subSection = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)
  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.title.user.profile'/>
      <BreadCrumbItem label={ `page.user.profile.${ subSection }` }/>
    </BreadCrumbs>

    <Card header={ header } className='mx-2 my-4'>
      <div className='flex gap-4'>
        <div className='w-50'>
          <NavigationComponent/>
        </div>
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </Card>
  </>
}
