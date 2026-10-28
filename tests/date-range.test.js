import test from 'node:test'
import assert from 'node:assert/strict'
import { koreanDayRange } from '../src/lib/date-range.js'
test('Korean calendar day uses inclusive start and exclusive next midnight',()=>{assert.deepEqual(koreanDayRange('2026-10-28'),{start:'2026-10-27T15:00:00.000Z',end:'2026-10-28T15:00:00.000Z'})})
test('date boundaries work across months and leap years',()=>{assert.equal(koreanDayRange('2026-12-31').end,'2026-12-31T15:00:00.000Z');assert.equal(koreanDayRange('2028-02-29').end,'2028-02-29T15:00:00.000Z')})
test('invalid and partial dates are rejected',()=>{for(const day of ['','2026-02-30','2026-13-01','bad','2026-10'])assert.equal(koreanDayRange(day),null)})
