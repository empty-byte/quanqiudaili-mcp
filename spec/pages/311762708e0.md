# 购买静态住宅（原生）时长测试IP

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/createTestOrder:
    post:
      summary: 购买静态住宅（原生）时长测试IP
      deprecated: false
      description: 购买静态住宅时长测试IP，购买测试IP通常用于自有平台短期时长购买，购买会按照时长扣费
      tags:
        - 用户IP子账号管理/静态住宅（原生）时长子账号
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
                  description: 产品类型id，此处固定为：3
                  example: 3
                  type: integer
                num:
                  description: 需要短期购买的子账号数量。范围：1-20之间
                  example: 1
                  type: integer
                timelen:
                  description: 时长计费：固定为12小时
                  example: 72
                  type: integer
                agree:
                  description: 协议：SOCKS5，HTTP，HTTPS
                  example: SOCKS5
                  type: string
                country:
                  description: 静态住宅国家编码code
                  example: US
                  type: string
                city:
                  description: 静态住宅城市名称,不传默认随机。
                  example: Los Angeles
                  type: string
                bandwidth_num:
                  description: 不传默认是5M，可传值10和15,10M按每条人民币10元,15M按每条人民币15元计费
                  example: '8'
                  type: string
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
                      orderProductBuy:
                        type: object
                        properties:
                          user_id:
                            type: integer
                          order_number:
                            type: string
                          description:
                            type: string
                          pay_gateway:
                            type: integer
                          order_status:
                            type: integer
                          order_category:
                            type: integer
                          origin_money:
                            type: string
                          real_money:
                            type: string
                          balance:
                            type: string
                          createtime:
                            type: integer
                          product_type_id:
                            type: integer
                          scope_native:
                            type: string
                          scene:
                            type: string
                          buy_num:
                            type: string
                          country:
                            type: string
                          area:
                            type: string
                          id:
                            type: string
                        required:
                          - user_id
                          - order_number
                          - description
                          - pay_gateway
                          - order_status
                          - order_category
                          - origin_money
                          - real_money
                          - balance
                          - createtime
                          - product_type_id
                          - scope_native
                          - scene
                          - buy_num
                          - country
                          - area
                          - id
                        x-apifox-orders:
                          - user_id
                          - order_number
                          - description
                          - pay_gateway
                          - order_status
                          - order_category
                          - origin_money
                          - real_money
                          - balance
                          - createtime
                          - product_type_id
                          - scope_native
                          - scene
                          - buy_num
                          - country
                          - area
                          - id
                        title: 订单信息
                      rows:
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
                          required:
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
                        title: 子账号详情
                    required:
                      - orderProductBuy
                      - rows
                    x-apifox-orders:
                      - orderProductBuy
                      - rows
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
              examples:
                '1':
                  summary: 成功示例
                  value:
                    code: 1
                    msg: ok
                    time: '1755667649'
                    data:
                      orderProductBuy:
                        user_id: 77
                        order_number: 20250820132733kNewGL
                        description: 【独享静态住宅（本土原生）】，国家/地区：US，城市：，数量：1
                        pay_gateway: 3
                        order_status: 2
                        order_category: 4
                        origin_money: '6.00'
                        real_money: '6.00'
                        balance: '0.07'
                        createtime: 1755667653
                        product_type_id: 3
                        scope_native: local
                        scene: ''
                        buy_num: '1'
                        country: US
                        area: ''
                        id: '43550'
                      rows:
                        - password: test
                          username: test
                          id: 11
                          is_bind: 否
                          bindUser: test
                          disabled: 0
                          bindPassword: test
                          createTime: '2025-08-20 13:27:32'
                          port: 5001
                          agree: SOCKS5
                          target: proxy.quanqiudaili.com
                          poolStatus: ''
                          changeInterval: 0
                          expiresIn: 1755926851
                          expiresDate: '2025-08-23 13:27:31'
                          ip: 96.62.48.237
                          bill: '0.00'
                          is_diff: 0
                          country: US
                          countryName: 美国
                          state: ''
                          remark: ''
                          city: ''
                '2':
                  summary: 异常示例
                  value:
                    code: 0
                    msg: 您没有赠送该类别产品71小时的权限
                    time: '1755667566'
                    data: null
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-311762708-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
