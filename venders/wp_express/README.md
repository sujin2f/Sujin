# WordPress Express
<p align="center">
  <img src="logo.png">
</p>

NOTE This repo is in dev.

Quick Wordpress Development Module. It will help you to make new admin pages, custom post types, and taxonomies. This module is on development, so some of its features are not perfect. However, I think it's still quite useful. Please send me the request if you want to improve WP Express together.

## Initialize
Include autoload.php, and you are ready to use wp-express!

```php
include_once( $your_path_to . '/wp_express/autoload.php' );
```
## Basic Usage
Modules you can create with WP Express are post type, taxonomy, post meta, admin page, meta box, settings api, rest endpoint, and theme customizer.

You can create modules by typing this syntax.
```php
Sujin\Wordpress\WP_Express\Admin::get_instance('Test Admin Page');
```

This returns an instance of Admin, so you can set variables.
```php
Sujin\Wordpress\WP_Express\Admin::get_instance('Test Admin Page')
  ->set_script( $url_of_script )
  ->set_style( $url_of_stle )
  ->set_position( 'Appearance' );
```

Calling get_instance again will return a same instance or you can store the module into variable and call it again.
```php
$test_admin = Sujin\Wordpress\WP_Express\Admin::get_instance('Test Admin Page')
  ->set_plugin( 'Akismet' );
$test_admin->set_position(1);
```

Some module has get_value method.
```php
$test_meta_box = Sujin\Wordpress\WP_Express\Meta_Box::get_instance('Test Meta Box')
  ->set_post_type( 'page' );
$test_meta = Sujin\Wordpress\WP_Express\Meta\Post_Meta::get_instance('Test Meta')
  ->set_metabox( $test_meta_box );
// Do other codes
$value = $test_meta->get_value($page_id);
```
