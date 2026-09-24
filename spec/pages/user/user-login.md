# 会员登陆

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/user/login:
    post:
      summary: 会员登陆
      deprecated: false
      description: 接口目前只支持账号密码登录,不支持验证码登录。
      tags:
        - 用户管理
      parameters: []
      requestBody:
        content:
          application/x-www-form-urlencoded:
            schema:
              type: object
              properties:
                account:
                  description: 用户名/邮箱/手机号
                  example: '123456'
                  type: string
                password:
                  description: 密码
                  example: test
                  type: string
              required:
                - account
                - password
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                    description: 响应编码:1=正常,0=错误
                  msg:
                    type: string
                    description: 响应说明
                  type:
                    type: integer
                  data:
                    type: object
                    properties:
                      userinfo:
                        type: object
                        properties:
                          id:
                            type: integer
                            description: user id
                          username:
                            type: string
                            description: 用户名
                          nickname:
                            type: string
                            description: 昵称
                          email:
                            type: string
                            description: 邮件地址
                          mobile:
                            type: string
                            description: 手机
                          email_verify:
                            type: integer
                            description: 邮箱验证，0=未验证，1=已验证
                          mobile_verify:
                            type: integer
                            description: 手机验证，0=未验证，1=已验证
                          avatar:
                            type: string
                            description: 头像
                          duties:
                            type: 'null'
                            description: 职位
                          gender:
                            type: integer
                            description: 性别
                          money:
                            type: string
                            description: 用户余额
                          score:
                            type: integer
                            description: 积分
                          extension_status:
                            type: integer
                            description: 推广状态:0=未激活,1=审核中,2=激活成功,3=激活失败
                          verify_status:
                            type: string
                            description: 实名验证状态:0=未实名认证,1=已通过实名认证
                          owner_verify_status:
                            type: string
                            description: 企业认证:0=未认证,1=已认证
                          ref:
                            type: string
                            description: 推广代码
                          channel:
                            type: string
                            description: 推广方式：0=用户推广，1=渠道推广
                          origin_money:
                            type: string
                            description: 充值金额
                          give_money:
                            type: string
                            description: 赠送金额
                          user_id:
                            type: integer
                            description: 同id
                          token:
                            type: string
                            description: 用户的登录权限token。即：access_token
                        required:
                          - id
                          - username
                          - nickname
                          - email
                          - mobile
                          - email_verify
                          - mobile_verify
                          - avatar
                          - duties
                          - gender
                          - money
                          - score
                          - extension_status
                          - verify_status
                          - owner_verify_status
                          - ref
                          - channel
                          - origin_money
                          - give_money
                          - user_id
                          - token
                        x-apifox-orders:
                          - id
                          - username
                          - nickname
                          - email
                          - mobile
                          - email_verify
                          - mobile_verify
                          - avatar
                          - duties
                          - gender
                          - money
                          - score
                          - extension_status
                          - verify_status
                          - owner_verify_status
                          - ref
                          - channel
                          - origin_money
                          - give_money
                          - user_id
                          - token
                        description: 用户信息
                    required:
                      - userinfo
                    x-apifox-orders:
                      - userinfo
                required:
                  - code
                  - msg
                  - type
                  - data
                x-apifox-orders:
                  - code
                  - msg
                  - type
                  - data
              example:
                code: 1
                msg: 登录成功
                type: 1
                data:
                  userinfo:
                    id: 321
                    username: userxxxxx
                    nickname: xiaoming
                    email: email@qq.com
                    mobile: ''
                    email_verify: 1
                    mobile_verify: 0
                    avatar: >-
                      data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgaGVpZ2h0PSIxMDAiIHdpZHRoPSIxMDAiPjxyZWN0IGZpbGw9InJnYigxNjEsMTYwLDIyOSkiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48L3JlY3Q+PHRleHQgeD0iNTAiIHk9IjUwIiBmb250LXNpemU9IjUwIiB0ZXh0LWNvcHk9ImZhc3QiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIHRleHQtcmlnaHRzPSJhZG1pbiIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPjc8L3RleHQ+PC9zdmc+
                    duties: null
                    gender: 0
                    purpose: null
                    money: '8888'
                    score: 8888
                    extension_status: 2
                    verify_status: '1'
                    owner_verify_status: '0'
                    ref: '0'
                    channel: '1'
                    origin_money: '3293.23'
                    give_money: '54.19'
                    token: token123456
                    user_id: 1
                    createtime: 1697527680
                    expiretime: 1700119680
                    expires_in: 2591999
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户管理
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222033982-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
