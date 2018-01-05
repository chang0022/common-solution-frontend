// 提供参数
const DEFAULT_PORT = 9090;
const {MockServer, createServerFromLocalFile, createServer} = require('local-api-mocker');
// console.log(require('local-api-mocker'));
const portFinder = require('portfinder');
const path = require('path');
const util = require('util');
const merge = require("merge");
var support = {};

support.argumentOptions = {
    rebuild: {
        type: 'boolean',
        describe: '是否建立最新的服务器',
        default: true
    },
    localApiFile: {
        type: 'string',
        describe: '本地的API文件',
    },
    remoteServerURL: {
        type: 'string',
        describe: '远程服务地址',
        default: '暂无'
    }, mockServerHome: {
        type: 'string',
        describe: 'mockServer的工作目录',
        default: '_mockServer'
    }
    // 还有项目名称 和 分支名称 这2个量通常是自动获取的
};

function getRemoteFile(originArguments) {
    // 将这个文件转换为绝对路径
    if (!originArguments.localApiFile)
        throw '必须输入localApiFile';
    return path.json('file://', path.resolve(originArguments.localApiFile));
}

function toProxy(server, port) {
    var proxy = {};
    const mockServerUrl = util.format('http://localhost:%d', port);
    new Set(server.uris.map(data => {
        return data.path;
    })).forEach(uri => {
        proxy[uri] = {
            target: mockServerUrl,
            secure: false
        };
    });
    console.log(proxy);
    return proxy;
}

/**
 *
 * @param originArguments 原始参数
 * @param webpackOptions webpackOptions
 * @param options options
 * @return {Promise} 结果是一个Object必然包含options
 */
support.mock = function (originArguments, webpackOptions, options) {
    const home = path.resolve(originArguments.mockServerHome);
    // 优先本地文件其次远程 暂不支持
    // 切换为file协议
    const remoteFile = getRemoteFile(originArguments);

    return new Promise((resolve, reject) => {
        function afterCreate() {
            portFinder.basePort = DEFAULT_PORT;
            portFinder.getPort((err, port) => {
                if (err) throw err;
                // 现在port有了
                // 现在要配置 option
                var server = new MockServer(home);
                // 将uris 转换成proxy
                server.start(port);
                var myProxy = toProxy(server, port);
                options.proxy = merge(options.proxy || {}, myProxy);
                resolve({
                    options: options
                });
            });
        }

        if (!originArguments.rebuild)
            afterCreate();
        else
            createServer(remoteFile, home, afterCreate);
    });

    // return Promise.resolve({
    //     options: options
    // });
};

module.exports = support;