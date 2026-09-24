# 带宽升级价格计算

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /externalapi/product_price/bandwidthUpgradePrice:
    post:
      summary: 带宽升级价格计算
      deprecated: false
      description: ''
      tags:
        - 增值带宽
      parameters:
        - name: sub_accounts[]
          in: query
          description: 子账号
          required: false
          example:
            - '33'
            - '32'
          schema:
            type: array
            items:
              type: string
        - name: bandwidth_num
          in: query
          description: 要升级的带宽值
          required: false
          example: '20'
          schema:
            type: string
        - name: product_type_id
          in: query
          description: 产品类型
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
                            sub_account:
                              type: integer
                              title: 子账号
                            bandwidth_num:
                              type: string
                              title: 要升级的带宽值
                            username:
                              type: string
                              title: 子账号账户名
                            upgrade_set_meal_name:
                              type: string
                              title: 要升级的带宽套餐
                            days:
                              type: integer
                              title: 天数
                            money:
                              type: string
                              title: 金额
                            bandwidth_price_settings_id:
                              type: integer
                            set_meal_bandwidth_id:
                              type: integer
                            last_time_ids:
                              type: array
                              items:
                                type: integer
                          x-apifox-orders:
                            - sub_account
                            - bandwidth_num
                            - username
                            - upgrade_set_meal_name
                            - days
                            - money
                            - bandwidth_price_settings_id
                            - set_meal_bandwidth_id
                            - last_time_ids
                      days:
                        type: integer
                        title: 总天数
                      realPrice:
                        type: string
                        title: 总金额
                      useCustomPriceLimit:
                        type: integer
                        title: 使用自定义价格中的额度
                      totalNum:
                        type: integer
                        title: 总数量
                    required:
                      - list
                      - days
                      - realPrice
                      - useCustomPriceLimit
                      - totalNum
                    x-apifox-orders:
                      - list
                      - days
                      - realPrice
                      - useCustomPriceLimit
                      - totalNum
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
                time: '1755159010'
                data:
                  list:
                    - sub_account: 65591
                      original_bandwidth_num: 5
                      bandwidth_num: '11'
                      username: zhizhuipsrt-65591
                      current_set_meal_name: 基础性
                      upgrade_set_meal_name: 标准型
                      days: 19
                      money: '57.00'
                      bandwidth_price_settings_id: 99
                      set_meal_bandwidth_id: 2
                    - sub_account: 65592
                      original_bandwidth_num: 5
                      bandwidth_num: '11'
                      username: zhizhuipsrt-65592
                      current_set_meal_name: 基础性
                      upgrade_set_meal_name: 标准型
                      days: 19
                      money: '57.00'
                      bandwidth_price_settings_id: 99
                      set_meal_bandwidth_id: 2
                  days: 38
                  total_money: '114.00'
                  use_custom_price_limit: '114.00'
                  total_num: 2
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 增值带宽
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-356575331-run
components:
  schemas: {}
  securitySchemes: {}
servers:
  - url: https://admin.quanqiudaili.com
    description: 正式环境
security: []

```
