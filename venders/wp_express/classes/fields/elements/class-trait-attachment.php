<?php
/**
 * Interface for Fields
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Fields\Elements;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

trait Trait_Attachment {
	protected $_defaults_attributes = array(
		'class' => 'regular-text',
	);

	public function __construct( string $name, array $attrs = array() ) {
		parent::__construct( $name, $attrs );
		$this->add_script( WP_EXPRESS_ASSET_URL . '/media-upload.js', true, true );
	}

	public function get_image( ?int $maybe_id = null, string $size = 'full' ): string {
		if ( empty( $this->_attributes['value'] ) ) {
			$this->_refresh_attributes( $maybe_id );
		}

		if ( $this->_attributes['value'] ) {
			$media_arr = wp_get_attachment_image_src( $this->_attributes['value'], $size );
			return $media_arr[0];
		}

		return '';
	}

	protected function _is_available(): bool {
		return true;
	}

	protected function _render_form() {
		$upload_link = get_upload_iframe_src();
		$media_arr   = wp_get_attachment_image_src( $this->_attributes['value'] );

		$img          = $this->_attributes['value'] ? esc_attr( $media_arr[0] ) : '';
		$class_upload = $img ? 'hidden' : '';
		$class_remove = empty( $img ) ? 'hidden' : '';

		?>
		<section
			class="<?php echo esc_attr( self::PREFIX ); ?> field attachment"
			data-id="<?php echo esc_attr( $this->get_id() ); ?>"
		>
			<div
				class="img-container <?php echo esc_attr( $class_remove ); ?>"
				style="background-image: url('<?php echo $img; ?>');"
			></div>

			<a
				class="<?php echo esc_attr( $class_upload ); ?> button btn-upload"
				href="<?php echo esc_url_raw( $upload_link ); ?>"
			>
				Add Image
			</a>

			<button class="<?php echo esc_attr( $class_remove ); ?> btn-remove">
				<span class="dashicons dashicons-no"></span>
			</button>

			<input
				name="<?php echo esc_attr( $this->get_id() ); ?>"
				type="hidden"
				value="<?php echo esc_attr( $this->_attributes['value'] ); ?>"
			/>
		</section>
		<?php

		wp_enqueue_media();
	}

	public function _rest_metadata( $value, $object_id, $meta_key ) {
		if ( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST ) {
			return $value;
		}

		if ( $meta_key !== $this->get_id() ) {
			return $value;
		}

		$meta_cache = wp_cache_get( $object_id, 'post_meta' );

		if ( ! $meta_cache ) {
			$meta_cache = update_meta_cache( 'post', array( $object_id ) );
			$meta_cache = $meta_cache[ $object_id ];
		}

		if ( ! isset( $meta_cache[ $this->get_id() ] ) ) {
			return $value;
		}

		$value = array();

		foreach ( get_intermediate_image_sizes() as $size ) {
			$value[ $size ] = wp_get_attachment_image_src( (int) $meta_cache[ $this->get_id() ][0], $size )[0];
		}
		return array( json_encode( $value ) );
	}
}
