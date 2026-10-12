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
// The real iconify-icon element fetches icons from the network and renders them on a timer,
// which can fire after the jsdom environment is torn down ("document is not defined").
vi.mock('@iconify-icon/react', async () => {
    const React = await import('react');
    return {
        Icon: React.forwardRef(({ icon, className, inline, ...props }, ref) =>
            React.createElement('iconify-icon', {
                ...props,
                ref,
                icon: typeof icon === 'object' ? JSON.stringify(icon) : icon,
                class: className,
                inline: inline || undefined,
            })),
    };
});
