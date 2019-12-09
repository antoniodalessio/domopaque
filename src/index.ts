require('module-alias/register')
require('dotenv').config()
import { config } from './config'
import App from './app'

new App(config)