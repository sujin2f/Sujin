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
$rb_title       = isset( $attributes['title'] ) ? $attributes['title'] : '';
$rb_url         = isset( $attributes['url'] ) ? $attributes['url'] : '';
$rb_target      = isset( $attributes['target'] ) ? $attributes['target'] : '';
$rb_title       = isset( $attributes['title'] ) ? $attributes['title'] : '';
$rb_subhead     = isset( $attributes['subhead'] ) ? $attributes['subhead'] : '';
$rb_details     = isset( $attributes['details'] ) && is_array( $attributes['details'] ) ? $attributes['details'] : array();
$rb_start_month = isset( $attributes['startMonth'] ) ? $attributes['startMonth'] : '';
$rb_start_year  = isset( $attributes['startYear'] ) ? $attributes['startYear'] : '';
$rb_end_month   = isset( $attributes['endMonth'] ) ? $attributes['endMonth'] : '';
$rb_end_year    = isset( $attributes['endYear'] ) ? $attributes['endYear'] : '';
$rb_tags        = isset( $attributes['tags'] ) && is_array( $attributes['tags'] ) ? $attributes['tags'] : array();
?>
<div class="about-item--v2">
	<div class="about-item__range">
		<?php if ( $rb_start_month || $rb_start_year || $rb_end_month || $rb_end_year ) : ?>
			<time datetime="<?php echo esc_attr( $rb_start_year ); ?>-<?php echo esc_attr( $rb_start_month ); ?>-01">
				<?php echo esc_html( $rb_start_year ); ?>
			</time>
			<time datetime="<?php echo esc_attr( $rb_end_year ); ?>-<?php echo esc_attr( $rb_end_month ); ?>-01">
				<?php echo esc_html( $rb_end_year ); ?>
			</time>
		<?php endif; ?>
	</div>

	<?php /* title */ ?>
	<?php if ( $rb_title ) : ?>
		<h3 class="about-item__title">
			<?php if ( $rb_url ) : ?>
				<a href="<?php echo esc_url( $rb_url ); ?> target="<?php $rb_target || '_self'; ?>">
			<?php endif; ?>
					<?php echo esc_html( $rb_title ); ?>
			<?php if ( $rb_url ) : ?>
				</a>
			<?php endif; ?>
		</h3>
	<?php endif; ?>

	<?php /* sub heading */ ?>
	<?php if ( $rb_subhead ) : ?>
		<p class="about-item__subhead"><?php echo esc_html( $rb_subhead ); ?></p>
	<?php endif; ?>

	<?php /* detail */ ?>
	<?php if ( ! empty( $rb_details ) ) : ?>
		<ul class="about-item__details">
			<?php foreach ( $rb_details as $rb_desc ) : ?>
				<li><?php echo esc_html( $rb_desc ); ?></li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>

	<?php /* detail */ ?>
	<?php if ( ! empty( $rb_tags ) ) : ?>
		<ul class="about-item__tags">
			<?php foreach ( $rb_tags as $rb_tag ) : ?>
				<li><?php echo esc_html( $rb_tag ); ?></li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</div>
