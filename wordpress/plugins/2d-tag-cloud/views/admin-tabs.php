<h2 class="nav-tab-wrapper">
	<?php
	if ( $options ) {
		foreach( $options as $key => $value ) :
			if ( ( $set == $key && $set != 0 ) || ( $set == 0 && $set === $key ) ) {
				$active = 'nav-tab-active';
				$link = '#';
			} else {
				$active = '';
				$link = add_query_arg( array( 'set' => $key ) );
			}
		?>

		<a href="<?php echo $link ?>" class="nav-tab <?php echo $active ?>"><?php echo $value['title'] ?></a>

		<?php
		endforeach;
	}

	if ( empty( $options ) || $set === 'new' ) :
	?>

	<a href="#" class="nav-tab nav-tab-active"><span class="dashicons dashicons-plus-alt"></span> New</a>

	<?php else : ?>

	<a href="<?php echo add_query_arg( array( 'set' => 'new' ) ) ?>" class="nav-tab"><span class="dashicons dashicons-plus-alt"></span> New</a>

	<?php endif; ?>
</h2>
