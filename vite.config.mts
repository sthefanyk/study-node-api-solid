import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsConfigPaths()],
    test: {
        environmentMatchGlobs: [
            [
                'src/http/controllers/**',
                'prisma/vitest-environment-prisma/prisma-test-environment.ts',
            ],
        ],
        dir: 'src',

        // globals: true,
        // coverage: {
        //     all: false,
        // },
    },
})
