<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 * @package sujinc.com
 */

// Render attributes safely.
$rb_images = isset( $attributes['images'] ) ? $attributes['images'] : array();

ob_start();

if ( count( $rb_images ) ) {
	echo '[carousel';

	foreach ( $rb_images as $index => $image ) {
		$url = wp_parse_url( $image['src'] );
		echo ' sc' . esc_attr( $index + 1 ) . '="' . esc_attr( $url['path'] ) . '"';
		echo ' width' . esc_attr( $index + 1 ) . '="' . esc_attr( $image['width'] ) . '"';
		echo ' height' . esc_attr( $index + 1 ) . '="' . esc_attr( $image['height'] ) . '"';
	}
	echo ' /]';
}

$content = ob_get_contents();
ob_end_clean();

$needle = array( "\n", "\r", "\t" );
echo str_replace( $needle, '', $content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
