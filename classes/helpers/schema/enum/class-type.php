<?php
/**
 * Class : JSON Schema -- Enum -- Type
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum;

final class Type extends Enum {
	const STRING = 'string';
	const NUMBER = 'number';
	const OBJECT = 'object';
	const ARRAY  = 'array';
	const BOOL   = 'boolean';
	const NULL   = 'null';
}