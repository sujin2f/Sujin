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

use WP_Post;

class Simple_Post extends Abstract_Rest_Item {
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

		$list       = Attachment::get_instance( 'List' )->get( $post->ID );
		$icon       = Attachment::get_instance( 'Icon' )->get( $post->ID );
		$title      = Attachment::get_instance( 'Title' )->get( $post->ID );
		$background = Attachment::get_instance( 'Background' )->get( $post->ID );
		$thumbnail  = Attachment::get_instance( 'Thumbnail' )->get( $post->ID );

		$this->meta = array(
			'list'               => $list ? new Images( $list ) : array(),
			'icon'               => $icon ? new Images( $icon ) : array(),
			'title'              => $title ? new Images( $title ) : array(),
			'background'         => $background ? new Images( $background ) : array(),
			'thumbnail'          => $thumbnail ? new Images( $thumbnail ) : array(),
			'useBackgroundColor' => Checkbox::get_instance( 'Use Background Color' )->get( $post->ID ),
			'backgroundColor'    => Input::get_instance( 'Background Color' )->get( $post->ID ),
		);

		$this->thumbnail = get_post_thumbnail_id( $post->ID ) ? new Images( get_post_thumbnail_id( $post->ID ) ) : array();
	}
}
