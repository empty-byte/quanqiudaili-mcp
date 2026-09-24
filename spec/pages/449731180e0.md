# 获取动态子账号流量统计信息

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/device/subAccountFlowQuery:
    get:
      summary: 获取动态子账号流量统计信息
      deprecated: false
      description: |
        获取动态住宅流量子账号的主账号动态带宽消耗情况
        仅支持按月查询流量统计信息
        同一用户1分钟内最多查询30个不同子账号
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
        - name: subAccount
          in: query
          description: 子账号id
          required: true
          example: 1
          schema:
            type: integer
        - name: month
          in: query
          description: 查询月份
          required: true
          example: 2026-04
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
                      rows:
                        type: array
                        items:
                          type: object
                          properties:
                            time:
                              type: string
                              title: 统计日期
                            flow:
                              type: string
                              title: 流量
                              description: 单位：GB
                          required:
                            - time
                            - flow
                          x-apifox-orders:
                            - time
                            - flow
                        description: 响应内容
                      total:
                        type: integer
                        description: 总数
                    required:
                      - rows
                      - total
                    x-apifox-orders:
                      - rows
                      - total
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
                time: '1777258440'
                data:
                  rows:
                    - time: '2026-04-01'
                      flow: '0.00'
                    - time: '2026-04-02'
                      flow: '0.00'
                    - time: '2026-04-03'
                      flow: '0.00'
                    - time: '2026-04-04'
                      flow: '0.00'
                    - time: '2026-04-05'
                      flow: '0.00'
                    - time: '2026-04-06'
                      flow: '0.00'
                    - time: '2026-04-07'
                      flow: '0.00'
                    - time: '2026-04-08'
                      flow: '0.00'
                    - time: '2026-04-09'
                      flow: '0.00'
                    - time: '2026-04-10'
                      flow: '0.00'
                    - time: '2026-04-11'
                      flow: '0.00'
                    - time: '2026-04-12'
                      flow: '0.00'
                    - time: '2026-04-13'
                      flow: '0.00'
                    - time: '2026-04-14'
                      flow: '0.00'
                    - time: '2026-04-15'
                      flow: '0.00'
                    - time: '2026-04-16'
                      flow: '0.00'
                    - time: '2026-04-17'
                      flow: '0.00'
                    - time: '2026-04-18'
                      flow: '0.00'
                    - time: '2026-04-19'
                      flow: '0.00'
                    - time: '2026-04-20'
                      flow: '0.00'
                    - time: '2026-04-21'
                      flow: '0.00'
                    - time: '2026-04-22'
                      flow: '0.00'
                    - time: '2026-04-23'
                      flow: '0.00'
                    - time: '2026-04-24'
                      flow: '0.00'
                    - time: '2026-04-25'
                      flow: '0.00'
                    - time: '2026-04-26'
                      flow: '0.00'
                    - time: '2026-04-27'
                      flow: '0.00'
                    - time: '2026-04-28'
                      flow: '0.00'
                    - time: '2026-04-29'
                      flow: '0.00'
                    - time: '2026-04-30'
                      flow: '0.00'
                  total: 30
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/动态住宅流量子账号（不限时长）
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-449731180-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
