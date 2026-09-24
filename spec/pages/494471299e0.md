# 获取静态住宅（运营商原生）对应城市列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/inventory/cityList:
    get:
      summary: 获取静态住宅（运营商原生）对应城市列表
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
        - name: country_id
          in: query
          description: >-
            国家id。可从<a href='/494471298e0'
            target='_blank'>静态住宅（运营商原生）国家列表获取</a>。country_id 和 country_code 二选一
          required: false
          example: '653'
          schema:
            type: string
        - name: country_code
          in: query
          description: >-
            国家code。可从<a href='/494471298e0'
            target='_blank'>静态住宅（运营商原生）国家列表获取</a>。country_id 和 country_code 二选一
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
                        id:
                          type: integer
                        name:
                          type: string
                          title: 名称
                        code:
                          type: string
                          title: code
                        country_id:
                          type: integer
                      required:
                        - id
                        - name
                        - code
                        - country_id
                      x-apifox-orders:
                        - id
                        - name
                        - code
                        - country_id
                    title: 城市列表
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
                time: '1753173843'
                data:
                  - id: 3902
                    name: New York City
                    code: New York City
                    country_id: 653
                  - id: 3905
                    name: Chicago
                    code: Chicago
                    country_id: 653
                  - id: 3906
                    name: Seattle
                    code: Seattle
                    country_id: 653
                  - id: 3909
                    name: Dallas
                    code: Dallas
                    country_id: 653
                  - id: 3910
                    name: Houston
                    code: Houston
                    country_id: 653
                  - id: 3911
                    name: Los Angeles
                    code: Los Angeles
                    country_id: 653
                  - id: 3912
                    name: San Francisco
                    code: San Francisco
                    country_id: 653
                  - id: 3913
                    name: Las Vegas
                    code: Las Vegas
                    country_id: 653
                  - id: 3914
                    name: Phoenix
                    code: Phoenix
                    country_id: 653
                  - id: 3915
                    name: Washington
                    code: Washington
                    country_id: 653
                  - id: 3916
                    name: Boston
                    code: Boston
                    country_id: 653
                  - id: 3917
                    name: Philadelphia
                    code: Philadelphia
                    country_id: 653
                  - id: 3950
                    name: Columbia
                    code: Columbia
                    country_id: 653
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（运营商原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-494471299-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
