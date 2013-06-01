/**
 * Created with JetBrains WebStorm.
 * User: tclh123
 * Date: 13-6-1
 * Time: 下午3:43
 */

(function () {
    if (!window.kido)
        window.kido = {};

    kido.commands = function ($container, http, context) {
        this.run = function ($output, commandText, callback) {
            var output = '';
            var immediateCallback = true;

            var commandData = parse(commandText);     // 解析 commandText
            if (commandData.error) {    // 若无法解析
                $output.html(commandData.error);
                callback();
                return;
            }
//            console.log(commandData);

//             post数据格式
//            commandData = {
//                name : 'name',
//                cmd : 'cmd',
//                args : []
//            };
            var postjson = JSON.stringify(commandData);
            http.post(context.urlpost, { json:postjson }, function(data) {
                data = JSON.parse(data);
                if(data.action == 'output') {
                    if(data.type == 'html') {
                        var output = data.data;
                        $output.html(output);
                    } else if(data.type == 'text') {     // 暂时没区别...
                        var output = data.data;
                        $output.html(output);
                    }
                } else if(data.action == 'needauth') {
                    if(data.type == 'json') {
                        var jsondata = data.data;
                        // TODO: 打开 jsondata.url 小窗口，进行授权
                        var token = 'token';
                        // 获取 token 后， 再向服务器post一次     //!!
                        http.post(context.urlpost, { json:JSON.stringify({
                            name:commandData.name,
                            cmd:jsondata.cmd,
                            args:[token]
                        }) }, function() {
                            if(data.action == 'output') {
                                if(data.type == 'html') {
                                    var output = data.data;
                                    $output.html(output);
                                } else if(data.type == 'text') {     // 暂时没区别...
                                    var output = data.data;
                                    $output.html(output);
                                }
                            }
                        });
                    }
                    //
                }
            });

//            var user = datamodel.getUser();
//            var command = commands[commandData.name] || {};       // commands -> command对象
//            command.requiredArgs = command.requiredArgs == null ? 0 : command.requiredArgs;
//            command.optionalArgs = command.optionalArgs == null ? 0 : command.optionalArgs;
//
//            if (!command.func) {
//                $output.html('invalid command');
//            }
//            else if (!user && command.needsAuth) {
//                $output.html('type "login" to log in');
//            }
//            else if (command.requiredArgs > commandData.args.length || (command.optionalArgs + command.requiredArgs) < commandData.args.length) {
//                var output = 'invalid syntax<br />';
//                output += '  syntax: "' + command.syntax + '"';
//                $output.html(output);
//            }
//            else {
//                var value = command.func($output, callback, commandData);         // 调用 func
//                immediateCallback = value == null || value == true;
//            }

            // TODO
            if (immediateCallback) {
                callback();
            }
        };
    };

    // 解析命令
    function parse(input) {
        var result = {
            args: []
        };
        input = $.trim(input);
        var commandParts = input.split(' '); // 字符串数组

        if (commandParts.length == 0) {
            return result;
        }
        result.name = commandParts.splice(0, 1)[0];

        if (commandParts.length == 0) {
            return result;
        }
        result.cmd = commandParts.splice(0, 1)[0];

        // args 不需要parse吧？ 不对就返回错误信息

        result.args = commandParts;

        return result;
    }

})();



//// HTTP POST 命令 到 后端
//http.post(context.urlpost, {}, function(data) {
//    var output = data;
//    $output.html(output);
//});