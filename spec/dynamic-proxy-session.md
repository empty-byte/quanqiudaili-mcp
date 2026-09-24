# 动态IP Session验证

## （Session）使用说明

### 基本格式

```
{账号}-ss-{随机值}:{密码}@proxy.quanqiudaili.com:5001
```

在账号后面拼接参数即可控制国家、时长、会话等，密码不变。

**完整参数格式：**
```
{账号}-cty-{国家}-st-{州/省}-ct-{城市}-ss-{会话ID}-tm-{ip时长}-spec-{资源池}:{密码}@proxy.quanqiudaili.com:5001
```

### 参数说明

| 参数 | 含义 | 是否必填 | 说明 |
|------|------|----------|------|
| 账号 | 子账号名 | **必填**，且必须在第一位 | 如 `apitest-1` |
| cty | 国家代码 | 可选 | 如 `US`、`TW`、`JP`，不指定则随机国家 |
| st | 州/省 | 可选 | 需先指定国家才生效，带空格用单引号如 `'New York'` |
| ct | 城市 | 可选 | 需先指定国家才生效，带空格用单引号如 `'Lehighton'` |
| ss | 会话ID | 可选 | **核心参数**，不同的 ss 值 = 不同的IP会话，详见下方说明 |
| tm | IP在线时长 | 可选 | 带单位：`s`(秒)、`m`(分钟)、`h`(小时) |
| spec | 资源池 | 可选 | 可选值：`4` 或 `284`，不指定则使用默认资源池 |

> **除了账号必须在第一个位置上，其他字段位置随意，所有字段都是可选的，不指定则按照子账号原本的参数执行。**
>
> **如果指定时长内分配的ip掉线，为保障请求网络可用性，系统会自动为您切换到其它IP。**

---

### 从简单到复杂：逐步上手

**第1步：最基本的代理请求**
```bash
curl -x apitest-1-ss-r4nd0m1:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**第2步：指定IP在线时长10分钟**
```bash
curl -x apitest-1-tm-10m-ss-r4nd0m2:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**第3步：指定国家 + IP在线时长10分钟**
```bash
curl -x apitest-1-cty-US-tm-10m-ss-r4nd0m3:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**第4步：需要5条美国在线10分钟的独立IP —— 每条指定不同的 ss 值**
```bash
curl -x apitest-1-cty-US-tm-10m-ss-456321sss:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
curl -x apitest-1-cty-US-tm-10m-ss-456322sad:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
curl -x apitest-1-cty-US-tm-10m-ss-456323231:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
curl -x apitest-1-cty-US-tm-10m-ss-456322111:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
curl -x apitest-1-cty-US-tm-10m-ss-456322222:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```
> 每条请求的 `ss` 值不同，所以会分别获得5个独立的IP，每个IP在线10分钟，到期自动切换。

---

### ss 会话参数详解（重点）

**ss 是会话的唯一标识，可以理解为：更换一个 ss 值 = 创建了一个新的子账号。**

- 每个不同的 `ss` 值会分配一个独立的IP
- 在 `tm` 指定的时长内，相同 `ss` 值会保持同一个IP
- 到期后自动切换新IP，但该 `ss` 会话仍然保持
- **如果需要同时使用多个IP，必须使用不同的 `ss` 值**

> **⚠️ 重要规则：**
> - 如果每次请求都想换IP（一次一换），**不要带 ss 参数**
> - 如果需要保持IP在指定时长内不变，**ss 参数必填**，且每个独立会话必须使用不同的 ss 值
> - 简单记忆：**不带 ss = 每次换IP，带 ss = 保持IP**

#### ❌ 错误用法：多个会话使用相同的 ss 值

```bash
curl -x apitest-1-cty-US-st-Pennsylvania-ct-'Lehighton'-tm-30m-ss-zaHJiS:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
curl -x apitest-1-cty-TW-tm-30m-ss-zaHJiS:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```
> 问题：两个请求使用了相同的 `ss-zaHJiS`，会导致会话冲突，IP不能正确隔离。

#### ✅ 正确用法：每个会话使用不同的 ss 值

**示例：同一地区同时需要3个独立IP会话**

第一个30分钟的IP会话：
```bash
curl -x apitest-1-cty-US-st-Pennsylvania-ct-'Lehighton'-tm-30m-ss-1z12ad2:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

第二个30分钟的IP会话：
```bash
curl -x apitest-1-cty-US-st-Pennsylvania-ct-'Lehighton'-tm-30m-ss-1z5cade:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

第三个30分钟的IP会话：
```bash
curl -x apitest-1-cty-US-st-Pennsylvania-ct-'Lehighton'-tm-30m-ss-1c5cgdf:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

> 每个 `ss` 值不同，所以会分别获得3个独立的IP，互不影响。

---

### 通过 tm 参数灵活控制在线时长

不再需要批量修改IP在线时长，直接在请求中通过 `tm` 参数指定即可，更加灵活方便。

**示例：将在线时长设为20分钟**

第一个IP（在线20分钟，到期自动切换）：
```bash
curl -x apitest-1-cty-US-ss-456321sss-spec-4:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

第二个IP（在线20分钟，到期自动切换）：
```bash
curl -x apitest-1-cty-US-ss-12345678-spec-4:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

> 只需更换 `ss` 参数值，即可获得一个全新的IP会话，无需修改子账号配置。

---

### 常用场景示例

> **注意：** 部分州/省、城市名称含有空格（如 `New York`、`Los Angeles`），在命令行中需要用**单引号**包裹，否则会导致请求解析时被截断。例如：`st-'New York'`、`ct-'Los Angeles'`。

**1. 指定国家+州+城市，30分钟切换**
```bash
curl -x apitest-1-cty-US-st-Pennsylvania-ct-'Lehighton'-tm-30m-ss-abc123:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**2. 只指定国家，30分钟切换**
```bash
curl -x apitest-1-cty-TW-tm-30m-ss-def456:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**3. 指定美国纽约，1分钟切换**
```bash
curl -x apitest-1-cty-US-st-'New York'-ss-123333-tm-1m:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**4. 指定资源池284，美国弗罗里达，2分钟切换**
```bash
curl -x apitest-1-cty-US-st-Florida-spec-284-ss-123444-tm-2m:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**5. 随机国家，1分钟切换**
```bash
curl -x apitest-1-ss-126643-tm-1m:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**6. 284资源池全球随机**
```bash
curl -x apitest-1-spec-284:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**7. 全球随机，5分钟切换一次**
```bash
curl -x apitest-1-tm-5m-ss-a3x7kp9:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**8. 不带 ss，实现IP一次一换（每次请求换IP）**
```bash
curl -x apitest-1-cty-US-tm-1m:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

**9. 不带地区参数，实现地区随机切换**
```bash
curl -x apitest-1-ss-789012-tm-5m:testpassword@proxy.quanqiudaili.com:5001 ipinfo.io
```

---

### 资源池性能参考

| 指标 | 资源池 4 | 资源池 284 |
|------|---------|-----------|
| 压测QPS | 32k | 16k |
| 成功率 | 96%（稳定） | 95%（稳定） |
| 美区带宽 | 最高40G | 20G |
| 最大同时连接数 | ~300W | ~70W |
| 扩容支持 | 支持 | - |
| P95平均响应时长 | 1.8s | - |

> 使用 `spec-4` 或 `spec-284` 指定资源池，不指定则使用默认配置。


