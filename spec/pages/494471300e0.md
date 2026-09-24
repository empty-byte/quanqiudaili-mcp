# 获取静态住宅（运营商原生）地区库存详情

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
      summary: 获取静态住宅（运营商原生）地区库存详情
      deprecated: false
      description: 获取静态住宅（运营商原生）时长对应国家列表
      tags:
        - 用户IP子账号管理/静态住宅（运营商原生）时长子账号
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定为：4
          required: true
          example: 4
          schema:
            type: integer
        - name: country_code
          in: query
          description: 国家code
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
                    type: array
                    items:
                      type: object
                      properties:
                        country_id:
                          type: integer
                        city_id:
                          type: integer
                        country_name:
                          type: string
                        country_code:
                          type: string
                          title: 国家code
                        city_name:
                          type: string
                        city_code:
                          type: string
                          title: 城市code
                        use_random_city:
                          type: integer
                        remark:
                          type: string
                          title: 备注
                        sku_status:
                          type: integer
                          title: 库存标识:0=充足,1=城市
                      x-apifox-orders:
                        - country_id
                        - city_id
                        - country_name
                        - country_code
                        - city_name
                        - city_code
                        - use_random_city
                        - remark
                        - sku_status
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
                      - country_id: 1770
                        city_id: 3002835
                        country_name: 中国香港
                        country_code: HK
                        city_name: Hong Kong
                        use_random_city: 1
                        remark: 充足
                        sku_status: 0
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
      x-apifox-folder: 用户IP子账号管理/静态住宅（运营商原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-494471300-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
