# 自定义静态住宅（运营商原生）批量开关直连

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/device/portEnableUpdateList:
    put:
      summary: 自定义静态住宅（运营商原生）批量开关直连
      deprecated: false
      description: ''
      tags:
        - 用户IP子账号管理/静态住宅（运营商原生）时长子账号
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
                  type: integer
                  description: 产品类型id，此处固定类别为：4
                  example: 4
                ids:
                  type: string
                  description: 子账号id集合,多个以英文逗号分隔
                  example: 1,2,3
                use_ip_port:
                  type: integer
                  description: 直连开关状态:0=关闭,1=开启
                  example: 1
              required:
                - product_type_id
                - ids
                - use_ip_port
            examples: {}
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
      x-apifox-folder: 用户IP子账号管理/静态住宅（运营商原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-494471309-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
