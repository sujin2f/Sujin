<?php

function mo2f_support() {
	global $user;
	global $Mo2fdbQueries;
	$user       = wp_get_current_user();
	$email      = $Mo2fdbQueries->get_user_detail( 'mo2f_user_email', $user->ID );
	$phone      = $Mo2fdbQueries->get_user_detail( 'mo2f_user_phone', $user->ID );
	$user_email = $email ? $email : $user->user_email;
	$user_phone = $phone != 'false' ? $phone : '';
	?>
    <div class="mo2f_support_layout">
        <h3><?php echo mo2f_lt( 'Support' ); ?></h3>
        <hr width="100%">
        <br>
        <form name="f" method="post" action="">
            <div><?php echo mo2f_lt( 'Need any help setting it up? Facing any issues? Shoot us a query and we will get back to you.' ); ?> </div>
            <br>
            <div><?php echo mo2f_lt( 'Have a look at these FAQ\'s to see if your question has been answered already! ' ); ?>
                <a href="https://faq.miniorange.com/kb/two-factor-authentication" target="_blank"><b>Frequently Asked
                        Questions.</b></a>
            </div>

            <br>
            <div>
                <table style="width:95%;">
                    <tr>
                        <td>
                            <input type="email" class="mo2f_table_textbox" id="EMAIL_MANDATORY" name="EMAIL_MANDATORY"
                                   value="<?php echo $user_email ?>"
                                   placeholder="Enter your email" required="true"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" class="mo2f_table_textbox" style="width:100% !important;"
                                   name="query_phone" id="query_phone"
                                   value="<?php echo $user_phone; ?>"
                                   placeholder="Enter your phone"/>
                        </td>

                    </tr>
                    <tr>
                        <td>
                            <textarea id="query" name="query"
                                      style="resize: vertical;width:100%;height:143px;"
                                      onkeyup="mo2f_valid(this)" onblur="mo2f_valid(this)" onkeypress="mo2f_valid(this)"
                                      placeholder="<?php echo mo2f_lt( 'Your query here...' ); ?>"></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <br>
            <input type="hidden" name="option" value="mo_2factor_send_query"/>
            <input type="submit" name="send_query" id="send_query"
                   value="<?php echo mo2f_lt( 'Submit Query' ); ?>"
                   style="float:right;" class="button button-primary button-large"/>
            <br><br>
        </form>
        <br>
    </div>
    <br>

    <script>
        jQuery("#query_phone").intlTelInput();

        function mo2f_valid(f) {
            !(/^[a-zA-Z?,.\(\)\/@ 0-9]*$/).test(f.value) ? f.value = f.value.replace(/[^a-zA-Z?,.\(\)\/@ 0-9]/, '') : null;
        }
    </script>
	<?php
}

?>