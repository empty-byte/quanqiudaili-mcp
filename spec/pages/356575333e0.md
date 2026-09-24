# 带宽监控列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/bandwidth/monitoringList:
    get:
      summary: 带宽监控列表
      deprecated: false
      description: ''
      tags:
        - 增值带宽
      parameters:
        - name: product_type_id
          in: query
          description: 产品类型
          required: false
          example: '3'
          schema:
            type: string
        - name: subAccounts[]
          in: query
          description: 子账号id
          required: false
          example:
            - '33'
            - '32'
          schema:
            type: array
            items:
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
                  msg:
                    type: string
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      list:
                        type: array
                        items:
                          type: object
                          properties:
                            downstreamTraffic:
                              type: integer
                              title: 下行流量
                            exitPortIP:
                              type: string
                              title: 出口ip
                            subAccount:
                              type: string
                              title: 子账号
                            upstreamTraffic:
                              type: integer
                              title: 上行流量
                            bindUser:
                              type: string
                              title: 账号
                          required:
                            - downstreamTraffic
                            - exitPortIP
                            - subAccount
                            - upstreamTraffic
                            - bindUser
                          x-apifox-orders:
                            - downstreamTraffic
                            - exitPortIP
                            - subAccount
                            - upstreamTraffic
                            - bindUser
                      total:
                        type: integer
                    required:
                      - list
                      - total
                    x-apifox-orders:
                      - list
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
                time: '1755253333'
                data:
                  list:
                    - downstreamTraffic: 0
                      exitPortIP: 96.62.135.150
                      subAccount: '69607'
                      upstreamTraffic: 0
                      bindUser: zhizhuipsrt-69607
                    - downstreamTraffic: 0
                      exitPortIP: 89.42.40.173
                      subAccount: '69606'
                      upstreamTraffic: 0
                      bindUser: zhizhuipsrt-69606
                  total: 2
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 增值带宽
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-356575333-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
