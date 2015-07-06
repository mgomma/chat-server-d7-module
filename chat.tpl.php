<script src="http://<?php echo $_SERVER['SERVER_NAME']; ?>:8283/socket.io/socket.io.js"></script>
<script>
    (function ($) {
        var myNick = 'me';
        var newlyJoined = true;
        var socket = io.connect('http://<?php print $_SERVER['SERVER_NAME'] ?>:8283');

        socket.on('connect', function () {
            $('#chat').addClass('connected');
        });

        socket.on('users', function (users) {
            $('#nicknames').empty().append($('<span>Online: </span>'));
            for (var i in users) {
                $('#nicknames').append($('<b>').text(users[i]));
            }
        });

        socket.on('user message', message);
        socket.on('reconnect', function () {
            $('#lines').remove();
            message('System', 'Reconnected to the server');
        });

        socket.on('reconnecting', function () {
            message('System', 'Attempting to re-connect to the server');
        });

        socket.on('error', function (e) {
            message('System', e ? e : 'A unknown error occurred');
        });

        function message(msg) {
            console.log(msg);
            $('#lines').append($('<p>').append($('<small>').text($('#receiver').val())).append($('<b>').text(' - '), linkify(msg['message'])));
        }

        function linkify(inputText) {
            //URLs starting with http://, https://, or ftp://
            var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            var replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

            //URLs starting with www. (without // before it, or it'd re-link the ones done above)
            var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            var replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

            //Change email addresses to mailto:: links
            var replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
            var replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

            return replacedText
        }

        function tstamp(stamp) {
            var currentTime = new Date();
            if (typeof stamp != 'undefined') {
                currentTime.setTime(stamp);
            }
            var days = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat');
            var day = currentTime.getDay();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (hours > 11) {
                var ap = 'p';
            }
            else {
                var ap = 'a';
            }
            if (hours > 12) {
                hours = hours - 12;
            }
            return "[" + days[day] + " " + hours + ":" + minutes + ap + "m] ";
        }

        $(document).ready(function () {
            $('input#message').focus(function () {
                if ($(this).val() == 'Type your chat messages here...') {
                    $(this).val('');
                }
            });

            $('input#show-timestamps').click(function () {
                if ($(this).is(':checked')) {
                    $('#messages p small').show();
                }
                else {
                    $('#messages p small').hide();
                }
            })

            socket.emit('user', <?php print json_encode(array('name' => isset($user->name) ? $user->name : NULL, 'uid' => $user->uid)) ?>, function (nick) {
                if (nick != 'me') {
                    myNick = nick;
                    socket.emit('get log');
                    return $('#chat').addClass('nickname-set');
                }
            });

            $('#send-message').submit(function () {
                if ($('#receiver').val() == '' || $('#to').val() == '') {
                    alert('Please select a user to chat with him first');
                    return;
                }

                if ($('#message').val() == '') {
                    return;
                }

                msg = {'message': $('#message').val(), 'sender':<?php echo $user->uid ?>, 'receiver': $('#to').val(), 'timestamp': tstamp()};

                socket.emit('user message', msg, function(res){
                    console.log(res);
                });

                clear();
                $('#lines').get(0).scrollTop = 10000000;

                return false;
            });

            function clear() {
                $('#message').val('').focus();
            }
            
            socket.on('online users', function (users) {
                console.log(users);
            });
            
            socket.on('user status', function (user) {
                console.log(user);
            });
            
            $('.chat-with-user').click(function () {
                $('#to').val($(this).attr('data-uid'));
                $('#receiver').val($(this).html());
                $('#chat-with').html('Chating with : ' + $(this).html());
            })
        });
    })(jQuery);
</script>
<div id="chat" sender="">
    <div id="messages">
        <div id="users">
            <p>online users</p>
            <ul>
                <?php foreach ($users as $user): ?>
                    <li><a class="chat-with-user" href="#" data-uid="<?php echo $user->uid ?>"><?php echo $user->name ?></a></li>
                <?php endforeach; ?>
            </ul>
        </div>
        <div id="lines">
        </div>

    </div>
    <form id="send-message" autocomplete="off">
        <p id="chat-with"></p>
        <input id="to" type="hidden" value="" autocomplete="off" />
        <input id="receiver" type="hidden" value="" autocomplete="off" />
        <input id="message" type="text" value="Type your chat messages here..." autocomplete="off" />
        <button>Send</button>
    </form>
</div>
<small><input id="show-timestamps" type="checkbox" checked="checked" /> Show timestamps</small>
