# 获取数据中心地区库存详情

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/inventory/getBuyProductSku:
    get:
      summary: 获取数据中心地区库存详情
      deprecated: false
      description: 获取静态住宅时长对应国家列表
      tags:
        - 用户IP子账号管理/数据中心时长子账号
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定为：8
          required: true
          example: 8
          schema:
            type: integer
        - name: country_code
          in: query
          description: 国家code。
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
                    description: 响应编码:1=正常,0=错误
                  msg:
                    type: string
                    description: 响应说明
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      countrys:
                        type: array
                        items:
                          type: object
                          properties:
                            id:
                              type: integer
                              title: 国家id。即：country_id
                            name:
                              type: string
                              title: 国家名称
                            image:
                              type: string
                            code:
                              type: string
                              title: 国家编码
                            type_text:
                              type: string
                            status_text:
                              type: string
                          required:
                            - id
                            - name
                            - image
                            - code
                            - type_text
                            - status_text
                          x-apifox-orders:
                            - id
                            - name
                            - image
                            - code
                            - type_text
                            - status_text
                        title: 国家列表
                    required:
                      - countrys
                    x-apifox-orders:
                      - countrys
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
                    time: '1750131384'
                    data:
                      - country_id: 1905
                        city_id: 1697480
                        country_name: 美国
                        country_code: US
                        city_name: New York City
                        use_random_city: 0
                        remark: 紧缺
                        sku_status: 1
                '2':
                  summary: 成功示例
                  value:
                    code: 1
                    msg: ok
                    time: '1750044858'
                    data:
                      - country_id: 1770
                        city_id: 3002835
                        num: 1986
                        country_name: 中国香港
                        country_code: HK
                        city_name: Hong Kong
                        use_random_city: 1
                        remark: 充足
                        sku_status: 0
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/数据中心时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-309091222-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
