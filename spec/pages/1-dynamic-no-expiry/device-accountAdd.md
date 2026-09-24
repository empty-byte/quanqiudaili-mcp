# 添加动态住宅流量子账号

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/device/accountAdd:
    post:
      summary: 添加动态住宅流量子账号
      deprecated: false
      description: 添加动态住宅流量子账号
      tags:
        - 用户IP子账号管理/动态住宅流量子账号（不限时长）
      parameters:
        - name: token
          in: header
          description: ''
          required: false
          example: '{{access_token}}'
          schema:
            type: string
      requestBody:
        content:
          application/x-www-form-urlencoded:
            schema:
              type: object
              properties:
                product_type_id:
                  description: 产品类型id，此处固定类别为：1
                  example: 1
                  type: integer
                num:
                  description: 需要生成的子账号数量
                  example: 1
                  type: integer
                changeInterval:
                  description: IP切换周期，5-120分钟可选
                  example: 5
                  type: integer
                country:
                  description: >-
                    国家编码，例如：US。从<a href='/api-222033933'
                    target='_blank'>动态住宅国家列表</a>获取
                  example: US
                  type: string
                url:
                  description: 业务网址
                  example: ''
                  type: string
                use_random_username:
                  description: 创建时是否使用随机账号和密码。0=不使用，1=使用
                  example: 1
                  type: integer
                limit_flow:
                  type: integer
                  description: 流量上限
                  example: 1
              required:
                - product_type_id
                - num
                - changeInterval
                - country
            examples: {}
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
                    description: 执行时间戳
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        password:
                          type: string
                          title: 密码
                        username:
                          type: string
                          title: 账号
                        id:
                          type: integer
                          title: id
                        is_bind:
                          type: string
                        bindUser:
                          type: string
                        disabled:
                          type: integer
                          title: 是否禁用
                        bindPassword:
                          type: string
                        createTime:
                          type: string
                          title: 创建时间
                        port:
                          type: integer
                          title: 端口
                        agree:
                          type: string
                          title: 协议(http/https/socks5实际都支持)
                        target:
                          type: string
                          title: 域名
                        poolStatus:
                          type: string
                          title: 子账号状态
                        changeInterval:
                          type: integer
                          title: 切换周期
                        expiresIn:
                          type: integer
                        expiresDate:
                          type: string
                        ip:
                          type: string
                        bill:
                          type: string
                          title: 已用流量
                        is_diff:
                          type: integer
                        country:
                          type: string
                          title: 城市code
                        countryName:
                          type: string
                          title: 城市名称
                        state:
                          type: string
                        remark:
                          type: string
                          title: 备注
                        city:
                          type: string
                        limit_flow:
                          type: integer
                          title: 限制流量
                      x-apifox-orders:
                        - password
                        - username
                        - id
                        - is_bind
                        - bindUser
                        - disabled
                        - bindPassword
                        - createTime
                        - port
                        - agree
                        - target
                        - poolStatus
                        - changeInterval
                        - expiresIn
                        - expiresDate
                        - ip
                        - bill
                        - is_diff
                        - country
                        - countryName
                        - state
                        - remark
                        - city
                        - limit_flow
                required:
                  - code
                  - msg
                  - time
                  - data
                x-apifox-orders:
                  - code
                  - msg
                  - time
                  - data
              example:
                code: 1
                msg: 创建成功!
                time: '1752746761'
                data:
                  - password: test
                    username: test-60
                    id: 60
                    is_bind: 否
                    bindUser: test
                    disabled: 0
                    bindPassword: z4b8zhwl
                    createTime: '2025-07-17 18:06:03'
                    port: 5001
                    agree: SOCKS5
                    target: proxy.quanqiudaili.com
                    poolStatus: ''
                    changeInterval: 300
                    expiresIn: 0
                    expiresDate: '1970-01-01 08:00:00'
                    ip: ''
                    bill: '0.00'
                    is_diff: 0
                    country: US
                    countryName: 美国
                    state: ''
                    remark: ''
                    city: ''
                    limit_flow: 0
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号（不限时长）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222033936-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
