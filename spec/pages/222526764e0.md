# 获取动态住宅（包月）对应城市列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/common/cityList:
    get:
      summary: 获取动态住宅（包月）对应城市列表
      deprecated: false
      description: 获取静态住宅时长对应国家列表
      tags:
        - 用户IP子账号管理/动态住宅流量子账号 （包月）
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定类别为：6
          required: true
          example: 6
          schema:
            type: integer
        - name: country_code
          in: query
          description: >-
            国家编码，例如：US。从<a href='/api-222526763'
            target='_blank'>动态住宅（包月）国家列表</a>获取
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
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号 （包月）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222526764-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
