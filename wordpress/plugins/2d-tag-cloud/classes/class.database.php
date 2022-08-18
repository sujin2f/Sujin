<?php
/**
 * 2D Tag Cloud - Database Controller
 *
 * @package sujin-2d-tag-cloud
 * @author Sujin 수진 Choi
 * @version 6.0.0
 */

if ( !defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

class SJ2DTAG_database {
	public static $table_name = 'terms_hit';

	/**
	 * 플러그인이 활성화될 때 작동 : 업그레이드 & 테이블 생성
	 *
	 * @since 1.0
	 * @access public
	 */
	public static function activate_plugin() {
		self::upgrade_from_under_5();

		$is_table = self::is_table_exists();
		if ( empty( $is_table ) ) {
			self::create_table();
		}
	}

	/**
	 * 테이블이 존재하는지 검사
	 *
	 * @since 1.0
	 * @access public
	 */
	protected static function is_table_exists() {
		global $wpdb;
		$table_name = self::$table_name;

		return $wpdb->query( "show tables like '{$wpdb->prefix}{$table_name}';" );
	}

	/**
	 * 테이블 생성
	 *
	 * @since 1.0
	 * @access public
	 */
	protected static function create_table() {
		global $wpdb;
		$table_name = self::$table_name;

		$sql = "CREATE TABLE {$wpdb->prefix}{$table_name} (
					term_id bigint(20) NOT NULL,
					hit bigint(20) DEFAULT 0 NOT NULL,
					UNIQUE KEY id(term_id)
				);";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		return dbDelta( $sql );
	}

	/**
	 * 5.0 이전 버전에서 업그레이드
	 *
	 * @since 1.0
	 * @access public
	 */
	#
	public static function upgrade_from_under_5() {
		$previous_version = get_option( 'sj_tag_db_version' );
		$version = get_option( SJ_2DTAG_VERSION_KEY );

		if ( empty( $previous_version ) && !empty( $version ) ) return true;

		# 5 버전 이하임
		$tag_sets = get_option('sj_tag_set');
		$options = array();

		if ( $tag_sets ) {
			foreach( $tag_sets as $key => $tag_set ) {
				$settings = get_option( 'sj_tag_conifg_' . $key );

				if ( $settings ) {
					foreach( $settings['tag_config']['color'] as &$color ) {
						$color['size'] = $settings['tag_config']['size'][$key];
					}

					$settings['tag_config'] = $settings['tag_config']['color'];
					unset( $settings['tag_step'] );

					$settings['title'] = $tag_set;
					$options[$key] = $settings;
				}


				delete_option( 'sj_tag_conifg_' . $key );
			}
		}
		update_option( 'SJ_2DTAG_CONFIG', $options );
		delete_option( 'sj_tag_db_version' );
		delete_option( 'sj_tag_debug' );
		delete_option( 'sj_tag_set' );

		update_option( SJ_2DTAG_VERSION_KEY, SJ_2DTAG_VERSION_NUM );
	}


	/**
	 * 카운터 증가
	 *
	 * @since 1.0
	 * @access public
	 */
	public static function increase_count() {
		global $wp_query;

		if ( is_single() ) {
			self::increase_count_single( get_the_ID() );

		} else if ( is_tag() ) {
			$term = get_term_by( 'slug', $wp_query->query_vars['tag'], 'post_tag' );

			if ( $term ) {
				self::increase_count_tag( $term->term_id );
				SJ2DTAG_options::reset_tag_cache();
			}
		}
	}

	private static function increase_count_single( $post_id ) {
		$tags = get_the_tags( $post_id );

		# For another post type
		# 포스트 톼잎이 틀리면 get_the_tags로 가져올 수 없더라
		if ( !$tags ) {
			global $wp_query;
			$tags = get_the_terms( $post_id, 'post_tag' );
		}

		if ( $tags ) {
			foreach( $tags as $tag ) {
				self::increase_count_tag( $tag->term_id );
			}

			SJ2DTAG_options::reset_tag_cache();
		}
	}

	private static function increase_count_tag( $tag_id ) {
		global $wpdb;

		$table_name = self::$table_name;

		if ( $hit = $wpdb->get_var( "SELECT hit FROM {$wpdb->prefix}{$table_name} WHERE term_id = $tag_id" ) ) {
			$hit++;
			$wpdb->update( $wpdb->prefix . $table_name, array( 'hit' => $hit ), array( 'term_id' => $tag_id ) );
		} else {
			$wpdb->insert( $wpdb->prefix . $table_name, array( 'term_id' => $tag_id, 'hit' => 1 ) );
		}
	}

	/**
	 * 태그 카운트/히트 순으로 태그 가져오기
	 *
	 * @since 1.0
	 * @access public
	 */
	public static function get_tags_count( $limit ) {
		global $wpdb;

		$query_count = '
			SELECT
				terms.term_id as term_id,
				terms.name as tag_name,
				taxonomy.count as post_count,
				count.hit as post_hit

			FROM
				' . $wpdb->term_taxonomy . ' as taxonomy
					LEFT JOIN ' . $wpdb->terms . ' as terms ON taxonomy.term_id = terms.term_id
					LEFT JOIN ' . $wpdb->term_relationships . ' as relationship ON terms.term_id = relationship.term_taxonomy_id
					LEFT JOIN ' . $wpdb->posts . ' as post ON post.ID = relationship.object_ID
					LEFT JOIN ' . $wpdb->prefix . self::$table_name . ' as count ON count.term_id = terms.term_id

			WHERE
				taxonomy.taxonomy = "post_tag" AND count <> 0

			GROUP BY terms.term_id
			ORDER BY post_count DESC LIMIT ' . $limit . '
		';

		return $wpdb->get_results( $query_count ); // 포함수
	}

	public static function get_tags_hit( $limit ) {
		global $wpdb;

		$query_hit = '
			SELECT
				terms.term_id as term_id,
				terms.name as tag_name,
				taxonomy.count as post_count,
				count.hit as post_hit

			FROM
				' . $wpdb->term_taxonomy . ' as taxonomy
					LEFT JOIN ' . $wpdb->terms . ' as terms ON taxonomy.term_id = terms.term_id
					LEFT JOIN ' . $wpdb->term_relationships . ' as relationship ON terms.term_id = relationship.term_taxonomy_id
					LEFT JOIN ' . $wpdb->posts . ' as post ON post.ID = relationship.object_ID
					LEFT JOIN ' . $wpdb->prefix . self::$table_name . ' as count ON count.term_id = terms.term_id

			WHERE
				taxonomy.taxonomy = "post_tag" AND count <> 0

			GROUP BY terms.term_id
			ORDER BY post_hit DESC LIMIT ' . $limit . '
		';

		return $wpdb->get_results($query_hit); // 히트수
	}
}




