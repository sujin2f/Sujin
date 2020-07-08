const { execSync } = require('child_process')
const path = require('path')
const reader = require('readline-sync');

const { colourRed, colourGreen, colourReset } = require('../constants/colour.js')
const env = require('../common/env.js')

class Wordpress {
  containerName = ''
  virtualHost = ''
  wordpressDbName = ''
  wordpressDbPassword = ''
  wordpressDebug = ''

  constructor() {
    this.containerName = env.isDev() ? 'sujinc-dev' : 'sujinc-prod'

    if (this.getContainer()) {
      return
    }

    this.virtualHost = env.isDev() ? 'sujinc.test' : 'sujinc.com'
    this.wordpressDbName = env.isDev() ? 'sujinc.test' : 'sujinc.com'
    this.wordpressDebug = env.isDev() ? '1' : '0'

    this.createContainer()
  }

  getContainer() {
    try {
      const container = execSync(`docker container ls | grep ${this.containerName}`)
      console.log(colourGreen, '[🎉 OK]', colourReset, 'Wordpress is intalled.')
      return container
    } catch (_) {
      return false
    }
  }

  createContainer() {
    const envs = [
      `-e VIRTUAL_HOST="${this.virtualHost}"`,
      `-e WORDPRESS_DB_NAME="${this.wordpressDbName}"`,
      `-e WORDPRESS_DB_USER="root"`,
      `-e WORDPRESS_DB_PASSWORD="${env.data.DB_PASSWORD}"`,
      `-e WORDPRESS_DEBUG="${this.wordpressDebug}"`,
      `-e TZ="America/Toronto"`,
    ]

    const root = path.resolve(__dirname, '../', '../', '../')

    const volumes = [
      this.getDataStorageFromUser(),
      `-v ${root}:/var/www/html/wp-content/themes/sujin`,
    ]

    execSync(`docker run -d --name ${this.containerName} --restart=always -p 80 ${envs.join(' ')} ${volumes.join(' ')} --link mariadb:mysql -d wordpress`)

    this.installZipArchive()
    this.increaseUploadSize()
    this.editHtAccess()

    if (env.isDev()) {
      this.installXdebug()
      console.log(colourGreen, '[🎉 OK]', colourReset, 'Wordpress is intalled. To activate xdebug, please restart the container.')
      return
    }

    console.log(colourGreen, '[🎉 OK]', colourReset, 'Wordpress is intalled.')
  }

  getDataStorageFromUser() {
    const dir = reader.question('Enter the absolute path of local wp-content. If you don\'t need it, just leave it blank: ')
    if (!dir) {
      return ''
    }

    return `-v ${dir}:/var/www/html/wp-content`
  }

  installZipArchive() {
    const commands = [
      'apt-get install -y libzip-dev zip',
      'docker-php-ext-configure zip --with-libzip',
      'docker-php-ext-install zip',
    ]

    execSync(`docker exec -d ${this.containerName} sh -c "${commands.join(' && ')}"`)
  }

  increaseUploadSize() {
    const commands = [
      `echo 'file_uploads = On' > /usr/local/etc/php/conf.d/uploads.ini`,
      `echo 'memory_limit = 100M' >> /usr/local/etc/php/conf.d/uploads.ini`,
      `echo 'upload_max_filesize = 100M' >> /usr/local/etc/php/conf.d/uploads.ini`,
      `echo 'post_max_size = 100M' >> /usr/local/etc/php/conf.d/uploads.ini`,
      `echo 'max_execution_time = 1000' >> /usr/local/etc/php/conf.d/uploads.ini`,
    ]

    execSync(`docker exec -d ${this.containerName} sh -c "${commands.join(' && ')}"`)
  }

  editHtAccess() {
    const commands = [
      `echo '# BEGIN WordPress' > /var/www/html/.htaccess`,
      `echo '<IfModule mod_rewrite.c>' >> /var/www/html/.htaccess`,
      `echo 'RewriteEngine On' >> /var/www/html/.htaccess`,
      `echo 'RewriteBase /' >> /var/www/html/.htaccess`,
      `echo 'RewriteRule ^index\\.php$ - [L]' >> /var/www/html/.htaccess`,
      `echo 'RewriteCond %{REQUEST_FILENAME} !-f' >> /var/www/html/.htaccess`,
      `echo 'RewriteCond %{REQUEST_FILENAME} !-d' >> /var/www/html/.htaccess`,
      `echo 'RewriteRule . /index.php [L]' >> /var/www/html/.htaccess`,
      `echo 'RedirectMatch 403 /\\..*$' >> /var/www/html/.htaccess`,
      `echo '</IfModule>' >> /var/www/html/.htaccess`,
      `echo '# END WordPress' >> /var/www/html/.htaccess`,
    ]

    execSync(`docker exec -d ${this.containerName} sh -c "${commands.join(' && ')}"`)
  }

  installXdebug() {
    let commands = [
      'pecl install xdebug',
    ]

    execSync(`docker exec -d ${this.containerName} sh -c "${commands.join(' && ')}"`)

    commands = [
      `echo 'zend_extension = /usr/local/lib/php/extensions/no-debug-non-zts-20190902/xdebug.so' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini`,
      `echo 'xdebug.force_display_errors = 1' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini`,
      `echo 'xdebug.profiler_enable_trigger = 1' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini`,
      `echo 'xdebug.profiler_output_dir = /opt/storage' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini`,
      `echo 'xdebug.var_display_max_children = -1' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini`,
      `echo 'xdebug.var_display_max_depth = -1' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini`,
      `sed -i 's|html_errors = Off|html_errors = On|g' /usr/local/etc/php/php.ini-production`,
      `sed -i 's|html_errors = Off|html_errors = On|g' /usr/local/etc/php/conf.d/error-logging.ini`,
      'docker-php-ext-enable xdebug',
    ]

    execSync(`docker exec -d ${this.containerName} sh -c "${commands.join(' && ')}"`)
  }
}

module.exports = { Wordpress }
