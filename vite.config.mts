/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    base: '/ui',
    plugins: [
        react(),
        tailwindcss()
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
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
