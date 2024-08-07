import { Attributes } from "react";

type TagProps = Attributes & {
    label: string,
    color?: string
}

const Tag = ({ label, color = "blue" } : TagProps) => {
    return <>
        { /* bg-blue-100 bg-gray-100 */ }
        { /* text-blue-400 text-gray-400 */ }
        <span className={ `text-xs text-${color}-400 bg-${color}-100 
                              rounded-full px-2 py-0.5 inline-block`}>
            { label }
        </span>
    </>
}

export default Tag