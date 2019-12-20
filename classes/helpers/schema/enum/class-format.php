<?php
/**
 * Enum JSON schema formats
 *
 * @package    Sujinc.com
 * @subpackage Enum
 * @author     Sujin 수진 Choi <http://www.sujinc.com/>
 */
namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum;

final class Format extends Enum {
	const URI  = array( 'uri', 'url' );
	const DATE = 'date';
}
