// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder } from 'util';
import {mockedAxios} from "../__mocks__/axios.js";
import {vi} from "vitest";

global.TextEncoder = TextEncoder;

mockedAxios.get()

let localStore = new Map()
vi.stubGlobal('localStorage', {
    getItem: vi.fn().mockImplementation(prop => localStore.get(prop)),
    setItem: vi.fn().mockImplementation((prop, value) => localStore.set(prop, value)),
    removeItem: vi.fn(),
    clear: vi.fn()
});