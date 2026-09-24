# 查询静态住宅（原生）IP段列表

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/inventory/ipStrList:
    get:
      summary: 查询静态住宅（原生）IP段列表
      deprecated: false
      description: 获取IP段列表
      tags:
        - 用户IP子账号管理/静态住宅（原生）时长子账号
      parameters:
        - name: product_type_id
          in: query
          description: 产品id:此处固定3
          required: true
          example: 3
          schema:
            type: integer
        - name: country_code
          in: query
          description: 国家code
          required: true
          example: US
          schema:
            type: string
        - name: city_code
          in: query
          description: 城市code
          required: false
          example: Los Angeles
          schema:
            type: string
        - name: exclude_ip_str
          in: query
          description: 需要排除掉的ip段，多个以英文逗号分隔
          required: false
          example: 38.31,149.52
          schema:
            type: string
        - name: ip_str
          in: query
          description: ''
          required: false
          example: '192.200'
          schema:
            type: string
        - name: page
          in: query
          description: 分页
          required: false
          example: '1'
          schema:
            type: string
        - name: pagesize
          in: query
          description: 数量
          required: false
          example: '20'
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
                    description: 响应编码:1=正常,0=错误
                  msg:
                    type: string
                    description: 响应说明
                  time:
                    type: string
                  data:
                    type: object
                    properties:
                      current_page:
                        type: integer
                      last_page:
                        type: integer
                      total:
                        type: integer
                        description: 总数
                      data:
                        type: array
                        items:
                          type: object
                          properties:
                            ipStr:
                              type: string
                              title: ip段
                            type:
                              type: integer
                            remark:
                              type: string
                              title: 库存备注
                            skuStatus:
                              type: integer
                              title: 库存标识:0=充足,1=紧缺
                          required:
                            - ipStr
                            - type
                            - remark
                            - skuStatus
                          x-apifox-orders:
                            - ipStr
                            - type
                            - remark
                            - skuStatus
                    required:
                      - current_page
                      - last_page
                      - total
                      - data
                    x-apifox-orders:
                      - current_page
                      - last_page
                      - total
                      - data
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
                msg: 库存获取成功!
                time: '1748939470'
                data:
                  current_page: 1
                  last_page: 6
                  total: 53
                  data:
                    - ipStr: '38.30'
                      type: 1
                      remark: 紧张
                      skuStatus: 1
                    - ipStr: '38.30'
                      type: 1
                      remark: 紧张
                      skuStatus: 1
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 用户IP子账号管理/静态住宅（原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-308762765-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
