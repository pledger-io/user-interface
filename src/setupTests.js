// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import {BrowserRouter} from "react-router-dom";
import {Form} from "./core/form";

export const routerWrapped = (component) => {
    return <BrowserRouter >
        {component}
    </BrowserRouter>
}

export const formWrapped = (component) => {
    return <Form entity='TestForm' onSubmit={_ => undefined}>
        {component}
    </Form>
}
