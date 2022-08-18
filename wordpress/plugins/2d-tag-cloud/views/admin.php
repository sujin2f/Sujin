<div id="SJ2DTAG" class="wrap">
	<?php include_once( SJ_2DTAG_VIEW_DIR . '/admin-tabs.php'); ?>

	<form method="post" id="SJ2DTAG_Form">
		<input type="hidden" value="2D-tag-cloud-options" name="option_page">
		<input type="hidden" value="update" name="action">
		<input type="hidden" value="<?php echo $set ?>" name="set_current_id">

		<?php wp_nonce_field( SJ_2DTAG_TEXTDOMAIN ) ?>

		<div id="poststuff">
			<div id="post-body" class="metabox-holder columns-2">
				<div id="post-body-content">
					<div id="titlediv">
						<div id="titlewrap">
							<input type="text" name="set_name" size="30" value="<?php echo $option['title'] ?>" id="title" autocomplete="off">
						</div>
					</div>
				</div>

				<div id="postbox-container-1" class="postbox-container inner-sidebar">
					<?php do_meta_boxes( false, 'side', false ); ?>
				</div>

				<div id="postbox-container-2" class="postbox-container meta-box-sortables">
					<?php do_meta_boxes( false, 'normal', false ); ?>
					<?php do_meta_boxes( false, 'advanced', false ); ?>
				</div>
			</div>
		</div>
	</form>
</div>















