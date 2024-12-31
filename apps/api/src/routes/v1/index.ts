import { Hono } from 'hono'
import signup from './account/signup'
import guarded from './guarded'
import cycle from './cycle'

const v1 = new Hono()
v1.route('/account/signup/steps', signup)
v1.route('/cycle', cycle)
v1.route('/', guarded)

export default v1
