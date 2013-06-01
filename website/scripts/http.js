/**
 * Created with JetBrains WebStorm.
 * User: tclh123
 * Date: 13-6-1
 * Time: 下午3:22
 */


(function () {
    if (!window.kido)                   // 靠 window 来共享全局 kido 对象
        window.kido = {};

    kido.http = function() {

        this.post = function (url, datapost, callback) {
            $.ajax({
                url: url, // "/service",
                type: "POST",
                data: datapost,
                success: callback
            });
        }

        this.get = function (url, callback) {
            $.ajax({
                url: url, // "/service",
                type: "GET",
                success: callback
            });
        }

    };
})();