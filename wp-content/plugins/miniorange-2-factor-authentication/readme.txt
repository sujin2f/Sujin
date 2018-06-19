=== Google Authenticator - Two Factor Authentication (2FA) ===
Contributors: cyberlord92
Donate link: https://miniorange.com/
Tags: google authenticator, two factor authentication, two factor, 2FA, 2 factor authentication, two step verification, 1 google authenticator, login, authy, authy two factor, Clef, 2 Factor, yubico, Two-Factor Authentication, Mobile Authentication, otp, strong authentication, 2 step authentication, smartphone authentication, Multifactor authentication, multi factor authentication, multi factor, no password, passwordless login, security, website security, one time passcode, password, soft token, woocommerce, authenticate, two factor auth, two-factor, duo, QR Code, QR Code Authentication, scan QR Code, wordfence, login security, google authenticator, google , email verification, trusted device, device Id , KBA , knowledge based authentication
Requires at least: 3.0.1
Tested up to: 4.9.4
Requires PHP: 5.3.0
Stable tag: 5.0.9
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Google Authenticator and Best Enterprise Grade Two Factor Authentication (2FA). Supports Google Authenticator, QR Code, Push Notification, Soft Token and Security Questions(KBA) for Unlimited Users in the free version of the plugin.

== Description ==

Secure your Wordpress login with an additional layer of security from us! The setup takes minutes, yet protects your site forever!

This plugin provides two factor authentication during login. If you are looking for OTP Verification of users during <b>Registration</b> then we have a separate plugin for this. <a href="https://wordpress.org/plugins/miniorange-otp-verification/"> Click Here </a> to learn more.

<h4>Free Plugin Features</h4>

* 2FA for **1 User** forever
* **Available Authentication Methods:** Google Authenticator, QR Code, Push Notification, Soft Token and Security Questions(KBA)
* Language Translation Support

<h4>Standard Plugin Features</h4>

* 2FA for Users as per the upgrade *( User-based pricing )*
* **Available Authentication Methods:** Google Authenticator, QR Code, Push Notification, Soft Token, Security Questions(KBA), Authy Authenticator, OTP Over Email, OTP Over SMS, OTP Over SMS and Email, Email Verification. *( SMS and Email credits need to be purchased as per the need)*
* Language Translation Support
* **Multiple Login Options:** Username + password + two-factor (or) Username + two-factor
* **Backup Method:** KBA(Security Questions)
* Multi-Site Support
* User role based redirection after Login, Custom Security Questions (KBA), Customize account name in Google Authenticator app

<h4>Premium Plugin Features</h4>

* 2FA for Users as per the upgrade *( User-based pricing )*
* **Available Authentication Methods:** Google Authenticator, QR Code, Push Notification, Soft Token, Security Questions(KBA), Authy Authenticator, OTP Over Email, OTP Over SMS, OTP Over SMS and Email, Email Verification, Hardware Token. *( SMS and Email credits need to be purchased as per the need)*
* Language Translation Support
* **Multiple Login Options:** Username + password + two-factor (or) Username + two-factor
* **Backup Methods:** KBA(Security Questions), OTP Over Email, Backup Codes
* Multi-Site Support
* Email notification to users asking them to set up 2FA.
* User role based redirection after Login, Custom Security Questions (KBA), Customize account name in Google Authenticator app.
* Enable 2FA for specific Users/User Roles
* Choose specific authentication methods for Users
* App Specific Password to login from mobile Apps
* **Add-Ons Included:** RBA & Trusted Devices Management Add-on, Personalization Add-on and Short Codes Add-on

<h4>Add Ons [Free and Standard Plans, Inclusive in the Premium Plan]</h4>

* **RBA & Trusted Devices Management Add-on Features **
 * Remember Device
 * Set Device Limit for the users to login
 * IP Restriction: Limit users to login from specific IPs
* **Personalization Add-on Features **
 * Custom UI of 2FA popups
 * Custom Email and SMS Templates
 * Customize 'powered by' Logo
 * Customize Plugin Icon
 * Customize Plugin Name
 * Add Recaptcha on Login Page
* **Short Codes Add-on Features **
 * Option to turn on/off 2-factor by user
 * Option to configure the Google Authenticator and Security Questions by user
 * Option to 'Enable Remember Device' from a custom login form
 * On-Demand ShortCodes for specific fuctionalities ( like for enabling 2FA for specific pages)

<h4>Apps Supported by the plugin:</h4>
* miniOrange Authenticator App.
* Google Authenticator App.
* Authy 2-Factor Authentication App [STANDARD / PREMIUM FEATURE]

Customized solutions and Active support is available. Email us at info@miniorange.com or call us at +1 9786589387.

== Installation ==

= From your WordPress dashboard =
1. Navigate to `Plugins > Add New` from your WP Admin dashboard.
2. Search for `miniOrange 2 Factor Authentication`.
3. Install `miniOrange 2 Factor Authentication` and Activate the plugin.

= From WordPress.org =
1. Search for `miniOrange 2 Factor Authentication` and download it.
2. Unzip and upload the `miniorange-2-factor-authentication` directory to your `/wp-content/plugins/` directory.
3. Activate miniOrange 2 Factor Authentication from the Plugins tab of your admin dashboard.

= Once Activated =
1. Select miniOrange 2-Factor from the left menu and follow the instructions.
2. Once, you complete your setup. Click on Log Out button.
3. Enter the username and password. After the initial validation, you will be prompted for the 2-factor method you had set up.
4. Validate yourself with the 2-factor authentication method you configured.

== Frequently Asked Questions ==

= How do I gain access to my website if I get locked out? =

You can obtain access to your website by one of the below options:

1. If you have an additional administrator account whose Two Factor is not enabled yet, you can login with it.
2. If you had setup KBA questions earlier, you can use them as an alternate method to login to your website.
3. Rename the plugin from FTP - this disables the 2FA plugin and you will be able to login with your Wordpress username and password.
4. Go to WordPress Database. Select wp_options, search for mo2f_activate_plugin key and update its value to 0. Two Factor will get disabled.

= I want to enable Two-Factor( 2FA ) role wise ? =

You can select the roles under Login Settings tab to enable the plugin role wise.	[PREMIUM FEATURE]

= I have enabled Two-Factor(2FA) for all users, what happens if an end user tries to login but has not yet registered ? =

If a user has not setup Two-Factor yet, user has to register by inline registration that will be invoked during the login.

= I want to enable only one authentication method for my users. What shloud I do? =

You can select the authentication methods under Login Settings tab. The selected authentication methods will be shown to the user during inline registration. [PREMIUM FEATURE]

= I am getting the fatal error of call to undefined function json_last_error(). What should I do? =

Please check your php version. The plugin is supported in php version 5.3.0 or above. You need to upgrade your php version to 5.3.0 or above to use the plugin.

= I did not recieve OTP while trying to register with miniOrange. What should I do? =

The OTP is sent to your email address with which you have registered with miniOrange. If you can't see the email from miniOrange in your mails, please make sure to check your SPAM folder. If you don't see an email even in SPAM folder, please submit a query in our Support Section in the plugin or you can contact us at info@miniorange.com.

= I want to configure 2nd factor by Google Authenticator. =

Select the radio button next to Google Authenticator/Authy App and select the phone type and then scan the QR Code by Google Authenticator App. Enter the 6 digit code in the textbox and click on Save and verify buuton.

= I want to configure 2nd factor by Authy 2-Factor Authentication App. =

Select the radio button next to Google Authenticator/Authy App and select the phone type and then scan the QR Code by Authy 2-Factor Authentication App. Enter the 6 digit code from the Authy App into the textbox available and click on Save and Verifiy button.

= I forgot the password of my miniOrange account. How can I reset it? =

There are two cases according to the page you see -<br>
 1. Login with miniOrange screen: You should click on forgot password link. You will get a new password on your email address with which you have registered with miniOrange . Now you can login with the new password.

 2. Register with miniOrange screen: Enter your email ID and any random password in password and confirm password input box. This will redirect you to Login with miniOrange screen. Now follow first step.

= I have a custom / front-end login page on my site and I want the look and feel to remain the same when I add 2 factor ? =

If you have a custom login form other than wp-login.php then we will provide you the shortcode. Shortcode will work only for the customized login page created from wordpress plugins. We are not claiming that it will work with all the customized login page. In such case, custom work is needed to integrate two factor with your customized login page. You can submit a query in our <b>Support Section</b> in the plugin or you can contact us at info@miniorange.com for more details.

= I have Woocommerce theme login page on my site. How can I enable Two Factor ? =

If you have Woocommerce theme login then go to Advanced Options Tab and check Enable Two-Factor for Woocommerce Front End Login. If you need any help setting up 2-Factor for your Woocommerce theme login form, please submit a query in our Support Section in the plugin or you can contact us at info@miniorange.com.

= I have installed plugins which limit the login attempts like Limit Login Attempt, Loginizer, Wordfence etc. Is there any incompatibilities with these kind of plugins? =

The limit login attempt kind of plugins limit the number of login attempts and block the IP temporarily. So if you are using 2 factor along with these kind of plugins then you should increase the login attempts (minimum 5) so that you dont get locked out yourself.

= If you are using any Security Plugin in WordPress like Simple Security Firewall, All in One WP Security Plugin and you are not able to login with Two-Factor. =

 Our Two-Factor plugin is compatible with most of the security plugins, but if it is not working for you. Please submit a query in our Support Section in the plugin or you can contact us at info@miniorange.com.

= If you are using any render blocking javascript and css plugin like Async JS and CSS Plugin and you are not able to login with Two-Factor or your screen got blank. =

If you are using Async JS and CSS Plugin. Please go to its settings and add jquery in the list of exceptions and save settings. It will work. If you are still not able to get it right, Please submit a query in our Support Section in the plugin or you can contact us at info@miniorange.com.

= My users have different types of phones. What phones are supported? =

We support all types of phones. Smart Phones, Basic Phones, Landlines, etc. Go to Setup Two-Factor Tab and select Two-Factor method of your choice from a range of 8 different options.

= What if a user does not have a smart phone? =

You can select OTP over SMS, Phone Call Verification or Email Verification as your Two-Factor method. All these methods are supported on basic phones.

= What if a user does not have any phone? =

You can select Email Verification or Security Questions (KBA) as your Two-Factor method.

= What if I am trying to login from my phone ? =

If your Security Questions (KBA) are configured then you will be asked to answer them when you are logging in from your phone.

= I want to hide default login form and just want to show login with phone? =

You should go to <b>Login Settings Tab</b> and check <b>Login with Phone Only</b> checkbox to hide the default login form.


= My phone has no internet connectivity and configured 2nd factor with miniOrange App, how can I login? =

You can login using our alternate login method. Please follow below steps to login:

* Enter your username and click on login with your phone.
* Click on <b>Phone is Offline?</b> button below QR Code.
* You will see a textbox to enter one time passcode.
* Open miniOrange Authenticator App and Go to Soft Token Tab.
* Enter the one time passcode shown in miniOrange Authenticator App in textbox, just like google authenticator.
* Click on submit button to validate the otp.
* Once you are authenticated, you will be logged in.

= My phone is lost, stolen or discharged. How can I login? =

You can login using our alternate login method. Click on the Forgot Phone link and you will get 2 alternate methods to login. Select "Send a one time passcode to my registered email" to authenticate by OTP over EMAIL or Select "Answer your Security Questions (KBA)" to authenticate by knowledge based authenticaion.

= My phone has no internet connectivity and i am entering the one time passcode from miniOrange Authenticator App, it says Invalid OTP? =

Click on the <b>Settings Icon</b> on top right corner in <b>miniOrange Authenticator App</b> and then press <b>Sync button</b> under 'Time correction for codes' to sync your time with miniOrange Servers. If you still can't logged in then please email us at info@miniorange.com or <a href="https://miniorange.com/contact" target="_blank">Contact us</a>.Soft Token method is just like google authenticator method.

= I want to go back to default login with password? =

You should go to <b>Login Settings Tab</b> and uncheck <b>Enable Two-Factor plugin</b> checkbox. This will disable 2-Factor and you can login using wordpress default login.

= I am upgrading my phone. =

You should go to <b>Setup Two Factor</b> Tab and click on <b>Reconfigure</b> to reconfigure 2-Factor with your new phone.

= What If I want to use any other second factor like OTP Over SMS, Security Questions, Device Id, etc ? =

miniOrange authentication service has 15+ authentication methods.One time passcodes (OTP) over SMS, OTP over Email, OTP over SMS and Email, Out of Band SMS, Out of Band Email, Soft Token, Push Notification, USB based Hardware token (yubico), Security Questions, Mobile Authentication (QR Code Authentication), Voice Authentication (Biometrics), Phone Verification, Device Identification, Location, Time of Access User Behavior. To know more about authentication methods, please visit <a href="https://miniorange.com/strong_auth" target="_blank">https://miniorange.com/strong_auth </a>. If you want to have any other 2-factor for your WordPress site, please email us at info@miniorange.com or <a href="https://miniorange.com/contact" target="_blank">Contact us</a>.

== Screenshots ==

1. Setup different 2-Factor methods.
2. Enable or Disable 2-factor for Users.
3. 2 Factor Authentication prompt during Login.

== Changelog ==

= 5.0.9 =
* Google Authenticator (2FA) : Bug Fix for "The loopback request to your site failed." error.

= 5.0.8 =
* Google Authenticator (2FA) : Changes for 2FA Free plugin for 1 user forever.

= 5.0.7 =
* Google Authenticator (2FA) : Bug Fix for User Registration and other plugin conflicts in Dashboard.

= 5.0.6 =
* Google Authenticator (2FA) : Bug Fix for existing customers who upgraded from 4.5.x version to versions between 5.0.0 and 5.0.4 and are facing issues with the Account Setup Tab.

= 5.0.5 =
* Google Authenticator (2FA) : Bug fix for user entry during plugin update.

= 5.0.4 =
* Google Authenticator (2FA) : Workaround for errors during sending of OTP during registration.

= 5.0.3 =
* Google Authenticator (2FA) : Minor fix for removing warings.

= 5.0.2 =
* Google Authenticator (2FA) : Bug fix.

= 5.0.1 =
* Google Authenticator (2FA) : Bug fix.

= 5.0.0 =
* Google Authenticator (2FA) : New UI Interface, 2-factor authentication for Unlimited Users.
* This is a major release.

= 4.6.2 =
* Google Authenticator (2FA) : Plugin registration fixes and minor warning fixes.

= 4.6.1 =
* Google Authenticator (2FA) : Login error fix. Please skip version 4.5.9 and update to version 4.6.1

= 4.5.9 =
* Google Authenticator (2FA) : Bug fixes for customers who were getting redirected to the login page after the two factor authentication.

= 4.5.8 =
* Google Authenticator (2FA) : Tested upto 4.9.4 and Removed External links.

= 4.5.7 =
* Google Authenticator (2FA) : Minor bug fixes.

= 4.5.6 =
* Google Authenticator (2FA) : Tested upto Wordpress 4.9.

= 4.5.5 =
* Google Authenticator (2FA) : 404 bug fixes.

= 4.5.4 =
* Google Authenticator (2FA) : Better UI of Login Pages, Fixed Redirection issue. Fixed the error in the last version (4.5.3) for the customers who were getting undefined action error.

= 4.5.3 =
* Google Authenticator (2FA) : Changed UI of the Login Pages, Redirect to Login Page bug fixes.

= 4.5.2 =
* Google Authenticator (2FA) : Readme Update: Description Update

= 4.5.1 =
* Google Authenticator (2FA) : Updated the new Authenticator App's link and the 'How to Setup Tab' tab.

= 4.5.0 =
* Google Authenticator (2FA) : Fix Google Authenticator configuration issue.

= 4.4.9 =
* Google Authenticator (2FA) : Added Alert Message for SMS Transactions only when authentication method is OTP over SMS.

= 4.4.8 =
* Google Authenticator (2FA) : Added Alert Message for SMS Transactions. Fixed Remember Device flow and confliction with themes. Added support for multiple instances of wordpress.

= 4.4.7 =
* Google Authenticator (2FA) : Updated the error message for 2-factor configuration.

= 4.4.6 =
* Google Authenticator (2FA) : Instructions for login in case user get locked out.


= 4.4.5 =
* Google Authenticator (2FA) : Fixed the issue of session variable on the login with username page.

= 4.4.4 =
* Google Authenticator (2FA) : Added alert messages for OTP over SMS usages.

= 4.4.3 =
* Google Authenticator (2FA) : Fixed the login flow for third party Apps that supports XML-RPC.

= 4.4 =
* Google Authenticator (2FA):
* Compatibility with Limit Login Attempts.
* New User Interface for login.

= 4.3.1 =
* Google Authenticator (Two Factor): Compatible upto 4.7

= 4.3.0 =
* Google Authenticator (Two Factor): Updated miniOrange APIs.

= 4.2.9 =
* Google Authenticator (Two Factor): Tested upto WordPress 4.6.

= 4.2.7 =
* Google Authenticator (Two Factor): Session Warnig fix in the last version for some of the users.

= 4.2.6 =
* Google Authenticator (Two Factor): Compatible with wordpress caching.

= 4.2.5 =
* Google Authenticator (Two Factor): Improved the session handler.

= 4.2.4 =
* Google Authenticator (Two Factor): Updated faq for limit login attempt type of plugins.

= 4.2.3 =
* Google Authenticator Two Factor Auth ( 2FA ):
* Improved Error handling during Account Creation.

= 4.2.2 =
* Google Authenticator Two Factor Auth ( 2FA ):
* Registration Flow fixes

= 4.2.1 =
* Google Authenticator Two Factor Auth ( 2FA ):
* Change of status during login with phone flow and tested with WP 4.5

= 4.2.0 =
* Google Authenticator Two Factor Auth ( 2FA ):
* Mark as tested on Wordpress 4.5

= 4.1.8 =
* Google Authenticator Two Factor Auth ( 2FA ):
* Changed the location of images used for demo. Now being loaded from the site having SSL certificate.

= 4.1.7 =
* Google Authenticator Two Factor Auth ( 2FA ):
* Improved Error Handling for Remember Device.

= 4.1.6 =
* Google Authenticator Two Factor Auth ( 2FA ):
* Licensing Plan Updated.

= 4.1.5 =
* Google Authenticator Two Factor Auth ( 2FA ):
* Added Forgot Password functionality for miniOrange customer admin.
* Added warning message for the users who are using lower version of php.
* Added functionlity to change the customer email.

= 4.1.4 =
* Google Authenticator Two Factor Auth ( 2FA ):
* Added an option for admin to enable or disable login for XML-RPC supported applications.

= 4.1.3 =
* Google Authenticator Two Factor Auth ( 2FA ):
* Fixed CSS Conflict with the plugins in the admin dashboard.
* More intuitive UI for woocommerce login.
* Tested front-end login with themes like wordpress default theme,
  customizr theme,zerif-lite theme,accesspress store theme,ishop theme and many more.

= 4.1.2 =
* Google Authenticator Two Factor Auth ( 2FA ): Google Authenticator for Windows phone
* Fixed CSS conflict with front-end of site if woocommerce is not enabled.

= 4.1.1 =
* Google Authenticator Two Factor Auth ( 2FA ): Adding Validation in choosing Security Questions (KBA).

= 4.1.0 =
* Google Authenticator Two Factor Auth ( 2FA ): Features added.
  multisite support
  Custom login redirection
  Authy 2-Factor Authentication as separate authentication method

= 4.0.5 = Login into third party apps which support XML-RPC.

= 4.0.4 = Added a check of KBA configuration from mobile login.

= 4.0.3 = Added Support for Authy 2-Factor Authentication App.

= 4.0.2 = Added a check for selection of unique questions during KBA setup.

= 4.0.1 = Bug Fix

= 4.0 =
* Two Factor Auth ( 2FA ): Features added.
* KBA as backup method.
* mobile browser support.
* more intuitive UI for woocommerce login.

= 3.8 =
* Two Factor Auth ( 2FA ): Bug Fix.

= 3.7 =
* Two Factor Auth ( 2FA ): Activation of two factor role wise.

= 3.6 =
* Two Factor Auth ( 2FA ): email verification in inline registration flow for all users.
More descriptive setup messages and UI changes.

= 3.5 =
* Two Factor Auth ( 2FA ): Provided mobile login support.

= 3.4 =
* Two Factor Auth ( 2FA ): Features added
* Inline registration flow for users.
* Security Questions (KBA) as additional method
* Alternate way of user identification in customer creation.
* premium customizable features.

= 3.3 =
* Two Factor Auth ( 2FA ): Fix the issue of session for some versions of php.

= 3.2 =
* Two Factor Auth ( 2FA ): Fix for device-id compatibility.

= 3.1 =
* Two Factor Auth ( 2FA ): Fix for 2FA ShortCode.

= 3.0 =
* Two Factor Auth ( 2FA ): Features added
* Google Authenticator.
* Device Id (Remember device).
* Choice given to admin to enable specific authentication methods for users.
* Two Factor support for woocommerce theme.
* Short Code for various customized frontend login.
* More intuitive UI and descriptive instructions.

= 2.6 =
* Two Factor Auth ( 2FA ): Fix the compatibility issues of user session with other security plugins.

= 2.5 =
* Two Factor Auth ( 2FA ): Fix the compatibility issues with All In One WP Security & Firewall plugin.

= 2.4 =
* Two Factor Auth ( 2FA ): UI fixes for admin media library dashboard.

= 2.3 =
* Two Factor Auth ( 2FA ): More descriptive setup messages, more intuitive UI.

= 2.2 =
* Two Factor Auth ( 2FA ): Fixed css issues for existing users

= 2.1 =
* Two Factor Auth ( 2FA ): Added support for multiple Two Factor Choices like OTP Over SMS, Phone Call Verification, Push Notification, Soft Token (like Google Authenticator Code), Email Verification, etc.

= 2.0 =
* Two Factor Auth ( 2FA ): Added login with password plus second factor feature.

= 1.8 =
* Two Factor Auth ( 2FA ): Added feature of different login form choice,test authentication and help for configuration and setup.

= 1.7 =
* Bug Fixes Two Factor Auth ( 2FA ): Modifying login screen adaptable to user's login form

= 1.6 =
* Bug Fixes Two Factor Auth ( 2FA ): fetching 2 factor configuration when activating the plugin after deactivating it.

= 1.5 =
* Bug Fixes Two Factor Auth ( 2FA ): Login issues and password save issues resolved

= 1.4 =
* Bug Fixes Two Factor Auth ( 2FA ): Authentication was not working on some version of php.

= 1.3 =
* Bug Fixes

= 1.2 =
* Two Factor Auth ( 2FA ): Added 2 factor for all users along with forgot phone functionality.

= 1.1 =
* Two Factor Auth ( 2FA ): Added email ID verification during registration.

= 1.0.0 =
* First version of Two Factor Auth ( 2FA ) plugin supported with mobile auhthentication for admin only.

== Upgrade Notice ==

= 5.0.9 =
* Google Authenticator (2FA) : Bug Fix for "The loopback request to your site failed." error.

= 5.0.8 =
* Google Authenticator (2FA) : Changes for 2FA Free plugin for 1 user forever.

= 5.0.7 =
* Google Authenticator (2FA) : Bug Fix for User Registration and other plugin conflicts in Dashboard.

= 5.0.6 =
* Google Authenticator (2FA) : Bug Fix for existing customers who upgraded from 4.5.x version to versions between 5.0.0 and 5.0.4 and are facing issues with the Account Setup Tab.

= 5.0.5 =
* Google Authenticator (2FA) : Bug fix for user entry during plugin update.

= 5.0.4 =
* Google Authenticator (2FA) : Workaround for errors during sending of OTP during registration.

= 5.0.3 =
* Google Authenticator (2FA) : Minor fix for removing warings.

= 5.0.2 =
* Google Authenticator (2FA) : Bug fix.

= 5.0.1 =
* Google Authenticator (2FA) : Bug fix.

= 5.0.0 =
* Google Authenticator (2FA) : New UI Interface, 2-factor authentication for Unlimited Users.
* This is a major release.

= 4.6.2 =
* Google Authenticator (2FA) : Plugin registration fixes and minor warning fixes.

= 4.6.1 =
* Google Authenticator (2FA) : Login error fix. Please skip version 4.5.9 and update to version 4.6.1

= 4.5.9 =
* Google Authenticator (2FA) : Bug fixes for customers who were getting redirected to the login page after the two factor authentication.

= 4.5.8 =
* Google Authenticator (2FA) : Tested upto 4.9.4 and Removed External links.

= 4.5.7 =
* Google Authenticator (2FA) : Minor bug fixes.

= 4.5.6 =
* Google Authenticator (2FA) : Tested upto Wordpress 4.9.

= 4.5.5 =
* Google Authenticator (2FA) : 404 bug fixes.

= 4.5.4 =
* Google Authenticator (2FA) : Better UI of Login Pages, Fixed Redirection issue. Fixed the error in the last version (4.5.3) for the customers who were getting undefined action error.

= 4.4.3 =
* Google Authenticator (2FA) : Fixed the login flow for third party Apps that supports XML-RPC.

= 4.4 =
* Google Authenticator (2FA): 
* Note: This is very important update having altogether new UI and compatibility with Limit Login Attempts. After updating, please do not logout from your admin dashboard. Try to login from another browser and if you face any issue , please contact us at info@miniorange.com
* Compatibility with Limit Login Attempts.
* New User Interface for login.

= 4.3.2 =
* Google Authenticator (Two Factor): Revised licensing cost for users.

= 4.3.1 =
* Google Authenticator (Two Factor): Compatible upto 4.7

= 4.3.0 =
* Google Authenticator (Two Factor): Updated miniOrange APIs.

= 4.2.9 =
* Google Authenticator (Two Factor): Tested upto WordPress 4.6.

= 4.2.7 =
* Google Authenticator (Two Factor): Session Warnig fix in the last version for some of the users.

= 4.2.6 =
* Google Authenticator (Two Factor): Compatible with wordpress caching.

= 4.2.5 =
* Google Authenticator (Two Factor): Improved the session handler.

= 4.2.4 =
* Google Authenticator (Two Factor): Updated faq for limit login attempt type of plugins.

= 4.2.3 =
* Two Factor Auth ( 2FA ):
* Improved Error handling during Account Creation.

= 4.2.2 =
* Two Factor Auth ( 2FA ):
* Registration Flow fixes

= 4.2.1 =
* Two Factor Auth ( 2FA ):
* Change of status during login with phone flow and tested with WP 4.5

= 4.2.0 =
* Two Factor Auth ( 2FA ):
* Mark as tested on Wordpress 4.5

= 4.1.8 = 
* Two Factor Auth ( 2FA ):
* Changed the location of images used for demo. Now being loaded from the site having SSL certificate.

= 4.1.7 = 
* Two Factor Auth ( 2FA ):
* Improved Error Handling for Remember Device.

= 4.1.6 = 
* Two Factor Auth ( 2FA ):
* Licensing Plan Updated.

= 4.1.5 = 
* Two Factor Auth ( 2FA ):
* Added Forgot Password functionality for miniOrange customer admin.
* Added warning message for the users who are using lower version of php.
* Added functionlity to change the customer email.

= 4.1.4 = 
* Two Factor Auth ( 2FA ):
* Added an option for admin to enable or disable login for XML-RPC supported applications.

= 4.1.3 =
* Two Factor Auth ( 2FA ): 
* Fixed CSS Conflict with the plugins in the admin dashboard. 
* More intuitive UI for woocommerce login.
* Tested front-end login with themes like wordpress default theme,
  customizr theme,zerif-lite theme,accesspress store theme,ishop theme and many more.

= 4.1.2 =
* Two Factor Auth ( 2FA ): Google Authenticator for Windows phone
* Fixed CSS conflict with front-end of site if woocommerce is not enabled.

= 4.1.1 =
* Two Factor Auth ( 2FA ): Adding Validation in choosing Security Questions (KBA).

= 4.1.0 = 
* Two Factor Auth ( 2FA ): Features added.
  multisite support 
  Custom login redirection
  Authy 2-Factor Authentication as separate authentication method

= 4.0.6 = Added multisite support and custom redirection after login feature.

= 4.0.5 = Login into third party apps which support XML-RPC.

= 4.0.4 = Added a check of KBA configuration from mobile login.

= 4.0.3 = Added Support for Authy 2-Factor Authentication App.

= 4.0.2 = Added a check for selection of unique questions during KBA setup.

= 4.0.1 = Bug Fix

= 4.0 =
* Two Factor Auth ( 2FA ): Features added.
* KBA as backup method.
* mobile browser support.
* more intuitive UI for woocommerce login.

= 3.8 =
* Two Factor Auth ( 2FA ): Bug Fix for roles.

= 3.7 =
* Two Factor Auth ( 2FA ): Activation of two factor role wise.

= 3.6 =
* Two Factor ( 2FA ): email verification in inline registration flow for all users.
More descriptive setup messages and UI changes.

= 3.5 =
* Two Factor ( 2FA ): Provided mobile login support.

= 3.4 =
* Two Factor ( 2FA ): Features added
* Inline registration flow for users.
* Security Questions (KBA) as additional method
* Alternate way of user identification in customer creation.
* premium customizable features.

= 3.3 =
* Two Factor ( 2FA ): Fix the issue of session for some versions of php.

= 3.2 =
* Two Factor ( 2FA ): Fix for device-id compatibility.

= 3.1 =
* Two Factor ( 2FA ): Fix for 2FA ShortCode.

= 3.0 =
* Two Factor ( 2FA ): Features added 
* Google Authenticator.
* Device Id (Remember device).
* Choice given to admin to enable specific authentication methods for users.
* Two Factor support for woocommerce theme.
* Short Code for various customized frontend login. 
* More intuitive UI and descriptive instructions.

= 2.6 =
* Two Factor ( 2FA ): Fix the compatibility issues of user session with other security plugins.

= 2.5 =
* Two Factor ( 2FA ): Fix the compatibility issues with All In One WP Security & Firewall plugin.

= 2.4 =
* Two Factor ( 2FA ): UI fixes for admin media library dashboard.

= 2.3 =
* Two Factor ( 2FA ): More descriptive setup messages, more intuitive UI.

= 2.2 =
* Two Factor ( 2FA ): Fixed css issues for existing users

= 2.1 =
* Two Factor ( 2FA ): Added support for multiple Two Factor Choices like OTP Over SMS, Phone Call Verification, Push Notification, Soft Token (like Google Authenticator Code), Email Verification, etc.

= 2.0 =
* Two Factor ( 2FA ): Added login with password plus second factor feature.

= 1.8 = 
* Two Factor ( 2FA ): Added feature of different login form choice,test authentication and help for configuration and setup.

= 1.7 =
* Bug Fixes Two Factor ( 2FA ): Modifying login screen adaptable to user's login form

= 1.6 =
* Bug Fixes Two Factor ( 2FA ): fetching 2 factor configuration when activating the plugin after deactivating it.

= 1.5 =
* Bug Fixes Two Factor ( 2FA ): Login issues and password save issues resolved

= 1.4 =
* Bug Fixes Two Factor ( 2FA ): Authentication was not working on some version of php.

= 1.3 =
* Bug Fixes

= 1.2 =
* Two Factor ( 2FA ): Added 2 factor for all users along with forgot phone functionality.

= 1.1 = 
* Two Factor ( 2FA ): Added email ID verification during registration.

= 1.0.0 =
First version of Two Factor ( 2FA ) plugin.