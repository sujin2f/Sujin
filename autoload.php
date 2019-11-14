<?php
/**
 * Autoload
 *
 * @project Sujin Mk 9
 * @version 9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

require_once( dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'classes/class-autoloader.php' );
$class_loader = new Sujin\Wordpress\Theme\Sujin\Autoloader();
$class_loader->register();
