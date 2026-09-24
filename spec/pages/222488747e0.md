# 获取数据中心对应国家列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/inventory/countryList:
    get:
      summary: 获取数据中心对应国家列表
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
                        code:
                          type: string
                      required:
                        - id
                        - name
                        - code
                      x-apifox-orders:
                        - id
                        - name
                        - code
                    title: 国家列表
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
                time: '1697680105'
                data:
                  countrys:
                    - id: 11
                      name: 美国
                      image: ''
                      code: US
                      type_text: ''
                      status_text: ''
                    - id: 12
                      name: 中国台湾省
                      image: ''
                      code: TW
                      type_text: ''
                      status_text: ''
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/数据中心时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222488747-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
