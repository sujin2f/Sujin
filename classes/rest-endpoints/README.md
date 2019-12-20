# Rest API

## Item
Item contains the validator, so just declare a constructor and schema. `json_decode( wp_json_encode( $item_instance ), true )` will return validated array for the response.

classes/rest-endpoints/items/class-sample-item.php
```php
namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

class Sample_Item extends Abstract_Rest_Item_Base {
	public $title = '';
	public $link  = '';

	public function __construct( array $item ) {
		$this->title = $item['title'];
		$this->link  = $item['link'];
	}
}
```

schema/rest-response/items/class-sample-item.json
```json
{
  "$schema": "http://json-schema.org/schema#",
  "title": "sample item",
  "type": "object",
  "properties": {
    "title": {
      "description": "The title of the photo.",
      "type": "string",
      "readonly": true
    },
    "link": {
      "description": "Flickr URL for the image",
      "type": "string",
      "format": "uri",
      "readonly": true
    }
  }
}
```
