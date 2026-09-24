import { defineConfig } from 'vitest/config';

// vitest 5 默认只排除 node_modules 与 .git，不限定的话会把 dist/test 里编译出来的测试再跑一遍
export default defineConfig({ test: { include: ['test/**/*.test.ts'] } });
