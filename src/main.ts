import { Application } from './app/application';

if(process.env.NODE_ENV !== 'production') {
  console.warn('Webpack is running in development mode!');
}

new Application();
