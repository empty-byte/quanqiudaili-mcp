# 添加动态住宅流量（包月）子账号

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
      summary: 添加动态住宅流量（包月）子账号
      deprecated: false
      description: 添加动态住宅流量子账号
      tags:
        - 用户IP子账号管理/动态住宅流量子账号 （包月）
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
                  description: 产品类型id，此处固定类别为：6
                  example: 6
                  type: integer
                num:
                  description: 需要生成的子账号数量
                  example: 1
                  type: integer
                changeInterval:
                  description: IP时长，5-120分钟可选
                  example: 5
                  type: integer
                agree:
                  description: 协议：SOCKS5，HTTP，HTTPS
                  example: SOCKS5
                  type: string
                country:
                  description: >-
                    国家编码，例如：US。从<a href='/api-222526763'
                    target='_blank'>动态住宅（包月）国家列表</a>获取
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
              required:
                - product_type_id
                - num
                - changeInterval
                - agree
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
                        username:
                          type: string
                        id:
                          type: integer
                        is_bind:
                          type: string
                        bindUser:
                          type: string
                        disabled:
                          type: integer
                        bindPassword:
                          type: string
                        createTime:
                          type: string
                        port:
                          type: integer
                        agree:
                          type: string
                        target:
                          type: string
                        poolStatus:
                          type: string
                        changeInterval:
                          type: integer
                        expiresIn:
                          type: integer
                        expiresDate:
                          type: string
                        ip:
                          type: string
                        bill:
                          type: string
                        is_diff:
                          type: integer
                        country:
                          type: string
                        countryName:
                          type: string
                        state:
                          type: string
                        remark:
                          type: string
                        city:
                          type: string
                        limit_flow:
                          type: integer
                required:
                  - code
                  - msg
                  - time
                  - data
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号 （包月）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222526765-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
