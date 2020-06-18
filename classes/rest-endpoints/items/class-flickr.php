<?php
/**
 * Flickr RESTful API Item
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;
use Sujin\Wordpress\WP_Express\Helpers\Schema;

/**
 * Flickr RESTful API Item
 */
class Flickr extends Items {
	/**
	 * Title
	 *
	 * @var string
	 */
	public $title = '';

	/**
	 * Flickr image URL
	 *
	 * @var string
	 */
	public $link = '';

	/**
	 * Media per sizes
	 *
	 * @var array
	 */
	public $media = array(
		'origin' => '',
		'b'      => '',
		'm'      => '',
		's'      => '',
		't'      => '',
	);

	/**
	 * Constructor
	 *
	 * @param      string $name Name of the instance.
	 * @param      ?array $item Flickr response item.
	 * @visibility protected
	 */
	protected function __construct( string $name, ?array $item = null ) {
		parent::__construct( $name );

		if ( ! $item ) {
			return;
		}

		$this->title = $item['title'];
		$this->link  = $item['link'];
		$this->media = array(
			'origin' => str_replace( '_m.', '.', $item['media']['m'] ),
			's'      => str_replace( '_m.', '_s.', $item['media']['m'] ),
			't'      => str_replace( '_m.', '_t.', $item['media']['m'] ),
			'b'      => str_replace( '_m.', '_b.', $item['media']['m'] ),
			'm'      => $item['media']['m'],
		);
	}
}
