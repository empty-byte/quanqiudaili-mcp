# 静态住宅（普通非原生）申请退单

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/order_back/createOrderBack:
    post:
      summary: 静态住宅（普通非原生）申请退单
      deprecated: false
      description: 不同订单购买的子账号退单时请分别请求
      tags:
        - 用户IP子账号管理/静态住宅（普通非原生）时长子账号
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
                order_product_buy_id:
                  type: integer
                  description: 订单id，对应子账号列表里的order_product_buy_id
                  example: 1
                ids[]:
                  description: 子账号id，对应子账号列表里的id
                  example:
                    - '1'
                    - '2'
                  type: array
                remark:
                  description: 退单备注
                  example: 退单备注
                  type: string
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
                    description: 响应时间戳
                  data:
                    type: string
                    description: 退单详情
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
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（普通非原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-386072997-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
