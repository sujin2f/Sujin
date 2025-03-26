// yarn test system.spec.ts

import { compareVersions } from './system'

describe('system.ts', () => {
    it('compareVersions()', () => {
        expect(compareVersions('1.0.1', '1.0.0')).toEqual(1)
        expect(compareVersions('1.0.0', '1.0.1')).toEqual(-1)
        expect(compareVersions('1.0.1', '1.0.1')).toEqual(0)
    })

    it('compareVersions() + sort', () => {
        const versions = ['1.0.1', '1.0.0', '1.0.2']
        const sorted = versions.sort(compareVersions)
        expect(sorted).toEqual(['1.0.0', '1.0.1', '1.0.2'])
    })

    it('compareVersions() + filter + sort', () => {
        const versions = ['1.0.1', '1.0.0', '1.0.5', '1.0.3', '1.0.4']
        const sorted = versions
            .filter((v) => compareVersions('1.0.2', v) < 0)
            .sort(compareVersions)
        expect(sorted).toEqual(['1.0.3', '1.0.4', '1.0.5'])
    })
})
