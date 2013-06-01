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

            var commandData = _parse(commandText);     // 解析 commandText
            if (commandData.error) {    // 若无法解析
                $output.html(commandData.error);
                callback();
                return;
            }

            //////////////
            // 前端命令
            var command = frontCmd[commandData.name] || {};
            command.requiredArgs = command.requiredArgs == null ? 0 : command.requiredArgs;
            command.optionalArgs = command.optionalArgs == null ? 0 : command.optionalArgs;

            if (command.func) {
                if (command.requiredArgs > commandData.args.length || (command.optionalArgs + command.requiredArgs) < commandData.args.length) {
                    output = 'invalid syntax<br />';
                    output += '  syntax: "' + command.syntax + '"';
                    $output.html(output);
                }
                else {
                    command.func($output, commandData);         // 调用 前端命令
                }
            } else {
                // 后端命令

                immediateCallback = false;
//                 post数据格式
//                commandData = {
//                    name : 'name',
//                    cmd : 'cmd',
//                    args : []
//                };
                var postjson = JSON.stringify(commandData);
                http.post(context.urlpost, { json:postjson }, function(data) {
                    data = JSON.parse(data);
                    if(data.action == 'output') {
                        if(data.type == 'html') {
                            output = data.data;
                            $output.html(output);
                        } else if(data.type == 'text') {     // 暂时没区别...
                            output = data.data;
                            $output.html(output);
                        }
                    }
                    // TODO: 如果后端找不到相应命令，输出 invalid command

                    // TODO: Auth
//                    else if(data.action == 'needauth') {
//                        if(data.type == 'json') {
//                            var jsondata = data.data;
//                            // TODO: 打开 jsondata.url 小窗口，进行授权
//                            var token = 'token';
//                            // 获取 token 后， 再向服务器post一次     //!!
//                            http.post(context.urlpost, { json:JSON.stringify({
//                                name:commandData.name,
//                                cmd:jsondata.cmd,
//                                args:[token]
//                            }) }, function() {
//                                if(data.action == 'output') {
//                                    if(data.type == 'html') {
//                                        var output = data.data;
//                                        $output.html(output);
//                                    } else if(data.type == 'text') {     // 暂时没区别...
//                                        var output = data.data;
//                                        $output.html(output);
//                                    }
//                                }
//                            });
//                        }
//
//                    }

                    callback(); // 新行，及 focus
                });

            }


            if (immediateCallback) {
                callback();
            }
        };


        // 前端命令
        var frontCmd = {
            // basic
            'help': {
                func: help,
                syntax: 'help'
            },
            'clear': {
                func: clear,
                syntax: 'clear'
            },
            'ver': {
                func: function ($output) { $output.html('kido version "alpha 1.0"'); },
                syntax: 'ver'
            },

            // music
            'play': {
                func: play,
                syntax: 'play song.mp3'
            },
            'pause': {
                func: pause,
                syntax: 'pause (pauses the playing song)'
            },
//            'queue': {
//                func: queue,
//                syntax: 'queue music.mp3 OR queue'
//            },
            'next': {
                func: next,
                syntax: 'next (goes to the next song in your queue)'
            },

            // terminal style
            'theam': {
                func: function () { bd.className="theam"; },
                syntax: 'theam'
            },
            'white': {
                func: function () { color('white'); },
                syntax: 'white'
            },
	    
            'sky': {
                func: function () { bd.className="sky"; },
                syntax: 'sky'
            },

            'dream': {
                func: function () { bd.className="dream"; },
                syntax: 'dream'
            },


            'childhood': {
                func: function () { bd.className="childhood"; },
                syntax: 'childhood'
            },


            'ubuntu': {
                func: function () { bd.className="ubuntu"; },
                syntax: 'ubuntu'
            },


            'forest': {
                func: function () { bd.className="forest"; },
                syntax: 'forest'
            },

            'color': {
                func: function () { bd.className="sky";},
//$('body').toggleClass('sky'); },
                syntax: 'color'
            }
        };
        function help($output) {
            var output = '';

            output += 'BASIC<br />';
            output += '  ls - show app installed<br />';
            output += '  help - show help messages<br />';
            output += '  clear - clear the screen<br />';
            output += '  ver - displays the system version<br />';
            output += '<br />';

            output += 'THEME<br />';
            output += '  green - sets command line text to green<br />';
            output += '  white - sets command line text to white<br />';
            output += '  color - switch the color<br />';
            output += '<br />';

            $output.html(output);
        }
        function clear() {
            $container.empty();
        }
        function play() {
            _play('http://mr5.douban.com/201306020131/c2b26b2f2a72b258dec67567770dc6b8/view/song/small/p367521.mp3');
        }
        function pause() {

        }
        function next() {

        }
        function color(theam) {
            //$('body').toggleClass('green', theam == 'green');
	    $('body').className=theam;
        }

        function _play(src) {
            if ($('#music') && $('#music')[0] && $('#music')[0].play) {
                $('#music')[0].innerHTML = '<source src="' + src + '" type="audio/mpeg" />';
                $('#music')[0].play();
            }
        }
        function _resume(src) {
            $('#music')[0].play();
        }
        function _pause() {
            $('#music')[0].pause();
        }


        // 解析命令
        function _parse(input) {
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
    };
})();
