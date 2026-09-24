# 生成带宽升级订单

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_order/createBandwidthUpgradeOrder:
    get:
      summary: 生成带宽升级订单
      deprecated: false
      description: ''
      tags:
        - 增值带宽
      parameters:
        - name: subAccountIds[]
          in: query
          description: 子账号
          required: false
          example:
            - '33'
            - '32'
          schema:
            type: array
            items:
              type: string
        - name: bandwidth_num
          in: query
          description: 要升级的带宽
          required: false
          example: '30'
          schema:
            type: string
        - name: product_type_id
          in: query
          description: 产品类型
          required: false
          example: '3'
          schema:
            type: string
        - name: pay_method
          in: query
          description: 支付方式alipay,wechat,balance
          required: false
          example: balance
          schema:
            type: string
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
                  msg:
                    type: string
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
                          country:
                            type: string
                          createtime:
                            type: integer
                          product_type_id:
                            type: integer
                          scope_native:
                            type: string
                          buy_num:
                            type: integer
                          is_use_custom_unit_price:
                            type: integer
                          use_custom_price_limit:
                            type: integer
                          is_bandwidth_upgrade_order:
                            type: integer
                          id:
                            type: string
                            title: 订单id
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
                          - country
                          - createtime
                          - product_type_id
                          - scope_native
                          - buy_num
                          - is_use_custom_unit_price
                          - use_custom_price_limit
                          - is_bandwidth_upgrade_order
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
                          - country
                          - createtime
                          - product_type_id
                          - scope_native
                          - buy_num
                          - is_use_custom_unit_price
                          - use_custom_price_limit
                          - is_bandwidth_upgrade_order
                          - id
                        title: 订单信息
                    required:
                      - orderProductBuy
                    x-apifox-orders:
                      - orderProductBuy
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
                msg: 带宽升级订单创建成功！
                time: '1755159289'
                data:
                  orderId: 772
                  orderNumber: 20250814161450689d9afa058a4
                  price: '2030.00'
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 增值带宽
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-356575332-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
