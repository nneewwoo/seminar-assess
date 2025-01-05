import { Hono } from 'hono'
import signup from './account/signup'
import guarded from './guarded'
import signin from './account/signin'
import security from './account/security'

const v1 = new Hono()
v1.route('/account/signup/steps', signup)
v1.route('/account/signin/steps', signin)
v1.route('/account/security', security)
v1.route('/', guarded)

export default v1
