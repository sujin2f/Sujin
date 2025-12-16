<?php
/**
 * Replace Image Block
 *
 * @package sujinc.com
 * @since   12.1.0
 * @author  Sujin 수진 Choi
 */

namespace Sujin\Theme;

/**
 * Replace Image Block
 */
class ImageBlock {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_filter( 'block_type_metadata_settings', array( $this, 'override_block_setting' ) );
	}

	/**
	 * Replace Block Setting.
	 *
	 * @param array $settings Block setting.
	 * @return array
	 */
	public function override_block_setting( array $settings ): array {
		if ( 'core/image' === $settings['name'] ) {
			$settings['render_callback'] = array( $this, 'replace_image_block' );

		}
		return $settings;
	}
	/**
	 * Replace Image Block.
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $content    The content.
	 * @return string The block content with the data-id attribute added.
	 */
	public function replace_image_block( array $attributes, string $content ): string {
		$image = get_post_meta( $attributes['id'], '_wp_attached_file', true );
		if ( ! $image ) {
			return '';
		}
		$image  = "/wp-content/uploads/{$image}";
		$meta   = get_post_meta( $attributes['id'], '_wp_attachment_metadata', true );
		$result = "[image src=\"{$image}\" ";
		if ( array_key_exists( 'align', $attributes ) ) {
			$result .= "align=\"{$attributes['align']}\" ";
		}
		$result .= "width=\"{$meta['width']}\" height=\"{$meta['height']}\" ";
		preg_match_all( '/<figcaption class=\"wp-element-caption\">(.*?)<\/figcaption>/s', $content, $matches );
		if ( $matches[1] && $matches[1][0] ) {
			$result .= "caption=\"{$matches[1][0]}\" ";
		}
		$result .= '/]';
		return $result;
	}
}
