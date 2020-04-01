<?php
/**
 * Initialize Assets
 *
 * @package Sujinc.com
 * @author  Sujin 수진 Choi <http://www.sujinc.com/>
*/

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\WP_Express\Helpers\Trait_Singleton;
use Sujin\Wordpress\WP_Express\Google_Font_Loader;
use Sujin\Wordpress\WP_Express\Helpers\Assets as Ex_Assets;
use Sujin\Wordpress\WP_Express\Fields\Settings\Attachment as Option_Attachment;
use Sujin\Wordpress\WP_Express\Fields\Settings\Checkbox as Option_Checkbox;
use Sujin\Wordpress\Theme\Sujin\Widgets\{
	Flickr as Flickr_Widget,
	Advert as Advert_Widget,
};

use SJ2DTAG_widget;
use WP_Query;

final class Assets {
	use Trait_Singleton;

	private const JQUERY_CDN = 'http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js';

	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_filter( 'upload_mimes', array( $this, 'upload_mimes' ) );
		Google_Font_Loader::get_instance()
			->append( 'Ubuntu:300,400,500,700' );
		$this->register_scripts();
	}

	public function upload_mimes( array $mime_types ): array {
		$mime_types['svg'] = 'image/svg+xml';
		return $mime_types;
	}

	public function register_scripts(): void {
		$manifest = get_stylesheet_directory() . '/dist/manifest.json';

		if ( ! file_exists( $manifest ) ) {
			return;
		}

		$manifest = file_get_contents( get_stylesheet_directory() . '/dist/manifest.json' );
		$manifest = json_decode( $manifest, true );

		$asset = Ex_Assets::get_instance( $manifest );

		if ( $manifest['vendors~app.js'] ?? null ) {
			$asset
				->append( 'vendors~app.js' )
				->is_footer( true );
		}

		$asset
			->append( 'app.js' )
			->is_footer( true )
			->translation_key( 'sujin' )
			->translation( $this->get_translation() );
		$asset->append( 'style.css' );
	}

	private function get_translation(): array {
		$show_on_front = get_option( 'show_on_front' );
		$page_on_front = get_option( 'page_on_front' );
		$front_page    = null;

		if ( 'posts' === $show_on_front ) {
			$front_page = new WP_Query(
				array(
					'post_type'      => 'post',
					'post_status'    => 'publish',
					'posts_per_page' => 1,
				)
			);

		} elseif ( 'page' === $show_on_front ) {
			$front_page = new WP_Query(
				array(
					'post_type'      => 'page',
					'post_status'    => 'publish',
					'posts_per_page' => 1,
					'p'              => $page_on_front,
				)
			);
		}

		return array(
			'title'           => get_bloginfo( 'name' ),
			'description'     => get_bloginfo( 'description' ),
			'ogImage'         => Option_Attachment::get_instance( 'Default Image' )->get(),
			'hideFrontHeader' => (bool) Option_Checkbox::get_instance( 'Hide Header in Front Page' )->get(),
			'hideFrontFooter' => (bool) Option_Checkbox::get_instance( 'Hide Footer in Front Page' )->get(),
			'frontPage'       => $front_page->post->post_name ?? null,
			'showOnFront'     => $show_on_front,
			'widgets'         => $this->get_widgets(),
		);
	}

	private function get_widgets(): array {
		$sidebar    = array();
		$wp_sidebar = wp_get_sidebars_widgets();
		$flickr     = Flickr_Widget::get_instance();
		$advert     = Advert_Widget::get_instance();
		$tags       = class_exists( 'SJ2DTAG_widget' ) ? new SJ2DTAG_widget() : null;

		add_filter( 'tag_link', array( $this, 'tag_link' ), 15, 2 );

		foreach ( array_keys( $wp_sidebar ) as $sidebar_key ) {
			if ( 'wp_inactive_widgets' === $sidebar_key ) {
				continue;
			}

			$key             = str_replace( array( '-', '+' ), '', $sidebar_key );
			$sidebar[ $key ] = array();

			foreach ( $wp_sidebar[ $sidebar_key ] as $widget_key ) {
				$basename      = explode( '-', $widget_key );
				$widget_number = array_pop( $basename );
				$basename      = implode( '-', $basename );

				$widget_setting = get_option( 'widget_' . $basename );

				switch ( $basename ) {
					case 'flickr':
						$flickr->id        = $basename . '-' . $widget_number;
						$sidebar[ $key ][] = $flickr->widget( $widget_setting[ $widget_number ], null );
						break;

					case 'advert':
						$advert->id        = $basename . '-' . $widget_number;
						$sidebar[ $key ][] = $advert->widget( $widget_setting[ $widget_number ], null );
						break;

					case 'tag_cloud_widget_sujin':
						if ( ! $tags ) {
							break;
						}

						$tags->id = $basename . '-' . $widget_number;
						ob_start();
						$widget_info       = $tags->widget(
							array(
								'before_widget' => '',
								'before_title'  => '',
								'after_title'   => '',
								'after_widget'  => '',
							),
							$widget_setting[ $widget_number ]
						);
						$sidebar[ $key ][] = array(
							'widget' => 'tags',
							'title'  => 'Popular Tags',
							'html'   => ob_get_clean(),
						);
						break;
				}
			}
		}

		remove_filter( 'tag_link', array( $this, 'tag_link' ), 15, 2 );

		return $sidebar;
	}

	public function tag_link( string $_, int $term_id ): string {
		$term = get_term_by( 'id', $term_id, 'post_tag' );
		return '/tag/' . $term->slug;
	}

	public function enqueue_scripts(): void {
		if ( ! is_admin() && 'wp-login.php' !== $GLOBALS['pagenow'] ) {
			wp_deregister_script( 'jquery' );
			wp_register_script( 'jquery', self::JQUERY_CDN, false, '1.12.4' );
		}

		if ( is_admin() ) {
			return;
		}

		wp_enqueue_script( 'wp-shortcode' );
		wp_enqueue_script( 'wp-components' );

		wp_dequeue_style( 'wp-block-library' );

		// Remove dependancies to minimize script load
		$scripts = wp_scripts();

		$scripts->registered['wp-shortcode']->deps  = array( 'lodash' );
		$scripts->registered['wp-components']->deps = array(
			'lodash',
			'wp-compose',
			'wp-dom',
			'wp-element',
			'wp-url',
			'wp-i18n',
			'moment',
		);
	}
}
