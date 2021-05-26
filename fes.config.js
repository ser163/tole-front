module.exports = {
    // 可选有vertical、horizontal，默认vertical
    mode: 'vertical',
    // 可选有blue、dark，默认blue
    theme: 'blue',
    // 项目名称
    fesName: '密码树洞',
    favicon: 'static/favicon.ico', // 图标
    lazyRouter: true,
    // 环境变量配置, 默认使用local环境
    env: {
        // 本地开发环境
        local: {
            api: 'http://pw.com/'
        },
        // 测试环境 --env=sit 触发使用
        develop: {
            api: 'http://pw.com/'
        },
        // 生产环境 --env=sit 触发使用
        prod: {
            api: 'http://pw.com/'
        }
    },
    // 配置角色-路由访问权限，使用FesApp.setRole('unLogin')来修改当前用户的角色，控制路由访问权限
    roles: {
        unLogin: ['/'],
        admins: ['/dashboard/console', '*'],
        users: ['/dashboard/console',
            '/my',
            '/hole/new',
            '/hole/find']
    },
    // map
    map: {
        level: [['1', '青铜'], ['2', '白银'], ['3', '黄金'], ['4', '铂金']]
    },
    // 左侧菜单配置
    menu: [
        {
            title: '工作台',
            subMenu: [
                {
                    title: '工作台',
                    path: '/dashboard/console'
                },
                {
                    title: '用户管理',
                    path: '/dashboard/user'
                },
                {
                    title: '用户角色',
                    path: '/dashboard/role'
                },
                {
                    title: '用户登录记录',
                    path: '/dashboard/ulogs'
                },
                {
                    title: '用户操作记录',
                    path: '/dashboard/history'
                },
                {
                    title: '组织架构',
                    path: '/dashboard/depart'
                }
            ]
        },
        {
            title: '树洞',
            subMenu: [
                {
                    title: '新建密码',
                    path: '/hole/new'
                }
            ]
        },
        {
            title: '规则',
            subMenu: [
                {
                    title: '规则列表',
                    path: '/rules/list'
                }
            ]
        },
        {
            title: '关于',
            path: '/about'
        }
    ],
    i18n: {
        // default zh-cn
        locale: 'zh-cn',
        messages: {
            'zh-cn': {
                menu: {
                    internationalization: '国际化'
                },
                overview: '概述',
                i18n: {
                    internationalization: '国际化，基于',
                    achieve: '实现。',
                    ui: 'UI组件'
                },
                title: '密码树洞'
            },
            en: {
                menu: {
                    internationalization: 'internationalization'
                },
                overview: 'Overview',
                i18n: {
                    internationalization: 'internationalization，base on',
                    achieve: 'to achieve.',
                    ui: 'UI components'
                },
                title: 'PW hole'
            }
        }
    }
};
