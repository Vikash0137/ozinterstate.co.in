import assert from 'node:assert/strict'
import { resolveContactValue, resolveSocialUrl, resolveApiBaseUrl } from '../src/utils/siteSettings.js'

assert.equal(resolveContactValue({ phone: '0400 000 000' }, 'phone', '1300 000 000'), '0400 000 000')
assert.equal(resolveContactValue({}, 'phone', '1300 000 000'), '1300 000 000')
assert.equal(resolveSocialUrl({ social: { facebook: 'https://facebook.com/oz' } }, 'facebook'), 'https://facebook.com/oz')
assert.equal(resolveSocialUrl({}, 'facebook'), '#')
assert.equal(resolveApiBaseUrl(), '/ozinterstate/api')

console.log('site settings tests passed')
