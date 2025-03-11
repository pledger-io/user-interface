import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React from "react";
import ReconcileRowComponent from './reconcile-row.component';
import ProcessRepository, {
    ProcessInstance,
    ProcessTask,
    ProcessVariable
} from "../../../core/repositories/process.repository";
import { BrowserRouter } from "react-router";
import { vi } from "vitest";


function tableWrapped(children: any) {
    return <BrowserRouter><table>
        <tbody>
        {children}
        </tbody>
    </table></BrowserRouter>
}

describe('ReconcileRowComponent', () => {
    const mockOnRemoved = vi.fn();
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

    it('should load process variables on mount', async () => {
        vi.spyOn(ProcessRepository, 'variables').mockResolvedValue(mockVariables);
        render(tableWrapped(<ReconcileRowComponent process={mockProcess} onRemoved={mockOnRemoved}/>));

        await waitFor(() => expect(ProcessRepository.variables).toHaveBeenCalledWith('AccountReconcile', mockProcess.businessKey, mockProcess.id));
    });

    it('should call onRemoved when process is retried', async () => {
        vi.spyOn(ProcessRepository, 'tasks').mockResolvedValue(mockTasks);
        vi.spyOn(ProcessRepository, 'completeTask').mockResolvedValue();
        vi.spyOn(ProcessRepository, 'variables').mockResolvedValue(mockVariables);

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
        vi.spyOn(ProcessRepository, 'variables').mockResolvedValue(mockVariables);
        vi.spyOn(ProcessRepository, 'delete').mockResolvedValue();

        const { getByTestId } = render(tableWrapped(<ReconcileRowComponent process={mockProcess}
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