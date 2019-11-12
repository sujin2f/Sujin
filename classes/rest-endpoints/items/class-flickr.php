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

	public function __construct( array $item ) {
		$properties = self::get_item_properties();

		$this->title = $this->cast_type( $properties['title']['type'], $item['title'] );
		$this->link  = $this->cast_type( $properties['link']['type'], $item['link'] );
		$this->media = array(
			'origin' => str_replace( '_m.', '.', $item['media']['m'] ),
			's'      => str_replace( '_m.', '_s.', $item['media']['m'] ),
			't'      => str_replace( '_m.', '_t.', $item['media']['m'] ),
			'b'      => str_replace( '_m.', '_b.', $item['media']['m'] ),
			'm'      => $item['media']['m'],
		);
		$this->media = $this->cast_type( $properties['media']['type'], $this->media );
	}

	public static function get_item_schema(): array {
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'flickr',
			'type'       => 'object',
			'properties' => array(
				'title' => array(
					'description' => 'The title of the photo.',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'link'  => array(
					'description' => 'Flickr URL for the image',
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'media' => array(
					'description' => 'Image URLs',
					'type'        => 'array',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
			),
		);
	}
}
