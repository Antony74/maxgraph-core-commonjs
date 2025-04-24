import { UserConfig } from 'vite';

const config: UserConfig = {
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'maxgraph-core-commonjs',
            fileName: 'index',
            formats: ['cjs'],
        },
        rollupOptions: {
            external: ['fs/promises', 'path'],
            onwarn(warning, warn) {
                if (
                    warning.code !== 'THIS_IS_UNDEFINED' &&
                    warning.code !== 'EVAL'
                ) {
                    warn(warning);
                }
            },
        },
        minify: false,
        sourcemap: true,
    },
};

export default config;
