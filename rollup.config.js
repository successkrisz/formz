import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
// import flow from 'rollup-plugin-flow'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  external: ['react', 'react-proptypes'],
  plugins: [
    // flow(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-react',
        '@babel/preset-flow',
      ],
    }),
    resolve(),
    commonjs(),
    uglify(),
  ],
}
