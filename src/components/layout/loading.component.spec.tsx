import React, {ReactNode} from 'react';
import {render, screen} from '@testing-library/react';
import Loading from './loading.component';

describe('Loading', () => {
    const dummyChild: ReactNode = <h1>Test Child</h1>;

    const renderLoadingComponent = (props: any) => {
        return render(<Loading {...props}>{dummyChild}</Loading>);
    };

    it('Should render loading icon when condition is false', () => {
        renderLoadingComponent({condition: false});
        const loadingIcon = screen.getByRole('presentation');
        expect(loadingIcon).not.toBeNull();
    });

    it('Should render children when condition is true', () => {
        renderLoadingComponent({condition: true});
        const childElement = screen.getByText('Test Child');
        expect(childElement).toBeInTheDocument();
    });
});