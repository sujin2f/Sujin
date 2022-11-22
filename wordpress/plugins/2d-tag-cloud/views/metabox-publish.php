<div id="major-publishing-actions">
	<?php if ( $set === 0 || $set != 'new' ) { ?>
	<div id="delete-action">
		<a class="submitdelete deletion" href="<?php echo wp_nonce_url( add_query_arg( array( 'action' => 'delete', 'set' => $set ) ), 'delete', SJ_2DTAG_TEXTDOMAIN ); ?>">Delete</a>
	</div>
	<?php } ?>

	<div id="publishing-action">
		<button class="button button-primary button-large" id="publish" accesskey="p"><span class="dashicons dashicons-pressthis"></span> Save Setting</button>
	</div>
	<div class="clear"></div>
</div>
