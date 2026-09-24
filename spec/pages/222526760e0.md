# 获取动态住宅流量（包月）子账号列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/device/accountList:
    get:
      summary: 获取动态住宅流量（包月）子账号列表
      deprecated: false
      description: 获取动态住宅流量子账号列表
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
        - name: page
          in: query
          description: 当前页数
          required: true
          example: 1
          schema:
            type: integer
        - name: pagesize
          in: query
          description: 每页显示数量。每页最大100条数据
          required: true
          example: 10
          schema:
            type: integer
        - name: remark
          in: query
          description: 子账号备注
          required: false
          example: ''
          schema:
            type: string
        - name: country
          in: query
          description: >-
            国家编码，例如：US。从<a href='/api-222526763'
            target='_blank'>动态住宅（包月）国家列表</a>获取
          required: false
          example: ''
          schema:
            type: string
        - name: subAccountName
          in: query
          description: 自定义用户名
          required: false
          example: test-11
          schema:
            type: string
        - name: subAccountStart
          in: query
          description: 子账号区间搜索[初始]
          required: false
          example: 100
          schema:
            type: integer
        - name: subAccountEnd
          in: query
          description: 子账号区间搜索[结束]
          required: false
          example: 200
          schema:
            type: integer
        - name: ids
          in: query
          description: 子账号id集,多个以英文逗号分隔
          required: false
          example: 44,45
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
                    description: 错误说明
                  time:
                    type: string
                    description: 响应时间戳
                  data:
                    type: object
                    properties:
                      total:
                        type: integer
                        description: 总数
                      rows:
                        type: array
                        items:
                          type: string
                        description: 响应内容
                      base:
                        type: object
                        properties:
                          totalFlow:
                            type: string
                          useFlow:
                            type: string
                          baseFlow:
                            type: string
                          expiresIn:
                            type: string
                        required:
                          - totalFlow
                          - useFlow
                          - baseFlow
                          - expiresIn
                    required:
                      - total
                      - rows
                      - base
                required:
                  - code
                  - msg
                  - time
                  - data
              example:
                code: 1
                msg: 获取成功
                time: '1752746322'
                data:
                  total: 0
                  rows: []
                  base:
                    totalFlow: '1.00'
                    useFlow: '0.00'
                    baseFlow: '1.00'
                    expiresIn: '2024-06-28 10:06:23'
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号 （包月）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222526760-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
