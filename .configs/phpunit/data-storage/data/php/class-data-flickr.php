<?php
/**
 * Test data -- Taxonomy
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

/**
 * Test data -- Taxonomy
 */
class Data_Flickr {
	/**
	 * Title
	 *
	 * @var string
	 */
	public $title;

	/**
	 * Link
	 *
	 * @var string
	 */
	public $link;

	/**
	 * Description
	 *
	 * @var string
	 */
	public $description;

	/**
	 * Modified
	 *
	 * @var string
	 */
	public $modified;

	/**
	 * Generator
	 *
	 * @var string
	 */
	public $generator;

	/**
	 * Items
	 *
	 * @var array
	 */
	public $items;

	/**
	 * Constructor
	 */
	public function __construct() {
		$json = file_get_contents( SJ_PHPUNIT__DIR . '/data-storage/data/json/flickr.json' );
		$json = json_decode( $json, true );

		$this->title       = $json['title'];
		$this->link        = $json['link'];
		$this->description = $json['description'];
		$this->modified    = $json['modified'];
		$this->generator   = $json['generator'];
		$this->items       = $json['items'];
	}
}
