const model = {
    aggregate: jest.fn(() => Promise.resolve()),
    find: jest.fn(() => Promise.resolve()),
    findOne: jest.fn(() => Promise.resolve()),
    insertOne: jest.fn(() => Promise.resolve()),
}

export const PostMock = { Post: { ...model } }
export const SpectraMock = { Spectra: { ...model } }
