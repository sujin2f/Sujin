<?php
/**
 * Admin Class
 *
 * @project WP-Express
 * @since   1.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express;

use Sujin\Wordpress\WP_Express\Setting;

use Sujin\Wordpress\WP_Express\Helpers\Messageable;
use Sujin\Wordpress\WP_Express\Helpers\Multiton;
use Sujin\Wordpress\WP_Express\Helpers\Assets;

if ( !defined( "ABSPATH" ) ) {
	header( "Status: 404 Not Found" );
	header( "HTTP/1.1 404 Not Found" );
	exit();
}

class Admin extends Base {
	use Messageable;
	use Multiton;
	use Assets;

	private $url;
	private $template   = array();
	private $plugin;
	private $position   = 'settings';
	private $icon       = 'dashicons-admin-generic';
	private $menu_icon;
	private $capability = 'activate_plugins';
	private $page_key;
	private $form       = false;

	public function __construct( $name ) {
		$this->name = $name;
		$this->id   = sanitize_title( $this->name );

		if ( is_network_admin() ) {
			add_action( 'network_admin_menu', array( $this, 'set_menu' ) );
		} else {
			add_action( 'admin_menu',         array( $this, 'set_menu' ) );
		}

		add_action( 'plugin_action_links',    array( $this, 'set_plugin_action_links' ), 15, 3 );
	}

	public function set_position( $position ) {
		$this->position = $position;
		return $this;
	}

	public function set_plugin( $plugin ) {
		$this->plugin = $plugin;
		return $this;
	}

	public function set_capability( $capability ) {
		$this->capability = $capability;
		return $this;
	}

	public function set_icon( $icon ) {
		$this->icon = $icon;
		return $this;
	}

	public function set_template( $template ) {
		if ( $template instanceof Setting ) {
			$template->set_page( $this->id );
			$this->form = true;
		}

		$this->template[] = $template;
		return $this;
	}

	public function set_menu() {
		switch ( $this->position ) {
			case 'general' :
			case 'General' :
			break;

			case 'option' :
			case 'Option' :
			case 'settings' :
			case 'Settings' :
				$this->page_key = add_options_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
				$this->url      = admin_url( 'options-general.php?page=' . $this->id );
			break;

			case 'tools' :
			case 'Tools' :
				$this->page_key = add_management_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
				$this->url      = admin_url( 'tools.php?page=' . $this->id );
			break;

			case 'users' :
			case 'Users' :
				$this->page_key = add_users_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
				$this->url      = admin_url( 'users.php?page=' . $this->id );
			break;

			case 'plugins' :
			case 'Plugins' :
				$this->page_key = add_plugins_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
				$this->url      = admin_url( 'plugins.php?page=' . $this->id );
			break;

			case 'comments' :
			case 'Comments' :
				$this->page_key = add_comments_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
				$this->url      = admin_url( 'comments.php?page=' . $this->id );
			break;

			case 'pages' :
			case 'Pages' :
				$this->page_key = add_pages_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
				$this->url      = admin_url( 'edit.php?post_type=page&page=' . $this->id );
			break;

			case 'posts' :
			case 'Posts' :
				$this->page_key = add_posts_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
				$this->url      = admin_url( 'edit.php?page=' . $this->id );
			break;

			case 'media' :
			case 'Media' :
				$this->page_key = add_media_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
				$this->url      = admin_url( 'upload.php?page=' . $this->id );
			break;

			case 'dashboard' :
			case 'Dashboard' :
				$this->page_key = add_dashboard_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
				$this->url      = admin_url( 'index.php?page=' . $this->id );
			break;

			case 'appearance' :
			case 'Appearance' :
				$this->page_key = add_theme_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
				$this->url      = admin_url( 'themes.php?page=' . $this->id );
			break;

			default :
				global $menu;
				$position_key = $this->id;

				if ( is_numeric( $this->position ) ) {
					// To existing position
					if ( isset( $menu[ $this->position ] ) ) {
						$position_key = $menu[ $this->position ][2];
						$this->page_key = add_submenu_page( $position_key, $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );

					// To new position
					} else {
						$this->page_key = add_menu_page( $this->name, $this->name, $this->capability, $position_key, array( $this, 'print_template' ), $this->icon, $this->position );
					}
				} else {
					$detected = false;

					foreach( $menu as $menu_ ) {
						if ( $this->position == $menu_[0] ) {
							$position_key = $menu_[2];
							$detected = true;
							$this->page_key = add_submenu_page( $position_key, $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ) );
							break;
						}
					}

					if ( !$detected ) {
						$this->page_key = add_menu_page( $this->name, $this->name, $this->capability, $this->id, array( $this, 'print_template' ), $this->icon );
					}
				}

				$this->url = admin_url( 'admin.php?page=' . $this->id );
			break;
		}

		add_action( "load-{$this->page_key}", array( $this, "set_screen_options") );
	}

	public function set_plugin_action_links( $actions, $plugin_file, $plugin_data ) {
		if ( $this->plugin && sanitize_title( $this->plugin ) == sanitize_title( $plugin_data[ 'Name' ] ) ) {
			$actions[ 'setting' ] = sprintf( '<a href="%s"><span class="dashicons-before dashicons-admin-settings"></span> Setting</a>', $this->url );
		}

		return $actions;
	}

	public function set_screen_options() {

	}

	public function print_template() {
		if ( isset( $_REQUEST['_wpnonce'] ) && wp_verify_nonce( $_REQUEST['_wpnonce'], $this->id . '-options' ) ) {
			$this->save_options();
			$this->show_message( 'Options are saved!' );
		}

		foreach ( $this->template as $template) {
			if ( $template instanceof Setting ) {
				$template->value = get_option( $template->id );
			}
		}

		printf( '<div class="wrap" id="admin-%s">', $this->id );
		printf( '<h2 class="page-title">%s</h2>', $this->name );

		settings_errors();

		if ( $this->form ) {
			echo '<form method="post">';
			settings_fields( $this->id );
		}

		$did_setting = false;

		foreach ( $this->template as $template) {
			// Call function
			if ( gettype( $template ) === 'string' &&  function_exists( $template ) ) {
				call_user_func( $template );

			// Call Method
			} else if ( is_array( $template ) && method_exists( $template[0], $template[1] ) ) {
				call_user_func( $template );
			} else if ( $template instanceof Setting ) {
				if ( ! $did_setting ) {
					$did_setting = true;
					do_settings_sections( $this->id );
				}
			// Print Value
			} else {
				echo $template;
			}
		}

		if ( $this->form ) {
			submit_button();
			echo '</form>';
		}
		echo '</div>';
	}

	private function save_options() {
		foreach ( $this->template as $template) {
			if ( $template instanceof Setting ) {
				update_option( $template->id, $_POST[ $template->id ] );
				continue;
			}
		}
	}
}
