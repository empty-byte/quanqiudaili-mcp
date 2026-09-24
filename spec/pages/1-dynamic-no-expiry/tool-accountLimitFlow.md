# 获取子账号流量上限

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/tool/accountLimitFlow:
    get:
      summary: 获取子账号流量上限
      deprecated: false
      description: ''
      tags:
        - 用户IP子账号管理/动态住宅流量子账号（不限时长）
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型id，此处固定类别为：1
          required: false
          example: '1'
          schema:
            type: string
        - name: id
          in: query
          description: ''
          required: false
          example: '44'
          schema:
            type: string
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
            examples: {}
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
                    type: object
                    properties:
                      product_type_id:
                        type: integer
                        title: 产品类别
                      id:
                        type: integer
                        title: 子账号id
                      limit_flow:
                        type: string
                        title: 限制流量
                    required:
                      - product_type_id
                      - id
                      - limit_flow
                    x-apifox-orders:
                      - product_type_id
                      - id
                      - limit_flow
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
                msg: 子账号流量设置获取成功!
                time: '1750038212'
                data:
                  product_type_id: 1
                  id: 44
                  limit_flow: '1.00'
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号（不限时长）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-308963227-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
