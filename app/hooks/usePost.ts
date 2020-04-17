/**  app/hooks/usePost */
import axios from 'axios';

import { HTTP_RESPONSE_NO_CONTENT } from 'app/constants/common';

import Post from 'app/items/rest/post';

const { useState, useEffect } = wp.element;

export function usePost(postSlug) {
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(false);

  const process = async () => {
    if (posts[postSlug]) {
      return posts[postSlug];
    }

    setLoading(true);
    return axios.get(`/wp-json/sujin/v1/post/${postSlug}`)
      .then((response) => {
        if (response.status === HTTP_RESPONSE_NO_CONTENT) {
          posts[postSlug] = HTTP_RESPONSE_NO_CONTENT;
          return;
        }

        posts[postSlug] = Post(response);
      }).catch(() => {
        posts[postSlug] = HTTP_RESPONSE_NO_CONTENT;
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    process();
  }, postSlug);

  return {
    post: posts[postSlug],
    loading,
  };
}
