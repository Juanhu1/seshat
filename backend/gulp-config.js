module.exports = () => {
    
        const src = './src/';
        const build = './build/';
        const release = './release/';
    
        var config = {
            src: {
                root: src,
                js: src + '',
            },
            build: {
                root: build,
                js: build + '',
                css: build + 'css/',
                svg: build + 'images/assets/'
            },
            release: {
                root: release,
                js: release + '',
                css: release + 'css/',
                libs: release + 'js/libs/',
                webInf: release + 'WEB-INF/',
                svg: build + 'images/assets/'
            },
            tsFiles: src + '/*.ts', // only used for watch, tsconfig.json is used to compile
            sassFiles: {
                global: src + 'scss/**/*.s+(a|c)ss',
                js: [
                    src + 'js/**/*.s+(a|c)ss',
                    '!' + src + 'js/libs/**/*'
                    ]
            },
            otherFiles: [
                './src/**/*',
                '!./src/**/*.ts',
                '!./src/**/*.scss',
                '!./src/**/*.bak',
                '!./src/**/*.html'
            ],            
            webInf: './WEB-INF/weblogic.xml',
            bowerComponents: './bower_components/**/*',
            nodeModules: "./node_modules/",
            bowerPath: "./bower_components/",
            tsConfig: './tsconfig-forserver.json',
            tsConfigOptimize: './tsconfig_optimize.json',
            sourcemapsOptions: {
            includeContent: false,
                    sourceRoot: './build/'
            },
            sassOptions: {
            outputStyle: 'expanded',
                    includePaths: [],
                    sourcemap: true
            },
            autoprefixerOptions: {
            browsers: [
                    'last 2 version',
                    '> 5%'
            ]
            },
            cssNanoOptions: {
            reduceIdents: {
            keyframes: false
            },
                    discardUnused: {
                    keyframes: false
                    }
            },
            bowerLibs: ['es6-promise', 'hammerjs', 'jquery', 'jquery-ui', 'js-signals', 'proj4',
                'reflect-metadata', 'require-css', 'requirejs', 'sugar', 'text', 'webcomponentsjs']
        };
        return config;
    }
    