<?php
/**
 * Creates Admin Page
 * 무엇이든 만들지어다
 *
 * @project WP Express
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\WP_Express;

use Sujin\Wordpress\WP_Express\Setting;

if ( ! defined( 'ABSPATH' ) ) {
	header( 'Status: 404 Not Found' );
	header( 'HTTP/1.1 404 Not Found' );
	exit();
}

class Admin extends Abs_Base {
	private $_admin_url;

	private const POSITION   = 'position';
	private const ICON       = 'icon';
	private const CAPABILITY = 'capability';
	private const PLUGIN     = 'plugin';

	private $_position   = 'settings';
	private $_icon       = 'dashicons-admin-generic';
	private $_capability = 'manage_options';
	private $_plugin     = null;

	public const POSITION_OPTION     = 'option';
	public const POSITION_SETTINGS   = 'settings';
	public const POSITION_TOOLS      = 'tools';
	public const POSITION_USERS      = 'users';
	public const POSITION_PLUGINS    = 'plugins';
	public const POSITION_COMMENTS   = 'comments';
	public const POSITION_PAGES      = 'pages';
	public const POSITION_POSTS      = 'posts';
	public const POSITION_MEDIA      = 'media';
	public const POSITION_DASHBOARD  = 'dashboard';
	public const POSITION_APPEARANCE = 'appearance';

	public function __construct( string $name ) {
		## Abs_Base
		parent::__construct( $name );

		add_action( 'network_admin_menu', array( $this, '_register_admin_menu' ) );
		add_action( 'admin_menu', array( $this, '_register_admin_menu' ) );
		add_action( 'plugin_action_links', array( $this, '_plugin_action_links' ), 15, 3 );
	}

	public function __call( string $name, array $arguments ) {
		switch ( strtolower( $name ) ) {
			case self::POSITION:
			case self::ICON:
			case self::CAPABILITY:
			case self::PLUGIN:
				$name = '_' . $name;
				if ( empty( $arguments ) ) {
					return $this->{$name};
				}

				$this->{$name} = $arguments[0];
				break;
		}

		return $this;
	}

	public function add( Setting $setting ): Admin {
		$setting->admin_page( $this );
		return $this;
	}

	# ACTION admin_menu, network_admin_menu
	public function _register_admin_menu() {
		$parent_slug = '';

		if ( is_string( $this->_position ) && $this->_register_admin_menu_by_position() ) {
			return;
		}

		## When the position is WP Express class
		if ( is_object( $this->_position ) && ( $this->_position instanceof Admin || $this->_position instanceof Post_Type ) ) {
			$this->_register_admin_menu_in_express_class();
			return;
		}

		## When the position is numeric
		if ( is_numeric( $this->_position ) ) {
			$this->_register_admin_menu_in_numeric_position();
			return;
		}

		## When the position is a menu Name
		if ( $this->_register_admin_menu_in_string_position() ) {
			return;
		}

		## To root position
		$this->_admin_url = admin_url( 'admin.php?page=' . $this->get_id() );
		$page_slug        = add_menu_page( ...$this->_get_menu_args() );
		add_action( 'load-' . $page_slug, array( $this, '_render_screen_options' ) );
	}

	# Excecuted by: _register_admin_menu()
	private function _register_admin_menu_by_position(): bool {
		$parent_slug = null;

		switch ( strtolower( $this->_position ) ) {
			case self::POSITION_OPTION:
			case self::POSITION_SETTINGS:
				$parent_slug = 'options-general.php';
				break;

			case self::POSITION_TOOLS:
				$parent_slug = 'tools.php';
				break;

			case self::POSITION_USERS:
				$parent_slug = 'users.php';
				break;

			case self::POSITION_PLUGINS:
				$parent_slug = 'plugins.php';
				break;

			case self::POSITION_COMMENTS:
				$parent_slug = 'edit-comments.php';
				break;

			case self::POSITION_PAGES:
				$parent_slug = 'edit.php?post_type=page';
				break;

			case self::POSITION_POSTS:
				$parent_slug = 'edit.php';
				break;

			case self::POSITION_MEDIA:
				$parent_slug = 'upload.php';
				break;

			case self::POSITION_DASHBOARD:
				$parent_slug = 'index.php';
				break;

			case self::POSITION_APPEARANCE:
				$parent_slug = 'themes.php';
				break;
		}

		if ( is_null( $parent_slug ) ) {
			return false;
		}

		$this->_admin_url = add_query_arg( 'page', $this->get_id(), admin_url( $parent_slug ) );
		$page_slug        = add_submenu_page( $parent_slug, ...$this->_get_menu_args() );
		add_action( 'load-' . $page_slug, array( $this, '_render_screen_options' ) );
		return true;
	}

	# Excecuted by: _register_admin_menu()
	private function _register_admin_menu_in_express_class() {
		if ( $this->_position instanceof Post_Type ) {
			$this->_admin_url = admin_url( 'edit.php?post_type=' . $this->_position->get_id() . '&page=' . $this->get_id() );
		}
		$page_slug = add_submenu_page( $this->_position->get_id(), ...$this->_get_menu_args() );
		add_action( 'load-' . $page_slug, array( $this, '_render_screen_options' ) );
	}

	# Excecuted by: _register_admin_menu()
	private function _register_admin_menu_in_numeric_position() {
		global $menu;
		$args = $this->_get_menu_args();

		if ( isset( $menu[ $this->_position ] ) ) { ## To existing position
			$parent_url       = $menu[ $this->_position ][2];
			$this->_admin_url = add_query_arg( 'page', $this->get_id(), $parent_url );
			$page_slug        = add_submenu_page( $parent_url, ...$args );

		} else { ## To new position
			$args[]    = $this->_position;
			$page_slug = add_menu_page( ...$args );
		}

		add_action( 'load-' . $page_slug, array( $this, '_render_screen_options' ) );
	}

	# Excecuted by: _register_admin_menu()
	private function _register_admin_menu_in_string_position(): bool {
		global $menu;

		if ( empty( $menu ) ) {
			return false;
		}

		foreach ( $menu as $menu_item ) {
			if ( $this->_position === $menu_item[0] ) {
				$parent_url       = $menu_item[2];
				$this->_admin_url = add_query_arg( 'page', $this->get_id(), $parent_url );
				$page_slug        = add_submenu_page( $parent_url, ...$this->_get_menu_args() );
				add_action( 'load-' . $page_slug, array( $this, '_render_screen_options' ) );
				return true;
			}
		}

		return false;
	}

	# ACTION plugin_action_links
	public function _plugin_action_links( array $actions, string $_, array $plugin_data ): array {
		if ( empty( $this->_plugin ) ) {
			return $actions;
		}

		if ( sanitize_title( $this->_plugin ) == sanitize_title( $plugin_data['Name'] ) ) {
			$actions['setting'] = sprintf(
				'<a href="%s"><span class="dashicons-before dashicons-admin-generic"></span> Setting</a>',
				$this->_admin_url
			);
		}

		return $actions;
	}

	public function _render() {
		?>
		<div
			class="<?php echo esc_attr( self::PREFIX ); ?> admin wrap"
			id="<?php echo esc_attr( self::PREFIX ); ?>-admin-<?php echo esc_attr( $this->get_id() ); ?>"
		>
			<h2 class="page-title <?php echo esc_attr( self::PREFIX ); ?>">
				<span class="dashicons <?php echo esc_attr( $this->_get_dashicon() ); ?>"></span>
				<?php echo esc_html( $this->get_name() ); ?>
			</h2>

			<form method="post" action="options.php">
				<?php
				settings_fields( $this->get_id() );
				do_settings_sections( $this->get_id() );
				submit_button();
				?>
			</form>
		</div>
		<?php
	}

	// TODO
	public function _render_screen_options() {}

	# HELPER
	private function _get_menu_args(): array {
		return array(
			$this->get_name(),
			$this->get_name(),
			$this->_capability,
			$this->get_id(),
			array( $this, '_render' ),
			$this->_icon,
		);
	}
}
