import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
    external: ['react'],
    plugins: [
      typescript({
        typescript: require('typescript'),
      }),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [['@babel/preset-env', { modules: false }], '@babel/preset-react'],
      }),
      resolve(),
      commonjs(),
      uglify(),
    ],
  },
  {
    input: './src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]
