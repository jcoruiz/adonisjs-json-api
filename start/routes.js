'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


  Route.post('login', 'Auth/AuthenticationController.login')
  Route.post('register', 'Auth/AuthenticationController.register')
  Route.get('me', 'Auth/AuthenticationController.me').middleware(['auth'])

const {ioc} = require('@adonisjs/fold')
Route.get('/Admin/Persona','/Admin/PersonaController.list')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.get('test/:version', 'core/personCustom.readAll')


Route.group(() => {

  Route.post(':module/:controller/:action', async ({view, request, response, params, auth}) => {
    const module = params.module
    const controller = params.controller
    const action = params.action
    const url = `App/Controllers/Http/${module}/${controller}.${action}`
    const controllerInstance = ioc.makeFunc(url)
    return controllerInstance.method.apply(controllerInstance.instance,[{view, request, response, params, auth}])
  })

  Route.post(':module/:controller', async ({view, request, response, params, auth}) => {
    const module = params.module
    const controller = params.controller
    const url = `App/Controllers/Http/${module}/${controller}.create`
    const controllerInstance = ioc.makeFunc(url)
    return controllerInstance.method.apply(controllerInstance.instance,[{view, request, response, params, auth}])
  })

  Route.get(':module/:controller', async ({view, request, response, params, auth}) => {
    const module = params.module
    const controller = params.controller
    const url = `App/Controllers/Http/${module}/${controller}.readAll`
    const controllerInstance = ioc.makeFunc(url)
    return controllerInstance.method.apply(controllerInstance.instance,[{view, request, response, params, auth}])
  })

  Route.get(':module/:controller/:id', async ({view, request, response, params, auth}) => {
    const module = params.module
    const controller = params.controller
    const url = `App/Controllers/Http/${module}/${controller}.read`
    const controllerInstance = ioc.makeFunc(url)
    return controllerInstance.method.apply(controllerInstance.instance,[{view, request, response, params, auth}])
  })

  Route.patch(':module/:controller', async ({view, request, response, params, auth}) => {
    const module = params.module
    const controller = params.controller
    const url = `App/Controllers/Http/${module}/${controller}.update`
    const controllerInstance = ioc.makeFunc(url)
    return controllerInstance.method.apply(controllerInstance.instance,[{view, request, response, params, auth}])
  })

  Route.delete(':module/:controller/:id', async ({view, request, response, params, auth}) => {
    const module = params.module
    const controller = params.controller
    const url = `App/Controllers/Http/${module}/${controller}.delete`
    const controllerInstance = ioc.makeFunc(url)
    return controllerInstance.method.apply(controllerInstance.instance,[{view, request, response, params, auth}])
  })
 
}).prefix(':client/:version').middleware(['authentication', 'authorization'])