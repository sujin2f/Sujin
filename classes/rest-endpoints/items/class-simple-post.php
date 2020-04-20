<?php
/**
	* Post Item
	*
	* @project Sujinc.com
	* @since   9.0.0
	* @author  Sujin 수진 Choi http://www.sujinc.com/
*/

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use Sujin\Wordpress\WP_Express\Fields\Post_Meta\{Attachment, Input, Checkbox};

use Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;
use WP_Post;

class Simple_Post extends Items {
	public $id;
	public $slug;
	public $excerpt;
	public $date;
	public $link;
	public $title;
	public $meta      = array();
	public $thumbnail = array();
	public $tags      = array();

	private const BREAKS      = array( '<br />', '<br/>', '<br>', '&lt;br /&gt;', '&lt;br/&gt;', '&lt;br&gt;' );
	protected const ITEM_NAME = 'simple-post';

	/**
	 * Create MenuItem from WP_Post
	*/
	public function __construct( WP_Post $post ) {
		$this->id    = $post->ID;
		$this->date  = $post->post_date;
		$this->link  = get_permalink( $post );
		$this->title = $post->post_title;
		$this->slug  = $post->post_name;

		// Excerpt
		$this->excerpt = str_replace( self::BREAKS, "\r\n\r\n", $post->post_excerpt );
		$this->excerpt = wpautop( $this->excerpt );

		// Tags
		$this->tags = wp_get_post_tags( $post->ID );
		foreach ( array_keys( $this->tags ) as $key ) {
			$this->tags[ $key ] = new Tag( $this->tags[ $key ] );
		}

		$list       = Attachment::get_instance( 'List' )->get( $post->ID ) ?? -1;
		$icon       = Attachment::get_instance( 'Icon' )->get( $post->ID ) ?? -1;
		$title      = Attachment::get_instance( 'Title' )->get( $post->ID ) ?? -1;
		$background = Attachment::get_instance( 'Background' )->get( $post->ID ) ?? -1;
		$thumbnail  = Attachment::get_instance( 'Thumbnail' )->get( $post->ID ) ?? -1;

		$this->meta = array(
			'list'               => new Images( $list ),
			'icon'               => new Images( $icon ),
			'title'              => new Images( $title ),
			'background'         => new Images( $background ),
			'thumbnail'          => new Images( $thumbnail ),
			'useBackgroundColor' => Checkbox::get_instance( 'Use Background Color' )->get( $post->ID ) ?? false,
			'backgroundColor'    => Input::get_instance( 'Background Color' )->get( $post->ID ) ?? '',
		);

		$this->thumbnail = new Images( get_post_thumbnail_id( $post->ID ) ?? -1 );
	}
}
