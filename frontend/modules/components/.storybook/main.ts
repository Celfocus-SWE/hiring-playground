import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  core: {
    builder: '@storybook/builder-webpack5',
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  webpackFinal: async (config) => {
    if (config.module && config.module.rules) {
      config.module.rules.push(
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        }
      );

      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        ],
        exclude: /node_modules/,
      });

      if (config.resolve) {
        config.resolve.alias = {
          ...config.resolve.alias,
          '@components': path.resolve(
            __dirname,
            '../../components/src/index.ts'
          ),
          '@services': path.resolve(__dirname, '../../services/index.ts'),
        };
      }
    }

    return config;
  },
};

export default config;
