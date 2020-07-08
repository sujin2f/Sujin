<?php
/**
 * Initialize Assets
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin;

use Sujin\Wordpress\WP_Express\{
	Fields\Settings\Attachment as Option_Attachment,
	Fields\Settings\Checkbox as Option_Checkbox,
	Google_Font_Loader,
	Helpers\Assets as Ex_Assets,
	Helpers\Trait_Singleton,
	Helpers\Transient,
};

use Sujin\Wordpress\Theme\Sujin\{
	Rest_Endpoints\Items\Images,
	Widgets\Flickr as Flickr_Widget,
	Widgets\Google_Advert as Advert_Widget,
	Widgets\Recent_Post as Recent_Post_Widget,
};

use SJ2DTAG_widget;
use WP_Query;
use Env_PHP;

/**
 * Initialize Assets
 */
class Assets {
	use Trait_Singleton;

	/**
	 * If the environment is production
	 *
	 * @var bool
	 */
	private $is_prod = null;

	/**
	 * Constructor
	 *
	 * @visibility protected
	 */
	protected function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'dequeue_scripts' ) );
		add_filter( 'upload_mimes', array( $this, 'allow_svg_to_upload_mimes' ) );

		if ( ! $this->is_frontend() ) {
			return;
		}

		Google_Font_Loader::get_instance()
			->append( 'Ubuntu:300,400,500,700' );

		$this->enqueue_scripts();
	}

	/**
	 * Allow SVG format to the WP attachement
	 *
	 * @param  array $mime_types Mime Types.
	 * @return array
	 */
	public function allow_svg_to_upload_mimes( array $mime_types ): array {
		$mime_types['svg'] = 'image/svg+xml';
		return $mime_types;
	}

	public function enqueue_scripts(): void {
		$asset    = Ex_Assets::get_instance( null, get_stylesheet_directory_uri() );
		$location = $this->is_prod() ? 'build' : 'dist';
		$manifest = get_stylesheet_directory_uri() . '/' . $location . '/asset-manifest.json';

		if ( ! file_exists( get_stylesheet_directory() . '/' . $location . '/asset-manifest.json' ) ) {
			return;
		}

		$manifest = wp_remote_get( $manifest );
		$manifest = json_decode( $manifest['body'], true );

		foreach ( $manifest['entrypoints'] as $key => $entrypoint ) {
			$asset
				->append( $location . '/' . $entrypoint )
				->is_footer( true );

			if ( 0 === $key ) {
				$asset
					->translation_key( 'sujin' )
					->translation( $this->get_translation() );
			}
		}
	}

	/**
	 * Check the environment is production
	 *
	 * @return bool
	 */
	private function is_prod(): bool {
		if ( ! is_null( $this->is_prod ) ) {
			return $this->is_prod;
		}

		$transient = Transient::get_transient( 'sujin-environment-variables' );

		if ( $transient && ! $transient->is_expired() ) {
			return $transient->items;
		}

		require_once dirname( __DIR__ ) . '/.configs/env.php';
		$env           = new Env_PHP();
		$this->is_prod = 'production' === $env->data['ENV'];

		$transient = new Transient( $this->is_prod, 12 * HOUR_IN_SECONDS );
		$transient->set_transient( 'sujin-environment-variables' );

		return $this->is_prod;
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

		$thumbnail = Option_Attachment::get_instance( 'Default Image' )->get() ?: -1;
		$thumbnail = new Images( $thumbnail );
		$thumbnail = $thumbnail->medium;

		return array(
			'title'           => get_bloginfo( 'name' ),
			'description'     => get_bloginfo( 'description' ),
			'url'             => get_bloginfo( 'url' ),
			'thumbnail'       => $thumbnail,
			'hideFrontHeader' => (bool) Option_Checkbox::get_instance( 'Hide Header in Front Page' )->get(),
			'hideFrontFooter' => (bool) Option_Checkbox::get_instance( 'Hide Footer in Front Page' )->get(),
			'frontPage'       => $front_page->post->post_name ?? '',
			'showOnFront'     => $show_on_front,
			'widgets'         => $this->get_widgets(),
			'isProd'          => $this->is_prod(),
		);
	}

	private function get_widgets(): array {
		$sidebar     = array();
		$wp_sidebar  = wp_get_sidebars_widgets();
		$flickr      = Flickr_Widget::get_instance();
		$advert      = Advert_Widget::get_instance();
		$recent_post = Recent_Post_Widget::get_instance();
		$tags        = class_exists( 'SJ2DTAG_widget' ) ? new SJ2DTAG_widget() : null;

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
						$sidebar[ $key ][] = array_merge(
							$flickr->widget( $widget_setting[ $widget_number ], null ),
							array( 'key' => $widget_number ),
						);
						break;

					case 'google-advert':
					case 'advert':
						$advert->id        = $basename . '-' . $widget_number;
						$sidebar[ $key ][] = array_merge(
							$advert->widget( $widget_setting[ $widget_number ], null ),
							array( 'key' => $widget_number ),
						);
						break;

					case 'tag_cloud_widget_sujin':
						if ( ! $tags ) {
							break;
						}

						$tags->id = $basename . '-' . $widget_number;
						ob_start();
						$tags->widget(
							array(
								'before_widget' => '',
								'before_title'  => '',
								'after_title'   => '',
								'after_widget'  => '',
							),
							$widget_setting[ $widget_number ]
						);
						$sidebar[ $key ][] = array(
							'widget' => 'tag-cloud',
							'title'  => 'Popular Tags',
							'html'   => ob_get_clean(),
							'key'    => $widget_number,
						);
						break;

					case 'recent-post':
						$recent_post->id   = $basename . '-' . $widget_number;
						$sidebar[ $key ][] = array_merge(
							$recent_post->widget( $widget_setting[ $widget_number ], null ),
							array( 'key' => $widget_number ),
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

	/**
	 * Remove unnecessary scripts
	 */
	public function dequeue_scripts(): void {
		if ( ! $this->is_frontend() ) {
			return;
		}

		wp_deregister_script( 'jquery' );
		wp_deregister_script( 'wp-embed' );
		wp_deregister_style( 'block-library' );
	}

	/**
	 * Check the current page is Frontend
	 *
	 * @return bool
	 */
	private function is_frontend(): bool {
		if ( is_admin() ) {
			return false;
		}

		$request_uri = isset( $_SERVER['REQUEST_URI'] )
			? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) )
			: '';

		if ( false !== strpos( wp_unslash( $request_uri ), '/wp-json/' ) ) {
			return false;
		}

		if ( false !== strpos( wp_unslash( $request_uri ), 'wp-login.php' ) ) {
			return false;
		}

		return true;
	}
}
