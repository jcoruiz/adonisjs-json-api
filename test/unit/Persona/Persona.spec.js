'use strict'

const { test } = use('Test/Suite')('Persona/Persona')

test('make sure 2 + 2 is 4', async ({ assert }) => {
  assert.plan(2)


  assert.equal(2 + 2, 4)
  assert.equal("hola", "hola")
})


test('make sure 2 + 2 is 5', async ({ assert }) => {
  assert.plan(2)


  assert.equal(2 + 3, 5)
  assert.equal("hola", "hola")
})