<?php
/**
 * Test data -- Gallery
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

use Sujin\Wordpress\Theme\Sujin\Modifier\Post_Type\Gallery as Post_Type_Gallery;

/**
 * Test data -- Gallery
 */
class Data_Gallery {
	/**
	 * Gallery
	 *
	 * @var WP_Post
	 */
	public $gallery;

	/**
	 * Constructor
	 */
	public function __construct( $factory ) {
		Post_Type_Gallery::get_instance();

		// Create Posts.
		$this->gallery = $factory->post->create_and_get(
			array(
				'post_title'   => '훈민정음',
				'post_content' => '<h2>훈민정음</h2>나랏말싸미 듕귁에 달아 문짜와로 서르 사맛디 아니할쌔 이런젼차로 어린백성이 니르고져 홇배이셔도 마참내 제 뜨들 시러 펴디 몯핧노미 하니라 내 이를 위하야 어엿비 너겨 새로 스믈여듧짱랄 맹가노니 사람마다 해여 수븨 니겨 날로 쑤메 뼌한킈 하고져 핧 싸라미니라',
				'post_type'    => 'gallery',
			)
		);

		$attachment = new Data_Attachment( $factory );

		// Assign Meta
		add_post_meta(
			$this->gallery->ID,
			'photos',
			$attachment->attachment_01->ID
		);
		add_post_meta(
			$this->gallery->ID,
			'photos',
			$attachment->attachment_02->ID
		);

		$this->gallery = get_post( $this->gallery->ID );
	}
}
