<?php
/**
 * Admin Class
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express\Helpers;

use Sujin\Wordpress\WP_Express\Helpers\Multiton;
use Sujin\Wordpress\WP_Express\Helpers\Assets;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

trait Meta_Base {
	use Multiton;
	use Assets;

	public $value;

	protected $type = 'text';
	protected $show_label = true;
	protected $show_in_rest = false;

	private $default;
	private $placeholder;
	private $description;
	private $html;
	private $classes = array();
	private $options = array();

	public function constructor( $name ) {
		$this->name        = $name;
		$this->placeholder = $name;
		$this->id          = sanitize_title( $this->name );

		$this->set_style( WP_EXPRESS_ASSET_URL . '/css/meta.css' );
	}

	public function set_type( $type ) {
		$this->type = $type;
		return $this;
	}

	public function set_default( $default ) {
		$this->default = $default;
		return $this;
	}

	public function set_description( $description ) {
		$this->description = $description;
		return $this;
	}

	public function set_html( $html ) {
		$this->html = $html;
		return $this;
	}

	public function set_placeholder( $placeholder ) {
		$this->placeholder = $placeholder;
		return $this;
	}

	public function set_class( $class ) {
		$this->classes[] = $class;
		return $this;
	}

	public function set_option( $option ) {
		$this->options[] = $option;
		return $this;
	}

	// Rest API
	public function set_show_in_rest( $bool, $thumbnail_size = null ) {
		$this->show_in_rest = $bool;

		if ( $thumbnail_size ) {
			$this->thumbnail_size = $thumbnail_size;
		}

		return $this;
	}

	public function print_field( $value = null ) {
		$classes = implode( ' ', $this->classes );
		$value = $this->value ? $this->value : $value;

		switch ( $this->type ) {
			case 'file' :
				$upload_link = get_upload_iframe_src();
				$media_arr = wp_get_attachment_image_src( $value );

				$img = $value ? '<img src="' . $media_arr[0] . '" width="150" />' : '';
				$class_upload = $img ? 'hidden' : '';
				$class_remove = ! $img ? 'hidden' : '';

				?>
				<div class="wp-express-meta wp-express-meta-file">
					<label><?php echo $this->name ?></label>
					<div id="<?php echo $this->id ?>-custom-img-container"><?php echo $img ?></div>

					<a id="<?php echo $this->id ?>-upload-custom-img" class="<?php echo $class_upload ?> btn-upload" href="<?php echo $upload_link ?>">
						<?php echo __( 'No image selected', 'wp-express' ) ?>
						<button class="button"><?php echo __( 'Add image', 'wp-express' ) ?></button>
					</a>

					<button id="<?php echo $this->id ?>-delete-custom-img" class="<?php echo $class_remove ?> button">
						<?php echo __( 'Remove image', 'wp-express' ) ?>
					</button>

					<input id="<?php echo $this->id ?>-custom-img-id" name="<?php echo $this->id ?>" type="hidden" value="<?php echo esc_attr( $value ) ?>" />
					</a>
				</div>
				<?php

				add_action( 'admin_footer', array( $this, 'print_media_upload_script' ) );
				wp_enqueue_media();
			break;

			case 'radio' :
				if ( !empty( $this->options ) ) {
					foreach( $this->options as $key => $option ) {
						if ( !is_array( $option ) )
							$option = [ $option, $option ];

						$checked = ( $option[0] == $value ) ? 'checked="checked"' : '';
						printf( '<label for="%s[%s]" class="%s"><input type="radio" id="%s[%s]" name="%s" value="%s" %s />%s</label>', $this->id, $key, $classes, $this->id, $key, $this->id, $option[0], $checked, $option[1] );
					}
				}
			break;

			case 'checkbox' :
				$text = $this->options ? $this->options[0] : $this->name;
				$checked = $value ? 'checked="checked"' : '';

				echo '<div class="wp-express-meta wp-express-meta-checkbox">';
				printf( '<label for="%s" class="%s">', $this->id, $classes );
				printf( '<input type="checkbox" name="%s" id="%s" %s />', $this->id, $this->id, $checked );
				echo $text;
				echo '</label>';
				echo '</div>';
			break;

			case 'select' :
				printf( '<select name="%s" id="%s" class="%s">', $this->id, $this->id, $classes );
				if ( !empty( $this->options ) ) {
					foreach( $this->options as $option ) {
						if ( !is_array( $option ) )
							$option = [ $option, $option ];

						$selected = ( $option[0] == $value) ? 'selected="selected"': '';
						printf( '<option value="%s" %s>%s</option>', $option[0], $selected, $option[1] );
					}
				}
				echo '</select>';
			break;

			case 'html' :
				echo $this->html;
			break;

			case 'textarea' :
				printf( '<textarea name="%s" id="%s" class="%s" rows="8">%s</textarea>', $this->id, $this->id, $classes, $value );
			break;

			case 'editor' :
				wp_editor( stripcslashes( $value), $this->id );
			break;

			default :
				$value = $value ? 'value="' . $value . '"' : '';
				echo '<div class="wp-express-meta wp-express-meta-text">';
				if ( $this->show_label ) {
					printf( '<label for="%s">%s</label>', $this->id, $this->name );
				}
				printf( '<input type="%s" name="%s" id="%s" %s class="%s" placeholder="%s" />', $this->type, $this->id, $this->id, $value, $classes, $this->placeholder );
				echo '</div>';
			break;
		}

		if ( !empty( $this->description ) ) {
			printf( '<p class="description">%s</p>', $this->description );
		}
	}

	public function print_media_upload_script() {
		?>
		<script type="text/javascript">
			jQuery( document ).ready( function($) {
				var frame;
				$( '#<?php echo $this->id ?>-upload-custom-img' ).click( function( e ) {
					e.preventDefault();

					if( !frame ) {
						frame = wp.media({
							title: 'Select or Upload Media Of Your Chosen Persuasion',
							button: { text: 'Use this media' },
							multiple: false
						});

						frame.on( 'select', function() {
							var attachment = frame.state().get('selection').first().toJSON();
							$( '#<?php echo $this->id ?>-custom-img-container' ).append( '<img src="' + attachment.url + '" width="150" />' );
							$( '#<?php echo $this->id ?>-custom-img-id' ).val( attachment.id );

							$( '#<?php echo $this->id ?>-upload-custom-img' ).addClass( 'hidden' );
							$( '#<?php echo $this->id ?>-delete-custom-img' ).removeClass( 'hidden' );
						});
					}

					frame.open();
				});

				$( '#<?php echo $this->id ?>-delete-custom-img' ).on( 'click', function( e ){
					e.preventDefault();

					$( '#<?php echo $this->id ?>-custom-img-container' ).html( '' );
					$( '#<?php echo $this->id ?>-custom-img-id' ).val( '' );

					$( '#<?php echo $this->id ?>-upload-custom-img' ).removeClass( 'hidden' );
					$( '#<?php echo $this->id ?>-delete-custom-img' ).addClass( 'hidden' );
				});
			});
		</script>
		<?php
	}
}
