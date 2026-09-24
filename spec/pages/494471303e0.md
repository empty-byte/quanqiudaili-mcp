# 购买静态住宅（运营商原生）时长IP

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/createProductBuyOrder:
    post:
      summary: 购买静态住宅（运营商原生）时长IP
      deprecated: false
      description: 购买静态住宅（运营商原生）时长IP
      tags:
        - 用户IP子账号管理/静态住宅（运营商原生）时长子账号
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
                  description: 产品类型id，此处固定为：4
                  example: 4
                  type: integer
                num:
                  description: 需要购买的子账号数量。范围：1-300之间
                  example: 1
                  type: integer
                timelen:
                  description: 时长计费类型：0=7天，1=30天，2=90天，3=180天，4=360天，5=3天
                  example: 0
                  type: integer
                agree:
                  description: 协议：SOCKS5，HTTP，HTTPS
                  example: SOCKS5
                  type: string
                country:
                  description: >-
                    静态住宅国家编码code，例如：US。可从<a href='/494471298e0'
                    target='_blank'>静态住宅（运营商原生）国家列表获取</a>
                  example: US
                  type: string
                city:
                  description: >-
                    静态住宅城市名称。在<a href='/494471299e0'
                    target='_blank'>静态住宅（运营商原生）城市列表</a>可获取城市名称。不传默认随机。
                  example: Los Angeles
                  type: string
                bandwidth_num:
                  type: integer
                  description: 带宽值
                  example: 5
                appoint_ip[0][ip_str]:
                  description: 指定段
                  example: '149.52'
                  type: string
                appoint_ip[0][count]:
                  description: 数量
                  example: '1'
                  type: string
                exclude_ip_str:
                  description: 排除ip段，多个以英文逗号分隔
                  example: '38.30'
                  type: string
                remark:
                  description: 创建的子账号备注
                  example: test
                  type: string
                use_ip_port:
                  type: integer
                  description: 是否开启ip端口连接:0=不开启,1=开启(默认为0)
                  example: 0
                random_account_password:
                  type: integer
                  description: 是否生成随机账号密码:0=否,1=是(默认为0)
                  example: 0
              required:
                - product_type_id
                - num
                - timelen
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
                  data:
                    type: object
                    properties:
                      sub_accounts:
                        type: array
                        items:
                          type: object
                          properties:
                            password:
                              type: string
                              title: 密码
                            username:
                              type: string
                              title: 用户名
                            id:
                              type: integer
                              title: 子账号id(用于续费或修改)
                            is_bind:
                              type: string
                            bindUser:
                              type: string
                            disabled:
                              type: integer
                              title: 是否被禁用
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
                              title: 协议
                            target:
                              type: string
                              title: 代理主机 / 地址
                            changeInterval:
                              type: integer
                            expiresIn:
                              type: integer
                              title: 到期时间戳
                            ip:
                              type: string
                              title: 出口ip
                            bill:
                              type: string
                              title: 已使用流量
                            is_diff:
                              type: integer
                            country:
                              type: string
                              title: 国家code
                            countryName:
                              type: string
                              title: 国家名称
                            state:
                              type: string
                              title: 洲
                            remark:
                              type: string
                              title: 备注
                            city:
                              type: string
                              title: 城市名称
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
                            - changeInterval
                            - expiresIn
                            - ip
                            - bill
                            - is_diff
                            - country
                            - countryName
                            - state
                            - remark
                            - city
                      order_number:
                        type: string
                        title: 订单编号
                    required:
                      - sub_accounts
                      - order_number
                    x-apifox-orders:
                      - sub_accounts
                      - order_number
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
                msg: 购买成功
                time: '1746667816'
                data:
                  sub_accounts:
                    - password: test
                      username: test
                      id: 9
                      is_bind: 否
                      bindUser: test
                      disabled: 0
                      bindPassword: test
                      createTime: '2025-05-08 09:30:17'
                      port: 5001
                      agree: SOCKS5
                      target: proxy.quanqiudaili.com
                      changeInterval: 0
                      expiresIn: 1747272617
                      ip: 38.30.214.96
                      bill: '0.00'
                      is_diff: 0
                      country: US
                      countryName: 美国
                      state: California
                      remark: ''
                      city: Los Angeles
                  order_number: 20250508093017ekVwhy
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（运营商原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-494471303-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
