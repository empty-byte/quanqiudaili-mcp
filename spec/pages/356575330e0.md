# 带宽套餐列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/bandwidth/getBandwidthList:
    get:
      summary: 带宽套餐列表
      deprecated: false
      description: ''
      tags:
        - 增值带宽
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型
          required: false
          example: '3'
          schema:
            type: string
        - name: country
          in: query
          description: 地区
          required: false
          example: US
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
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: integer
                        name:
                          type: string
                          title: 套餐名称
                        num:
                          type: integer
                          title: 带宽值
                        price:
                          type: string
                          title: 单价
                        month_price:
                          type: string
                          title: 30天价格
                        is_diy:
                          type: string
                          title: 是否自定义
                        is_recommend:
                          type: string
                          title: 是否推荐
                        discount:
                          type: string
                          title: 折扣
                      required:
                        - id
                        - name
                        - num
                        - price
                        - month_price
                        - is_diy
                        - is_recommend
                        - discount
                      x-apifox-orders:
                        - id
                        - name
                        - num
                        - price
                        - month_price
                        - is_diy
                        - is_recommend
                        - discount
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
                msg: 获取成功!
                time: '1755157406'
                data:
                  - id: 1
                    name: 基础性
                    num: 5
                    price: '0.00'
                    is_diy: '0'
                    is_recommend: '0'
                    discount: '100.00'
                  - id: 2
                    name: 标准型
                    num: 10
                    price: '2.50'
                    is_diy: '0'
                    is_recommend: '1'
                    discount: '100.00'
                  - id: 3
                    name: 增强型
                    num: 20
                    price: '7.50'
                    is_diy: '0'
                    is_recommend: '0'
                    discount: '100.00'
                  - id: 4
                    name: 专业性
                    num: 50
                    price: '22.50'
                    is_diy: '0'
                    is_recommend: '0'
                    discount: '100.00'
                  - id: 5
                    name: 自定义100M
                    num: 100
                    price: '47.50'
                    is_diy: '1'
                    is_recommend: '0'
                    discount: '85.00'
                  - id: 6
                    name: 自定义200
                    num: 200
                    price: '97.50'
                    is_diy: '1'
                    is_recommend: '0'
                    discount: '80.00'
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 增值带宽
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-356575330-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
