const LiveChat = require('@livechat/agent-app-widget-sdk'),
    $ = require('jquery-browserify'),
    ifemoji = require('if-emoji');

window.EmojiKeyboard = {

    printEmojiCategory: function(emojisObject, category) {
        let elementID = category.toLowerCase();
        $('.emoji-set').append('<p class="emoji-category" id="' + elementID + '"><span class="emoji-header">' + category + '</span></p>');
        $.each(emojisObject[category], function () {
            let unified = this.unified;
            unified = unified.split('-');
            let dec = [];
            $.each(unified, function () {
                dec.push(parseInt(this, 16));
            });
            let emoji = String.fromCodePoint.apply(this, dec);
            if (ifemoji(emoji))
                $('#' + elementID).append('<span class="emoji-single" data-emoji-code="' + emoji + '">' + emoji + '</span>');
        });
    },

    init: function () {
        LiveChat.init({
            authorization: false
        });

        $('.emoji-set').on( "click", ".emoji-single", function() {
            LiveChat.putMessage($(this).data('emoji-code'));
        });

        $.fn.isInViewport = function() {
            let elementTop = $(this).offset().top;
            let elementBottom = elementTop + $(this).outerHeight();

            let viewportTop = $(window).scrollTop();
            let viewportBottom = viewportTop + $(window).height();

            return elementBottom > viewportTop && elementTop < viewportBottom;
        };

        $(window).on('resize scroll', function() {
            let stop = false;
            $('.emoji-category').each(function() {
                if (stop === false) {
                    let id = $(this).attr('id').toLowerCase();
                    $('.chat-plugin__menu__item').removeClass('chat-plugin__menu__item--active');
                    if ($(this).isInViewport()) {
                        $('li[data-target-id="'+id+'"]').addClass('chat-plugin__menu__item--active');
                        stop = true;
                    }
                }
            });
        });

        $.each(emojis, function (index, value) {
            EmojiKeyboard.printEmojiCategory(emojis, index);
        });


    }
};

window.EmojiKeyboard.init();