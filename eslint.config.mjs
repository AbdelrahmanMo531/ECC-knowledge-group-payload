import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'src/payload-types.ts',
      'src/migrations/**',
      'src/app/(payload)/**',
    ],
  },
  {
    rules: {
      // New with Next 16's React Compiler rules. They flag patterns the
      // inherited UI uses deliberately — an icon looked up from a static map,
      // state synced once on mount — so they warn rather than fail.
      'react-hooks/static-components': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // The data layer reads loosely typed CMS documents by design and narrows
    // them field by field.
    files: ['src/lib/cms/**/*.ts', 'src/scripts/**/*.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
];

export default eslintConfig;
