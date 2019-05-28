<?php
namespace Sujin\Wordpress\Theme\Sujin\Helpers;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

use Sujin\Wordpress\WP_Express\Fields\Post_Meta\Attachment;

use WP_Query;

/**
 * trait Posts_Helper
 *
 * Enhanced version of the WP API V2 base controller
 * Provides some helper functions for instituting consistent practices across endpoints
 *
 */
trait Rest_Helper {
	protected function get_thumbnail( $post_id, $thumbnail_size = 'post-thumbnail' ) {
		$thumbnail_url = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), $thumbnail_size );
		return is_array( $thumbnail_url ) ? $thumbnail_url[0] : null;
	}

	protected function get_tags( $post_id ) {
		return wp_get_post_tags( $post_id );
	}

	protected function get_categories( $post_id ) {
		return wp_get_object_terms( $post_id, 'category' );
	}

	protected function get_prevnext( $post_id ) {
		$prevnext = array(
			'prev' => null,
			'next' => null,
		);

		$prev_ = $this->get_adjacent_post( $post_id, true, '', true );

		if ( $prev_ ) {
			$prev = array(
				'id'    => $prev_->ID,
				'link'  => str_replace( get_option( 'siteurl' ), '/', get_permalink( $prev_->ID ) ),
				'title' => $prev_->post_title,
				'slug'  => $prev_->post_name,
			);

			$prevnext['prev'] = $prev;
		}

		$next_ = $this->get_adjacent_post( $post_id, true, '', false );

		if ( $next_ ) {
			$next = array(
				'id'    => $next_->ID,
				'link'  => str_replace( get_option( 'siteurl' ), '/', get_permalink( $next_->ID ) ),
				'title' => $next_->post_title,
				'slug'  => $next_->post_name,
			);

			$prevnext['next'] = $next;
		}

		return $prevnext;
	}

	protected function get_adjacent_post( $post_id, $in_same_term = false, $excluded_terms = '', $previous = true, $taxonomy = 'category' ) {
		global $wpdb;

		$post = get_post( $post_id );

		if ( ! $post || ! taxonomy_exists( $taxonomy ) ) {
			return null;
		}

		$current_post_date = $post->post_date;

		$join     = '';
		$where    = '';
		$adjacent = $previous ? 'previous' : 'next';

		if ( $in_same_term || ! empty( $excluded_terms ) ) {
			if ( ! empty( $excluded_terms ) && ! is_array( $excluded_terms ) ) {
				// back-compat, $excluded_terms used to be $excluded_terms with IDs separated by " and "
				if ( false !== strpos( $excluded_terms, ' and ' ) ) {
					_deprecated_argument( __FUNCTION__, '3.3', 'Use commas instead of and to separate excluded terms.' );
					$excluded_terms = explode( ' and ', $excluded_terms );
				} else {
					$excluded_terms = explode( ',', $excluded_terms );
				}

				$excluded_terms = array_map( 'intval', $excluded_terms );
			}

			if ( $in_same_term ) {
				$join  .= " INNER JOIN $wpdb->term_relationships AS tr ON p.ID = tr.object_id INNER JOIN $wpdb->term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id";
				$where .= $wpdb->prepare( 'AND tt.taxonomy = %s', $taxonomy );

				if ( ! is_object_in_taxonomy( $post->post_type, $taxonomy ) ) {
					return '';
				}
				$term_array = wp_get_object_terms( $post->ID, $taxonomy, array( 'fields' => 'ids' ) );

				// Remove any exclusions from the term array to include.
				$term_array = array_diff( $term_array, (array) $excluded_terms );
				$term_array = array_map( 'intval', $term_array );

				if ( ! $term_array || is_wp_error( $term_array ) ) {
					return '';
				}

				$where .= ' AND tt.term_id IN (' . implode( ',', $term_array ) . ')';
			}

			$excluded_terms = apply_filters( "get_{$adjacent}_post_excluded_terms", $excluded_terms );

			if ( ! empty( $excluded_terms ) ) {
				$where .= " AND p.ID NOT IN ( SELECT tr.object_id FROM $wpdb->term_relationships tr LEFT JOIN $wpdb->term_taxonomy tt ON (tr.term_taxonomy_id = tt.term_taxonomy_id) WHERE tt.term_id IN (" . implode( ',', array_map( 'intval', $excluded_terms ) ) . ') )';
			}
		}

		if ( is_user_logged_in() ) {
			$user_id = get_current_user_id();

			$post_type_object = get_post_type_object( $post->post_type );
			if ( empty( $post_type_object ) ) {
				$post_type_cap    = $post->post_type;
				$read_private_cap = 'read_private_' . $post_type_cap . 's';
			} else {
				$read_private_cap = $post_type_object->cap->read_private_posts;
			}

			$private_states = get_post_stati( array( 'private' => true ) );
			$where         .= " AND ( p.post_status = 'publish'";
			foreach ( (array) $private_states as $state ) {
				if ( current_user_can( $read_private_cap ) ) {
					$where .= $wpdb->prepare( ' OR p.post_status = %s', $state );
				} else {
					$where .= $wpdb->prepare( ' OR (p.post_author = %d AND p.post_status = %s)', $user_id, $state );
				}
			}
			$where .= ' )';
		} else {
			$where .= " AND p.post_status = 'publish'";
		}

		$op    = $previous ? '<' : '>';
		$order = $previous ? 'DESC' : 'ASC';

		$join  = apply_filters( "get_{$adjacent}_post_join", $join, $in_same_term, $excluded_terms, $taxonomy, $post );
		$where = apply_filters( "get_{$adjacent}_post_where", $wpdb->prepare( "WHERE p.post_date $op %s AND p.post_type = %s $where", $current_post_date, $post->post_type ), $in_same_term, $excluded_terms, $taxonomy, $post );
		$sort  = apply_filters( "get_{$adjacent}_post_sort", "ORDER BY p.post_date $order LIMIT 1", $post );

		$query = "SELECT p.ID FROM $wpdb->posts AS p $join $where $sort";
		$query_key = 'adjacent_post_' . md5( $query );
		$result    = wp_cache_get( $query_key, 'counts' );
		if ( false !== $result ) {
			if ( $result ) {
				$result = get_post( $result );
			}
			return $result;
		}

		$result = $wpdb->get_var( $query );
		if ( null === $result ) {
			$result = '';
		}

		wp_cache_set( $query_key, $result, 'counts' );

		if ( $result ) {
			$result = get_post( $result );
		}

		return $result;
	}

	public function get_related( $post_id ) {
		$related_posts = $this->get_related_posts( array( $post_id ) );

		foreach ( array_keys( $related_posts ) as $key ) {
			$related_posts[ $key ] = (array) $related_posts[ $key ];

			$related_posts[ $key ]['id']           = $related_posts[ $key ]['ID'];
			$related_posts[ $key ]['title']        = array( 'rendered' => $related_posts[ $key ]['post_title'] );
			$related_posts[ $key ]['content']      = array( 'rendered' => $related_posts[ $key ]['post_content'] );
			$related_posts[ $key ]['excerpt']      = array( 'rendered' => $related_posts[ $key ]['post_excerpt'] );
			$related_posts[ $key ]['meta']['list'] = $this->get_thumbnail( $related_posts[ $key ]['ID'] ) ?: Attachment::get_instance( 'List' )->get( $related_posts[ $key ]['ID'] );
			$related_posts[ $key ]['link']         = get_permalink( $related_posts[ $key ]['ID'] );

			unset( $related_posts[ $key ]['ID'] );
			unset( $related_posts[ $key ]['post_title'] );
			unset( $related_posts[ $key ]['post_content'] );
			unset( $related_posts[ $key ]['post_excerpt'] );
		}

		return rest_ensure_response( $related_posts );
	}

	private function get_related_posts( $post_ids, $posts = array(), $key = 'tag__in' ) {
		switch ( $key ) {
			case 'tag__in':
				$array = array_map(
					function( $wp_term ) {
							return $wp_term->term_id;
					},
					$this->get_tags( $post_ids[0] )
				);
				break;
			case 'category__in':
				$array = array_map(
					function( $wp_term ) {
							return $wp_term->term_id;
					},
					$this->get_categories( $post_ids[0] )
				);
				break;
			default:
				$key   = '';
				$array = '';
				break;
		}

		$query_args = array(
			'posts_per_page'      => 4 - count( $posts ),
			'ignore_sticky_posts' => 1,
			'post__not_in'        => $post_ids,
			$key                  => $array,
		);

		$query = new WP_Query( $query_args );
		wp_reset_query();

		$posts    = array_merge( $posts, $query->posts );
		$new_ids  = array_map(
			function( $posts ) {
					return $posts->ID;
			},
			$query->posts
		);
		$post_ids = array_merge( $post_ids, $new_ids );

		if ( count( $posts ) >= 4 ) {
			return array_slice( $posts, 0, 4 );
		}

		if ( empty( $key ) ) {
			return $posts;
		}

		if ( 'category__in' === $key ) {
			$key = '';
		}

		if ( 'tag__in' === $key ) {
			$key = 'category__in';
		}

		return $this->get_related_posts( $post_ids, $posts, $key );
	}
}
