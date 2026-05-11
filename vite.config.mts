/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from "vite-plugin-static-copy";

const backendUri = 'http://localhost:8080'
export default defineConfig({
    base: '/ui',
    plugins: [
        react(),
        tailwindcss(),
        viteStaticCopy({
            targets: [
                {
                    src: 'node_modules/primereact/resources/themes/lara-dark-blue/*',
                    dest: 'assets/themes/lara-dark-blue/',
                    rename: { stripBase: true }
                },
                {
                    src: 'node_modules/primereact/resources/themes/lara-light-blue/*',
                    dest: 'assets/themes/lara-light-blue/',
                    rename: { stripBase: true }
                },
                {
                    src: 'node_modules/primereact/resources/themes/saga-blue/*',
                    dest: 'assets/themes/saga-blue/',
                    rename: { stripBase: true }
                }
            ]
        })
    ],
    build: {
        cssCodeSplit: true,
    },
    esbuild: {
        supported: {
            'top-level-await': true //browsers can handle top-level-await features
        },
    },
    server: {
        proxy: {
            '/v2/api': {
                target: backendUri,
                changeOrigin: true
            },
            '/ui/ui/assets/': {
                target: 'http://localhost:5173',
                rewrite: path => {
                    console.log(path.substring(3))
                    return path.substring(3)
                }
            },
            '/.well-known/openid-connect': {
                target: backendUri,
                changeOrigin: true
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
        css: true,
        reporters: ['verbose', 'junit'],
        outputFile: {
            junit: 'coverage/junit-report.xml'
        },
        coverage: {
            reporter: ['json-summary', 'json'],
            include: ['src/**/*'],
            exclude: [],
            reportOnFailure: true,
        }
    },
})
