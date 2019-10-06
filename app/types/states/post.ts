import Post, { PostObject } from 'app/types/responses/post';

export default interface PostState {
  entities: PostObject;
  recent: Array<Post> | boolean | undefined; // true is loading, false is failed, undefined is not yet loaded
  archive: {
    [kind: string]: { // TODO use Enum
      [slug: string]: {
        entities: {
          [page: number]: Array<Post> | boolean;
        };
        totalPages?: number;
        background?: string;
        title?: string;
        description?: string;
      };
    };
  };
};
