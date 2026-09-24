# 设置子账号流量上限

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/tool/accountLimitFlowEdit:
    post:
      summary: 设置子账号流量上限
      deprecated: false
      description: ''
      tags:
        - 用户IP子账号管理/动态住宅流量子账号（不限时长）
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
                  description: 产品类型id，此处固定类别为：1
                  example: '1'
                  type: string
                id:
                  description: 子账号id
                  example: '58'
                  type: string
                limit_flow:
                  description: 流量上限，GB，0 到 1000000；0 = 取消限制并删除限流记录
                  example: '1'
                  type: string
                type:
                  description: 限流类型：0 = 永久，按子账号累计用量，默认；1 = 周期
                  example: ''
                  type: string
                timelen:
                  description: 周期：0 天、1 周、2 月、3 季度、4 年；type=1 时有效，type=0 时忽略
                  example: ''
                  type: string
              required:
                - product_type_id
                - id
                - limit_flow
            examples: {}
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
              examples:
                '1':
                  summary: 成功示例
                  value:
                    code: 1
                    msg: 设置成功!
                    time: '1750043140'
                    data: null
                '2':
                  summary: 异常示例
                  value:
                    code: 0
                    msg: 不存在的子账号id!
                    time: '1750043169'
                    data: null
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号（不限时长）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-308610361-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
