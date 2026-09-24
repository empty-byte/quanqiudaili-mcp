# 获取静态住宅（普通非原生）对应城市列表

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
      summary: 获取静态住宅（普通非原生）对应城市列表
      deprecated: false
      description: 获取静态住宅时长对应国家列表
      tags:
        - 用户IP子账号管理/静态住宅（普通非原生）时长子账号
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定为：2
          required: true
          example: 2
          schema:
            type: integer
        - name: country_id
          in: query
          description: >-
            国家id。可从<a href='/api-222487309'
            target='_blank'>静态住宅（普通非原生）国家列表获取</a>。country_id 和 country_code 二选一
          required: false
          example: '1905'
          schema:
            type: string
        - name: country_code
          in: query
          description: >-
            国家code。可从<a href='/api-222487309'
            target='_blank'>静态住宅（普通非原生）国家列表获取</a>。country_id 和 country_code 二选一
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
                      type: string
                required:
                  - code
                  - msg
                  - time
                  - data
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（普通非原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222487647-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
