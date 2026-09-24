# 获取剩余有效期内的带宽详情

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/bandwidth/bandwidthNumDetail:
    get:
      summary: 获取剩余有效期内的带宽详情
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
        - name: subAccount
          in: query
          description: 子账号id
          required: false
          example: '3'
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
                            id:
                              type: integer
                            max_bandwidth:
                              type: integer
                              title: 峰值带宽
                            min_bandwidth:
                              type: integer
                              title: 保底带宽
                            start_time:
                              type: integer
                              title: 开始时间
                            end_time:
                              type: integer
                              title: 结束时间
                            start_time_text:
                              type: string
                              title: 开始时间
                            end_time_text:
                              type: string
                              title: 结束时间
                            create_time:
                              type: integer
                              title: 创建时间
                            update_time:
                              type: integer
                              title: 更新时间
                            create_time_text:
                              type: string
                              title: 创建时间
                            update_time_text:
                              type: string
                              title: 更新时间
                          x-apifox-orders:
                            - id
                            - max_bandwidth
                            - min_bandwidth
                            - start_time
                            - end_time
                            - start_time_text
                            - end_time_text
                            - create_time
                            - update_time
                            - create_time_text
                            - update_time_text
                        title: 在有效期内的详情情况
                      end_time:
                        type: integer
                        title: 子账号的结束时间
                      end_time_text:
                        type: string
                        title: 子账号的结束时间
                      current_max_bandwidth:
                        type: integer
                        title: 当前峰值带宽
                      current_min_bandwidth:
                        type: integer
                        title: 当前保底带宽
                      current_cycle_end_time:
                        type: integer
                        title: 当前带宽结束时间节点
                      current_cycle_end_time_text:
                        type: string
                        title: 当前带宽结束时间节点
                      cycle_min_bandwidth_maximum:
                        type: integer
                        title: 子账号结束周期内保底带宽的最大值
                    required:
                      - list
                      - end_time
                      - end_time_text
                      - current_max_bandwidth
                      - current_min_bandwidth
                      - current_cycle_end_time
                      - current_cycle_end_time_text
                      - cycle_min_bandwidth_maximum
                    x-apifox-orders:
                      - list
                      - end_time
                      - end_time_text
                      - current_max_bandwidth
                      - current_min_bandwidth
                      - current_cycle_end_time
                      - current_cycle_end_time_text
                      - cycle_min_bandwidth_maximum
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
              examples:
                '1':
                  summary: 成功示例
                  value:
                    code: 1
                    msg: 获取成功!
                    time: '1759047899'
                    data:
                      list:
                        - id: 101
                          max_bandwidth: 100
                          min_bandwidth: 5
                          start_time: 1758345185
                          end_time: 1759554782
                          start_time_text: '2025-09-20 13:13:05'
                          end_time_text: '2025-10-04 13:13:02'
                          create_time: 1758345232
                          update_time: 1758345232
                          create_time_text: '2025-09-20 13:13:52'
                          update_time_text: '2025-09-20 13:13:52'
                      end_time: 1759554782
                      end_time_text: '2025-10-04 13:13:02'
                      current_max_bandwidth: 100
                      current_min_bandwidth: 5
                      current_cycle_end_time: 1759554782
                      current_cycle_end_time_text: '2025-10-04 13:13:02'
                      cycle_min_bandwidth_maximum: 5
                '2':
                  summary: 成功示例
                  value:
                    code: 1
                    msg: 获取成功!
                    time: '1755321775'
                    data:
                      bandwidthList:
                        - downstreamTraffic: 0
                          time: 2025-08-16 00
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 01
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 02
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 03
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 04
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 05
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 06
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 07
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 08
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 09
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 10
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 11
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 12
                          upstreamTraffic: 0
                        - downstreamTraffic: 0
                          time: 2025-08-16 13
                          upstreamTraffic: 0
                      currentBandwidth: 0
                      peakBandwidth: 0
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 增值带宽
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-356598388-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
