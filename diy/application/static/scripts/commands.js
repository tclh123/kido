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

        var playing = false;

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
            var done = false;
            var command = frontCmd[commandData.name] || {};
            if(commandData.name == 'doubanfm') {
                if(commandData.cmd == 'play') {
                    playing = true;

                    done = true;
                    _resume();
                    output = 'fm play(resume)...';
                    $output.html(output);
                } else if(commandData.cmd == 'stop') {
                    playing = false;

                    done = true;
                    _pause();
                    output = 'fm stop(pause)...';
                    $output.html(output);
                }
            }
            if(done) {
                callback();
                return;
            }

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
                        } else if(data.type == 'json') {
                            var jsondata = data.data;
                            if(jsondata.src && jsondata.title) {    // douban fm
                                playing = true;

                                _play(jsondata.src);
                                output = jsondata.title;
                                $output.html(output);
                            }
                            if(jsondata.src && jsondata.tittle) {    // douban fm
                                playing = true;

                                _play(jsondata.src);
                                output = jsondata.tittle;
                                $output.html(output);
                            }
                        }
                    }
                    // TODO: 如果后端找不到相应命令，输出 invalid command

                    // TODO: Auth
                    else if(data.action == 'needauth') {
                        if(data.type == 'text') {
                            console.log(data.data);
                            window.open(data.data);
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
                        }

                    }

                    callback(); // 新行，及 focus
                });

            }


            if (immediateCallback) {
                callback();
            }
        };

        // doubanfm 自动下一首
        // 因为是后台播放，下一首时自动向前端输出有点weird..
        // TODO: too ugly... need refactor
        $('#music').bind('ended', function (e) {
            if (playing) {
                var $output = $('<div class="output"></div>');
                $container.append($output);
                var output = '';

                http.post(context.urlpost, { json: JSON.stringify({
                        name : 'doubanfm',
                        cmd : 'next',
                        args : []
                    })},
                    function(data) {
                    data = JSON.parse(data);
                    if(data.action == 'output') {
                        if(data.type == 'html') {
                            output = data.data;
                            $output.html(output);
                        } else if(data.type == 'text') {     // 暂时没区别...
                            output = data.data;
                            $output.html(output);
                        } else if(data.type == 'json') {
                            var jsondata = data.data;
                            if(jsondata.src && jsondata.title) {    // douban fm
                                _play(jsondata.src);
                                output = jsondata.title;
                                $output.html(output);
                            }
                            if(jsondata.src && jsondata.tittle) {    // douban fm
                                _play(jsondata.src);
                                output = jsondata.tittle;
                                $output.html(output);
                            }
                        }
                    }
                });
            }
        });

        // 弹出授权弹层：
        function authLoad(){
            context.wbapi.AuthDialog.show({
                client_id : '2074065925',    //必选，appkey
                redirect_uri : 'http://127.0.0.1:8888/callback',     //必选，授权后的回调地址，例如：http://apps.weibo.com/giftabc
                height: 120,    //可选，默认距顶端120px
                scope: "friendships_groups_read, friendships_groups_write"//可选，授权页scope参数
            });
        }
        // 前端命令
        var frontCmd = {

            'test' : {
                func: function() { authLoad(); }
            },

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

            // terminal style
            'theme': {
                func: function () { bd.className="theme"; },
                syntax: 'theme'
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
            output += '  sky - use the sky theme<br />';
            output += '  dream - use the dream theme<br />';
            output += '  childhood - use the childhood theme<br />';
	    output += '  ubuntu - use the ubuntu theme<br />';
	    output += '  forest - use the forest theme<br />';
	    output += '  theme - use the theme theme<br />';

            output += '<br />';

            $output.html(output);
        }
        function clear() {
            $container.empty();
        }
        function color(theam) {
            //$('body').toggleClass('green', theam == 'green');
	    $('body').className=theam;
        }

        // internal
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
