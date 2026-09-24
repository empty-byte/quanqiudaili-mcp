# 自定义动态住宅（包月）IP子账号用户名和密码

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/device/batchUpdateSubAccountUsernamePassword:
    post:
      summary: 自定义动态住宅（包月）IP子账号用户名和密码
      deprecated: false
      description: ''
      tags:
        - 用户IP子账号管理/动态住宅流量子账号 （包月）
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
                product_type_id:
                  description: 产品类型id，此处固定类别为：6
                  example: '6'
                  type: string
                content[0][id]:
                  type: string
                  description: 子账号id
                  example: '1'
                content[0][customUsername]:
                  description: 自定义用户名。只能是大小字母和数字。长度8-30个字符之间
                  example: usxxxxxFFW1
                  type: string
                content[0][customPassword]:
                  description: 自定义密码。只能是大小字母和数字。长度8-30个字符之间
                  example: passxxdxxx1
                  type: string
                content[1][id]:
                  description: 子账号id
                  example: '2'
                  type: string
                content[1][customUsername]:
                  description: 自定义用户名。只能是字母和数字。长度8-30个字符之间
                  example: usxxexxxFFW2
                  type: string
                content[1][customPassword]:
                  description: 自定义密码。只能是字母和数字。长度8-30个字符之间
                  example: paxxrdxxx2
                  type: string
              required:
                - content[0][id]
                - content[0][customUsername]
                - content[0][customPassword]
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号 （包月）
      x-apifox-status: developing
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222617854-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
