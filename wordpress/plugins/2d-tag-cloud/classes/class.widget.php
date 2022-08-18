<?php
/**
 * 2D Tag Cloud - Widget
 *
 * @package sujin-2d-tag-cloud
 * @author Sujin 수진 Choi
 * @version 6.0.0
 */

if ( !defined( 'ABSPATH' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

class SJ2DTAG_widget extends WP_Widget {
	public $widget_id = 'tag_cloud_widget_sujin';
	public $widget_name;
	public $widget_title;

	function __construct() {
		$this->widget_id = 'tag_cloud_widget_sujin';
		$this->widget_name = __( '2D Tag Cloud', SJ_2DTAG_TEXTDOMAIN );
		$this->widget_title = __( '2D Tag Cloud', SJ_2DTAG_TEXTDOMAIN );

		$widget_ops = array(
			'classname' => $this->widget_id,
			'description' =>'Generate 2-Dimentional Tag Cloud'
		);

		$control_ops = array(
			'width' => 500,
		);

		parent::__construct($this->widget_id, $this->widget_name, $widget_ops, $control_ops);
		$this->alt_option_name = 'widget_' . $this->id_base;
	}

	function widget( $args, $instance ) {
		extract($args, EXTR_SKIP);

		$title = isset($instance['title']) ? $instance['title'] : '';

		$number = isset($instance['number']) ? $instance['number'] : 20;
		$separator = isset($instance['separator']) ? $instance['separator'] : '';
		$sort = isset($instance['sort']) ? $instance['sort'] : 'DESC';
		$set = isset($instance['set_id']) ? $instance['set_id'] : 0;

		$options = compact( 'set', 'number', 'separator', 'sort' );

		echo $before_widget;
		echo $before_title . apply_filters( 'widget_title', $title ) . $after_title;
		echo SJ2DTAG_main::get_tagcloud( $options );
		echo $after_widget;
	} // function widget($args, $instance)

	function update($new_instance, $old_instance) {
		$instance = $old_instance;

		$instance['number'] = $new_instance['number'];
		$instance['title'] = $new_instance['title'];
		$instance['separator'] = $new_instance['separator'];
		$instance['sort'] = $new_instance['sort'];
		$instance['set_id'] = $new_instance['set_id'];

		return $instance;
	} // function update($new_instance, $old_instance)

	function form($instance) {
		$number = isset($instance['number']) ? $instance['number'] : 20;
		$title = isset($instance['title']) ? $instance['title'] : '';
		$separator = isset($instance['separator']) ? $instance['separator'] : '';
		$sort = isset($instance['sort']) ? $instance['sort'] : 'DESC';
		$current_set_num = isset($instance['set_id']) ? $instance['set_id'] : 0;

		$options = get_option( 'SJ_2DTAG_CONFIG' );
		$tag_set = array();
		if ( !$options ) {
			$tag_set = array(0 => 'Default Setting');
		} else {
			foreach( $options as $key => $value ) {
				$tag_set[$key] = $value['title'];
			}
		}

		?>

			<p>
				<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title', SJ_2DTAG_TEXTDOMAIN); ?> :</label>
				<input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" class="widefat" />
			</p>

			<p>
				<label for="<?php echo $this->get_field_id('set_id'); ?>"><?php _e('Set', SJ_2DTAG_TEXTDOMAIN); ?> :</label>
				<select id="<?php echo $this->get_field_id('set_id'); ?>" name="<?php echo $this->get_field_name('set_id'); ?>">

					<?php foreach($tag_set as $key=>$value) { ?>

					<option value="<?php echo $key ?>" <?php if ($key == $current_set_num) echo 'selected="selected"' ?>><?php echo $value ?></option>

					<?php } ?>

				</select>
			</p>

			<p>
				<label for="<?php echo $this->get_field_id('number'); ?>"><?php _e('Number of tags to show', SJ_2DTAG_TEXTDOMAIN); ?> :</label>
				<input id="<?php echo $this->get_field_id('number'); ?>" name="<?php echo $this->get_field_name('number'); ?>" type="text" value="<?php echo $number; ?>" class="widefat" />
			</p>

			<p>
				<label for="<?php echo $this->get_field_id('separator'); ?>"><?php _e('Separator', SJ_2DTAG_TEXTDOMAIN); ?> :</label>
				<input id="<?php echo $this->get_field_id('separator'); ?>" name="<?php echo $this->get_field_name('separator'); ?>" type="text" value="<?php echo $separator; ?>" class="widefat" />
			</p>

			<p>
				<label><?php _e('Sort', SJ_2DTAG_TEXTDOMAIN); ?> :</label>

				<select name="<?php echo $this->get_field_name('sort'); ?>" class="widefat">
					<option value="DESC" <?php if ($sort == 'DESC') echo 'selected="selected"' ?>><?php _e('Put tags by descending order', SJ_2DTAG_TEXTDOMAIN); ?></option>
					<option value="intersection" <?php if ($sort == 'intersection') echo 'selected="selected"' ?>><?php _e('Put tags 1 by 1. bigger, smaller, bigger, smaller...', SJ_2DTAG_TEXTDOMAIN); ?></option>
					<option value="name" <?php if ($sort == 'name') echo 'selected="selected"' ?>><?php _e('Sort by name', SJ_2DTAG_TEXTDOMAIN); ?></option>
				</select>
			</p>

		<?php
	} // function form($instance)
}







