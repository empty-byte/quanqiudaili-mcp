# 获取用户信息

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/user/getUserInfo:
    get:
      summary: 获取用户信息
      deprecated: false
      description: 获取用户信息
      tags:
        - 用户管理
      parameters:
        - name: token
          in: header
          description: ''
          required: false
          example: '{{access_token}}'
          schema:
            type: string
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
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      id:
                        type: integer
                      username:
                        type: string
                        description: 用户名
                      nickname:
                        type: string
                        description: 昵称
                      email:
                        type: string
                        description: 用户邮箱
                      mobile:
                        type: string
                        description: 手机号
                      email_verify:
                        type: integer
                        description: 邮件是否验证。0=未验证，1=已验证
                      mobile_verify:
                        type: integer
                        description: 手机号码是否验证。0=未验证，1=已验证
                      avatar:
                        type: string
                        description: 头像
                      duties:
                        type: 'null'
                      gender:
                        type: integer
                      purpose:
                        type: 'null'
                      money:
                        type: string
                        description: 账户余额
                      score:
                        type: integer
                        description: 账户积分
                      extension_status:
                        type: integer
                        description: 推广状态：0=未激活，1=审核中，2=激活成功，3=激活失败
                      verify_status:
                        type: string
                        description: 验证状态：0=未实名认证，1=已通过支付宝扫码实名认证
                      owner_verify_status:
                        type: string
                        description: 企业认证：0=未认证，1=已认证
                      ref:
                        type: string
                        description: 推广链接
                      channel:
                        type: string
                        description: 推广方式：0=用户推广，1=渠道推广
                      origin_money:
                        type: string
                      give_money:
                        type: string
                      token:
                        type: string
                        description: 登录token
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
                      - purpose
                      - money
                      - score
                      - extension_status
                      - verify_status
                      - owner_verify_status
                      - ref
                      - channel
                      - origin_money
                      - give_money
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
                      - purpose
                      - money
                      - score
                      - extension_status
                      - verify_status
                      - owner_verify_status
                      - ref
                      - channel
                      - origin_money
                      - give_money
                      - token
                x-apifox-orders:
                  - code
                  - msg
                  - time
                  - data
                required:
                  - code
                  - msg
                  - time
                  - data
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户管理
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222033983-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
