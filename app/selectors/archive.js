/* eslint-disable import/prefer-default-export */

export const getArchive = (state, kind, slug, page) => ({
  archive:
    state.archive.entities[kind] &&
    state.archive.entities[kind][slug] &&
    state.archive.entities[kind][slug][page],
  loading: state.archive.loading,
});

/* eslint-enable import/prefer-default-export */
