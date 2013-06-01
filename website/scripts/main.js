/**
 * Created with JetBrains WebStorm.
 * User: tclh123
 * Date: 13-6-1
 * Time: 下午2:08
 */

// js入口，当 document 加载完毕

$(document).ready(function () {
    window.$document = $(document);
    window.$body = $('body');

    $('#container').text('loading...');

    var context = {
    };

    var terminal = new kido.terminal($('#container'), context);
    $('#container').focus();

});