<?php
/**
 * Class : JSON Schema Valildator
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema;

use Test_Case;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema;
use org\bovigo\vfs\vfsStream;
use stdClass;

class Unit_Test extends Test_Case {
	public function setUp() {
		parent::setUp();

		$items       = file_get_contents( SJ_PHPUNIT__DIR . '/schema/simple.json' );
		$reference   = file_get_contents( SJ_PHPUNIT__DIR . '/schema/reference.json' );
		$definitions = file_get_contents( SJ_PHPUNIT__DIR . '/schema/definitions.json' );

		$directory = array(
			'schema' => array(
				'simple.json'      => $items,
				'reference.json'   => $reference,
				'definitions.json' => $definitions,
			),
		);

		// setup and cache the virtual file system
		$this->file_system = vfsStream::setup( 'root', 444, $directory );
	}

/*
	public function test_get_schema() {
		$this->object = Schema::load( $this->file_system->url() . '/schema/simple.json' );
		$this->assertEquals( 'simple', $this->object->title );
		$this->assertEquals( array( 'title', 'url', 'number', 'object' ), array_keys( $this->object->properties ) );
	}

	public function test_process_simple_schema() {
		$this->object = Schema::load( $this->file_system->url() . '/schema/simple.json' );
		$object       = new stdClass();

		$object->title  = 'Title';
		$object->url    = 'http://test.com';
		$object->number = '1';
		$object->object = array(
			'child' => 'http://test.com',
		);

		$this->object->process( $object );
		$object = json_decode( wp_json_encode( $object), true );

		$this->assertEquals( 'Title', $object['title'] );
		$this->assertEquals( 'http://test.com', $object['url'] );
		$this->assertEquals( 1, $object['number'] );
		$this->assertEquals( array( 'child' => 'http://test.com' ), $object['object'] );
	}

	public function test_process_definitions_schema() {
		$this->object = Schema::load( $this->file_system->url() . '/schema/definitions.json' );
		$object       = new stdClass();

		$object->title  = 'Title';
		$object->url    = 'http://test.com';
		$object->number = '1';
		$object->object = array(
			'child' => 'http://test.com',
		);

		$this->object->process( $object );
		$object = json_decode( wp_json_encode( $object), true );

		$this->assertEquals( 'Title', $object['title'] );
		$this->assertEquals( 'http://test.com', $object['url'] );
		$this->assertEquals( 1, $object['number'] );
		$this->assertEquals( array( 'child' => 'http://test.com' ), $object['object'] );
	}
*/

	public function test_process_reference_schema() {
		$this->object = Schema::load( $this->file_system->url() . '/schema/reference.json' );

		$object                = new stdClass();
		$object->object        = new stdClass();
		$object->object->child = new stdClass();

		$object->object->child->title  = 'Title';
		$object->object->child->url    = 'http://test.com';
		$object->object->child->number = '1';
		$object->object->child->object = array(
			'child' => 'http://test.com',
		);

		$this->object->process( $object );
		$object = json_decode( wp_json_encode( $object), true );

		$this->assertEquals( 'Title', $object['object']['child']['title'] );
		$this->assertEquals( 'http://test.com', $object['object']['child']['url'] );
		$this->assertEquals( 1, $object['object']['child']['number'] );
		$this->assertEquals( array( 'child' => 'http://test.com' ), $object['object']['child']['object'] );
	}
}
