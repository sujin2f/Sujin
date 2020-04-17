<?php
/**
 * Response Schema
 *
 * @package Sujinc.com
 * @author  Sujin 수진 Choi <http://www.sujinc.com/>
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema;

use Sujin\Wordpress\WP_Express\Helpers\Schema;

class Response_Schema extends Schema {
	protected function get_base_dir(): string {
		return get_stylesheet_directory() . DIRECTORY_SEPARATOR . '.configs' . DIRECTORY_SEPARATOR . 'schema' . DIRECTORY_SEPARATOR . 'response';
	}
}
