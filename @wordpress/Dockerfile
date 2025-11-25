# syntax=docker.io/docker/dockerfile:1
FROM wordpress:6.8.3-php8.3

WORKDIR /var/www/html

COPY ./theme/ ./wp-content/themes/sujin/
COPY ./plugins/resume-item/ ./wp-content/plugins/resume-item/

# Install Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php && \
    mv composer.phar /usr/local/bin/composer

RUN /usr/local/bin/composer --working-dir=/var/www/html/wp-content/themes/sujin install

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
