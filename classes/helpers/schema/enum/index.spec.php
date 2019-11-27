<?php
/**
 * Unit Test of JSON Schema Valildator
 *
 * @package    Sujinc.com
 * @subpackage Enum
 * @author     Sujin 수진 Choi <http://www.sujinc.com/>
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum;

use Test_Case;
use Sujin\Wordpress\Theme\Sujin\Helpers\Schema\Enum;

class Korean_Food extends Enum {
	const 김치  = array( 'kimchi', '김치', 'Korean pickcle' );
	const 떡볶이 = 'Duckbonkki';
}

class Unit_Test extends Test_Case {
	/**
	 * Test instantiation and its comparing functionality
	 */
	public function test_create_and_compare(): void {
		$kimchi = Korean_Food::kimchi();

		switch ( $kimchi->case() ) {
			case Korean_Food::김치:
				$this->assertTrue( true );
				return;
		}

		// Test case()
		$this->assertTrue( false );

		// Test value()
		$this->assertEquals( 'kimchi', $kimchi->value() );
	}
}
