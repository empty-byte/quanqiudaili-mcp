# 获取动态住宅对应城市列表

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
      summary: 获取动态住宅对应城市列表
      deprecated: false
      description: 获取动态住宅时长对应城市列表
      tags:
        - 用户IP子账号管理/动态住宅流量子账号（不限时长）
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定类别为：1
          required: true
          example: 1
          schema:
            type: integer
        - name: country_code
          in: query
          description: 国家编码，例如：US。从<a href='/api-222033933' target='_blank'>动态住宅国家列表</a>获取
          required: false
          example: HK
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
                        name:
                          type: string
                        code:
                          type: string
                        state_name:
                          type: string
                        country_name:
                          type: string
                      required:
                        - name
                        - code
                        - state_name
                        - country_name
                      x-apifox-orders:
                        - name
                        - code
                        - state_name
                        - country_name
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
                time: '1752746716'
                data:
                  - name: Tin Shui Wai
                    code: Tin Shui Wai
                    state_name: Yuen Long
                    country_name: 中国香港
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号（不限时长）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222467508-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
