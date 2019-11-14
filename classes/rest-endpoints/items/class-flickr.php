<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

class Flickr extends Abstract_Rest_Item_Base {
	public $title = '';
	public $link  = '';
	public $media = array(
		'origin' => '',
		'b'      => '',
		'm'      => '',
		's'      => '',
		't'      => '',
	);

	public $title2 = '';

	public function __construct( array $item ) {
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
