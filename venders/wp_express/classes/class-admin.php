<?php
/**
 * Creates Admin Page
 * 아무 페이지나 만들지어다
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

		add_action( 'network_admin_menu', array( $this, '_admin_menu' ) );
		add_action( 'admin_menu', array( $this, '_admin_menu' ) );
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

	public function _admin_menu() {
		$args = array(
			$this->get_name(),
			$this->get_name(),
			$this->_capability,
			$this->get_id(),
			array( $this, '_render' ),
			$this->_icon,
		);

		$position = is_string( $this->_position ) ? strtolower( $this->_position ) : $this->_position;

		switch ( $position ) {
			case self::POSITION_OPTION:
			case self::POSITION_SETTINGS:
				$page_slug        = add_options_page( ...$args );
				$this->_admin_url = admin_url( 'options-general.php?page=' . $this->get_id() );
				break;

			case self::POSITION_TOOLS:
				$page_slug        = add_management_page( ...$args );
				$this->_admin_url = admin_url( 'tools.php?page=' . $this->get_id() );
				break;

			case self::POSITION_USERS:
				$page_slug        = add_users_page( ...$args );
				$this->_admin_url = admin_url( 'users.php?page=' . $this->get_id() );
				break;

			case self::POSITION_PLUGINS:
				$page_slug        = add_plugins_page( ...$args );
				$this->_admin_url = admin_url( 'plugins.php?page=' . $this->get_id() );
				break;

			case self::POSITION_COMMENTS:
				$page_slug        = add_comments_page( ...$args );
				$this->_admin_url = admin_url( 'comments.php?page=' . $this->get_id() );
				break;

			case self::POSITION_PAGES:
				$page_slug        = add_pages_page( ...$args );
				$this->_admin_url = admin_url( 'edit.php?post_type=page&page=' . $this->get_id() );
				break;

			case self::POSITION_POSTS:
				$page_slug        = add_posts_page( ...$args );
				$this->_admin_url = admin_url( 'edit.php?page=' . $this->get_id() );
				break;

			case self::POSITION_MEDIA:
				$page_slug        = add_media_page( ...$args );
				$this->_admin_url = admin_url( 'upload.php?page=' . $this->get_id() );
				break;

			case self::POSITION_DASHBOARD:
				$page_slug        = add_dashboard_page( ...$args );
				$this->_admin_url = admin_url( 'index.php?page=' . $this->get_id() );
				break;

			case self::POSITION_APPEARANCE:
				$page_slug        = add_theme_page( ...$args );
				$this->_admin_url = admin_url( 'themes.php?page=' . $this->get_id() );
				break;

			default:
				global $menu;
				$position_key     = $this->get_id();
				$page_slug        = null;
				$this->_admin_url = admin_url( 'admin.php?page=' . $this->get_id() );

				## When the position is WP Express class
				if ( is_object( $this->_position ) && false !== stripos( get_class( $this->_position ), 'WP_Express' ) ) {
					$page_slug = add_submenu_page( $this->_position->get_id(), ...$args );
					break;
				}

				## When the position is numeric
				if ( is_numeric( $this->_position ) ) {
					## To existing position
					if ( isset( $menu[ $this->_position ] ) ) {
						$position_key = $menu[ $this->_position ][2];
						$page_slug    = add_submenu_page( $position_key, ...$args );
						break;
					}

					## To new position
					$args[]    = $this->_position;
					$page_slug = add_menu_page( ...$args );
					break;
				}

				## When the position is a menu Name
				foreach ( $menu as $menu_item ) {
					if ( $this->_position === $menu_item[0] ) {
						$position_key = $menu_item[2];
						## To existing position
						$page_slug = add_submenu_page( $position_key, ...$args );
						break 2;
					}
				}

				## To root position
				$args[]    = $this->_position;
				$page_slug = add_menu_page( ...$args );
				break;
		}

		add_action( 'load-' . $page_slug, array( $this, '_render_screen_options' ) );
	}

	public function _plugin_action_links( array $actions, string $_, array $plugin_data ): array {
		if ( empty( $this->_plugin ) ) {
			return $actions;
		}

		if ( sanitize_title( $this->_plugin ) == sanitize_title( $plugin_data['Name'] ) ) {
			$actions['setting'] = sprintf(
				'<a href="%s"><span class="dashicons-before %s"></span> Setting</a>',
				$this->_admin_url,
				$this->_get_dashicon()
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
			<h2
				class="page-title <?php echo esc_attr( self::PREFIX ); ?>"
			>
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

	private function _get_dashicon(): string {
		return
			false !== stripos( $this->_icon, 'dashicons-' )
			? $this->_icon
			: 'dashicons-admin-settings';
	}
}
