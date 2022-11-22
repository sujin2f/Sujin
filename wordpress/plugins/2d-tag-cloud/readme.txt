=== 2D Tag Cloud ===
Contributors: sujin2f
Donate link: http://www.sujinc.com/donation/
Tags: tag, cloud
Requires at least: 2.8
Tested up to: 4.4
Stable tag: 6.0.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

2D Tag Cloud makes a favulous tag cloud with two visual values: hit and used count.

== Description ==
Is your tag too simple? 2D Tag Cloud helps you improve your tag style.
It makes a tag cloud with two visual values: hit and used count.

For instance, the size represents that how many times the tag have clicked,
and the colour represents how many posts have had the tag.

2D 태그 클라우드는 두가지  기준에 의해 글자의 색상과 크기를 달리해서 태그를 표시하는 플러그인이에요.
많이 클릭된 태그와 많이 포함된 태그, 이 두 가지 기준에 의해 한 태그는 각각 다른 색상과 크기를 가지죠.
어떻게 정렬하는지에 따라 다양한 태그 구름이 형성될 수 있지요 :D
색상과 크기는 어드민에서 지정해주세요~

== Installation ==
= From your WordPress dashboard =
1. Visit 'Plugins > Add New'
2. Search for '2D Tag Cloud'
3. Activate 2D Tag Cloud from your Plugins page.

= From WordPress.org =
1. Download 2D Tag Cloud.
2. Upload the 'two-dimensional-tag-cloud-sujin' directory to your '/wp-content/plugins/' directory, using your favorite method (ftp, sftp, scp, etc...)
3. Activate 2D Tag Cloud from your Plugins page.

= Global Setting =
1. Go to "2D Tag Cloud" under the "Settings"
2. Make your own settings.

= Widget =
1. Go to "Widgets" under the "Appearance" menu
2. Drag "2D Tag Cloud Widget" to the widget holder you want to set

== Shortcode ==
You can use a shortcode to display a tag cloud in your post/page or .php files.
shortcode is [tag2d] you with 4 attributes.

* number : Number of tags (Default : 30)
* separator : Separator between each tags (Default : None)
* set : Name of your Setting (Default : None)
* sort : Order of tags.
 - alphabetical : Alphabetical order
 - 1by1 : Blending most used and most viewed one by one
 - intersection : Blending most and least values one by one

= Note =
At the early stage of applying this plugin, you cannot perceive a property of View step on your tag cloud.
When clicked the tag or displayed the post which has the tag, the View Counts will be increased.

플러그인을 설치하신 딱! 고 당시에는 클릭 수로 설정된 요소(크기나 색상)가 모두 똑같을 거에요. 워드프레스는 포스트의 View를 세거나 하는 기능이 없어요.
많은 사람들이 여러분의 블로그를 방문해서 태그를 클릭하거나 태그가 포함된 포스트를 보면 따로 설정한 카운트가 올라가면서 그 요소가 변경될 거에요~ :)

== Frequently Asked Questions ==

= Will this plugin replace previous tag cloud? =

No. You have to put our widget to your widget holder.

== Screenshots ==

1. **Widget Setting**
2. **Global Setting Page**
3. **Result**

== Changelog ==
= 6.0.2 =
* Fix Some Error

= 6.0.1 =
* Fix Number of Tags Error

= 6.0.0 =
* Tested up to 4.2.2
* Code Reorganizing
* Fix shortcode errors
* Add shortcode metabox

= 5.0 =
* Test with all version of Wordpress; From 2.8 to 3.9
* Fix some errors
* Re-design

= 4.1.1 =
* Fix activation hook

= 4.1 =
* Add Debug Mode. (디버깅 모드를 추가했어요.)
* If you get an error while activate and run this plugin, you activate this Debug mode and send me a screenshot to sujin.2f@gmail.com (플러그인 실행 중 이상이 있다면 스크린샷을 제게 보내주세요)

= 4.0 =
* You can set mouse-over color. (마우스 오버 시 컬러 변화를 설정할 수 있어요)
* If you set mouse-over color, I want you to set padding and border-radius. (마우스 오버 컬러를 설정하시면 패딩하고 보더 래디어스를 설정하시길 바래요)
* You can set text-underline attribute when mouse-over. (마우스 오버 시 언더라인 표시 여부도 설정하실 수 있어요.)

= 3.0.1 =
* Fix bugs that caused with older version of WP. (옛날 버전의 WP에서 나오는 오류를 수정했어요.)

= 3.0 =
* Convert functions to class. It will prevent a duplicate error. (클래스 기반으로 변경했어요. 에러를 없애고 코드를 다이어트 했죠.)
* Support multi-language. (다국어 추가했어요.)

= 2.8 =
* Fix Critical Bug. You MUST Update! (2.7에서 업데이트 해주세요!)
* Add a function, which you can save your setting as separate set. (세팅을 따로 저장할 수 있어요~)

= 2.7 =
* Set style using css file, not a inline-style. So the style in this plugin will ignore global css. (인라인 스타일이 아닌 CSS를 따로 빼서 설정해요. a 태그 같은 경우엔 때론 전역 세팅이 붙기도 해서요.)
* Add Korean to readme.txt file. (readme.txt에 한국어를 추가했어요. 전 참 대단한 애국자에요)
* You can use a shortcode in your post/page or php file. (숏코드를 추가했어요.)

= 2.6 =
* Fix option-saving bug with some system.

= 2.5 =
* Make sort setting on widget section.

= 2.0 =
* Fix some bugs.
* Add more presetting.
* Add line-height and margin setting.
* Change setting view to table shape.
* Add preview.
* Add id and class key of tags. So you can make custom css.
* Make to run at least Wordpress 2.8 version.

= 1.1.1 =
* Fix tag's output style (Add 'display:inline-block', line-height and margin). On next update, I'll put that function on user setting.

= 1.1 =
* Add preset config

= 1.0 =
* Original Version
