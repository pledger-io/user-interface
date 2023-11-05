
type DataPoint = number | {
    x: number
    y: number
}

export type DataSet = {
    label: string
    data: DataPoint[]
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
}

export type Datasets = DataSet[] | undefined