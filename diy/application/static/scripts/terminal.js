/**
 * Created with JetBrains WebStorm.
 * User: tclh123
 * Date: 13-6-1
 * Time: 下午2:08
 */


(function () {
    if (!window.kido)                   // 靠 window 来共享全局 kido 对象
        window.kido = {};

    kido.terminal = function ($container, http, context) {
        var $currentConsoleLine;
//        var currentPath = '';
//        var currentFolder = '';
        var commandHistory = [];
        var commandCount = 0;
//        var firstname = '';
//        var loggedIn = false;
//        var currentId;
//        var searchTerm = '';
//        var searchIndex = 0;
//        var matches = [];

        ///// commands !!
        var runningCommand = false;
        var commands = new kido.commands($container, http, context);

        init();

        function init() {

            // 输出 欢迎信息
          var welcomeText = '<pre>     __    ____  ___   ___\n'+
			    '    / /_  /  _//  _ \\ /  _ \\  \n'+
			    '   / / /  / / / / / // / / /\n'+
			    '  /   / _/ / / /_/ // /_/ /\n'+
			    ' /_/\\_\\/___//_____/ \\____/\n'+
			      '_        _ _____   ___         _____  _       _____  _      _\n' +
                              '||  _   ///  ___/ /  _ \\      / ___/ / /     / ___// /    / /  \n' +
                              '|| / | /// /___  / /_/ /      \\__ \\ / /____ //___ / /    / / \n' +
                              '||//||/// /__   / /_/ /      ___/ // /- / ///__  / /___ / /__   \n' +
                              '|_/ |_//_____/ /_____/      /____//_/  /_//____//_____//_____/\n\n\n</pre>';

            //var welcomeText = '<pre><b> kido - a shell for web.\n\n</b></pre>';

            welcomeText += 'type "help" for list of supported commands<br /><br />';
            welcomeText += '<br />';
            $container.html(welcomeText);

            // 新行
            newCommandLine();

            $body.keydown(onKeyDown);          // window.$body ?  keydown 事件

            setTimeout(blink, 600); // 光标 闪
        }

        function onKeyDown(e) {
            var key = e.which;
            var handled = false;
            var text = $currentConsoleLine.text();      // text

//            // remove photo
//            if ($('#overlay').size() > 0) {
//                $('#overlay').remove();
//                return true;
//            }

            // ignore any keystrokes with alt, ctrl or cmd
            if (e.metaKey || e.altKey || e.ctrlKey || runningCommand) {
                // ctrl+c cancels the running command // 如果 在执行命令中，ctrl+c 取消命令（直接输出新行）
                if ((e.ctrlKey || e.metaKey) && key == keymap.c) {
                    if (runningCommand) {
                        runningCommand = false;
                        newCommandLine();
                        $(document).scrollTop($(document).height());
                    }
                }

                return true;
            }

            // 历史命令浏览 // 上，下
            // up should go back in history
            if (e.which == keymap.up) {
                if (commandCount > 0) {
                    commandCount--;

                    $currentConsoleLine.html(commandHistory[commandCount]);
                }

                return false;
            }
            // down should go forward in history
            if (e.which == keymap.down) {
                if (commandCount < commandHistory.length - 1) {
                    commandCount++;
                    $currentConsoleLine.html(commandHistory[commandCount]);
                }
                else {
                    $currentConsoleLine.html('');
                    commandCount = commandHistory.length;
                }

                return false;
            }

            // shift key presses    // 支持大写
            if (e.shiftKey && keymap.uppercase[key]) {
                var character = keymap.uppercase[key];
                $currentConsoleLine.text(text + character);
                resetSearch();

                return false;
            }

            // 按键输入
            // supported key presses
            if (keymap.lowercase[key]) {
                var character = keymap.lowercase[key];
                $currentConsoleLine.text(text + character);
                resetSearch();

                return false;
            }

            // allow backspace  // 支持后退
            if (e.which == keymap.backspace) {
                text = text.substr(0, text.length - 1);
                $currentConsoleLine.text(text);
                resetSearch();

                return false;
            }

//            // tab auto completes
//            if (e.which == keymap.tab) {
//                var words = searchTerm.split(' ');
//                var lastWord = words[words.length - 1];
//                var newText = searchTerm.substr(0, searchTerm.length - lastWord.length);
//
//                datamodel.getFile(context.currentId, function (folder) {
//                    // need to find all of the search matches
//                    if (matches.length == 0) {
//                        for (var i = 0; i < folder.sortedChildList.length; i++) {
//                            var file = folder.sortedChildList[i];
//                            if (file.name.substr(0, lastWord.length).toLowerCase() == lastWord.toLowerCase()) {
//                                matches.push(file.name);
//                            }
//                        }
//                    }
//
//                    // get the current match and update the command
//                    var filename = matches[searchIndex];
//                    if (filename) {
//                        if (filename.indexOf(' ') != -1) {
//                            filename = '"' + filename + '"';
//                        }
//                        $currentConsoleLine.text(newText + filename);
//                    }
//
//                    searchIndex++;
//                    if (searchIndex >= matches.length)
//                        searchIndex = 0;
//                });
//
//                return false;
//            }

            // escape clears the command line   // 支持 ESC
            if (e.which == keymap.escape) {
                $currentConsoleLine.html('');
                resetSearch();

                return false;
            }

            // enter evaluates the command  // 按回车，执行 cmd
            if (e.which == keymap.enter) {
                $('#cursor').remove();      //?
                if (text == '') {       // 空命令
                    newCommandLine();
                    $(document).scrollTop($(document).height());
                }
                else {
                    runningCommand = true;
                    var $output = $('<div class="output"></div>');
                    $container.append($output);

                    // TODO

                    commands.run($output, text, function () {
                        if (runningCommand) {
                            runningCommand = false;
                            newCommandLine();
                            $(document).scrollTop($(document).height());
                        }
                    });


                    $(document).scrollTop($(document).height());
                    // 维护命令历史
                    commandHistory.push(text);
                    commandCount = commandHistory.length;
                }
                return false;
            }

            $(document).scrollTop($(document).height());
        }

        function resetSearch() {
            // 用来 tab 补全用的 ?
//            searchTerm = $currentConsoleLine.text();
//            searchIndex = 0;
//            matches = [];
        }

        // echo  - 输出信息，外部调用    // 更改当前行的信息
//        function echoOutput(text) {
//            text = '<div class="output">' + text + '</div><br />';
//            echo(text);
//        }
//
//        function echo(text) {
//            $currentConsoleLine.html($currentConsoleLine.html() + text);
//        }

        function newCommandLine() {
//            var user = datamodel.getUser();
            var user = {};
            user.name = 'guest';
            var username = (user && user.name) || '';   // 看看是否是登陆用户
            $container.append('<div><span class="path">' + username + '@kido.com' + '&gt;</span><span class="console"></span><span id="cursor">_</span></div>');
            $currentConsoleLine = $('.console:last');
        }

        function blink(show) {            // 光标闪烁
            $('#cursor').toggle(show);
            setTimeout(function () { blink(!show); }, 600);
        }
    };

})();
