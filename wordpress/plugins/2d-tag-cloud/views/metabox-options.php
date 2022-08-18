<table class="form-table">
	<tbody>
		<tr>
			<th scope="row"><label for="tag_method"><?php _e( 'Output', SJ_2DTAG_TEXTDOMAIN ); ?></label></th>
			<td>
				<select id="tag_method" name="tag_method">
					<option value="click-color" <?php if ( $option['tag_method'] == 'click-color' ) echo 'selected="selected"' ?>><?php _e('Color:View / Size:Including', SJ_2DTAG_TEXTDOMAIN); ?></option>
					<option value="include-color" <?php if ( $option['tag_method'] == 'include-color') echo 'selected="selected"' ?>><?php _e('Color:Including / Size:View', SJ_2DTAG_TEXTDOMAIN); ?></option>
				</select>
			</td>
		</tr>

		<tr>
			<th scope="row"><label for="line_height"><?php _e( 'Line Height', SJ_2DTAG_TEXTDOMAIN ); ?></label></th>
			<td>
				<input id="line_height" class="jquery-spinner" name="line_height" value="<?php echo $option['line_height'] ?>" />
				<select id="line_height_unit" name="line_height_unit">
					<option value="em" <?php if ( $option['line_height_unit'] == 'em') echo 'selected="selected"' ?>>em</option>
					<option value="px" <?php if ( $option['line_height_unit'] == 'px') echo 'selected="selected"' ?>>px</option>
				</select>
			</td>
		</tr>

		<tr>
			<th scope="row"><label for="margin_right"><?php _e( 'Right Margin', SJ_2DTAG_TEXTDOMAIN ); ?></label></th>
			<td>
				<input id="margin_right" class="jquery-spinner" name="margin_right" value="<?php echo $option['margin_right'] ?>" />
			</td>
		</tr>

		<tr>
			<th scope="row"><label for="margin_bottom"><?php _e( 'Bottom Margin', SJ_2DTAG_TEXTDOMAIN ); ?></label></th>
			<td>
				<input id="margin_bottom" class="jquery-spinner" name="margin_bottom" value="<?php echo $option['margin_bottom'] ?>" />
			</td>
		</tr>

		<tr>
			<th scope="row"><label for="underline"><?php _e( 'Underline', SJ_2DTAG_TEXTDOMAIN ); ?></label></th>
			<td>
				<input type="checkbox" id="underline" name="underline" <?php if ( $option['underline'] ) echo 'checked="checked"' ?> /> <label for="underline" id="label_underline"><?php _e('Check if show underline when mouse-over', SJ_2DTAG_TEXTDOMAIN); ?></label>
			</td>
		</tr>
	</tbody>
</table>
