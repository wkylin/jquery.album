module.exports = function (grunt) {

    //使用 matchdep，可以自动载入所有任务。
    // require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);
    // 构建任务配置
    grunt.initConfig({

        //默认文件目录在这里
        paths: {
            assets: 'assets',//输出的最终文件assets里面
            less: 'assets/css/less',//推荐使用Less
            css: 'assets/css', //若简单项目，可直接使用原生CSS，同样可以grunt watch:base进行监控
            js: 'assets/scripts', //js文件相关目录
            img: 'assets/image' //图片相关
        },
        buildPaths: {
            build: 'build',
            css: 'build/css',
            js: 'build/scripts',
            img: 'build/assets/image'
        },
        buildType: 'Build',
        //读取package.json的内容，形成个json数据
        pkg: grunt.file.readJSON('package.json'),
        archive: grunt.option('name') || 'GruntJs',//此处可根据自己的需求修改


        //Task配置
        jsonlint: {
            sample: {
                src: ['<%= paths.js %>/json/lint.json']
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - '
                + '<%= grunt.template.today("yyyy-mm-dd") %>\n'
                + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>'
                + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;'
                + ' Licensed <%= pkg.license %> */\n',
                mangle: true,
                beautify: false
            },

            jsMin: {
                files: [{
                    expand: true,
                    cwd: 'assets/js',
                    src: '**/*.js',
                    dest: 'build/assets/js'
                }]
            }
        },
        cssmin: {
            build: {
                options: {
                    banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %>' + ' Licensed <%= pkg.license %> */\n',
                    beautify: {
                        //中文ascii化，非常有用！防止中文乱码的神配置
                        ascii_only: true
                    }
                },

                files: [
                    {
                        src: ['<%= paths.css %>/base.css', '<%= paths.css %>/index.css'],
                        dest: '<%= buildPaths.css %>/album.min.css'
                    }
                ]
            }
        },
        clean: {
            build: {
                src: ['build']
            },
            delDoc: {
                src: ['docs']
            },
            delCss: {
                src: ['<%= buildPaths.css %>']
            },
            delJs: {
                src: ['<%= buildPaths.js %>']
            },
            delHtml: {
                src: ['<%= buildPaths.html %>']
            },
            delZip: ['<%= archive %>*.zip'], //先删除先前生成的压缩包
            delTmp: ['.tmp'],
            delInclude: ['build/assets/include']
        },
        concat: {
            build: {
                options: {
                    separator: '\n'
                },
                src: ['<%= paths.js %>/*.js'],
                dest: '<%= buildPaths.js %>/concatIndex.js'
            }
        },
        copy: {
            main: {
                files: [
                    //{expand: true, src: ['<%= paths.assets %>/*.html'], dest: 'build/'},
                    {expand: true, src: ['<%= paths.css %>/*.css'], dest: 'build/'},
                    {expand: true, src: ['<%= paths.img %>/**'], dest: 'build/'},
                    {expand: true, src: ['<%= paths.js %>/**'], dest: 'build/'},
                    {
                        expand: true,
                        src: ['*', '!build', '!test', '!.gitignore', '!.DS_Store', '!Gruntfile.js', '!package.json', '!node_modules/**', '!go.sh', '!.ftppass', '!<%= archive %>*.zip'],
                        dest: 'build/'
                    }
                ]
            },
            copyHtml: {
                files: [
                    {expand: true, src: ['assets/**/*.html'], dest: 'build'}
                ]
            }
        },
        useminPrepare: {
            html: ['assets/*.html'],
            options: {
                dest: 'build/assets'
            }
        },
        usemin: {
            html: ['build/assets/*.html']
        },
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },

                files: [
                    {
                        expand: true,
                        cwd: '<%= buildPaths.build %>',
                        src: ['**/*.html'],
                        dest: '<%= buildPaths.build %>'
                    }
                ]
            }
        },
        imagemin: {
            build: {
                options: {
                    optimizationLevel: 4
                },

                files: [
                    {
                        expand: true,
                        cwd: 'assets/',
                        src: ['**/*.{jpg,png,gif}'],
                        dest: 'build/assets/'
                    }
                ]
            }
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                node: true
            },
            files: ['<%= paths.js %>/app/*.js']
        },
        less: {
            build: {
                options: {
                    compress: true,
                    optimization: 2,
                    banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %>' + ' Licensed <%= pkg.license %> */\n'
                    //cleancss: true,
                    //sourceMap: true,
                    //sourceMapFilename: "<%= paths.css %>/source.map",
                    //sourceMapBasepath: "<%= paths.css %>"
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= paths.less %>",
                        src: ["**/*.less"],
                        dest: "<%= paths.css %>",
                        ext: ".css"
                    }
                ]
            }
        },
        sass: {
            dist: {
                files: {
                    'assets/css/scss.css': 'assets/css/scss/scss.scss'
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: '<%= archive %>-<%= grunt.template.today("yyyy") %>年<%= grunt.template.today("mm") %>月<%= grunt.template.today("dd") %>日<%= grunt.template.today("h") %>时<%= grunt.template.today("TT") %>.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*'],
                dest: ''
            }
        },
        //grunt-cssc整合CSS文件样式规则，最大限度削减重复内容
        cssc: {
            build: {
                options: {
                    consolidateViaDeclarations: true,
                    consolidateViaSelectors: true,
                    consolidateMediaQueries: true
                },
                files: {
                    '<% paths.css %>/index.css': '<%= paths.css %>/index.css'
                }
            }
        },

        //按照预定义的排序格式重新排列CSS中定义的属性
        csscomb: {
            options: {
                config: 'assets/js/libs/csscomb.json'
            },
            files: {
                expand: true,
                cwd: 'assets/css/',
                src: ['**/*.css'],
                dest: 'assets/css/',
                ext: '.css'
            }
        },
        uncss: {
            dist: {
                options: {
                    csspath: 'css/',
                    stylesheets: ['base.css', 'index.css'],
                    report: 'min'
                },
                files: {
                    '<%= paths.css %>/tidy.css': ['<%= paths.assets %>/index.html']
                }
            }
        },
        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            default: {
                files: [
                    {
                        src: [
                            'build/**/*.css',
                            'build/**/*.js'
                        ]
                    }
                ]
            }
        },

        yuidoc: {
            compile: {
                options: {
                    paths: '<%= paths.js %>/',
                    themedir: 'theme/',
                    outdir: 'docs/'
                }
            }
        },
        requirejs: {
            build: {
                options: {
                    appDir: 'assets',
                    baseUrl: 'js',
                    dir: 'build',
                    optimize: 'uglify2',
                    generateSourceMaps: false,
                    preserveLicenseComments: false,
                    useSourceUrl: true,
                    optimizeCss: 'standard',
                    paths: {
                        'jquery': 'libs/jquery-1.11.2.min',
                        'wkAlbum': 'app/jquery.wkAlbum',
                        'winScroll': 'app/jquery.winScroll',
                        'winModal': 'app/jquery.winModal',
                        'domready': 'utils/domready',
                        'main': 'app/index'
                    },
                    shim: {},
                    modules: [
                        {
                            name: 'index'
                        }
                    ]
                }
            }
        },
        qunit: {
            files: ['test/*.html']
        },

        browserSync: {
            bsFiles: {
                src: 'assets/**'
            },
            options: {
                server: {
                    baseDir: "./"
                },
                watchTask: true,
                port: 3000,
                reloadDelay: 100
            }
        },
        includereplace: {
            default: {
                options: {
                    prefix: '@@',
                    suffix: ''
                },
                src: 'assets/index.html',
                dest: 'build/'
            }
        },
        htmlhint: {
            default: {
                src: ['assets/*.html']
            }
        },
        csslint: {
            default: {
                src: ['assets/css/*.css']
            }
        },

        // 通过connect任务，创建一个静态服务器
        connect: {
            server: {
                options: {
                    // 服务器端口号
                    port: 8088,
                    // 服务器地址(可以使用主机名localhost，也能使用IP)
                    hostname: 'localhost',
                    // 物理路径(默认为. 即根目录)
                    base: './',
                    livereload: true
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },

            prd: {
                files: ['assets/**/*.*'],
                tasks: ['copy:copyHtml', 'includereplace', 'useminPrepare', 'concat:generated', 'uglify:generated', 'cssmin:generated', 'usemin', 'clean:delTmp', 'clean:delInclude']
            }
        }
    });

    // 默认执行的任务
    grunt.registerTask('default', ['live', 'prd']);

    // 自定义任务
    grunt.registerTask('buildcss', ['cssmin']);
    grunt.registerTask('live', ['browserSync', 'connect', 'watch']);

    //Prd
    grunt.registerTask('prd', ['clean:build','copy:copyHtml', 'useminPrepare', 'concat:generated', 'uglify:generated', 'cssmin:generated', 'filerev', 'usemin', 'imagemin', 'htmlmin','clean:delTmp']);
};