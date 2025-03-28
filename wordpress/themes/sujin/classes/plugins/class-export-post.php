<?php
/**
 * Export Posts
 *
 * @package sujinc.com
 * @since   10.2.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme\Plugins;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\WP_Express\Admin;
use Sujin\Wordpress\WP_Express\Settings_Section;
use Sujin\Wordpress\WP_Express\Fields\Settings\Input;

class Export_Post {
	use Trait_Singleton;
	
	protected function __construct() {
		$input = Input::get_instance( 'ID Range' );
		Admin::get_instance( 'Export Posts' )
			->append(
				Settings_Section::get_instance( 'Export Posts' )
					->append( $input )
			)
			->position( 'tools' );

		add_action( 'update_option_' . $input->get_id(), array( $this, 'update_option' ), 10, 3 );
		add_action( 'admin_init', array( $this, 'admin_init' ) );

	}

	public function admin_init(): void {
		add_settings_section( 'export-post-log', 'Last Log', array( $this, 'echo_log' ), 'export-posts', array() );
	}

	/**
	 * Print the last log of GraphQL response.
	 *
	 * @return void
	 */
	public function echo_log(): void {
		$log = get_option( 'last-gql-response');
		echo '<pre>';
		var_dump( $log );
		echo '</pre>';
	}

	public function update_option( string $old_value, string $value, string $option_name ): void {
		$posts = [];
		$comma = strpos( $value, ',' );
		$dash  = strpos( $value, '-' );
		if ( $comma !== false ) {
			$ids   = explode( ',', $value );
			$posts = array_map( function( string $id ) {
				return get_post( $id );
			}, $ids );
		} else if ( $dash !== false ) {
			$range = explode( '-', $value );
			$from  = intval( $range[0] );
			$to    = intval( $range[1] );
			$posts = array_map( function( int $id ) {
				return get_post( $id );
			}, range( $from, $to ) );
		} else {
			$posts[0] = get_post( $value );
		}

		foreach ( $posts as $post ) {
			if ( $post === null ) {
				continue;
			}

			if ( $post->post_status !== 'publish' ) {
				continue;
			}

			if ( $post->post_type !== 'post' && $post->post_type !== 'page' ) {
				continue;
			}

			$graphql  = new GraphQL();
			$response = $graphql->update_post( $post );
			update_option( 'last-gql-response', $response );
		}

		update_option( $option_name, '' );
	}
}
