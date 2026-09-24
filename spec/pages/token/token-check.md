# 检测Token是否过期

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/token/check:
    get:
      summary: 检测Token是否过期
      deprecated: false
      description: 检测Token是否过期
      tags:
        - Token管理
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
              properties: {}
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
                      token:
                        type: string
                        description: token
                      expiretime:
                        type: string
                        description: 到期时间
                    required:
                      - token
                      - expiretime
                    x-apifox-orders:
                      - token
                      - expiretime
                x-apifox-orders:
                  - code
                  - msg
                  - time
                  - data
                required:
                  - code
                  - msg
                  - time
                  - data
              example:
                code: 1
                msg: ''
                time: '1697598444'
                data:
                  token: string
                  expiretime: '2023-11-17 11:05:09'
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: Token管理
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222033977-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
