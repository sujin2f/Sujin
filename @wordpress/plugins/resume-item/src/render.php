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
 */

// Generates a unique id for aria-controls.
$unique_id = wp_unique_id( 'p-' );

// Adds the global state.
wp_interactivity_state(
	'resume-block',
	array(
		'isDark'    => false,
		'darkText'  => esc_html__( 'Switch to Light', 'resume-block' ),
		'lightText' => esc_html__( 'Switch to Dark', 'resume-block' ),
		'themeText'	=> esc_html__( 'Switch to Dark', 'resume-block' ),
	)
);
?>

<div
	<?php echo get_block_wrapper_attributes(); ?>
</div>

<?php
// Render attributes safely.
$rb_title        = isset( $attributes['title'] ) ? $attributes['title'] : '';
$rb_descriptions = isset( $attributes['descriptions'] ) && is_array( $attributes['descriptions'] ) ? $attributes['descriptions'] : array();
$rb_start_month  = isset( $attributes['startMonth'] ) ? $attributes['startMonth'] : '';
$rb_start_year   = isset( $attributes['startYear'] ) ? $attributes['startYear'] : '';
$rb_end_month    = isset( $attributes['endMonth'] ) ? $attributes['endMonth'] : '';
$rb_end_year     = isset( $attributes['endYear'] ) ? $attributes['endYear'] : '';
$rb_tags         = isset( $attributes['tags'] ) && is_array( $attributes['tags'] ) ? $attributes['tags'] : array();

?>
<div class="wp-block-resume-block-resume-block__content">
	<?php if ( $rb_title ) : ?>
		<h3 class="resume-title"><?php echo esc_html( $rb_title ); ?></h3>
	<?php endif; ?>

	<?php if ( $rb_start_month || $rb_start_year || $rb_end_month || $rb_end_year ) : ?>
		<div class="resume-period">
			<span class="resume-start"><?php echo esc_html( trim( $rb_start_month . ' ' . $rb_start_year ) ); ?></span>
			&nbsp;&mdash;&nbsp;
			<span class="resume-end"><?php echo esc_html( trim( $rb_end_month . ' ' . $rb_end_year ) ); ?></span>
		</div>
	<?php endif; ?>

	<?php if ( ! empty( $rb_descriptions ) ) : ?>
		<ul class="resume-descriptions">
			<?php foreach ( $rb_descriptions as $rb_desc ) : ?>
				<li><?php echo esc_html( $rb_desc ); ?></li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>

	<?php if ( ! empty( $rb_tags ) ) : ?>
		<div class="resume-tags">
			<?php foreach ( $rb_tags as $rb_tag ) : ?>
				<span class="resume-tag"><?php echo esc_html( $rb_tag ); ?></span>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

</div>
