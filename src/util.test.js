import { bound, distributeToRange, easeInOutCubic } from "./util"

describe('bound', () => {
  it('returns the value if its within the range', () => {
    expect(bound(5, 0, 10)).toBe(5)
  })

  it('returns the min if its lower than the min', () => {
    expect(bound(-10, 0, 10)).toBe(0)
  })

  it('returns the max if its higher than the max', () => {
    expect(bound(11, 0, 10)).toBe(10)
  })
})

describe('distribute to range', () => {
  it('properly distributes to the new range', () => {
    expect(distributeToRange(5, [0, 10], [-20, 10])).toBe(-5)
  });
})

describe('ease in out cubic', () => {
  it('the math checks out', () => {
    expect(easeInOutCubic(0, 0, 100, 40)).toBe(0)
    expect(easeInOutCubic(10, 0, 100, 40)).toBe(6.25)
    expect(easeInOutCubic(20, 0, 100, 40)).toBe(50) // inflection point directly in center
    expect(easeInOutCubic(30, 0, 100, 40)).toBe(93.75)
    expect(easeInOutCubic(40, 0, 100, 40)).toBe(100)
  })
})