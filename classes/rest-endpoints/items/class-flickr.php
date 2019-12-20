<?php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

class Flickr extends Items {
	public $title = '';
	public $link  = '';
	public $media = array(
		'origin' => '',
		'b'      => '',
		'm'      => '',
		's'      => '',
		't'      => '',
	);

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
