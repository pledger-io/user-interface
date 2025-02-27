import { FC, ReactNode } from "react";
import { Button } from "./button";

export type TabButton = {
    id: string,
    title: string,
    icon?: any
}
type TabsProps = {
    activeTab?: string,
    buttons: TabButton[],
    children: ReactNode | ReactNode[],
    onChange: (_: string) => void
}

const Tabs: FC<TabsProps> = ({  activeTab, buttons, children, onChange }) => {

    return <>
        <div className='flex flex-col'>
            <div className='flex items-end mb-4'>
                {
                    buttons.map(button => (
                        <Button label={ button.title }
                                onClick={ () => onChange(button.id) }
                                key={ button.id }
                                variant='text'
                                className={`p-4 !border-solid border-b-[1px] !border-separator rounded-t-lg hover:filter-none
                                           ${activeTab === button.id ? 'border-[1px] border-b-0' : ''}`}
                                icon={ button.icon }/>
                    ))
                }
                <div className='grow border-b-[1px] border-b-separator'/>
            </div>
            <div>
                { children }
            </div>
        </div>
    </>
}

export default Tabs