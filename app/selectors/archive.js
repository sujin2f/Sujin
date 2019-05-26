/* eslint-disable import/prefer-default-export */

export const getArchive = (state, kind, slug, page) => ({
  archive:
    state.archive.entities[kind] &&
    state.archive.entities[kind][slug] &&
    state.archive.entities[kind][slug][page],
  loading: state.archive.loading,
  totalPages:
    state.archive.entities[kind] &&
    state.archive.entities[kind][slug] &&
    state.archive.entities[kind][slug].totalPages,
  background:
    state.archive.entities[kind] &&
    state.archive.entities[kind][slug] &&
    state.archive.entities[kind][slug].background,
  title:
    state.archive.entities[kind] &&
    state.archive.entities[kind][slug] &&
    state.archive.entities[kind][slug].title,
  description:
    state.archive.entities[kind] &&
    state.archive.entities[kind][slug] &&
    state.archive.entities[kind][slug].description,
});

/* eslint-enable import/prefer-default-export */
