# This file is making a Wordpress Docker image for developer which includes xDebug, MailHog, ZipArchive, and increased upload size
# Make this like docker build -t sujin2f/wordpress .

FROM wordpress:php7.3

# Install x-debug
RUN apt-get update \
  && pecl install xdebug \
  && docker-php-ext-enable xdebug \
  && apt-get install -y unzip \
  && apt-get install -y wget

RUN echo 'zend_extension = /usr/local/lib/php/extensions/no-debug-non-zts-20180731/xdebug.so' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo 'xdebug.force_display_errors = 1' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo 'xdebug.profiler_enable_trigger = 1' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo 'xdebug.profiler_output_dir = /opt/storage' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo 'xdebug.var_display_max_children = -1' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo 'xdebug.var_display_max_depth = -1' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

RUN sed -i "s|html_errors = Off|html_errors = On|g" /usr/local/etc/php/php.ini-production && \
    sed -i "s|html_errors = Off|html_errors = On|g" /usr/local/etc/php/conf.d/error-logging.ini

RUN mkdir /opt/storage && \
    chmod 777 /opt/storage

RUN wget -O webgrind.zip https://github.com/jokkedk/webgrind/archive/v1.6.0.zip && \
    unzip webgrind.zip

# ZipArchive
RUN apt-get install -y \
    libzip-dev \
    zip \
  && docker-php-ext-configure zip --with-libzip \
  && docker-php-ext-install zip

# Increase Upload Size
RUN echo 'file_uploads = On\nmemory_limit = 100M\nupload_max_filesize = 100M\npost_max_size = 100M\nmax_execution_time = 1000' > /usr/local/etc/php/conf.d/uploads.ini
