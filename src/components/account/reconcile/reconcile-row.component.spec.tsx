import {act, fireEvent, render, waitFor} from '@testing-library/react';
import React from "react";
import ReconcileRowComponent from './reconcile-row.component';
import ProcessRepository, {
    ProcessInstance,
    ProcessTask,
    ProcessVariable
} from "../../../core/repositories/process.repository";
import {BrowserRouter} from "react-router";

jest.mock("../../../core/repositories/process.repository");

function tableWrapped(children: any) {
    return <BrowserRouter><table>
        <tbody>
        {children}
        </tbody>
    </table></BrowserRouter>
}

describe('ReconcileRowComponent', () => {
    const mockOnRemoved = jest.fn();
    const mockProcess: ProcessInstance = {
        id: '1',
        process: 'Process1',
        businessKey: 'Key1',
        suspended: false,
        state: 'ACTIVE'
    };
    const mockVariables: ProcessVariable[] = [{
        id: '1',
        name: 'startDate',
        value: '2022-01-01'
    }];
    const mockTasks: ProcessTask[] = [{
        id: '1',
        name: 'Task1',
        created: new Date().toISOString(),
        form: 'Form1',
        definition: 'Definition1'
    }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should load process variables on mount', async () => {
        jest.spyOn(ProcessRepository, 'variables').mockResolvedValue(Promise.resolve(mockVariables));
        render(tableWrapped(<ReconcileRowComponent process={mockProcess} onRemoved={mockOnRemoved}/>));

        await waitFor(() => expect(ProcessRepository.variables).toHaveBeenCalledWith('AccountReconcile', mockProcess.businessKey, mockProcess.id));
    });

    it('should call onRemoved when process is retried', async () => {
        jest.spyOn(ProcessRepository, 'tasks').mockResolvedValue(Promise.resolve(mockTasks));
        jest.spyOn(ProcessRepository, 'completeTask').mockResolvedValue(Promise.resolve());
        jest.spyOn(ProcessRepository, 'variables').mockResolvedValue(Promise.resolve(mockVariables));

        const { getByTestId } = render(tableWrapped(<ReconcileRowComponent process={ mockProcess }
                                                                            onRemoved={ mockOnRemoved }/>));
        await waitFor(() => expect(ProcessRepository.variables).toHaveBeenCalledWith('AccountReconcile', mockProcess.businessKey, mockProcess.id));

        const retryButton = getByTestId(`retry-button-${mockProcess.id}`);

        act(() => {
            fireEvent.click(retryButton);
        });

        await waitFor(() => expect(mockOnRemoved).toHaveBeenCalled());
    });

    it('should call onRemoved when process is deleted', async () => {
        jest.spyOn(ProcessRepository, 'variables').mockResolvedValue(Promise.resolve(mockVariables));
        jest.spyOn(ProcessRepository, 'delete').mockResolvedValue(Promise.resolve());

        const {getByTestId} = render(tableWrapped(<ReconcileRowComponent process={mockProcess}
                                                                         onRemoved={mockOnRemoved}/>));
        await waitFor(() => expect(getByTestId(`remove-row-${mockProcess.id}`)).toBeInTheDocument());

        expect(ProcessRepository.delete).not.toHaveBeenCalled();
        expect(ProcessRepository.variables).toHaveBeenCalledWith('AccountReconcile', mockProcess.businessKey, mockProcess.id);

        const deleteButton = getByTestId(`remove-row-${mockProcess.id}`);
        act(() => {
            fireEvent.click(deleteButton);
        });

        await waitFor(() => expect(getByTestId(`confirm-button`)).toBeInTheDocument());
        const confirmButton = getByTestId(`confirm-button`);
        act(() => {
            fireEvent.click(confirmButton);
        });

        await waitFor(() => expect(ProcessRepository.delete).toHaveBeenCalledWith('AccountReconcile', mockProcess.businessKey, mockProcess.id));
        expect(mockOnRemoved).toHaveBeenCalled();
    })
});