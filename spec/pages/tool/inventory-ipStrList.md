# 查询IP段列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/inventory/ipStrList:
    post:
      summary: 查询IP段列表
      deprecated: false
      description: 获取IP段列表
      tags:
        - 工具管理
      parameters:
        - name: product_type_id
          in: query
          description: ''
          required: false
          example: '3'
          schema:
            type: string
        - name: country_code
          in: query
          description: ''
          required: false
          example: US
          schema:
            type: string
        - name: city_code
          in: query
          description: ''
          required: false
          example: Los Angeles
          schema:
            type: string
        - name: ip_str
          in: query
          description: ''
          required: false
          example: '38'
          schema:
            type: string
        - name: exclude_ip_str
          in: query
          description: ''
          required: false
          example: '38.31'
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
              properties:
                product_type_id:
                  description: 产品id:2=静态住宅非原生;3=静态住宅原生;8=数据中心
                  example: '3'
                  type: string
                country_code:
                  description: 国家code
                  example: US
                  type: string
                city_code:
                  description: 城市code
                  example: Los Angeles
                  type: string
                ip_str:
                  description: 需要查询的ip段A段信息，如：38   ；150  ；
                  example: '38'
                  type: string
                exclude_ip_str:
                  description: 需要排除掉的ip段
                  example: '38.31'
                  type: string
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
                    description: 响应编码:1=正常,0=错误
                  msg:
                    type: string
                    description: 响应说明
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      total:
                        type: integer
                        description: 总数
                      rows:
                        type: array
                        items:
                          type: object
                          properties:
                            id:
                              type: integer
                              description: id
                            infor:
                              type: string
                              description: 白名单ip
                          required:
                            - id
                            - infor
                          x-apifox-orders:
                            - id
                            - infor
                    required:
                      - total
                      - rows
                    x-apifox-orders:
                      - total
                      - rows
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
                msg: 库存获取成功!
                time: '1748939470'
                data:
                  current_page: 1
                  last_page: 6
                  total: 53
                  data:
                    - ipStr: 23.247.**.**
                      type: 1
                      remark: 紧张
                      skuStatus: 1
                    - ipStr: 23.247.**.**
                      type: 1
                      remark: 紧张
                      skuStatus: 1
                    - ipStr: 192.200.**.**
                      type: 1
                      remark: 紧张
                      skuStatus: 1
                    - ipStr: 192.200.**.**
                      type: 1
                      remark: 紧张
                      skuStatus: 1
                    - ipStr: 149.52.**.**
                      type: 1
                      remark: 紧张
                      skuStatus: 1
                    - ipStr: 149.52.**.**
                      type: 1
                      remark: 紧张
                      skuStatus: 1
                    - ipStr: 149.52.**.**
                      type: 1
                      remark: 紧张
                      skuStatus: 1
                    - ipStr: 149.52.**.**
                      type: 1
                      remark: 紧张
                      skuStatus: 1
                    - ipStr: 149.52.**.**
                      type: 1
                      remark: 紧张
                      skuStatus: 1
                    - ipStr: 149.52.**.**
                      type: 1
                      remark: 紧张
                      skuStatus: 1
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 工具管理
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-303563504-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
