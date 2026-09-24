# 查询静态住宅（普通）IP段列表

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
      summary: 查询静态住宅（普通）IP段列表
      deprecated: false
      description: 获取IP段列表
      tags:
        - 用户IP子账号管理/静态住宅（普通非原生）时长子账号
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
                  description: 产品id:此处固定2
                  example: '2'
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
                  description: 需要查询的ip段前缀
                  example: '38.30'
                  type: string
                exclude_ip_str:
                  description: 需要排除掉的ip段
                  example: '38.31'
                  type: string
                page:
                  description: 分页
                  example:
                    - '1'
                  type: array
                pagesize:
                  description: 数量
                  example: '10'
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
                      current_page:
                        type: integer
                      last_page:
                        type: integer
                      total:
                        type: integer
                        title: 总条数
                        description: 总数
                      data:
                        type: array
                        items:
                          type: object
                          properties:
                            ipStr:
                              type: string
                              title: IP段
                            type:
                              type: integer
                            remark:
                              type: string
                              title: 库存备注
                            skuStatus:
                              type: integer
                              title: 库存状态
                              description: 库存状态:0=充足,1=紧缺
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
                        title: 详情
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
      x-apifox-folder: 用户IP子账号管理/静态住宅（普通非原生）时长子账号
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-308762739-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
