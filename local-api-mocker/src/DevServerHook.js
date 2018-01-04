// 负责跟webpack devServer 通讯 试试维护

import {join} from "path";
import proxy from 'express-http-proxy';
import {existsSync} from 'fs';
import getPaths from './getPaths';
import {createServerFromLocalFile} from './ServerCreator';
import {MockServer} from './MockServer';
import chokidar from 'chokidar';
import chalk from 'chalk';

const DEFAULT_PORT = 9090;
const portFinder = require('portfinder');

const paths = getPaths(process.cwd());
const configFile = paths.resolveApp('.api.mock.js');

function getConfig() {
    if (existsSync(configFile)) {
        // disable require cache
        // Object.keys(require.cache).forEach(file => {
        //     if (file === configFile || file.indexOf(mockDir) > -1) {
        //         debug(`delete cache ${file}`);
        //         delete require.cache[file];
        //     }
        // });
        return require(configFile);
    }
}

function createProxy(method, path, target) {
    return proxy(target, {
        filter(req) {
            return method ? req.method.toLowerCase() === method.toLowerCase() : true;
        },
        proxyReqPathResolver(req) {
            // console.log('我的要求地址:');
            return 'http://' + target + path;
        },
        // forwardPath(req) {
        //     let matchPath = req.originalUrl;
        //     const matches = matchPath.match(path);
        //     if (matches.length > 1) {
        //         matchPath = matches[1];
        //     }
        //     return join(winPath(url.parse(target).path), matchPath);
        // },
    });
}

function addProxy(server, app, port) {
    server.uris.forEach(data => {
        app.use(data.path, createProxy(data.method, data.path, 'localhost:' + port));
        // console.log('proxy for ', data.path, ' method:', data.method, ' to:' + 'localhost:' + port);
    });
}

function setupServer(devServer, home, watcher) {
    return new Promise((resolve, reject) => {
        portFinder.basePort = DEFAULT_PORT;
        portFinder.getPort((err, port) => {
            if (err) throw err;
            // 现在port有了
            // 现在要配置 option
            var server = new MockServer(home);
            // 将uris 转换成proxy
            server.start(port);

            const {app} = devServer;
            // 添加proxy

            addProxy(server, app, port);

            // 调整 stack，把 historyApiFallback 放到最后
            let lastIndex = null;
            app._router.stack.forEach((item, index) => {
                if (item.name === 'webpackDevMiddleware') {
                    lastIndex = index;
                }
            });
            const mockAPILength = app._router.stack.length - 1 - lastIndex;
            if (lastIndex && lastIndex > 0) {
                const newStack = app._router.stack;
                newStack.push(newStack[lastIndex - 1]);
                newStack.push(newStack[lastIndex]);
                newStack.splice(lastIndex - 1, 2);
                app._router.stack = newStack;
            }

            // console.log('there have ', mockAPILength, ' api.');

            watcher(() => {
                app._router.stack.splice(lastIndex - 1, mockAPILength);
                if (server) {
                    // console.log(server);
                    server.stop();
                    server = null;
                }
                hook(devServer);
            });

            resolve({server, mockAPILength});
        });
    });
}

function forLocalFile(filePath, devServer, dir, watcher) {
    // Promise
    return new Promise((resolve, reject) => {
        createServerFromLocalFile(filePath, dir, function () {
            resolve(dir);
        });
    }).then(dir => setupServer(devServer, dir, watcher));
}

/**
 *
 * @return {boolean} 是否应该启用hook
 */
function shouldHook() {
    const config = getConfig();
    return config !== undefined;
}

/**
 * 绑定到webpack devServer
 * @param devServer
 */
function hook(devServer) {
    const config = getConfig();
    // 配置中包括 localApiFile 或者 projectId
    // https://www.npmjs.com/package/git-branch
    if (!config)
        return;
    const {localApiFile, mockDir} = config;
    const mockServerDir = paths.appDirectory + "/" + (mockDir || '.mock');

    // 锁定本地文件，若更新时 则放弃掉原MockServer并且调整devServer的Proxy
    // 研究下这个devServer到底是什么鬼 可以api化的空间

    if (localApiFile) {
        forLocalFile(localApiFile, devServer, mockServerDir, function (target) {
            const watcher = chokidar.watch(localApiFile);

            watcher.on('change', path => {
                console.log(chalk.green('CHANGED'), path.replace(paths.appDirectory, '.'));
                target();
                watcher.close();
            })
        });
    }
}

module.exports = {hook, shouldHook};
